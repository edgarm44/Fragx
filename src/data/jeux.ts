/**
 * Conversion de sensibilité.
 * Pour chaque jeu : degrés tournés par « count » (unité de mouvement de la souris)
 * en fonction de la sensibilité affichée dans le menu.
 *   degrés = yaw × sensibilité + decalage
 * Pour la plupart des jeux le décalage est nul (relation proportionnelle).
 * Les valeurs ne sont pas publiées par les éditeurs : ce sont des mesures communautaires.
 * À revérifier après chaque mise à jour majeure d'un jeu.
 */
export interface Jeu {
  id: string;
  nom: string;
  /** Degrés par count pour une sensibilité de 1 */
  yaw: number;
  /** Degrés par count ajoutés quelle que soit la sensibilité (Battlefield 6) */
  decalage?: number;
  /** Nom du réglage dans le menu du jeu */
  format: string;
  /** Décimales affichées */
  decimales: number;
  /** Valeur affichée en pourcentage (Fortnite) */
  pourcent?: boolean;
  /** Formule estimée par la communauté, moins sûre */
  estimation?: boolean;
  source: { nom: string; url: string; date: string };
}

const SENSLAB = (jeu: string) => ({ nom: 'senslab.pro', url: `https://senslab.pro/sensitivity/${jeu}`, date: 'novembre 2026' });
const RECHARGE = { nom: 'Recharge.com', url: 'https://www.recharge.com/blog/en-gb/mouse-sensitivity-converter-calculator-for-23-fps-games', date: 'octobre 2026' };

export const JEUX: Jeu[] = [
  { id: 'valorant', nom: 'Valorant', yaw: 0.07, format: 'Sensibilité', decimales: 3, source: RECHARGE },
  { id: 'fortnite', nom: 'Fortnite', yaw: 0.005555, format: 'Sensibilité X et Y, en %', decimales: 1, pourcent: true, source: RECHARGE },
  { id: 'apex', nom: 'Apex Legends', yaw: 0.022, format: 'Sensibilité souris', decimales: 2, source: RECHARGE },
  { id: 'cod', nom: 'Call of Duty (BO7, Warzone)', yaw: 0.0066, format: 'Sensibilité souris', decimales: 2, source: RECHARGE },
  {
    id: 'bf6', nom: 'Battlefield 6', yaw: 0.00173623, decalage: 0.00231498, format: 'Sensibilité de visée de l\'infanterie',
    decimales: 1, estimation: true, source: SENSLAB('battlefield6'),
  },
  { id: 'bf2042', nom: 'Battlefield 2042', yaw: 0.0066, format: 'Sensibilité soldat', decimales: 2, source: RECHARGE },
  { id: 'cs2', nom: 'Counter-Strike 2', yaw: 0.022, format: 'Sensibilité', decimales: 3, source: RECHARGE },
  { id: 'ow2', nom: 'Overwatch 2', yaw: 0.0066, format: 'Sensibilité', decimales: 2, source: RECHARGE },
];

export const JEUX_COUVERTS = ['Valorant', 'Fortnite', 'Apex Legends', 'Call of Duty', 'Battlefield'];

export const jeuParId = (id: string): Jeu | undefined => JEUX.find((j) => j.id === id);

/** Degrés tournés par count de souris. */
export function degresParCount(jeu: Jeu, sens: number): number {
  return jeu.yaw * sens + (jeu.decalage ?? 0);
}

/** Sensibilité à régler dans un jeu pour obtenir une rotation donnée (null si impossible). */
export function sensPour(jeu: Jeu, degres: number): number | null {
  const s = (degres - (jeu.decalage ?? 0)) / jeu.yaw;
  return s > 0 && Number.isFinite(s) ? s : null;
}

/** Centimètres de tapis pour un tour complet. */
export function cm360(jeu: Jeu, sens: number, dpi: number): number {
  return (360 / (degresParCount(jeu, sens) * dpi)) * 2.54;
}

/**
 * eDPI = sensibilité × DPI, comparable uniquement entre joueurs d'un même jeu.
 * Fortnite : la sensibilité est en %, on utilise la valeur décimale (convention habituelle).
 */
export function edpi(jeu: Jeu, sens: number, dpi: number): number {
  return (jeu.pourcent ? sens / 100 : sens) * dpi;
}
