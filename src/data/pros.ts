/**
 * Réglages publics de joueurs professionnels et créateurs.
 * Les pros changent souvent de réglages : chaque ligne indique sa source et la date du relevé.
 * Relevé effectué le 26 octobre 2026.
 */
export interface Pro {
  joueur: string;
  equipe?: string;
  dpi: number;
  /** Sensibilité en jeu (pour Fortnite : pourcentage X) */
  sens: number;
  /** Fortnite : sensibilité Y si différente */
  sensY?: number;
  /** Apex : multiplicateur de visée */
  ads?: number;
  souris?: string;
  source: { nom: string; url: string; date: string };
}

export interface JeuPros {
  id: 'valorant' | 'fortnite' | 'apex';
  nom: string;
  pros: Pro[];
}

const SENSLAB_VAL = 'https://senslab.pro/pro-settings/valorant';
const SETUP_VAL = 'https://www.setup.gg/news/valorant-crosshair-sensitivity-trends-2026-pro-examples/';
const SETUP_FN = 'https://www.setup.gg/game/fortnite/best-sensitivity/';
const SETUP_APEX = 'https://www.setup.gg/game/apex-legends/best-sensitivity/';

export const PROS: JeuPros[] = [
  {
    id: 'valorant',
    nom: 'Valorant',
    pros: [
      { joueur: 'aspas', dpi: 800, sens: 0.37, source: { nom: 'setup.gg', url: SETUP_VAL, date: 'juin 2026' } },
      { joueur: 'Chronicle', equipe: 'Team Vitality', dpi: 1600, sens: 0.175, source: { nom: 'senslab.pro', url: SENSLAB_VAL, date: 'mars 2026' } },
      { joueur: 'Boaster', equipe: 'Fnatic', dpi: 800, sens: 0.2, source: { nom: 'senslab.pro', url: SENSLAB_VAL, date: 'février 2026' } },
      { joueur: 'CHICHOO', dpi: 800, sens: 0.2, source: { nom: 'setup.gg', url: SETUP_VAL, date: 'juin 2026' } },
      { joueur: 'something', dpi: 800, sens: 0.66, source: { nom: 'setup.gg', url: SETUP_VAL, date: 'juin 2026' } },
    ],
  },
  {
    id: 'fortnite',
    nom: 'Fortnite',
    pros: [
      { joueur: 'Peterbot', dpi: 800, sens: 6.4, souris: 'Logitech G Pro X2 Superstrike', source: { nom: 'setup.gg', url: SETUP_FN, date: 'août 2026' } },
      { joueur: 'Malibuca', dpi: 1600, sens: 3.5, souris: 'Logitech G Pro X2 Superstrike', source: { nom: 'setup.gg', url: SETUP_FN, date: 'juillet 2026' } },
      { joueur: 'MrSavage', dpi: 800, sens: 9.1, souris: 'Logitech G Pro X Superlight 2', source: { nom: 'setup.gg', url: SETUP_FN, date: 'août 2026' } },
      { joueur: 'Clix', dpi: 800, sens: 8.7, sensY: 6.3, source: { nom: 'setup.gg', url: SETUP_FN, date: 'août 2026' } },
    ],
  },
  {
    id: 'apex',
    nom: 'Apex Legends',
    pros: [
      { joueur: 'ImperialHal', dpi: 800, sens: 1.1, ads: 1.0, souris: 'Finalmouse Starlight Pro', source: { nom: 'setup.gg', url: SETUP_APEX, date: 'septembre 2026' } },
      { joueur: 'Aceu', dpi: 1600, sens: 0.9, ads: 1.0, souris: 'Finalmouse Ultralight X Medium', source: { nom: 'setup.gg', url: SETUP_APEX, date: 'septembre 2026' } },
      { joueur: 'iiTzTimmy', dpi: 1800, sens: 0.9, ads: 1.05, souris: 'ASUS ROG Harpe Ace Extreme', source: { nom: 'setup.gg', url: SETUP_APEX, date: 'septembre 2026' } },
      { joueur: 'Faide', dpi: 1700, sens: 0.8, ads: 1.0, souris: 'Logitech G Pro X Superlight 2', source: { nom: 'setup.gg', url: SETUP_APEX, date: 'septembre 2026' } },
    ],
  },
];
