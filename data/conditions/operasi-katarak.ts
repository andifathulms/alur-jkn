import type { Condition } from '@/lib/content/condition';

/**
 * MIGRATION.md step 5's second example. Same shape of correction as
 * operasi-usus-buntu: method choice is a medical-indication and
 * hospital-capability question, not a coverage decision — draft content,
 * pending re-verification (UPDATING.md), same as everything else in this
 * repo.
 */
export const operasiKatarak: Condition = {
  contentType: 'condition',
  slug: 'operasi-katarak',
  title: 'Operasi katarak',
  summary:
    'Fakoemulsifikasi dan ekstraksi konvensional ada dalam paket JKN yang sama — yang menentukan pilihan di rumah sakit Anda adalah indikasi medis dan peralatan yang tersedia, bukan aturan penjaminan.',
  position: { type: 'station', stationId: 'rumahSakit' },
  route:
    'Operasi katarak dilakukan melalui jalur bedah mata di rumah sakit, setelah rujukan dari FKTP ke poli mata (atau rujukan internal dari dokter spesialis mata ke bedah, jika sudah dalam pemantauan). Operasi katarak umumnya bukan kondisi gawat darurat, sehingga jalur rujukan berjenjang biasa berlaku.',
  methodDeterminant:
    'Operasi katarak dapat dilakukan dengan metode fakoemulsifikasi (phaco) atau ekstraksi katarak konvensional (ECCE). Dokter spesialis mata menentukan metode yang sesuai berdasarkan indikasi medis — misalnya tingkat kekeruhan lensa dan kondisi mata pasien — bukan berdasarkan aturan penjaminan JKN.',
  whyOneOption:
    'Kedua metode termasuk dalam paket INA-CBG yang sama untuk kelompok kasus katarak. Karena tarif paketnya sama, rumah sakit menawarkan metode yang peralatannya tersedia dan sesuai keahlian tim bedah di rumah sakit tersebut — fakoemulsifikasi memerlukan alat khusus yang tidak selalu tersedia di semua rumah sakit.',
  costsThatRemain:
    'Lensa intraokular (IOL) tertentu di luar standar yang dijamin, atau naik kelas rawat inap, dapat dikenakan biaya tambahan mandiri. Tanyakan ke petugas jenis lensa yang termasuk dalam paket JKN sebelum operasi.',
  questionToAsk:
    'Metode dan jenis lensa mana yang sesuai indikasi medis saya, dan apakah rumah sakit ini bisa melakukannya dalam paket JKN?',
  ruleRefs: [
    { packId: 'perpres-82-2018', ruleId: 'rujukan-berjenjang' },
    { packId: 'permenkes-3-2023', ruleId: 'paket-ina-cbg' },
  ],
};
