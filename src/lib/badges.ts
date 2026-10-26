import { lireHistorique, drapeaux, type Exercice, type Historique } from './historique';
import { resultatsDefis } from './defi';
import { serieRoutine, seriesParJour, lireManuel } from './progression';

interface Contexte {
  h: Historique;
  total: number;
  meilleur: (ex: Exercice) => number | null;
  serie: number;
  defis: number;
  drapeaux: Record<string, number>;
}

export interface Badge {
  id: string;
  nom: string;
  description: string;
  /** Progression : [valeur actuelle, objectif]. Débloqué quand valeur >= objectif. */
  progres: (c: Contexte) => [number, number];
}

const BAS: Exercice[] = ['vitesse', 'flick', 'reflexes'];

/** Seuil « plus bas est mieux » converti en progression (0 tant qu'aucun score). */
const sous = (v: number | null, seuil: number): [number, number] => [v !== null && v <= seuil ? 1 : 0, 1];
const dessus = (v: number | null, seuil: number): [number, number] => [v ?? 0, seuil];

export const BADGES: Badge[] = [
  { id: 'premier', nom: 'Premier pas', description: 'Termine ton premier exercice.', progres: (c) => [c.total, 1] },
  { id: 'echauffe', nom: 'Échauffé', description: 'Termine 25 exercices.', progres: (c) => [c.total, 25] },
  { id: 'machine', nom: 'Machine', description: 'Termine 200 exercices.', progres: (c) => [c.total, 200] },
  { id: 'reflexe', nom: 'Réflexe de chat', description: 'Moyenne au test de réflexes sous 220 ms.', progres: (c) => sous(c.meilleur('reflexes'), 220) },
  { id: 'eclair', nom: 'Éclair', description: 'Moyenne au test de réflexes sous 180 ms.', progres: (c) => sous(c.meilleur('reflexes'), 180) },
  { id: 'rapide', nom: 'Main rapide', description: 'Exercice Vitesse en moins de 20 secondes.', progres: (c) => sous(c.meilleur('vitesse'), 20000) },
  { id: 'sniper', nom: 'Sniper', description: '200 points en Précision.', progres: (c) => dessus(c.meilleur('precision'), 200) },
  { id: 'colle', nom: 'Collé à la cible', description: '60 % en Suivi.', progres: (c) => dessus(c.meilleur('suivi'), 60) },
  { id: 'flick', nom: 'Flick propre', description: 'Moyenne en Flick sous 600 ms par cible.', progres: (c) => sous(c.meilleur('flick'), 600) },
  { id: 'chirurgien', nom: 'Chirurgien', description: '25 touches en Micro-ajustements.', progres: (c) => dessus(c.meilleur('micro'), 25) },
  { id: 'esquive', nom: 'Anti-esquive', description: '50 % en Strafe.', progres: (c) => dessus(c.meilleur('strafe'), 50) },
  { id: 'polyvalent', nom: 'Polyvalent', description: 'Essaie les six exercices de visée.', progres: (c) => [(['vitesse', 'precision', 'suivi', 'flick', 'micro', 'strafe'] as Exercice[]).filter((e) => c.h[e].length > 0).length, 6] },
  { id: 'regulier', nom: 'Régulier', description: 'Routine complète 3 jours d\'affilée.', progres: (c) => [c.serie, 3] },
  { id: 'assidu', nom: 'Assidu', description: 'Routine complète 7 jours d\'affilée.', progres: (c) => [c.serie, 7] },
  { id: 'inarretable', nom: 'Inarrêtable', description: 'Routine complète 30 jours d\'affilée.', progres: (c) => [c.serie, 30] },
  { id: 'defi', nom: 'Défi relevé', description: 'Termine un défi du jour.', progres: (c) => [c.defis, 1] },
  { id: 'defi7', nom: 'Habitué des défis', description: 'Termine 7 défis du jour.', progres: (c) => [c.defis, 7] },
  { id: 'technicien', nom: 'Technicien', description: 'Lance le diagnostic, le benchmark et le test de ping.', progres: (c) => [['setup', 'benchmark', 'ping'].filter((d) => c.drapeaux[d]).length, 3] },
];

export function contexte(): Contexte {
  const h = lireHistorique();
  const total = (Object.keys(h) as Exercice[]).reduce((n, k) => n + h[k].length, 0);
  return {
    h,
    total,
    meilleur: (ex) => {
      const v = h[ex].map((e) => e.score);
      if (!v.length) return null;
      return BAS.includes(ex) ? Math.min(...v) : Math.max(...v);
    },
    serie: serieRoutine(seriesParJour(h), lireManuel()),
    defis: Object.keys(resultatsDefis()).length,
    drapeaux: drapeaux(),
  };
}

export function debloques(c = contexte()): Set<string> {
  return new Set(BADGES.filter((b) => { const [v, o] = b.progres(c); return v >= o; }).map((b) => b.id));
}

/** Points d'expérience : 10 par exercice, 30 par défi, 100 par badge. */
export function experience(c = contexte()): number {
  return c.total * 10 + c.defis * 30 + debloques(c).size * 100;
}

/** Niveau n atteint à 100 × n × (n − 1) / 2 points : 0, 100, 300, 600, 1000… */
export function niveau(xp: number): { niveau: number; debut: number; suivant: number } {
  let n = 1;
  while (100 * (n + 1) * n / 2 <= xp) n++;
  return { niveau: n, debut: (100 * n * (n - 1)) / 2, suivant: (100 * (n + 1) * n) / 2 };
}

const CLE_VUS = 'fragx.badges.vus';

/** Affiche une notification pour chaque badge débloqué depuis la dernière vérification. */
export function verifierBadges(): void {
  let vus: string[] = [];
  try { vus = JSON.parse(localStorage.getItem(CLE_VUS) || '[]'); } catch { /* indisponible */ }
  const actuels = debloques();
  const nouveaux = BADGES.filter((b) => actuels.has(b.id) && !vus.includes(b.id));
  try { localStorage.setItem(CLE_VUS, JSON.stringify([...actuels])); } catch { /* indisponible */ }
  nouveaux.forEach((b, i) => setTimeout(() => notifier(b), i * 900));
  document.dispatchEvent(new CustomEvent('fragx:progression'));
}

function notifier(b: Badge): void {
  let zone = document.getElementById('toasts');
  if (!zone) {
    zone = document.createElement('div');
    zone.id = 'toasts';
    zone.setAttribute('aria-live', 'polite');
    document.body.append(zone);
  }
  const t = document.createElement('a');
  t.className = 'toast';
  t.href = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/badges`;
  const titre = document.createElement('strong');
  titre.textContent = `Badge débloqué : ${b.nom}`;
  const desc = document.createElement('span');
  desc.textContent = b.description;
  t.append(titre, desc);
  zone.append(t);
  setTimeout(() => { t.dataset.sortie = ''; setTimeout(() => t.remove(), 400); }, 5000);
}
