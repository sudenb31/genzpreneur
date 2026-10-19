// Utilitas kecil untuk Vercel Node Functions (req/res gaya Node + helper Vercel).

const MAX_BODY = 256 * 1024;

/** Ambil body JSON apa pun bentuk yang diberikan Vercel (object, string, Buffer, atau stream). */
export async function readJson(req) {
  let body = req.body;
  if (body === undefined || body === null) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BODY) throw Object.assign(new Error('Body terlalu besar.'), { statusCode: 413 });
      chunks.push(chunk);
    }
    body = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') {
    if (body.length > MAX_BODY) throw Object.assign(new Error('Body terlalu besar.'), { statusCode: 413 });
    if (!body.trim()) return {};
    try { return JSON.parse(body); } catch { throw Object.assign(new Error('Body bukan JSON.'), { statusCode: 400 }); }
  }
  return body;
}

export function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export function bearer(req) {
  const header = String(req.headers?.authorization || '');
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}
