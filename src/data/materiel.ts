/**
 * Sélections de matériel. Rien d'inventé : chaque produit cite au moins une source de test,
 * et une caractéristique absente des sources est laissée de côté.
 *
 * Liens : `lien` reste vide tant qu'aucun programme d'affiliation n'est actif.
 * Un lien avec `affilie: true` fait échouer la construction du site tant que MONETISE vaut false
 * (src/data/editeur.ts) : les mentions légales doivent être mises à jour d'abord.
 */
export type Gamme = 'budget' | 'milieu' | 'haut';

export const GAMMES: Record<Gamme, string> = {
  budget: 'Petit budget',
  milieu: 'Bon rapport qualité-prix',
  haut: 'Haut de gamme',
};

export interface Source { nom: string; url: string; date: string }

export interface Produit {
  nom: string;
  gamme: Gamme;
  pourQui: string;
  caracteristiques: string[];
  pointsForts: string[];
  aSavoir?: string[];
  sources: Source[];
  lien?: { url: string; affilie: boolean; boutique: string };
}

export interface Critere { titre: string; texte: string }

export interface CategorieMateriel {
  id: 'souris' | 'ecran' | 'clavier';
  nom: string;
  titre: string;
  description: string;
  intro: string;
  criteres: Critere[];
  produits: Produit[];
  outil: { href: string; nom: string; texte: string };
  miseAJour: string;
}

const S = {
  rtingsSouris: { nom: 'RTINGS', url: 'https://www.rtings.com/mouse/reviews/best/by-usage/gaming', date: 'novembre 2026' },
  rtingsSourisBudget: { nom: 'RTINGS', url: 'https://www.rtings.com/mouse/reviews/best/budget-cheap-gaming', date: 'octobre 2026' },
  psSuperstrike: { nom: 'prosettings.net', url: 'https://prosettings.net/reviews/logitech-g-pro-x2-superstrike/', date: 'février 2026' },
  psViper: { nom: 'prosettings.net', url: 'https://prosettings.net/reviews/razer-viper-v4-pro/', date: '2026' },
  psDeathAdder: { nom: 'prosettings.net', url: 'https://prosettings.net/reviews/razer-deathadder-v4-pro/', date: 'octobre 2025' },
  pcgEcrans: { nom: 'PC Gamer', url: 'https://www.pcgamer.com/best-gaming-monitor/', date: 'octobre 2026' },
  tomsEcrans: { nom: "Tom's Hardware", url: 'https://www.tomshardware.com/reviews/best-gaming-monitors,4533.html', date: 'octobre 2026' },
  rtingsEcransBudget: { nom: 'RTINGS', url: 'https://www.rtings.com/monitor/reviews/best/budget-gaming', date: 'octobre 2026' },
  pcgClaviers: { nom: 'PC Gamer', url: 'https://www.pcgamer.com/best-gaming-keyboard/', date: 'août 2026' },
} satisfies Record<string, Source>;

export const MATERIEL: CategorieMateriel[] = [
  {
    id: 'souris',
    nom: 'Souris',
    titre: 'Meilleures souris pour les jeux de tir',
    description: 'Quelle souris gaming choisir pour Valorant, CS2, Apex ou Fortnite : les critères qui comptent vraiment et une sélection par budget, avec sources.',
    intro: 'Pour viser, la forme et le poids comptent plus que les chiffres du capteur : tous les capteurs récents sont précis. Choisis d\'abord une souris adaptée à ta main.',
    criteres: [
      { titre: 'La forme avant tout', texte: 'Une souris symétrique convient à la plupart des prises (paume, griffe, bout des doigts). Une souris ergonomique, bombée vers la droite, est plus confortable en prise paume pour les droitiers.' },
      { titre: 'Le poids', texte: 'Entre 50 et 70\u00a0g, la souris se lance et s\'arrête facilement : c\'est la norme chez les joueurs de FPS. Plus lourde, elle reste jouable mais fatigue plus vite.' },
      { titre: 'Le taux d\'interrogation', texte: '1000\u00a0Hz suffit largement. 4000 ou 8000\u00a0Hz apportent un gain très faible et chargent davantage le processeur : commence à 1000\u00a0Hz.' },
      { titre: 'Sans fil ou filaire', texte: 'Les souris sans fil de jeu récentes ne sont pas plus lentes qu\'une souris filaire. Le sans-fil évite simplement le câble qui accroche.' },
    ],
    produits: [
      {
        nom: 'Logitech G305 Lightspeed', gamme: 'budget',
        pourQui: 'Une première souris sans fil fiable, si ton budget est serré.',
        caracteristiques: ['Sans fil (récepteur USB)', 'Une pile AA', 'Forme symétrique'],
        pointsForts: ['Meilleure souris gaming petit budget selon RTINGS', 'Forme qui convient à la plupart des tailles de main'],
        aSavoir: ['Plus lourde que les modèles récents, à cause de la pile'],
        sources: [S.rtingsSourisBudget],
      },
      {
        nom: 'Razer DeathAdder V4 Pro', gamme: 'haut',
        pourQui: 'Les droitiers qui tiennent la souris à pleine paume.',
        caracteristiques: ['Ergonomique (droitiers)', '56\u00a0g', 'Capteur Focus Pro 45K', 'Jusqu\'à 8000\u00a0Hz', 'Sans fil'],
        pointsForts: ['Excellentes performances en jeu', 'Très bonne finition et grande autonomie'],
        aSavoir: ['Très chère', 'Clics bruyants'],
        sources: [S.psDeathAdder],
      },
      {
        nom: 'Razer Viper V4 Pro', gamme: 'haut',
        pourQui: 'Les joueurs compétitifs en prise griffe ou bout des doigts.',
        caracteristiques: ['Symétrique', '49\u00a0g', 'Capteur Focus Pro 50K', 'Jusqu\'à 8000\u00a0Hz', 'Sans fil'],
        pointsForts: ['Très légère', 'Excellentes performances'],
        aSavoir: ['Clics assez bruyants'],
        sources: [S.psViper],
      },
      {
        nom: 'Logitech G Pro X2 Superstrike', gamme: 'haut',
        pourQui: 'Ceux qui veulent le clic le plus réactif du moment et peuvent y mettre le prix.',
        caracteristiques: ['Symétrique', 'Environ 61\u00a0g', 'Capteur HERO 2', 'Jusqu\'à 8000\u00a0Hz', 'Sans fil'],
        pointsForts: ['Meilleure souris gaming selon RTINGS (novembre 2026)', 'Clic à déclenchement réglable, avec retour haptique'],
        aSavoir: ['Très chère'],
        sources: [S.rtingsSouris, S.psSuperstrike],
      },
    ],
    outil: { href: '/souris-ecran', nom: 'Test de souris', texte: 'Avant de changer de souris, teste la tienne : clics par seconde, double-clic parasite et taux d\'interrogation réel.' },
    miseAJour: '2026-11-14',
  },
  {
    id: 'ecran',
    nom: 'Écran',
    titre: 'Meilleurs écrans gaming pour les jeux de tir',
    description: 'Quel écran gaming choisir pour les FPS : fréquence, définition, type de dalle (IPS, VA, TN, OLED) et une sélection par budget, avec sources.',
    intro: 'Pour un jeu de tir, la fréquence de l\'écran compte plus que tout le reste : passer de 60\u00a0Hz à 144\u00a0Hz ou plus est l\'amélioration la plus visible d\'un setup.',
    criteres: [
      { titre: 'La fréquence', texte: '144\u00a0Hz est le minimum conseillé pour un FPS. 240\u00a0Hz et plus profitent surtout aux joueurs compétitifs, à condition que ta carte graphique produise autant d\'images par seconde.' },
      { titre: 'La définition', texte: '1080p sur 24\u00a0pouces reste la référence en compétition et demande peu à la carte graphique. 1440p sur 27\u00a0pouces donne une image plus fine, pour une carte de milieu de gamme ou mieux.' },
      { titre: 'La dalle', texte: 'IPS : bonnes couleurs et bonne réactivité. VA : fort contraste, parfois des traînées dans les zones sombres. TN : très rapide mais couleurs fades. OLED : la plus réactive avec un contraste parfait, mais plus chère et sensible au marquage.' },
      { titre: 'Le branchement', texte: 'Branche l\'écran sur la carte graphique, en DisplayPort ou en HDMI récent, sinon la haute fréquence peut ne pas être disponible.' },
    ],
    produits: [
      {
        nom: 'AOC Gaming C27G4ZXE', gamme: 'budget',
        pourQui: 'Passer à la haute fréquence pour pas cher.',
        caracteristiques: ['27\u00a0pouces, incurvé', '1920 × 1080', '280\u00a0Hz', 'Dalle VA'],
        pointsForts: ['Meilleur écran 1080p selon PC Gamer', 'Très rapide pour son prix'],
        aSavoir: ['Du 1080p sur 27\u00a0pouces est moins net que sur 24\u00a0pouces'],
        sources: [S.pcgEcrans],
      },
      {
        nom: 'KTC 25M1', gamme: 'budget',
        pourQui: 'Les joueurs compétitifs qui veulent une fréquence très haute à prix raisonnable.',
        caracteristiques: ['24\u00a0pouces', '1920 × 1080', '400\u00a0Hz', 'Dalle TN'],
        pointsForts: ['Meilleur écran pour la compétition selon PC Gamer'],
        aSavoir: ['Couleurs et angles de vision limités, comme toutes les dalles TN'],
        sources: [S.pcgEcrans],
      },
      {
        nom: 'AOC Q27G3XMN', gamme: 'milieu',
        pourQui: 'Une belle image en 1440p, pour jouer aussi à des jeux solo.',
        caracteristiques: ['27\u00a0pouces', '2560 × 1440', '180\u00a0Hz', 'Dalle VA, rétroéclairage mini-LED'],
        pointsForts: ['Meilleur écran gaming petit budget selon RTINGS', 'Qualité d\'image au-dessus de sa catégorie de prix'],
        aSavoir: ['180\u00a0Hz : moins rapide que les modèles compétitifs'],
        sources: [S.rtingsEcransBudget],
      },
      {
        nom: 'KTC H27T22C-3', gamme: 'milieu',
        pourQui: 'Du 1440p rapide avec une dalle IPS, sans exploser le budget.',
        caracteristiques: ['27\u00a0pouces', '2560 × 1440', '210\u00a0Hz', 'Dalle IPS'],
        pointsForts: ['Meilleur écran 1440p petit budget selon PC Gamer'],
        sources: [S.pcgEcrans],
      },
      {
        nom: 'Alienware AW2726DM', gamme: 'haut',
        pourQui: 'Passer à l\'OLED au prix le plus raisonnable.',
        caracteristiques: ['27\u00a0pouces', '2560 × 1440', '240\u00a0Hz', 'Dalle QD-OLED'],
        pointsForts: ['OLED au meilleur rapport qualité-prix selon PC Gamer et Tom\'s Hardware', 'Garantie de 3\u00a0ans qui couvre le marquage'],
        sources: [S.pcgEcrans, S.tomsEcrans],
      },
      {
        nom: 'Asus ROG Swift PG27AQDP', gamme: 'haut',
        pourQui: 'Les joueurs exigeants qui veulent à la fois la vitesse et la qualité d\'image.',
        caracteristiques: ['27\u00a0pouces', '2560 × 1440', '480\u00a0Hz', 'Dalle OLED'],
        pointsForts: ['Meilleur écran gaming selon Tom\'s Hardware'],
        aSavoir: ['Il faut une carte graphique puissante pour profiter des 480\u00a0Hz'],
        sources: [S.tomsEcrans],
      },
    ],
    outil: { href: '/ecran', nom: 'Test d\'écran', texte: 'Vérifie d\'abord que ton écran actuel tourne bien à sa fréquence maximale : c\'est souvent un simple réglage de Windows.' },
    miseAJour: '2026-11-14',
  },
  {
    id: 'clavier',
    nom: 'Clavier',
    titre: 'Meilleurs claviers gaming pour les jeux de tir',
    description: 'Quel clavier gaming choisir pour les FPS : touches magnétiques, rapid trigger, format compact, disposition AZERTY, et une sélection par budget.',
    intro: 'Pour un jeu de tir, les claviers à touches magnétiques (Hall effect) ont pris l\'avantage : leur point de déclenchement réglable permet des arrêts et des changements de direction plus rapides.',
    criteres: [
      { titre: 'Touches magnétiques et rapid trigger', texte: 'Le « rapid trigger » relâche la touche dès que tu remontes le doigt, sans attendre un point fixe. Dans Valorant ou CS2, tu t\'arrêtes plus vite pour tirer précisément.' },
      { titre: 'Le format', texte: 'Un clavier compact (60\u00a0%, 65\u00a0%, 75\u00a0% ou sans pavé numérique) laisse plus de place à la souris, ce qui compte avec une sensibilité basse.' },
      { titre: 'La disposition', texte: 'Beaucoup de claviers gaming sont vendus en QWERTY. Vérifie qu\'une version AZERTY existe, ou que tu es à l\'aise en QWERTY, avant d\'acheter.' },
      { titre: 'Filaire ou sans fil', texte: 'Pour jouer, le filaire reste le plus simple. Le sans-fil est pratique pour un bureau polyvalent, avec une batterie à surveiller.' },
    ],
    produits: [
      {
        nom: 'Gamakay x NaughShark NS68', gamme: 'budget',
        pourQui: 'Découvrir les touches magnétiques et le rapid trigger pour un petit prix.',
        caracteristiques: ['Format 68\u00a0%', 'Touches magnétiques', 'Filaire'],
        pointsForts: ['Meilleur clavier petit budget selon PC Gamer', 'Rapid trigger à très bas prix'],
        aSavoir: ['Disposition AZERTY à vérifier'],
        sources: [S.pcgClaviers],
      },
      {
        nom: 'Keychron K2 HE', gamme: 'milieu',
        pourQui: 'Un clavier polyvalent et sans fil, avec rapid trigger.',
        caracteristiques: ['Format 75\u00a0%', 'Touches magnétiques', 'Sans fil'],
        pointsForts: ['Rapid trigger dans un clavier sans fil abordable'],
        aSavoir: ['Disposition AZERTY à vérifier'],
        sources: [S.pcgClaviers],
      },
      {
        nom: 'Wooting 60HE v2', gamme: 'haut',
        pourQui: 'Les joueurs compétitifs qui veulent le maximum de place pour la souris.',
        caracteristiques: ['Format 60\u00a0%', 'Touches magnétiques'],
        pointsForts: ['Meilleur clavier 60\u00a0% selon PC Gamer', 'Réglages très poussés'],
        aSavoir: ['Pas de flèches ni de touches de fonction dédiées', 'Disposition et disponibilité en France à vérifier'],
        sources: [S.pcgClaviers],
      },
      {
        nom: 'Wooting 80HE', gamme: 'haut',
        pourQui: 'Le meilleur clavier magnétique du moment, avec les touches de fonction.',
        caracteristiques: ['Format sans pavé numérique (80\u00a0%)', 'Touches magnétiques'],
        pointsForts: ['Meilleur clavier gaming selon PC Gamer', 'Logiciel de réglage réputé'],
        aSavoir: ['Souvent en rupture de stock', 'Disposition et disponibilité en France à vérifier'],
        sources: [S.pcgClaviers],
      },
    ],
    outil: { href: '/guides/windows-et-pilotes', nom: 'Guide Windows et pilotes', texte: 'Le clavier ne fait pas tout : vérifie aussi que Windows et tes pilotes sont bien réglés.' },
    miseAJour: '2026-11-14',
  },
];

export const categorieMateriel = (id: string) => MATERIEL.find((c) => c.id === id);
