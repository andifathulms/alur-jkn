import { ReferenceSchema, type Reference } from '@/lib/content/reference';
import { inaCbg } from './ina-cbg';
import { pengecualian } from './pengecualian';
import { poli } from './poli';
import { alatKesehatan } from './alat-kesehatan';
import { obat } from './obat';
import { kelas } from './kelas';

const rawEntries: Reference[] = [inaCbg, pengecualian, poli, alatKesehatan, obat, kelas];

export const referenceEntries: Reference[] = rawEntries.map((entry) => ReferenceSchema.parse(entry));

export function getReference(slug: string): Reference | undefined {
  return referenceEntries.find((r) => r.slug === slug);
}
