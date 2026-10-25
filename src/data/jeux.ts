/**
 * Valeurs de « yaw » : rotation en degrés par unité de mouvement souris
 * à une sensibilité de 1 dans le menu du jeu.
 * Sources : valeurs communautaires couramment utilisées par les convertisseurs
 * (vérifiées en octobre 2026). À revérifier après chaque mise à jour majeure d'un jeu.
 */
export interface Jeu {
  id: string;
  nom: string;
  yaw: number;
  /** Comment la sensibilité s'affiche dans le menu du jeu */
  format: string;
  /** Nombre de décimales à afficher */
  decimales: number;
  note?: string;
}

export const JEUX: Jeu[] = [
  { id: 'valorant', nom: 'Valorant', yaw: 0.07, format: 'Sensibilité', decimales: 3 },
  { id: 'fortnite', nom: 'Fortnite', yaw: 0.005555, format: 'Sensibilité X/Y en %', decimales: 1 },
  { id: 'apex', nom: 'Apex Legends', yaw: 0.022, format: 'Sensibilité souris', decimales: 2 },
  { id: 'cod', nom: 'Call of Duty (MW3, Warzone, BO6)', yaw: 0.0066, format: 'Sensibilité souris', decimales: 2 },
  {
    id: 'bf2042',
    nom: 'Battlefield 2042',
    yaw: 0.0066,
    format: 'Sensibilité soldat',
    decimales: 2,
    note: 'Valeur pour Battlefield 2042. Battlefield 6 pas encore vérifié.',
  },
  { id: 'cs2', nom: 'Counter-Strike 2', yaw: 0.022, format: 'Sensibilité', decimales: 3 },
  { id: 'ow2', nom: 'Overwatch 2', yaw: 0.0066, format: 'Sensibilité', decimales: 2 },
];

export const JEUX_COUVERTS = ['Valorant', 'Fortnite', 'Apex Legends', 'Call of Duty', 'Battlefield'];
