import { graine, generateur } from './aleatoire';
import { EXERCICES, type DefExercice } from './exercices';
import { jour, PLUS_BAS_MEILLEUR } from './historique';

export interface Defi { date: string; exercice: DefExercice; graine: number; }

/** Le défi d'un jour donné : le même exercice et les mêmes cibles pour tout le monde. */
export function defiDu(date: string = jour()): Defi {
  const g = graine(`fragx-defi-${date}`);
  const r = generateur(g);
  const ex = EXERCICES[Math.floor(r() * EXERCICES.length)];
  return { date, exercice: ex, graine: g };
}

const CLE = 'fragx.defis';

export function resultatsDefis(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(CLE) || '{}') || {}; } catch { return {}; }
}

/** Enregistre un score de défi ; renvoie true si c'est le meilleur score de la journée. */
export function enregistrerDefi(date: string, mode: string, score: number): boolean {
  const res = resultatsDefis();
  const basMieux = PLUS_BAS_MEILLEUR[mode as keyof typeof PLUS_BAS_MEILLEUR];
  const avant = res[date];
  const meilleur = avant === undefined || (basMieux ? score < avant : score > avant);
  if (meilleur) {
    res[date] = score;
    try { localStorage.setItem(CLE, JSON.stringify(res)); } catch { /* indisponible */ }
  }
  return meilleur;
}
