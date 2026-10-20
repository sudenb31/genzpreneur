import type { IndustryKey } from '../industries';
import type { SimIndustryOps, SimLevelKey, SimScenario, SimScenarioContent } from './types';
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

export * from './types';

/** Gabungkan cerita & keputusan dengan operasional tim + rencana eksekusi per keputusan. */
function merge(content: SimScenarioContent[], ops: SimIndustryOps): SimScenario[] {
  return content.map((c) => {
    const exec = ops.exec[c.level];
    const [d1, d2, d3] = c.decisions;
    return {
      ...c,
      ops: ops.ops[c.level],
      decisions: [
        { ...d1, execution: exec[0] },
        { ...d2, execution: exec[1] },
        { ...d3, execution: exec[2] },
      ],
    };
  });
}

export const SIM_SCENARIOS: SimScenario[] = [
  ...merge(FASHION, FASHION_OPS),
  ...merge(FNB, FNB_OPS),
  ...merge(DIGITAL_SERVICES, DIGITAL_OPS),
  ...merge(CREATOR, CREATOR_OPS),
  ...merge(EDUCATION, EDUCATION_OPS),
  ...merge(EVENT, EVENT_OPS),
  ...merge(BEAUTY, BEAUTY_OPS),
  ...merge(B2B_SALES, B2B_OPS),
  ...merge(TECH, TECH_OPS),
  ...merge(RETAIL, RETAIL_OPS),
];

export function findScenario(industry: IndustryKey, level: SimLevelKey): SimScenario | undefined {
  return SIM_SCENARIOS.find((s) => s.industry === industry && s.level === level);
}
