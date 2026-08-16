import type { Condition } from '@/lib/content/condition';

/**
 * PRD.md §3 — the worked example the whole product's mission is built on:
 * "Coverage applies to appendectomy both conventionally and
 * laparoscopically, as long as a doctor recommends it on medical
 * grounds... a clinician saying 'laparoskopi nggak ditanggung' is being
 * accurate about their hospital and inaccurate about the regulation."
 * questionToAsk reuses PRD.md §5.3's own example question.
 */
export const operasiUsusBuntu: Condition = {
  contentType: 'condition',
  slug: 'operasi-usus-buntu',
  title: 'Operasi usus buntu (apendektomi)',
  summary:
    'Baik operasi terbuka maupun laparoskopi ada dalam paket JKN yang sama — yang menentukan pilihan di rumah sakit Anda adalah indikasi medis dan kemampuan rumah sakit, bukan aturan penjaminan.',
  position: { type: 'station', stationId: 'rumahSakit' },
  route:
    'Operasi usus buntu biasanya dilakukan melalui jalur bedah umum di rumah sakit. Jika ini kondisi akut dengan risiko darurat, jalur gawat darurat berlaku tanpa perlu rujukan lebih dulu — datang langsung ke IGD. Jika tidak akut, rujukan dari FKTP ke poli bedah tetap diperlukan lebih dulu.',
  methodDeterminant:
    'Operasi usus buntu dapat dilakukan dengan metode operasi terbuka (konvensional) atau laparoskopi. Dokter bedah menentukan metode yang sesuai berdasarkan indikasi medis — misalnya kondisi usus buntu, riwayat operasi sebelumnya, dan kondisi pasien secara umum — bukan berdasarkan aturan penjaminan JKN.',
  whyOneOption:
    'Baik operasi terbuka maupun laparoskopi termasuk dalam paket INA-CBG yang sama untuk kelompok kasus usus buntu. Karena tarif paketnya sama, rumah sakit menawarkan metode yang bisa dilakukannya dengan baik dalam batas paket tersebut — laparoskopi memerlukan peralatan dan keahlian tertentu yang tidak selalu tersedia di semua rumah sakit.',
  costsThatRemain:
    'Jika Anda memilih naik kelas rawat inap di atas hak Anda, selisih biayanya dibayar mandiri. Obat atau alat kesehatan tambahan di luar Formularium Nasional atau di luar paket standar juga dapat dikenakan biaya tersendiri, tergantung ketentuan yang berlaku di rumah sakit tersebut.',
  questionToAsk:
    'Metode mana yang sesuai dengan indikasi medis saya, dan apakah rumah sakit ini bisa melakukannya dalam paket JKN?',
  ruleRefs: [
    { packId: 'perpres-82-2018', ruleId: 'rujukan-berjenjang' },
    { packId: 'perpres-82-2018', ruleId: 'gawat-darurat-akses-langsung' },
    { packId: 'permenkes-3-2023', ruleId: 'paket-ina-cbg' },
  ],
  inaCbgPackageItems: ['Operasi terbuka', 'Laparoskopi'],
  emergencyBypassApplies: true,
  outOfPocketStops: ['naikKelas', 'obatNonFornas'],
};
