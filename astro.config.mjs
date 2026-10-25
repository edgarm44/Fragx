// @ts-check
import { defineConfig } from 'astro/config';

// Hébergement : GitHub Pages (https://edgarm44.github.io/Fragx/)
// https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
  site: 'https://edgarm44.github.io',
  // Le site vit sous /Fragx/ : tous les liens internes passent par src/lib/lien.ts.
  // À retirer si le site passe sur un nom de domaine dédié.
  base: '/Fragx',
  trailingSlash: 'ignore',
});
