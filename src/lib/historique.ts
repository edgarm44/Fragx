/**
 * Historique des scores, stocké uniquement dans le navigateur (localStorage).
 * Utilisé par l'entraînement de visée, le test de réflexes et la routine.
 */
export type Exercice = 'vitesse' | 'precision' | 'suivi' | 'flick' | 'micro' | 'strafe' | 'reflexes';
export interface Entree { t: number; score: number; }
export type Historique = Record<Exercice, Entree[]>;

const CLE = 'fragx.historique';
const MAX = 300;

/** Exercices où un score plus bas est meilleur (temps en millisecondes). */
export const PLUS_BAS_MEILLEUR: Record<Exercice, boolean> = {
  vitesse: true,
  precision: false,
  suivi: false,
  flick: true,
  micro: false,
  strafe: false,
  reflexes: true,
};

function vide(): Historique {
  return { vitesse: [], precision: [], suivi: [], flick: [], micro: [], strafe: [], reflexes: [] };
}

export function lireHistorique(): Historique {
  try {
    const brut = JSON.parse(localStorage.getItem(CLE) || 'null');
    const h = vide();
    if (brut && typeof brut === 'object') {
      for (const k of Object.keys(h) as Exercice[]) {
        if (Array.isArray(brut[k])) h[k] = brut[k].filter((e: Entree) => e && typeof e.t === 'number' && typeof e.score === 'number');
      }
    }
    return h;
  } catch {
    return vide();
  }
}

export function ajouter(exercice: Exercice, score: number): void {
  const h = lireHistorique();
  h[exercice].push({ t: Date.now(), score });
  if (h[exercice].length > MAX) h[exercice] = h[exercice].slice(-MAX);
  try { localStorage.setItem(CLE, JSON.stringify(h)); } catch { /* stockage indisponible */ }
}

/** Date locale au format AAAA-MM-JJ. */
export function jour(t: number = Date.now()): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Petits drapeaux « outil utilisé au moins une fois » (benchmark, diagnostic, ping…). */
export function marquer(drapeau: string): void {
  try {
    const d = JSON.parse(localStorage.getItem('fragx.drapeaux') || '{}');
    if (!d[drapeau]) { d[drapeau] = Date.now(); localStorage.setItem('fragx.drapeaux', JSON.stringify(d)); }
  } catch { /* stockage indisponible */ }
}
export function drapeaux(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem('fragx.drapeaux') || '{}') || {}; } catch { return {}; }
}
