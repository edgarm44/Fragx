/**
 * Préfixe un chemin interne avec la base du site.
 * Sur GitHub Pages, le site vit sous /Fragx/ : un lien "/setup" doit devenir "/Fragx/setup".
 * Si le site passe un jour sur un domaine à lui, il suffit de retirer `base` dans astro.config.mjs.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function lien(chemin: string): string {
  if (!chemin.startsWith('/')) return chemin;
  return chemin === '/' ? `${BASE}/` : `${BASE}${chemin}`;
}

/** Retire la base d'un chemin (pour savoir quelle page est active). */
export function sansBase(chemin: string): string {
  return BASE && chemin.startsWith(BASE) ? chemin.slice(BASE.length) || '/' : chemin;
}
