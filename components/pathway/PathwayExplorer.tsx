'use client';

import { useState } from 'react';
import { PathwayMap, type PathwayPosition } from './PathwayMap';

const OPTIONS: Array<{ value: PathwayPosition; label: string }> = [
  { value: null, label: 'Tanpa posisi' },
  { value: 'fktp', label: 'Di FKTP' },
  { value: 'rumahSakit', label: 'Di rumah sakit (dirujuk)' },
  { value: 'subSpesialis', label: 'Di sub-spesialis' },
  { value: 'gawatDarurat', label: 'Jalur gawat darurat' },
];

/** Lets a reader step through each position and see DESIGN.md §6's route-drawing animation. */
export function PathwayExplorer() {
  const [position, setPosition] = useState<PathwayPosition>(null);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap no-print" role="group" aria-label="Pilih posisi pada peta alur">
        {OPTIONS.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => setPosition(opt.value)}
            aria-pressed={position === opt.value}
            className={`min-h-[48px] px-3 rounded-md border-2 text-caption font-medium ${
              position === opt.value ? 'border-ink bg-ink text-paper' : 'border-ink hover:bg-ink/5'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <PathwayMap position={position} />
    </div>
  );
}
