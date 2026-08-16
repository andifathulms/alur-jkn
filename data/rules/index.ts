import { loadRulePack } from '@/lib/rules/loader';
import type { RulePack } from '@/lib/rules/schema';

import perpres82 from './perpres-82-2018.json';
import permenkes47 from './permenkes-47-2018.json';
import permenkesFormularium from './permenkes-formularium-nasional.json';

const rawPacks: Array<{ raw: unknown; label: string }> = [
  { raw: perpres82, label: 'perpres-82-2018.json' },
  { raw: permenkes47, label: 'permenkes-47-2018.json' },
  { raw: permenkesFormularium, label: 'permenkes-formularium-nasional.json' },
];

export const rulePacks: RulePack[] = rawPacks.map(({ raw, label }) => loadRulePack(raw, label));
