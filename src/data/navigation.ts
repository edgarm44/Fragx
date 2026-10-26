export interface Outil {
  href: string;
  nom: string;
  court: string;
  texte: string;
  duree: string;
}
export interface Categorie {
  id: string;
  nom: string;
  outils: Outil[];
}

export const CATEGORIES: Categorie[] = [
  {
    id: 'materiel',
    nom: 'Matériel',
    outils: [
      { href: '/setup', nom: 'Diagnostic du setup', court: 'Diagnostic', texte: 'Repère ce qui freine ton PC : écran, mémoire, stockage, souris, connexion.', duree: '3 min' },
      { href: '/benchmark', nom: 'Benchmark navigateur', court: 'Benchmark', texte: 'Charge ta carte graphique par paliers et obtiens un score à comparer.', duree: '1 min' },
      { href: '/souris-ecran', nom: 'Souris et écran', court: 'Souris et écran', texte: 'Mesure le taux d\'interrogation réel de ta souris, teste la netteté de ton écran et les pixels morts.', duree: '2 min' },
      { href: '/ping', nom: 'Ping et connexion', court: 'Ping', texte: 'Latence, gigue et pertes de ta connexion, avec des conseils pour jouer en ligne.', duree: '30 s' },
    ],
  },
  {
    id: 'visee',
    nom: 'Visée',
    outils: [
      { href: '/visee', nom: 'Entraînement de visée', court: 'Entraînement', texte: 'Six exercices joués à ta vraie sensibilité de jeu, souris capturée comme en partie.', duree: '1 min par exercice' },
      { href: '/reflexes', nom: 'Test de réflexes', court: 'Réflexes', texte: 'Clique dès que l\'écran change : temps de réaction moyen sur 5 essais.', duree: '1 min' },
      { href: '/sensibilite', nom: 'Convertisseur de sensibilité', court: 'Sensibilité', texte: 'La même visée d\'un jeu à l\'autre, avec le cm/360 et l\'eDPI.', duree: '30 s' },
      { href: '/reticule', nom: 'Éditeur de réticule', court: 'Réticule', texte: 'Crée ton réticule Valorant, vois-le sur différents fonds et copie le code dans le jeu.', duree: '2 min' },
    ],
  },
  {
    id: 'progression',
    nom: 'Progression',
    outils: [
      { href: '/defi', nom: 'Défi du jour', court: 'Défi du jour', texte: 'Un exercice imposé chaque jour, avec les mêmes cibles pour tous les joueurs.', duree: '1 min' },
      { href: '/routine', nom: 'Routine d\'entraînement', court: 'Routine', texte: 'Un programme de 15 minutes par jour et le suivi de ta progression.', duree: '15 min' },
      { href: '/badges', nom: 'Badges et niveau', court: 'Badges et niveau', texte: 'Tes objectifs débloqués, ta progression et ton niveau, sans compte.', duree: 'Consultation' },
    ],
  },
  {
    id: 'apprendre',
    nom: 'Apprendre',
    outils: [
      { href: '/pros', nom: 'Réglages des pros', court: 'Réglages des pros', texte: 'Sensibilité, DPI et souris de joueurs professionnels, comparables avec les tiens.', duree: 'Consultation' },
      { href: '/guides', nom: 'Guides', court: 'Guides', texte: 'Les meilleurs réglages graphiques jeu par jeu, Windows et pilotes, expliqués simplement.', duree: 'Lecture' },
    ],
  },
];
