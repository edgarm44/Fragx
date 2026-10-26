/**
 * Codes de réticule Valorant : lecture et écriture.
 * Format : « 0;P;c;5;h;0;0l;4;... ». Les sections P (principal), A (visée) et S (sniper)
 * contiennent des paires clé;valeur ; les valeurs par défaut sont omises.
 * Seul le réticule principal est modifié ici, le reste du code est conservé tel quel.
 */
export interface Lignes {
  afficher: boolean;
  opacite: number;
  longueur: number;
  separer: boolean;
  longueurV: number;
  epaisseur: number;
  ecart: number;
  mouvement: boolean;
  tir: boolean;
}
export interface Reticule {
  couleur: number;
  perso: string;
  contour: boolean;
  contourEpaisseur: number;
  contourOpacite: number;
  point: boolean;
  pointEpaisseur: number;
  pointOpacite: number;
  fondu: boolean;
  interne: Lignes;
  externe: Lignes;
}

export const COULEURS = [
  { nom: 'Blanc', hex: '#ffffff' },
  { nom: 'Vert', hex: '#00ff00' },
  { nom: 'Vert-jaune', hex: '#7fff00' },
  { nom: 'Jaune-vert', hex: '#dfff00' },
  { nom: 'Jaune', hex: '#ffff00' },
  { nom: 'Cyan', hex: '#00ffff' },
  { nom: 'Rose', hex: '#ff00ff' },
  { nom: 'Rouge', hex: '#ff0000' },
];

export const DEFAUT: Reticule = {
  couleur: 0, perso: 'FFFFFF',
  contour: true, contourEpaisseur: 1, contourOpacite: 0.5,
  point: false, pointEpaisseur: 2, pointOpacite: 1,
  fondu: true,
  interne: { afficher: true, opacite: 0.8, longueur: 6, separer: false, longueurV: 6, epaisseur: 2, ecart: 3, mouvement: false, tir: true },
  externe: { afficher: true, opacite: 0.35, longueur: 2, separer: false, longueurV: 2, epaisseur: 2, ecart: 10, mouvement: true, tir: true },
};

export const copier = (r: Reticule): Reticule => JSON.parse(JSON.stringify(r));

export interface Code { general: string[]; principal: Reticule; reste: string[]; }

const bool = (v: string) => v === '1';
const nb = (v: string, d: number) => { const n = parseFloat(v); return Number.isFinite(n) ? n : d; };

export function lire(code: string): Code {
  const t = code.trim().split(';').filter((x) => x !== '');
  const r = copier(DEFAUT);
  const general: string[] = [];
  const reste: string[] = [];
  let section = '';
  let i = 0;
  if (t[0] === '0' || t[0] === '1') i = 1;
  while (i < t.length) {
    const k = t[i];
    if (/^[A-Z]$/.test(k)) {
      section = k;
      if (k !== 'P') reste.push(k);
      i++;
      continue;
    }
    const v = t[i + 1] ?? '';
    i += 2;
    if (section === '') { general.push(k, v); continue; }
    if (section !== 'P') { reste.push(k, v); continue; }
    const l = k[0] === '0' ? r.interne : k[0] === '1' ? r.externe : null;
    const cle = l ? k.slice(1) : k;
    if (l) {
      switch (cle) {
        case 'b': l.afficher = bool(v); break;
        case 't': l.epaisseur = nb(v, l.epaisseur); break;
        case 'l': l.longueur = nb(v, l.longueur); if (!l.separer) l.longueurV = l.longueur; break;
        case 'v': l.longueurV = nb(v, l.longueurV); break;
        case 'g': l.separer = bool(v); break;
        case 'o': l.ecart = nb(v, l.ecart); break;
        case 'a': l.opacite = nb(v, l.opacite); break;
        case 'm': l.mouvement = bool(v); break;
        case 'f': l.tir = bool(v); break;
      }
      continue;
    }
    switch (cle) {
      case 'c': r.couleur = Math.round(nb(v, 0)); break;
      case 'u': r.perso = v.slice(0, 6).toUpperCase(); break;
      case 'h': r.contour = bool(v); break;
      case 't': r.contourEpaisseur = nb(v, r.contourEpaisseur); break;
      case 'o': r.contourOpacite = nb(v, r.contourOpacite); break;
      case 'd': r.point = bool(v); break;
      case 'z': r.pointEpaisseur = nb(v, r.pointEpaisseur); break;
      case 'a': r.pointOpacite = nb(v, r.pointOpacite); break;
      case 'f': r.fondu = bool(v); break;
    }
  }
  // longueur verticale identique si non séparée
  for (const l of [r.interne, r.externe]) if (!l.separer) l.longueurV = l.longueur;
  return { general, principal: r, reste };
}

const fmt = (n: number) => String(Math.round(n * 1000) / 1000);

export function ecrire(r: Reticule, general: string[] = [], reste: string[] = []): string {
  const d = DEFAUT;
  const p: string[] = [];
  const ajout = (k: string, v: string | number | boolean, def: string | number | boolean) => {
    if (v !== def) p.push(k, typeof v === 'boolean' ? (v ? '1' : '0') : typeof v === 'number' ? fmt(v) : v);
  };
  ajout('c', r.couleur, d.couleur);
  if (r.couleur === 8) p.push('u', `${r.perso.toUpperCase()}FF`);
  ajout('h', r.contour, d.contour);
  ajout('t', r.contourEpaisseur, d.contourEpaisseur);
  ajout('o', r.contourOpacite, d.contourOpacite);
  ajout('d', r.point, d.point);
  ajout('z', r.pointEpaisseur, d.pointEpaisseur);
  ajout('a', r.pointOpacite, d.pointOpacite);
  ajout('f', r.fondu, d.fondu);
  for (const [pre, l, ld] of [['0', r.interne, d.interne], ['1', r.externe, d.externe]] as const) {
    ajout(`${pre}b`, l.afficher, ld.afficher);
    ajout(`${pre}t`, l.epaisseur, ld.epaisseur);
    ajout(`${pre}l`, l.longueur, ld.longueur);
    if (l.separer) { ajout(`${pre}v`, l.longueurV, ld.longueurV); p.push(`${pre}g`, '1'); }
    ajout(`${pre}o`, l.ecart, ld.ecart);
    ajout(`${pre}a`, l.opacite, ld.opacite);
    ajout(`${pre}m`, l.mouvement, ld.mouvement);
    ajout(`${pre}f`, l.tir, ld.tir);
  }
  return ['0', ...general, 'P', ...p, ...reste].join(';');
}

/** Couleur d'affichage du réticule (hexadécimal). */
export function couleurHex(r: Reticule): string {
  return r.couleur === 8 ? `#${r.perso.slice(0, 6)}` : (COULEURS[r.couleur]?.hex ?? '#ffffff');
}

/** Dessine le réticule centré en (cx, cy), à l'échelle k (1 = taille réelle en 1080p). */
export function dessiner(ctx: CanvasRenderingContext2D, r: Reticule, cx: number, cy: number, k: number): void {
  const couleur = couleurHex(r);
  const rects: { x: number; y: number; w: number; h: number; a: number }[] = [];
  if (r.point) {
    const s = r.pointEpaisseur;
    rects.push({ x: -s / 2, y: -s / 2, w: s, h: s, a: r.pointOpacite });
  }
  for (const l of [r.interne, r.externe]) {
    if (!l.afficher || l.epaisseur <= 0) continue;
    const e = l.epaisseur, o = l.ecart, lh = l.longueur, lv = l.separer ? l.longueurV : l.longueur;
    if (lh > 0) {
      rects.push({ x: o, y: -e / 2, w: lh, h: e, a: l.opacite });
      rects.push({ x: -o - lh, y: -e / 2, w: lh, h: e, a: l.opacite });
    }
    if (lv > 0) {
      rects.push({ x: -e / 2, y: o, w: e, h: lv, a: l.opacite });
      rects.push({ x: -e / 2, y: -o - lv, w: e, h: lv, a: l.opacite });
    }
  }
  ctx.save();
  ctx.translate(Math.round(cx), Math.round(cy));
  if (r.contour && r.contourOpacite > 0) {
    const c = r.contourEpaisseur;
    for (const q of rects) {
      ctx.globalAlpha = r.contourOpacite;
      ctx.fillStyle = '#000';
      ctx.fillRect(Math.round((q.x - c) * k), Math.round((q.y - c) * k), Math.round((q.w + 2 * c) * k), Math.round((q.h + 2 * c) * k));
    }
  }
  for (const q of rects) {
    ctx.globalAlpha = q.a;
    ctx.fillStyle = couleur;
    ctx.fillRect(Math.round(q.x * k), Math.round(q.y * k), Math.round(q.w * k), Math.round(q.h * k));
  }
  ctx.restore();
}
