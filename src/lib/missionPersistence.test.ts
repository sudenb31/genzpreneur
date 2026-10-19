import { emptyEntry, ENTRY_KEY } from './entry';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ write: vi.fn(), doc: vi.fn((...x: unknown[]) => x) }));
vi.mock('firebase/firestore', () => ({ doc: mocks.doc, setDoc: mocks.write, serverTimestamp: () => 'SERVER_TIME' }));
vi.mock('./firebase', () => ({ db: () => 'TEST_DB' }));
import { saveEntry, saveMissionArtifact } from './data';
beforeEach(() => { mocks.write.mockReset().mockResolvedValue(undefined); });
describe('mission persistence boundary', () => {
  it('merges one owner draft into the existing notes map, without overwriting old progress', async () => {
    const encoded = await saveMissionArtifact('owner', 'start', { text: 'Waktu dan skill', checks: [0] });
    expect(mocks.write).toHaveBeenCalledWith(['TEST_DB', 'progress', 'owner'], { ownerUid: 'owner', plan: { notes: { 'work-v1-start': encoded } }, updatedAt: 'SERVER_TIME' }, { merge: true });
  });
  it('rejects invalid stage keys before making any write', async () => {
    await expect(saveMissionArtifact('owner', 'bad-stage', { text: 'test', checks: [] })).rejects.toThrow();
    expect(mocks.write).not.toHaveBeenCalled();
  });
});

describe('condition persistence boundary', () => {
  it('updates only the versioned condition note with merge, leaving legacy data and mission drafts alone', async () => {
    const record=emptyEntry();
    const encoded=await saveEntry('owner',record);
    expect(mocks.write).toHaveBeenCalledWith(['TEST_DB','progress','owner'],{ownerUid:'owner',plan:{notes:{[ENTRY_KEY]:encoded}},updatedAt:'SERVER_TIME'},{merge:true});
    expect(JSON.parse(encoded)).toEqual(record);
  });
  it('rejects invalid conditions before a database write', async () => {
    await expect(saveEntry('owner',{...emptyEntry(),questionVersion:99} as never)).rejects.toThrow();
    expect(mocks.write).not.toHaveBeenCalled();
  });
});
