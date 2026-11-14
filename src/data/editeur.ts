/**
 * Réglages des mentions légales. C'est TOI qui choisis le statut : rien n'est décidé ici à ta place.
 *
 * statut 'non-professionnel' : site édité à titre personnel, sans revenus.
 *   La loi (LCEN, article 1-1 II) permet alors de ne pas publier son identité, à condition que
 *   l'hébergeur dispose de tes éléments d'identification. Seuls les nom et adresse de l'hébergeur
 *   sont affichés.
 *
 * statut 'professionnel' : dès qu'il y a des revenus (affiliation, publicité, dons réguliers…).
 *   Il faut alors afficher : nom et prénom, domicile (ou adresse de domiciliation, à vérifier),
 *   téléphone, e-mail, numéro d'immatriculation s'il y en a un, directeur de la publication,
 *   et le téléphone de l'hébergeur.
 *
 * Remplis les champs ci-dessous seulement quand tu as fait ton choix.
 */
export type Statut = 'non-professionnel' | 'professionnel';

export const EDITEUR: {
  statut: Statut;
  /** Adresse e-mail de contact (facultative en non-professionnel, obligatoire en professionnel) */
  contact?: string;
  /** Champs du statut professionnel */
  nom?: string;
  adresse?: string;
  telephone?: string;
  immatriculation?: string;
  directeurPublication?: string;
  /** Date de dernière mise à jour de la page, au format AAAA-MM-JJ */
  miseAJour: string;
} = {
  statut: 'non-professionnel',
  miseAJour: '2026-11-14',
};

export const HEBERGEUR = {
  nom: 'GitHub, Inc. (service GitHub Pages)',
  adresse: '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis',
  /** Obligatoire en statut professionnel : numéro à vérifier auprès de GitHub avant de le renseigner */
  telephone: undefined as string | undefined,
  site: 'https://github.com',
};

/** Le site contient-il des liens affiliés ou de la publicité ? Passe à true au premier lien affilié. */
export const MONETISE = false;
