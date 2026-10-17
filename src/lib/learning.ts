import { MODULES, type LearningModule } from '../content/modules';
import { moduleFeature, type FeatureKey } from './membership';
import type { LessonProgress } from './data';

/** Resume a saved draft first, otherwise the first unfinished lesson the plan permits. */
export function nextLearningLesson(lessons: Record<string, LessonProgress>, can: (feature: FeatureKey) => boolean, modules: LearningModule[] = MODULES) {
  const available = modules.filter((m) => can(moduleFeature(m))).flatMap((mod) => mod.lessons.map((lesson) => ({ mod, lesson })));
  return available.find(({ lesson }) => !lessons[lesson.id]?.done && !!lessons[lesson.id]?.reflection.trim())
    ?? available.find(({ lesson }) => !lessons[lesson.id]?.done)
    ?? null;
}

export const lessonUrl = (slug: string, id: string) => `/app/belajar/${slug}?pelajaran=${encodeURIComponent(id)}`;
