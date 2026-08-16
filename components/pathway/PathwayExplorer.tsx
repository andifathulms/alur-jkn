'use client';

import { useState } from 'react';
import { PathwayMap, type PathwayPosition } from './PathwayMap';
import { buttonClassName } from '@/components/primitives/Button';

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
            className={buttonClassName({ size: 'caption', pressed: position === opt.value })}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <PathwayMap position={position} />
    </div>
  );
}
