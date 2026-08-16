import { ReferenceSchema, type Reference } from '@/lib/content/reference';
import { inaCbg } from './ina-cbg';

const rawEntries: Reference[] = [inaCbg];

export const referenceEntries: Reference[] = rawEntries.map((entry) => ReferenceSchema.parse(entry));

export function getReference(slug: string): Reference | undefined {
  return referenceEntries.find((r) => r.slug === slug);
}
