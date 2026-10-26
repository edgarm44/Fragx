/** Définition des exercices de visée (angles en degrés). */
export type Mode = 'vitesse' | 'precision' | 'suivi' | 'flick' | 'micro' | 'strafe';

export interface DefExercice {
  id: Mode;
  nom: string;
  resume: string;
  consigne: string;
  /** cibles : nombre fixe de cibles ; chrono : durée fixe ; suivi : garder la visée sur une cible mobile */
  type: 'cibles' | 'chrono' | 'suivi';
  nbCibles?: number;
  duree?: number;
  /** Rayon angulaire de la cible */
  rayon: number;
  libelleScore: string;
  format: (v: number) => string;
}

const virgule = (v: number, d: number) => v.toFixed(d).replace('.', ',');

export const EXERCICES: DefExercice[] = [
  {
    id: 'vitesse', nom: 'Vitesse', resume: '30 cibles, le plus vite possible', type: 'cibles', nbCibles: 30, rayon: 1.6,
    consigne: 'Détruis les 30 cibles le plus vite possible.', libelleScore: 'Touches',
    format: (v) => `${virgule(v / 1000, 2)} s`,
  },
  {
    id: 'precision', nom: 'Précision', resume: 'Petites cibles, 30 secondes', type: 'chrono', duree: 30000, rayon: 0.75,
    consigne: 'Touche un maximum de petites cibles en 30 secondes. Chaque tir manqué retire 5 points.', libelleScore: 'Points',
    format: (v) => `${Math.round(v)} pts`,
  },
  {
    id: 'suivi', nom: 'Suivi', resume: 'Garde la visée sur une cible mobile', type: 'suivi', duree: 30000, rayon: 1.8,
    consigne: 'Garde ton viseur sur la cible qui se déplace pendant 30 secondes. Pas besoin de tirer.', libelleScore: 'Sur la cible',
    format: (v) => `${Math.round(v)} %`,
  },
  {
    id: 'flick', nom: 'Flick', resume: 'Grands mouvements rapides', type: 'cibles', nbCibles: 20, rayon: 1.6,
    consigne: 'Chaque cible apparaît loin de ton viseur : va la chercher d\'un seul geste. 20 cibles.', libelleScore: 'Touches',
    format: (v) => `${Math.round(v)} ms`,
  },
  {
    id: 'micro', nom: 'Micro-ajustements', resume: 'Toutes petites corrections', type: 'chrono', duree: 30000, rayon: 0.45,
    consigne: 'De minuscules cibles apparaissent tout près de ton viseur. Corrige au plus juste : 30 secondes.', libelleScore: 'Touches',
    format: (v) => `${Math.round(v)} touches`,
  },
  {
    id: 'strafe', nom: 'Strafe', resume: 'Cible qui change de sens', type: 'suivi', duree: 30000, rayon: 1.8,
    consigne: 'La cible se déplace de gauche à droite et change brusquement de sens, comme un joueur qui esquive.', libelleScore: 'Sur la cible',
    format: (v) => `${Math.round(v)} %`,
  },
];

export const exercice = (id: string) => EXERCICES.find((e) => e.id === id);
