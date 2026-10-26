import { lireHistorique, jour, type Exercice, type Historique } from './historique';

export const CLE_MANUEL = 'fragx.routine.jeu';
/** Séries à faire chaque jour pour valider la routine. */
export const CIBLES_ROUTINE: Partial<Record<Exercice, number>> = { reflexes: 1, vitesse: 2, precision: 2, suivi: 2 };

export function lireManuel(): Set<string> {
  try { const v = JSON.parse(localStorage.getItem(CLE_MANUEL) || '[]'); return new Set(Array.isArray(v) ? v : []); } catch { return new Set(); }
}
export function ecrireManuel(jours: Set<string>): void {
  try { localStorage.setItem(CLE_MANUEL, JSON.stringify([...jours].sort().slice(-400))); } catch { /* indisponible */ }
}

/** Nombre de séries par jour et par exercice. */
export function seriesParJour(h: Historique = lireHistorique()): Map<string, Partial<Record<Exercice, number>>> {
  const m = new Map<string, Partial<Record<Exercice, number>>>();
  for (const ex of Object.keys(h) as Exercice[]) {
    for (const e of h[ex]) {
      const j = jour(e.t);
      const r = m.get(j) ?? {};
      r[ex] = (r[ex] ?? 0) + 1;
      m.set(j, r);
    }
  }
  return m;
}

export function jourComplet(j: string, parJour = seriesParJour(), manuel = lireManuel()): boolean {
  const r = parJour.get(j);
  if (!r || !manuel.has(j)) return false;
  return (Object.entries(CIBLES_ROUTINE) as [Exercice, number][]).every(([ex, n]) => (r[ex] ?? 0) >= n);
}

/** Jours d'affilée avec la routine complète (aujourd'hui compte s'il est déjà complet). */
export function serieRoutine(parJour = seriesParJour(), manuel = lireManuel()): number {
  let n = 0;
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  if (!jourComplet(jour(d.getTime()), parJour, manuel)) d.setDate(d.getDate() - 1);
  while (jourComplet(jour(d.getTime()), parJour, manuel)) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
