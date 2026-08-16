import { NetworkSchema, type Network } from './schema';
import { getReference } from '@/data/reference';
import { slugify } from '@/lib/content/slugify';

/**
 * The one canonical network definition — DESIGN.md v3 §5: "Fragments are
 * cropped views of one canonical network definition in `lib/`, never
 * separately drawn. If the network changes, every fragment changes with
 * it." Nothing in this file renders anything; it is validated data, same
 * discipline as data/scenarios, data/reference, data/conditions.
 *
 * Station labels/sublabels are carried over unchanged from the pre-v3
 * `components/pathway/PathwayMap.tsx` (now superseded by this
 * definition — that component is not touched in this step).
 */
const stations: Network['stations'] = [
  { id: 'fktp', label: 'FKTP', sublabel: 'Puskesmas / klinik' },
  { id: 'rumahSakit', label: 'Rumah Sakit', sublabel: 'Interchange' },
  { id: 'subSpesialis', label: 'Sub-spesialis', sublabel: 'Rujukan lanjutan' },
  { id: 'naikKelas', label: 'Naik kelas', sublabel: 'Selisih biaya kelas rawat inap' },
  { id: 'obatNonFornas', label: 'Obat di luar Fornas', sublabel: 'Persetujuan komite medik' },
  { id: 'alkesAboveCeiling', label: 'Alat kesehatan di atas batas', sublabel: 'Selisih di atas batas tarif' },
];

const lines: Network['lines'] = [
  {
    id: 'referral',
    kind: 'referral',
    label: 'Jalur rujukan berjenjang',
    colorToken: 'payer-1',
    pattern: 'solid',
    stationIds: ['fktp', 'rumahSakit', 'subSpesialis'],
  },
  {
    id: 'careBypass',
    kind: 'careBypass',
    label: 'Jalur gawat darurat',
    colorToken: 'care',
    pattern: 'sparseDash',
    stationIds: ['rumahSakit'],
    entersFromOutsideNetwork: true,
  },
  {
    id: 'selfBranch',
    kind: 'selfBranch',
    label: 'Jalur mandiri — bisa berbayar',
    colorToken: 'self',
    pattern: 'dot',
    stationIds: ['naikKelas', 'obatNonFornas', 'alkesAboveCeiling'],
    branchesFromStationId: 'rumahSakit',
  },
];

/**
 * DESIGN.md §5: "The exclusions are drawn as stations connected to
 * nothing." Derived from the real pengecualian reference entries
 * (data/reference/pengecualian.ts) rather than re-authored here, so the
 * off-network cluster can never drift from the actual Pasal 52 list this
 * app cites elsewhere — a missing item here would misrepresent which
 * services are genuinely excluded, this product's core safety concern
 * (PRD.md §3). Precedent for lib/ deriving from data/: lib/search/
 * searchIndex.ts and lib/copy/collectContentCopy.ts already do this.
 */
function buildOffNetworkFromPengecualian(): Network['offNetwork'] {
  const pengecualian = getReference('pengecualian');
  if (!pengecualian || pengecualian.format !== 'entryList') {
    throw new Error('lib/network/definition.ts: data/reference/pengecualian is missing or not an entryList');
  }
  return pengecualian.entries.map((entry) => ({
    id: slugify(entry.term),
    label: entry.term,
    article: entry.citation.article,
  }));
}

export const network: Network = NetworkSchema.parse({
  stations,
  lines,
  offNetwork: buildOffNetworkFromPengecualian(),
});
