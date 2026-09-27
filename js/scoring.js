// Pixel-diff scoring: renders the player's shapes/strokes and the reference
// flag to same-size offscreen canvases, then compares every pixel.
import { drawShape } from './shapes.js';

const MAX_DIST = Math.sqrt(3 * 255 * 255);

export function renderReference(flag, W, H) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = flag.bg;
  ctx.fillRect(0, 0, W, H);
  for (const s of flag.shapes) drawShape(ctx, s, W, H);
  return c;
}

export function renderEditorClean(editor, W, H) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  editor.renderClean(ctx, W, H);
  return c;
}

export function scoreDrawing(editor, flag) {
  const W = editor.W, H = editor.H;
  const userCanvas = renderEditorClean(editor, W, H);
  const userData = userCanvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, W, H).data;
  const refData = renderReference(flag, W, H).getContext('2d', { willReadFrequently: true }).getImageData(0, 0, W, H).data;

  let total = 0;
  let simSum = 0;
  for (let i = 0; i < userData.length; i += 4) {
    const dr = userData[i] - refData[i];
    const dg = userData[i + 1] - refData[i + 1];
    const db = userData[i + 2] - refData[i + 2];
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    const sim = Math.max(0, 1 - dist / MAX_DIST);
    simSum += sim;
    total++;
  }
  return Math.round((simSum / total) * 100);
}

export function tierFor(score) {
  if (score >= 90) return { label: 'Flag Master!', cls: 'tier-great' };
  if (score >= 75) return { label: 'Great job!', cls: 'tier-good' };
  if (score >= 55) return { label: 'Not bad!', cls: 'tier-ok' };
  if (score >= 35) return { label: 'Keep practicing', cls: 'tier-meh' };
  return { label: 'Try again!', cls: 'tier-bad' };
}
