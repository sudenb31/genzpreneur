import type { IndustryKey } from '../industries';
import type { SimLevelKey, SimScenario } from './types';
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

export * from './types';

export const SIM_SCENARIOS: SimScenario[] = [
  ...FASHION, ...FNB, ...DIGITAL_SERVICES, ...CREATOR, ...EDUCATION,
  ...EVENT, ...BEAUTY, ...B2B_SALES, ...TECH, ...RETAIL,
];

export function findScenario(industry: IndustryKey, level: SimLevelKey): SimScenario | undefined {
  return SIM_SCENARIOS.find((s) => s.industry === industry && s.level === level);
}
