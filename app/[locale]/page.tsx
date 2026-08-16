import Link from 'next/link';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';

/** DESIGN.md §5: two doors, same content. A single unified dashboard would fail both. */
export default function HomePage() {
  return (
    <div>
      <EmergencyBanner />
      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 space-y-8">
        <div>
          <h1 className="text-heading font-medium">Alur JKN</h1>
          <p className="text-body-lg mt-2">
            Menjelaskan alur rujukan dan penjaminan JKN, dan menghasilkan pertanyaan yang tepat untuk
            ditanyakan ke petugas. Bukan verdict, bukan kanal resmi BPJS Kesehatan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/id/petugas"
            className="block border-2 border-ink rounded-lg p-6 min-h-[48px] hover:bg-ink/5"
          >
            <h2 className="text-key font-medium">Mode petugas</h2>
            <p className="text-body mt-2">
              Daftar skenario ringkas, satu tap ke penjelasan. Untuk dijelaskan lewat meja dalam waktu
              singkat.
            </p>
          </Link>
          <Link
            href="/id/keluarga"
            className="block border-2 border-ink rounded-lg p-6 min-h-[56px] hover:bg-ink/5"
          >
            <h2 className="text-key font-medium">Mode keluarga</h2>
            <p className="text-body mt-2">
              Satu pertanyaan per layar, tanpa tekanan progres. Untuk dibaca sendiri, pelan-pelan.
            </p>
          </Link>
        </div>

        <Link href="/id/alur" className="underline underline-offset-4 text-body inline-block">
          Lihat peta alur rujukan →
        </Link>
      </div>
    </div>
  );
}
