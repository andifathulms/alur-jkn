/** Deterministic anchor id from a term — "Kacamata" -> "kacamata", "Kelas 1/2/3" -> "kelas-1-2-3". */
export function slugify(term: string): string {
  const COMBINING_DIACRITICS = new RegExp('[̀-ͯ]', 'g');
  return term
    .toLowerCase()
    .normalize('NFKD')
    .replace(COMBINING_DIACRITICS, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
