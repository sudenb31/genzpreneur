// Firestore palsu di memori untuk tes server GoAkal. Meniru perilaku penting Admin SDK:
// transaksi optimistis (diulang bila dokumen yang dibaca berubah), create() gagal bila dokumen ada,
// update() gagal bila dokumen tidak ada, serta FieldValue.serverTimestamp/increment/delete.

const OP = Symbol('fieldOp');
export const FakeFieldValue = {
  serverTimestamp: () => ({ [OP]: 'ts' }),
  increment: (n) => ({ [OP]: 'inc', n }),
  delete: () => ({ [OP]: 'del' }),
};
class FakeTs {
  constructor(ms) { this._ms = ms; }
  toMillis() { return this._ms; }
  toDate() { return new Date(this._ms); }
}
export const FakeTimestamp = { fromMillis: (ms) => new FakeTs(ms) };

function clone(value) {
  if (value instanceof FakeTs) return new FakeTs(value._ms);
  if (Array.isArray(value)) return value.map(clone);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clone(v)]));
  return value;
}

function applyPatch(base, patch, nowMs) {
  const out = { ...(base || {}) };
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === 'object' && value[OP]) {
      if (value[OP] === 'ts') out[key] = FakeTimestamp.fromMillis(nowMs);
      else if (value[OP] === 'inc') out[key] = Number(out[key] || 0) + value.n;
      else if (value[OP] === 'del') delete out[key];
    } else out[key] = value;
  }
  return out;
}

export class FakeDb {
  constructor() {
    this.docs = new Map();
    this.versions = new Map();
    this.now = () => Date.now();
    this.writeLog = [];
    this.readOnly = false;
  }
  collection(name) {
    return { doc: (id) => this.ref(`${name}/${id}`) };
  }
  ref(path) {
    const db = this;
    const id = path.split('/').pop();
    return {
      path, id,
      async get() { await Promise.resolve(); return db.snap(path); },
      async update(patch) { await Promise.resolve(); db.write(path, 'update', patch); },
      async set(data) { await Promise.resolve(); db.write(path, 'set', data); },
    };
  }
  snap(path) {
    const data = this.docs.get(path);
    return { id: path.split('/').pop(), exists: data !== undefined, data: () => (data === undefined ? undefined : clone(data)) };
  }
  write(path, kind, data) {
    if (this.readOnly) throw new Error(`Tulis ke ${path} saat readOnly`);
    for (const [k, v] of Object.entries(data)) {
      if (v === undefined) throw new Error(`Cannot use "undefined" as a Firestore value (field "${k}") di ${path}`);
      if (kind !== 'update' && v && typeof v === 'object' && v[OP] === 'del') throw new Error(`FieldValue.delete() tidak boleh dipakai di ${kind} (${k})`);
    }
    const exists = this.docs.has(path);
    if (kind === 'create' && exists) throw Object.assign(new Error(`ALREADY_EXISTS ${path}`), { code: 6 });
    if (kind === 'update' && !exists) throw Object.assign(new Error(`NOT_FOUND ${path}`), { code: 5 });
    const next = kind === 'update' ? applyPatch(this.docs.get(path), data, this.now()) : applyPatch({}, data, this.now());
    this.docs.set(path, next);
    this.versions.set(path, (this.versions.get(path) || 0) + 1);
    this.writeLog.push({ path, kind });
  }
  async getAll(...refs) {
    await Promise.resolve();
    return refs.map((r) => this.snap(r.path));
  }
  async runTransaction(fn) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const reads = new Map();
      const writes = [];
      const t = {
        get: async (ref) => {
          if (writes.length) throw new Error('Firestore transactions require all reads to be executed before all writes.');
          await Promise.resolve();
          reads.set(ref.path, this.versions.get(ref.path) || 0);
          return this.snap(ref.path);
        },
        create: (ref, data) => { writes.push([ref.path, 'create', data]); },
        update: (ref, data) => { writes.push([ref.path, 'update', data]); },
        set: (ref, data) => { writes.push([ref.path, 'set', data]); },
      };
      const result = await fn(t);
      await Promise.resolve();
      const stale = [...reads].some(([path, v]) => (this.versions.get(path) || 0) !== v);
      if (stale) continue; // diulang seperti Firestore asli
      for (const [path, kind, data] of writes) this.write(path, kind, data);
      return result;
    }
    throw new Error('ABORTED: terlalu banyak konflik transaksi');
  }
  all(collection) {
    return [...this.docs.entries()].filter(([p]) => p.startsWith(`${collection}/`)).map(([, d]) => d);
  }
}
