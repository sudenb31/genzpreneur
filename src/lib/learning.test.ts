import { describe, expect, it } from 'vitest';
import { MODULES } from '../content/modules';
import { lessonUrl, nextLearningLesson } from './learning';

describe('learning recommendations', () => {
  it('starts with an accessible lesson without requiring a completed Passport', () => {
    expect(nextLearningLesson({}, () => true)?.lesson.id).toBe(MODULES[0].lessons[0].id);
  });
  it('resumes an unfinished saved exercise before untouched lessons', () => {
    const lesson = MODULES[0].lessons[1];
    expect(nextLearningLesson({ [lesson.id]: { done: false, reflection: 'Draf latihan' } }, () => true)?.lesson.id).toBe(lesson.id);
  });
  it('does not recommend content outside the current access', () => {
    expect(nextLearningLesson({}, () => false)).toBeNull();
  });
  it('ignores saved drafts in a locked season', () => {
    const locked = MODULES.find((m) => m.season === 4)!;
    const next = nextLearningLesson({ [locked.lessons[0].id]: { done: false, reflection: 'Draf lama' } }, (feature) => feature === 'business101' || feature === 'season1');
    expect(next?.mod.season).toBe(1);
  });
  it('returns null when all accessible lessons are complete', () => {
    const lessons = Object.fromEntries(MODULES.flatMap((m) => m.lessons.map((l) => [l.id, { done: true, reflection: '' }])));
    expect(nextLearningLesson(lessons, () => true)).toBeNull();
  });
  it('skips completed exercises even when they contain a reflection', () => {
    const first = MODULES[0].lessons[0];
    expect(nextLearningLesson({ [first.id]: { done: true, reflection: 'Selesai' } }, () => true)?.lesson.id).toBe(MODULES[0].lessons[1].id);
  });
  it('links to the exact lesson', () => {
    expect(lessonUrl('mindset', 'mindset-1')).toBe('/app/belajar/mindset?pelajaran=mindset-1');
  });
});
