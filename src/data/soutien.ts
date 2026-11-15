/**
 * Bouton « Soutenir Fragx » (dons via Ko-fi).
 *
 * Pour l'afficher sur le site : passer ACTIF à true.
 * À faire seulement quand la page de dons est prête ET que les mentions légales ont été vérifiées
 * pour un site qui reçoit des dons (décision des responsables du site, pas de Claude).
 *
 * Simple lien : pas de widget Ko-fi (il chargerait un script et des cookies tiers sur Fragx,
 * ce qui imposerait un bandeau de consentement).
 */
export const SOUTIEN = {
  ACTIF: false,
  url: 'https://ko-fi.com/edprime',
  plateforme: 'Ko-fi',
};

/** Le bouton n'apparaît que si ACTIF vaut true et qu'une adresse https est renseignée. */
export const soutienVisible = SOUTIEN.ACTIF && /^https:\/\//.test(SOUTIEN.url);
