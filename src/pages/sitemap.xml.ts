import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORIES } from '../data/navigation';
import { lien } from '../lib/lien';

/** Plan du site pour les moteurs de recherche. */
export const GET: APIRoute = async ({ site }) => {
  const guides = await getCollection('guides');
  const chemins = [
    '/',
    ...CATEGORIES.flatMap((c) => c.outils.map((o) => o.href)),
    ...guides.map((g) => `/guides/${g.id}`),
    '/mentions-legales',
  ];
  const urls = [...new Set(chemins)].map((c) => {
    const loc = new URL(lien(c).replace(/\/?$/, '/'), site).href;
    return `  <url><loc>${loc}</loc></url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
