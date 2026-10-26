/** Générateur pseudo-aléatoire reproductible (mulberry32) : même graine = mêmes cibles pour tout le monde. */
export function graine(texte: string): number {
  let h = 1779033703 ^ texte.length;
  for (let i = 0; i < texte.length; i++) {
    h = Math.imul(h ^ texte.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

export function generateur(g: number): () => number {
  let a = g >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
