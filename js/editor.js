import { drawShape, shapeContains } from './shapes.js';

const PRESETS = {
  rect:     { w: 0.22, h: 0.22 },
  hstripe:  { w: 1,    h: 0.16 },
  vstripe:  { w: 0.16, h: 1 },
  circle:   { w: 0.3,  h: 0.45 },
  triangle: { w: 0.35, h: 0.5 },
  diamond:  { w: 0.3,  h: 0.45 },
  star:     { w: 0.22, h: 0.32 },
  crescent: { w: 0.3,  h: 0.45 },
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
let uidCounter = 1;
const uid = () => 'sh' + (uidCounter++);

export class FlagEditor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.W = canvas.width;
    this.H = canvas.height;

    this.shapes = [];
    this.strokes = [];
    this.bgColor = '#ffffff';
    this.selectedId = null;
    this.mode = 'select'; // 'select' | 'pencil'
    this.armedType = null;
    this.armedDir = 'right';
    this.currentColor = '#c0392b';
    this.brushSize = 6;

    this.history = [];
    this.onChange = null; // callback fired after any mutation

    this._drag = null;
    this._bindEvents();
    this.render();
  }

  // ---------- coordinate helpers ----------
  _toNorm(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    return { x: clamp(x, -0.5, 1.5), y: clamp(y, -0.5, 1.5) };
  }

  _handlePixelPos(s) {
    return { x: (s.x + s.w) * this.W, y: (s.y + s.h) * this.H };
  }

  // ---------- history ----------
  _snapshot() {
    this.history.push(JSON.stringify({ shapes: this.shapes, strokes: this.strokes, bgColor: this.bgColor }));
    if (this.history.length > 60) this.history.shift();
  }

  undo() {
    const prev = this.history.pop();
    if (!prev) return;
    const state = JSON.parse(prev);
    this.shapes = state.shapes;
    this.strokes = state.strokes;
    this.bgColor = state.bgColor;
    this.selectedId = null;
    this._emit();
  }

  clearAll() {
    this._snapshot();
    this.shapes = [];
    this.strokes = [];
    this.bgColor = '#ffffff';
    this.selectedId = null;
    this._emit();
  }

  _emit() {
    this.render();
    if (this.onChange) this.onChange();
  }

  // ---------- shape ops ----------
  addShapeAt(type, nx, ny, dir) {
    this._snapshot();
    const preset = PRESETS[type] || { w: 0.2, h: 0.2 };
    let w = preset.w, h = preset.h, x, y;
    if (type === 'hstripe') { x = 0; y = clamp(ny - h / 2, 0, 1 - h); }
    else if (type === 'vstripe') { y = 0; x = clamp(nx - w / 2, 0, 1 - w); }
    else { x = clamp(nx - w / 2, 0, 1 - w); y = clamp(ny - h / 2, 0, 1 - h); }
    const shape = { id: uid(), type, x, y, w, h, color: this.currentColor };
    if (type === 'triangle' || type === 'crescent') shape.dir = dir || this.armedDir || 'right';
    this.shapes.push(shape);
    this.selectedId = shape.id;
    this._emit();
    return shape;
  }

  get selected() {
    return this.shapes.find(s => s.id === this.selectedId) || null;
  }

  setColor(hex) {
    this.currentColor = hex;
    const s = this.selected;
    if (s) {
      this._snapshot();
      s.color = hex;
      this._emit();
    }
  }

  setBackground(hex) {
    this._snapshot();
    this.bgColor = hex;
    this._emit();
  }

  deleteSelected() {
    if (!this.selectedId) return;
    this._snapshot();
    this.shapes = this.shapes.filter(s => s.id !== this.selectedId);
    this.selectedId = null;
    this._emit();
  }

  cycleOrientation() {
    const s = this.selected;
    if (!s || (s.type !== 'triangle' && s.type !== 'crescent')) return;
    this._snapshot();
    const order = s.type === 'triangle' ? ['right', 'down', 'left', 'up'] : ['right', 'left'];
    const idx = order.indexOf(s.dir || 'right');
    s.dir = order[(idx + 1) % order.length];
    this._emit();
  }

  bringToFront() {
    const s = this.selected;
    if (!s) return;
    this._snapshot();
    this.shapes = this.shapes.filter(x => x !== s);
    this.shapes.push(s);
    this._emit();
  }

  sendToBack() {
    const s = this.selected;
    if (!s) return;
    this._snapshot();
    this.shapes = this.shapes.filter(x => x !== s);
    this.shapes.unshift(s);
    this._emit();
  }

  setMode(mode) {
    this.mode = mode;
    if (mode === 'pencil') { this.armedType = null; this.selectedId = null; this.render(); }
  }

  armShape(type, dir) {
    this.mode = 'select';
    this.armedType = type;
    this.armedDir = dir || 'right';
    this.selectedId = null;
    this.render();
  }

  // ---------- pointer interaction ----------
  _bindEvents() {
    const c = this.canvas;
    c.addEventListener('pointerdown', e => this._onDown(e));
    c.addEventListener('pointermove', e => this._onMove(e));
    window.addEventListener('pointerup', e => this._onUp(e));

    c.addEventListener('dragover', e => e.preventDefault());
    c.addEventListener('drop', e => {
      e.preventDefault();
      const data = e.dataTransfer.getData('text/plain');
      if (!data) return;
      const [type, dir] = data.split(':');
      const { x, y } = this._toNorm(e.clientX, e.clientY);
      this.addShapeAt(type, x, y, dir);
    });
  }

  _onDown(e) {
    this.canvas.setPointerCapture(e.pointerId);
    const { x: nx, y: ny } = this._toNorm(e.clientX, e.clientY);
    const px = e.clientX - this.canvas.getBoundingClientRect().left;
    const py = e.clientY - this.canvas.getBoundingClientRect().top;
    const scaleX = this.W / this.canvas.getBoundingClientRect().width;
    const scaleY = this.H / this.canvas.getBoundingClientRect().height;

    const sel = this.selected;
    if (sel) {
      const hp = this._handlePixelPos(sel);
      const dx = px * scaleX - hp.x, dy = py * scaleY - hp.y;
      if (Math.sqrt(dx * dx + dy * dy) < 14) {
        this._snapshot();
        this._drag = { type: 'resize', shape: sel };
        return;
      }
    }

    if (this.mode === 'pencil') {
      this._snapshot();
      const stroke = { color: this.currentColor, width: this.brushSize, points: [{ x: nx, y: ny }] };
      this.strokes.push(stroke);
      this._drag = { type: 'pencil', stroke };
      this.render();
      return;
    }

    if (this.armedType) {
      const type = this.armedType, dir = this.armedDir;
      this.armedType = null;
      this.addShapeAt(type, nx, ny, dir);
      return;
    }

    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (shapeContains(this.shapes[i], nx, ny)) {
        this.selectedId = this.shapes[i].id;
        this._snapshot();
        this._drag = { type: 'move', shape: this.shapes[i], offX: nx - this.shapes[i].x, offY: ny - this.shapes[i].y };
        this.render();
        return;
      }
    }
    this.selectedId = null;
    this.render();
  }

  _onMove(e) {
    if (!this._drag) return;
    const { x: nx, y: ny } = this._toNorm(e.clientX, e.clientY);
    if (this._drag.type === 'move') {
      const s = this._drag.shape;
      s.x = clamp(nx - this._drag.offX, -s.w * 0.4, 1 - s.w * 0.6);
      s.y = clamp(ny - this._drag.offY, -s.h * 0.4, 1 - s.h * 0.6);
      this.render();
    } else if (this._drag.type === 'resize') {
      const s = this._drag.shape;
      s.w = clamp(nx - s.x, 0.03, 2);
      s.h = clamp(ny - s.y, 0.03, 2);
      this.render();
    } else if (this._drag.type === 'pencil') {
      const pts = this._drag.stroke.points;
      pts.push({ x: clamp(nx, 0, 1), y: clamp(ny, 0, 1) });
      this.render();
    }
  }

  _onUp() {
    if (this._drag) {
      this._drag = null;
      if (this.onChange) this.onChange();
    }
  }

  // ---------- rendering ----------
  render() {
    const { ctx, W, H } = this;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, W, H);
    for (const s of this.shapes) drawShape(ctx, s, W, H);
    for (const st of this.strokes) this._drawStroke(st);

    const sel = this.selected;
    if (sel) {
      ctx.save();
      ctx.strokeStyle = '#2d8cf0';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(sel.x * W, sel.y * H, sel.w * W, sel.h * H);
      ctx.setLineDash([]);
      const hp = this._handlePixelPos(sel);
      ctx.fillStyle = '#2d8cf0';
      ctx.fillRect(hp.x - 5, hp.y - 5, 10, 10);
      ctx.restore();
    }
  }

  _drawStroke(st) {
    const { ctx, W, H } = this;
    if (st.points.length < 1) return;
    ctx.save();
    ctx.strokeStyle = st.color;
    ctx.lineWidth = st.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    st.points.forEach((p, i) => {
      const px = p.x * W, py = p.y * H;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();
  }

  // Render without selection UI, for scoring/snapshot comparisons.
  renderClean(ctx, W, H) {
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, W, H);
    for (const s of this.shapes) drawShape(ctx, s, W, H);
    for (const st of this.strokes) {
      ctx.save();
      ctx.strokeStyle = st.color;
      ctx.lineWidth = st.width * (W / this.W);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      st.points.forEach((p, i) => {
        const px = p.x * W, py = p.y * H;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.restore();
    }
  }
}
