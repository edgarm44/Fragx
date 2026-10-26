/** Sons de tir et de touche synthétisés (aucun fichier à télécharger). */
let ctx: AudioContext | null = null;
const CLE = 'fragx.son';

export function sonActif(): boolean {
  try { return localStorage.getItem(CLE) !== '0'; } catch { return true; }
}
export function reglerSon(actif: boolean): void {
  try { localStorage.setItem(CLE, actif ? '1' : '0'); } catch { /* indisponible */ }
}

function contexte(): AudioContext | null {
  if (!sonActif()) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** À appeler lors d'un clic de l'utilisateur pour autoriser le son dans le navigateur. */
export function preparerSon(): void { contexte(); }

export function sonTir(): void {
  const c = contexte();
  if (!c) return;
  const duree = 0.05;
  const tampon = c.createBuffer(1, Math.floor(c.sampleRate * duree), c.sampleRate);
  const d = tampon.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
  const src = c.createBufferSource();
  src.buffer = tampon;
  const filtre = c.createBiquadFilter();
  filtre.type = 'lowpass';
  filtre.frequency.value = 2400;
  const g = c.createGain();
  g.gain.value = 0.22;
  src.connect(filtre).connect(g).connect(c.destination);
  src.start();
}

export function sonTouche(): void {
  const c = contexte();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  const t = c.currentTime;
  o.type = 'triangle';
  o.frequency.setValueAtTime(1046, t);
  o.frequency.exponentialRampToValueAtTime(1568, t + 0.06);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.18, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.13);
}
