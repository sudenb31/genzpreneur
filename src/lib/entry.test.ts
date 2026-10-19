import { describe, expect, it } from 'vitest';
import { emptyEntry, encodeEntry, ENTRY_KEY, entryDimensions, entryMissionStage, knownText, readEntry, recommendEntry, type EntryAnswers } from './entry';
import { encodeMissionDraft, missionKey } from './mission';
const answer = (patch: Partial<EntryAnswers> = {}): EntryAnswers => ({ ...emptyEntry().answers, ...patch });
const skilled = { ability: 'can', task: 'Merapikan tiga deskripsi menu' } as const;
const target = { ...skilled, problemKnown: 'yes', recipient: 'Kedai sekitar kampus', problem: 'Menu publik belum ada deskripsinya' } as const;
const sample = { ...target, exampleStatus: 'available', exampleRelevant: 'yes' } as const;
describe('initial condition rules v1', () => {
  it('A: unknown and not yet able remain provisional or preparatory, never success labels', () => {
    expect(recommendEntry(answer())).toMatchObject({ branch: 'A', stage: 'start', question: expect.any(String) });
    expect(recommendEntry(answer({ ability: 'not_yet' }))).toMatchObject({ branch: 'A', stage: 'start' });
    expect(recommendEntry(answer({ ability: 'can', task: 'belum tahu' })).branch).toBe('A');
    expect(knownText(' Belum tahu. ')).toBe(false);
  });
  it('B: skill is not enough to establish a recipient and problem', () => {
    expect(recommendEntry(answer(skilled))).toMatchObject({ branch: 'B', stage: 'problem' });
    expect(recommendEntry(answer({ ...skilled, problemKnown: 'yes' })).question).toMatch(/penerima/i);
    expect(recommendEntry(answer({ ...target, problem: 'belum tahu' })).branch).toBe('B');
  });
  it('C: a relevant example needs to be reported, but proof is optional', () => {
    expect(recommendEntry(answer(target))).toMatchObject({ branch: 'C', stage: 'sample' });
    expect(recommendEntry(answer({ ...target, exampleStatus: 'available' })).question).toMatch(/contoh/);
    expect(recommendEntry(answer({ ...target, exampleStatus: 'available', exampleRelevant: 'no' })).branch).toBe('C');
  });
  it('D: self-reported example leads to offer; ready offer leads to approach', () => {
    expect(recommendEntry(answer(sample))).toMatchObject({ branch: 'D', stage: 'offer' });
    expect(recommendEntry(answer({ ...sample, offer: 'ready' }))).toMatchObject({ branch: 'D', stage: 'approach' });
  });
  it('E: a relevant actual attempt is evaluated even without sales or a sample upload', () => {
    expect(recommendEntry(answer({ ...skilled, experience: 'offered', experienceSame: 'yes' }))).toMatchObject({ branch: 'E', stage: 'review' });
    expect(recommendEntry(answer({ ...skilled, experience: 'delivered', experienceSame: 'yes' })).stage).toBe('review');
    expect(recommendEntry(answer({ ...skilled, experience: 'delivered', experienceSame: 'no' })).branch).toBe('B');
  });
  it('shows one relevant uncertainty question for contradictory or ambiguous answers', () => {
    for (const a of [answer({ experience:'never',experienceSame:'yes' }),answer({ experience:'delivered' }),answer({ experience:'delivered',experienceSame:'yes',ability:'not_yet' }),answer({ exampleStatus:'none',exampleRelevant:'yes' })]) {
      const r=recommendEntry(a); expect(typeof r.question).toBe('string'); expect(r.editSection).toBeGreaterThanOrEqual(0);
    }
  });
  it('constraints and six needs remain separate from interest and permanent labels', () => {
    const a=answer({...sample,time:'none',constraints:'Koneksi terbatas'});
    expect(recommendEntry(a).stage).toBe('offer');
    expect(entryDimensions(a)).toHaveLength(6);
    expect(JSON.stringify(entryDimensions(a))).toContain('Waktu belum tersedia');
  });
});
describe('versioned condition record and safe resume', () => {
  it('round trips partial answers and a manual entry without marking anything done', () => {
    const record={...emptyEntry(),selectedStage:'sample' as const};
    const raw=encodeEntry(record);expect(readEntry(raw)).toEqual(record);
    expect(JSON.parse(raw)).not.toHaveProperty('tasks');
  });
  it('rejects unexpected sensitive fields, unrecognized versions and unsafe stage values', () => {
    expect(readEntry('{broken')).toBeNull();
    expect(readEntry(JSON.stringify({...emptyEntry(),ruleVersion:99}))).toBeNull();
    expect(()=>encodeEntry({...emptyEntry(),answers:{...emptyEntry().answers,customerEmail:'private'}} as never)).toThrow();
    expect(()=>encodeEntry({...emptyEntry(),selectedStage:'not-a-stage'} as never)).toThrow();
    expect(()=>encodeEntry({...emptyEntry(),answers:{...emptyEntry().answers,task:'x'.repeat(301)}})).toThrow();
  });
  it('uses the recommendation only with no previous work; preserves old notes and tasks', () => {
    const record={...emptyEntry(),answers:answer(sample)};
    const notes={d1:'Old day note',[ENTRY_KEY]:encodeEntry(record)};
    expect(entryMissionStage(notes)).toBe('offer');expect(notes.d1).toBe('Old day note');
    const withWork={...notes,[missionKey('try')]:encodeMissionDraft({text:'Old work in progress',checks:[]})};
    expect(entryMissionStage(withWork)).toBe('try');
    expect(entryMissionStage({...withWork,[ENTRY_KEY]:encodeEntry({...record,selectedStage:'review'})})).toBe('review');
  });
});
