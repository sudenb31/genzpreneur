import type { IndustryKey } from '../industries';
import type { SimDecisionFull, SimIndustryJourney, SimIndustryOps, SimLevelKey, SimScenario, SimScenarioContent } from './types';
import { FASHION } from './fashion';
import { FNB } from './fnb';
import { DIGITAL_SERVICES } from './digital';
import { CREATOR } from './creator';
import { EDUCATION } from './education';
import { EVENT } from './event';
import { BEAUTY } from './beauty';
import { B2B_SALES } from './b2b';
import { TECH } from './tech';
import { RETAIL } from './retail';
import { FASHION_OPS } from './ops/fashion';
import { FNB_OPS } from './ops/fnb';
import { DIGITAL_OPS } from './ops/digital';
import { CREATOR_OPS } from './ops/creator';
import { EDUCATION_OPS } from './ops/education';
import { EVENT_OPS } from './ops/event';
import { BEAUTY_OPS } from './ops/beauty';
import { B2B_OPS } from './ops/b2b';
import { TECH_OPS } from './ops/tech';
import { RETAIL_OPS } from './ops/retail';
import { FASHION_JOURNEY } from './journey/fashion';
import { FNB_JOURNEY } from './journey/fnb';
import { DIGITAL_JOURNEY } from './journey/digital';
import { CREATOR_JOURNEY } from './journey/creator';
import { EDUCATION_JOURNEY } from './journey/education';
import { EVENT_JOURNEY } from './journey/event';
import { BEAUTY_JOURNEY } from './journey/beauty';
import { B2B_JOURNEY } from './journey/b2b';
import { TECH_JOURNEY } from './journey/tech';
import { RETAIL_JOURNEY } from './journey/retail';

export * from './types';

/**
 * Gabungkan 3 keputusan dasar (konten) + eksekusinya (ops) + 7 keputusan tambahan (journey)
 * menjadi perjalanan 90 hari berisi 10 keputusan, sesuai urutan di journey.order.
 */
function merge(content: SimScenarioContent[], ops: SimIndustryOps, journey: SimIndustryJourney): SimScenario[] {
  return content.map((c) => {
    const j = journey[c.level];
    const pool: Record<string, SimDecisionFull> = {};
    c.decisions.forEach((d, i) => { pool[`b${i}`] = { ...d, area: j.areas[i], execution: ops.exec[c.level][i] }; });
    j.extra.forEach((d, i) => { pool[`e${i}`] = d; });
    const decisions = j.order.map((k) => {
      const d = pool[k];
      if (!d) throw new Error(`Simulasi ${c.industry}/${c.level}: keputusan "${k}" tidak ditemukan`);
      return d;
    });
    return { ...c, ops: ops.ops[c.level], fase: j.fase, decisions };
  });
}

export const SIM_SCENARIOS: SimScenario[] = [
  ...merge(FASHION, FASHION_OPS, FASHION_JOURNEY),
  ...merge(FNB, FNB_OPS, FNB_JOURNEY),
  ...merge(DIGITAL_SERVICES, DIGITAL_OPS, DIGITAL_JOURNEY),
  ...merge(CREATOR, CREATOR_OPS, CREATOR_JOURNEY),
  ...merge(EDUCATION, EDUCATION_OPS, EDUCATION_JOURNEY),
  ...merge(EVENT, EVENT_OPS, EVENT_JOURNEY),
  ...merge(BEAUTY, BEAUTY_OPS, BEAUTY_JOURNEY),
  ...merge(B2B_SALES, B2B_OPS, B2B_JOURNEY),
  ...merge(TECH, TECH_OPS, TECH_JOURNEY),
  ...merge(RETAIL, RETAIL_OPS, RETAIL_JOURNEY),
];

export function findScenario(industry: IndustryKey, level: SimLevelKey): SimScenario | undefined {
  return SIM_SCENARIOS.find((s) => s.industry === industry && s.level === level);
}
