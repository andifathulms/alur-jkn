import { describe, it, expect } from 'vitest';
import { ZodDiscriminatedUnion, ZodObject, type ZodTypeAny } from 'zod';
import { ScenarioSchema } from '@/lib/content/scenario';
import { OutcomeSchema, PayerSchema, PayerRoutingSchema } from '@/lib/content/outcome';
import { RuleSchema, RuleCitationSchema, RulePackSchema } from '@/lib/rules/schema';

/**
 * CLAUDE.md v2 invariant 8: no diagnostic field anywhere in the content
 * schema — no symptom, severity, duration, or free-text clinical entry.
 * This inspects the zod schema *shapes themselves* (not content strings),
 * so a future field named e.g. `gejala` or `keparahan` fails this test the
 * moment it's added to a schema, before any data is ever written for it.
 */
const DIAGNOSTIC_FIELD_NAMES =
  /gejala|symptom|diagnos|severity|keparahan|derajat|durasi.?keluhan|keluhan|riwayat.?penyakit|triage|nyeri/i;

function fieldNames(schema: ZodTypeAny): string[] {
  if (schema instanceof ZodObject) {
    return Object.keys(schema.shape);
  }
  if (schema instanceof ZodDiscriminatedUnion) {
    return (schema.options as ZodTypeAny[]).flatMap(fieldNames);
  }
  throw new Error('fieldNames: unsupported schema type in this test — extend it, not skip it');
}

const SCHEMAS: Array<[string, ZodTypeAny]> = [
  ['ScenarioSchema', ScenarioSchema],
  ['OutcomeSchema', OutcomeSchema],
  ['PayerSchema', PayerSchema],
  ['PayerRoutingSchema', PayerRoutingSchema],
  ['RuleSchema', RuleSchema],
  ['RuleCitationSchema', RuleCitationSchema],
  ['RulePackSchema', RulePackSchema],
];

describe('no diagnostic field in any schema', () => {
  it.each(SCHEMAS)('%s has no field name matching the diagnostic-keyword blocklist', (name, schema) => {
    const offending = fieldNames(schema).filter((f) => DIAGNOSTIC_FIELD_NAMES.test(f));
    expect(offending, `${name} has diagnostic-looking field(s): ${offending.join(', ')}`).toEqual([]);
  });

  it('positive control: the blocklist actually catches a diagnostic-looking name', () => {
    expect(DIAGNOSTIC_FIELD_NAMES.test('gejala')).toBe(true);
    expect(DIAGNOSTIC_FIELD_NAMES.test('severityLevel')).toBe(true);
    expect(DIAGNOSTIC_FIELD_NAMES.test('id')).toBe(false);
  });
});
