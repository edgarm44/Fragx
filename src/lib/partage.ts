/**
 * Partage d'un résultat : génère une image 1200 × 630 (format des aperçus Discord et réseaux)
 * puis propose de la copier, de la télécharger ou de la partager.
 */
export interface Resultat {
  /** Nom de l'outil, par exemple « Test de réflexes » */
  titre: string;
  /** Valeur principale, par exemple « 212 ms » */
  valeur: string;
  /** Ligne de détail, par exemple « Très bon, meilleur essai 198 ms » */
  detail?: string;
  /** Nom du fichier téléchargé, sans extension */
  fichier: string;
}

const L = 1200, H = 630;

async function polices(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load('italic 700 120px "Chakra Petch"'),
      document.fonts.load('700 60px "Chakra Petch"'),
      document.fonts.load('500 36px "Barlow"'),
    ]);
  } catch { /* les polices de secours feront l'affaire */ }
}

function adresseSite(): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${location.host}${base}`;
}

/** Réduit la taille de police jusqu'à ce que le texte tienne dans la largeur donnée. */
function ajuster(ctx: CanvasRenderingContext2D, texte: string, police: (t: number) => string, taille: number, largeur: number): number {
  let t = taille;
  ctx.font = police(t);
  while (t > 20 && ctx.measureText(texte).width > largeur) { t -= 4; ctx.font = police(t); }
  return t;
}

export async function dessinerCarte(r: Resultat): Promise<HTMLCanvasElement> {
  await polices();
  const c = document.createElement('canvas');
  c.width = L; c.height = H;
  const ctx = c.getContext('2d')!;

  // Fond : violet profond, projecteurs magenta et cyan
  const fond = ctx.createLinearGradient(0, 0, 0, H);
  fond.addColorStop(0, '#160b3c'); fond.addColorStop(0.6, '#0b0620'); fond.addColorStop(1, '#08041a');
  ctx.fillStyle = fond; ctx.fillRect(0, 0, L, H);
  for (const [x, couleur] of [[120, 'rgba(255,46,151,0.30)'], [1080, 'rgba(25,227,255,0.24)']] as const) {
    const g = ctx.createRadialGradient(x, -60, 0, x, -60, 560);
    g.addColorStop(0, couleur); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, L, H);
  }

  // Sol quadrillé en perspective
  const horizon = 470;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, horizon, L, H - horizon); ctx.clip();
  ctx.lineWidth = 1.5;
  for (let i = -24; i <= 24; i++) {
    ctx.strokeStyle = 'rgba(255,46,151,0.35)';
    ctx.beginPath(); ctx.moveTo(L / 2 + i * 14, horizon); ctx.lineTo(L / 2 + i * 120, H); ctx.stroke();
  }
  for (let k = 1; k < 9; k++) {
    const y = horizon + (H - horizon) * Math.pow(k / 8, 1.8);
    ctx.strokeStyle = 'rgba(25,227,255,0.32)';
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(L, y); ctx.stroke();
  }
  ctx.restore();
  const ligne = ctx.createLinearGradient(0, 0, L, 0);
  ligne.addColorStop(0, '#ff2e97'); ligne.addColorStop(0.5, '#8b5cff'); ligne.addColorStop(1, '#19e3ff');
  ctx.fillStyle = ligne; ctx.fillRect(0, horizon - 1, L, 2);

  // Logo
  ctx.save();
  ctx.translate(90, 92);
  ctx.strokeStyle = ligne; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -30); ctx.lineTo(0, -10); ctx.moveTo(0, 10); ctx.lineTo(0, 30);
  ctx.moveTo(-30, 0); ctx.lineTo(-10, 0); ctx.moveTo(10, 0); ctx.lineTo(30, 0);
  ctx.stroke();
  ctx.fillStyle = '#19e3ff'; ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#f2effd';
  ctx.font = 'italic 700 52px "Chakra Petch", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('Fragx', 140, 94);

  // Titre de l'outil
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ff6fb8';
  ctx.font = '700 40px "Chakra Petch", sans-serif';
  ctx.fillText(r.titre, 90, 222);

  // Valeur principale, avec lueur cyan
  const taille = ajuster(ctx, r.valeur, (t) => `italic 700 ${t}px "Chakra Petch", sans-serif`, 168, L - 180);
  ctx.save();
  ctx.font = `italic 700 ${taille}px "Chakra Petch", sans-serif`;
  ctx.shadowColor = 'rgba(25,227,255,0.85)'; ctx.shadowBlur = 36;
  ctx.fillStyle = '#19e3ff';
  ctx.fillText(r.valeur, 86, 222 + taille * 0.98);
  ctx.restore();

  // Détail
  if (r.detail) {
    ajuster(ctx, r.detail, (t) => `500 ${t}px "Barlow", sans-serif`, 36, L - 180);
    ctx.fillStyle = '#d9d4f3';
    ctx.fillText(r.detail, 90, 222 + taille * 0.98 + 58);
  }

  // Pied : date et adresse du site
  ctx.font = '500 26px "Barlow", sans-serif';
  ctx.fillStyle = 'rgba(242,239,253,0.85)';
  ctx.fillText(new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), 90, H - 44);
  ctx.textAlign = 'right';
  ctx.fillText(adresseSite(), L - 90, H - 44);
  ctx.textAlign = 'left';
  return c;
}

const versBlob = (c: HTMLCanvasElement) => new Promise<Blob>((ok, ko) => c.toBlob((b) => (b ? ok(b) : ko(new Error('image'))), 'image/png'));

let dialogue: HTMLDialogElement | null = null;

function construireDialogue(): HTMLDialogElement {
  const d = document.createElement('dialog');
  d.className = 'partage';
  d.setAttribute('aria-labelledby', 'partage-titre');
  d.innerHTML = `
    <h2 id="partage-titre">Partager ton résultat</h2>
    <img class="partage-apercu" alt="" width="1200" height="630" />
    <div class="partage-actions">
      <button type="button" class="bouton bouton-principal" data-action="copier">Copier l'image</button>
      <button type="button" class="bouton bouton-secondaire" data-action="telecharger">Télécharger</button>
      <button type="button" class="bouton bouton-secondaire" data-action="partager" hidden>Partager…</button>
    </div>
    <p class="partage-statut" aria-live="polite"></p>
    <button type="button" class="partage-fermer" data-action="fermer" aria-label="Fermer">×</button>`;
  document.body.append(d);
  d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  return d;
}

/** Ouvre la fenêtre de partage pour un résultat. */
export async function ouvrirPartage(r: Resultat): Promise<void> {
  dialogue ??= construireDialogue();
  const d = dialogue;
  const statut = d.querySelector<HTMLElement>('.partage-statut')!;
  const img = d.querySelector<HTMLImageElement>('.partage-apercu')!;
  statut.textContent = 'Création de l\'image…';
  delete statut.dataset.erreur;
  if (!d.open) d.showModal();

  const canvas = await dessinerCarte(r);
  const blob = await versBlob(canvas);
  const url = URL.createObjectURL(blob);
  if (img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
  img.src = url;
  img.alt = `${r.titre} : ${r.valeur}${r.detail ? `, ${r.detail}` : ''}`;
  statut.textContent = '';
  const fichier = new File([blob], `${r.fichier}.png`, { type: 'image/png' });

  const btnPartager = d.querySelector<HTMLButtonElement>('[data-action="partager"]')!;
  btnPartager.hidden = !(navigator.canShare?.({ files: [fichier] }));

  const message = (texte: string, erreur = false) => {
    statut.textContent = texte;
    if (erreur) statut.dataset.erreur = ''; else delete statut.dataset.erreur;
  };

  d.onclick = async (e) => {
    const action = (e.target as HTMLElement).closest<HTMLElement>('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'fermer') { d.close(); return; }
    if (action === 'telecharger') {
      const a = document.createElement('a');
      a.href = url; a.download = fichier.name;
      document.body.append(a); a.click(); a.remove();
      message('Image téléchargée.');
    } else if (action === 'copier') {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        message('Image copiée : colle-la dans Discord avec Ctrl+V.');
      } catch {
        message('Ce navigateur ne permet pas de copier une image : utilise « Télécharger ».', true);
      }
    } else if (action === 'partager') {
      try {
        await navigator.share({ files: [fichier], title: 'Fragx', text: `${r.titre} : ${r.valeur} sur Fragx` });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') message('Le partage a échoué : utilise « Télécharger ».', true);
      }
    }
  };
}
