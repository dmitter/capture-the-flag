// Shared shape rendering + hit-testing used by both the flag editor (user drawing)
// and the reference renderer (actual flags), so scoring compares like-for-like pixels.
//
// A "shape" is a plain object: { type, x, y, w, h, color, dir?, points? }
// x/y/w/h are fractions of the flag canvas (0..1), independent of pixel resolution.

export function drawShape(ctx, s, W, H) {
  const x = s.x * W, y = s.y * H, w = s.w * W, h = s.h * H;
  ctx.save();
  ctx.fillStyle = s.color;

  switch (s.type) {
    case 'rect':
    case 'hstripe':
    case 'vstripe': {
      ctx.fillRect(x, y, w, h);
      break;
    }
    case 'circle': {
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'triangle': {
      ctx.beginPath();
      const dir = s.dir || 'right';
      if (dir === 'right') {
        ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h / 2);
      } else if (dir === 'left') {
        ctx.moveTo(x + w, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h / 2);
      } else if (dir === 'up') {
        ctx.moveTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w / 2, y);
      } else {
        ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w / 2, y + h);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'diamond': {
      const cx = x + w / 2, cy = y + h / 2;
      ctx.beginPath();
      ctx.moveTo(cx, y); ctx.lineTo(x + w, cy); ctx.lineTo(cx, y + h); ctx.lineTo(x, cy);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'star': {
      drawStar(ctx, x + w / 2, y + h / 2, w / 2, h / 2, s.points || 5);
      break;
    }
    case 'crescent': {
      drawCrescent(ctx, x, y, w, h, s.dir || 'right');
      break;
    }
  }
  ctx.restore();
}

function drawStar(ctx, cx, cy, rx, ry, points = 5, inner = 0.42) {
  const step = Math.PI / points;
  ctx.beginPath();
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? 1 : inner;
    const angle = -Math.PI / 2 + i * step;
    const px = cx + Math.cos(angle) * rx * r;
    const py = cy + Math.sin(angle) * ry * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawCrescent(ctx, x, y, w, h, dir) {
  const cx = x + w / 2, cy = y + h / 2, rx = w / 2, ry = h / 2;
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  const offset = dir === 'right' ? rx * 0.55 : -rx * 0.55;
  ctx.beginPath();
  ctx.ellipse(cx + offset, cy, rx * 0.82, ry * 0.82, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Bounding-box test used for selection/dragging in the editor.
export function shapeContains(s, px, py) {
  if (s.type === 'circle') {
    const cx = s.x + s.w / 2, cy = s.y + s.h / 2;
    const rx = s.w / 2 || 0.0001, ry = s.h / 2 || 0.0001;
    const dx = (px - cx) / rx, dy = (py - cy) / ry;
    return dx * dx + dy * dy <= 1;
  }
  return px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h;
}
