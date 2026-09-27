import { randomFlag } from './flags.js';
import { FlagEditor } from './editor.js';
import { scoreDrawing, tierFor, renderReference, renderEditorClean } from './scoring.js';

const STATS_KEY = 'ctf_stats_v1';

const PALETTE = [
  '#FFFFFF', '#000000', '#C0392B', '#ED2939', '#DE2910', '#E30A17',
  '#F42A41', '#CE1126', '#CB1515', '#D7141A', '#FF8200', '#F2A800',
  '#FCD116', '#FECC02', '#FFDE00', '#FFFF00', '#009246', '#009739',
  '#008751', '#169B62', '#00966E', '#1EB53A', '#003893', '#002654',
  '#0039A6', '#003580', '#002868', '#21468B', '#4189DD', '#0072CE',
  '#9E3039', '#436F4D',
];

const SHAPE_TOOLS = [
  { type: 'hstripe', label: 'H-Stripe', icon: '▬' },
  { type: 'vstripe', label: 'V-Stripe', icon: '▮' },
  { type: 'rect', label: 'Block', icon: '▭' },
  { type: 'circle', label: 'Circle', icon: '●' },
  { type: 'triangle', label: 'Triangle', icon: '▶' },
  { type: 'diamond', label: 'Diamond', icon: '◆' },
  { type: 'star', label: 'Star', icon: '★' },
  { type: 'crescent', label: 'Crescent', icon: '☾' },
];

const state = {
  flag: null,
  difficulty: 'all',
};

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY)) || { played: 0, totalScore: 0, best: 0 };
  } catch { return { played: 0, totalScore: 0, best: 0 }; }
}
function saveStats(s) { localStorage.setItem(STATS_KEY, JSON.stringify(s)); }

function $(sel) { return document.querySelector(sel); }
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

let editor;

function buildPalette() {
  const wrap = $('#colorPalette');
  wrap.innerHTML = '';
  PALETTE.forEach(hex => {
    const sw = el('button', 'swatch');
    sw.style.background = hex;
    sw.title = hex;
    sw.addEventListener('click', () => {
      editor.setColor(hex);
      $('#customColor').value = hex;
      highlightSwatch(hex);
    });
    sw.dataset.hex = hex;
    wrap.appendChild(sw);
  });
}

function highlightSwatch(hex) {
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.hex.toLowerCase() === hex.toLowerCase());
  });
}

function buildShapeTools() {
  const wrap = $('#shapeTools');
  wrap.innerHTML = '';
  SHAPE_TOOLS.forEach(({ type, label, icon }) => {
    const btn = el('button', 'tool-btn');
    btn.innerHTML = `<span class="tool-icon">${icon}</span><span class="tool-label">${label}</span>`;
    btn.draggable = true;
    btn.title = `Drag onto the canvas, or click then click the canvas to place a ${label}`;
    btn.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', `${type}:right`);
    });
    btn.addEventListener('click', () => {
      editor.armShape(type, 'right');
      syncToolbarUI();
    });
    wrap.appendChild(btn);
  });
}

function syncToolbarUI() {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
  if (editor.armedType) {
    const idx = SHAPE_TOOLS.findIndex(t => t.type === editor.armedType);
    const btn = $('#shapeTools').children[idx];
    if (btn) btn.classList.add('active');
  } else if (editor.mode === 'pencil') {
    $('#btnPencil').classList.add('active');
  } else {
    $('#btnSelect').classList.add('active');
  }
  const sel = editor.selected;
  highlightSwatch(sel ? sel.color : editor.currentColor);
}

function newRound(keepFlag) {
  if (!keepFlag) {
    state.flag = randomFlag(state.flag ? state.flag.name : null, state.difficulty);
  }
  editor.shapes = [];
  editor.strokes = [];
  editor.bgColor = '#ffffff';
  editor.selectedId = null;
  editor.armedType = null;
  editor.mode = 'select';
  editor.history = [];
  editor.render();
  syncToolbarUI();

  $('#countryName').textContent = state.flag.name;
  $('#difficultyBadge').textContent = state.flag.difficulty;
  $('#difficultyBadge').className = `badge badge-${state.flag.difficulty}`;
  $('#resultPanel').classList.add('hidden');
  $('#gamePanel').classList.remove('hidden');
}

function renderStats() {
  const s = loadStats();
  const avg = s.played ? Math.round(s.totalScore / s.played) : 0;
  $('#statPlayed').textContent = s.played;
  $('#statAvg').textContent = avg + '%';
  $('#statBest').textContent = s.best + '%';
}

function submitDrawing() {
  const score = scoreDrawing(editor, state.flag);
  const s = loadStats();
  s.played += 1;
  s.totalScore += score;
  s.best = Math.max(s.best, score);
  saveStats(s);
  renderStats();

  const tier = tierFor(score);
  $('#scoreValue').textContent = score + '%';
  $('#scoreValue').className = 'score-value ' + tier.cls;
  $('#tierLabel').textContent = tier.label;
  $('#resultCountry').textContent = state.flag.name;

  const W = editor.W, H = editor.H;
  const userCanvas = renderEditorClean(editor, W, H);
  const refCanvas = renderReference(state.flag, W, H);
  const yourCtx = $('#compareYours').getContext('2d');
  const actualCtx = $('#compareActual').getContext('2d');
  $('#compareYours').width = W; $('#compareYours').height = H;
  $('#compareActual').width = W; $('#compareActual').height = H;
  yourCtx.drawImage(userCanvas, 0, 0);
  actualCtx.drawImage(refCanvas, 0, 0);

  $('#gamePanel').classList.add('hidden');
  $('#resultPanel').classList.remove('hidden');
}

function init() {
  const canvas = $('#flagCanvas');
  editor = new FlagEditor(canvas);

  buildPalette();
  buildShapeTools();
  highlightSwatch(editor.currentColor);
  editor.onChange = syncToolbarUI;

  $('#customColor').addEventListener('input', e => {
    editor.setColor(e.target.value);
    highlightSwatch(e.target.value);
  });

  $('#btnSelect').addEventListener('click', () => {
    editor.armedType = null;
    editor.setMode('select');
    syncToolbarUI();
  });
  $('#btnPencil').addEventListener('click', () => {
    editor.setMode('pencil');
    syncToolbarUI();
  });
  $('#brushSize').addEventListener('input', e => { editor.brushSize = Number(e.target.value); });

  $('#btnBackground').addEventListener('click', () => editor.setBackground(editor.currentColor));
  $('#btnOrientation').addEventListener('click', () => editor.cycleOrientation());
  $('#btnFront').addEventListener('click', () => editor.bringToFront());
  $('#btnBack').addEventListener('click', () => editor.sendToBack());
  $('#btnDelete').addEventListener('click', () => editor.deleteSelected());
  $('#btnUndo').addEventListener('click', () => editor.undo());
  $('#btnClear').addEventListener('click', () => {
    if (confirm('Clear the whole drawing?')) editor.clearAll();
  });

  window.addEventListener('keydown', e => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      editor.deleteSelected();
    }
    if (e.key === 'Escape') {
      editor.armedType = null;
      editor.setMode('select');
      syncToolbarUI();
    }
  });

  $('#btnSubmit').addEventListener('click', submitDrawing);
  $('#btnNext').addEventListener('click', () => newRound(false));
  $('#btnRetry').addEventListener('click', () => newRound(true));
  $('#btnNextFromResult').addEventListener('click', () => newRound(false));
  $('#btnRetryFromResult').addEventListener('click', () => newRound(true));

  $('#difficultySelect').addEventListener('change', e => {
    state.difficulty = e.target.value;
    newRound(false);
  });

  renderStats();
  newRound(false);
}

document.addEventListener('DOMContentLoaded', init);
