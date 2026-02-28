/* ================================================
   TRANSFORMER EXPLAINED - Interactive Visualizations
   Canvas-based diagrams for each lesson
   ================================================ */

// ─────────────────────────────────────────────────
//  LESSON 02: TOKENIZATION DEMO
// ─────────────────────────────────────────────────
function initTokenizationDemo() {
  const inp = document.getElementById('token-input');
  const btn = document.getElementById('token-btn');
  const out = document.getElementById('token-output');
  const countEl = document.getElementById('token-count');
  if (!inp || !btn || !out) return;

  const COLORS = ['t1','t2','t3','t4','t5','t6'];

  function simpleTokenize(text) {
    if (!text.trim()) return [];
    // Simulate BPE-style tokenization (simplified)
    const words = text.match(/\w+|[^\w\s]|\s+/g) || [];
    const tokens = [];
    words.forEach(w => {
      if (w.length > 8 && /\w+/.test(w)) {
        // Long words split into subwords
        let i = 0;
        while (i < w.length) {
          const len = i === 0 ? Math.min(5, w.length) : Math.min(4, w.length - i);
          tokens.push((i === 0 ? '' : '##') + w.slice(i, i + len));
          i += len;
        }
      } else {
        tokens.push(w);
      }
    });
    return tokens.filter(t => t.trim() !== '');
  }

  function renderTokens(tokens) {
    out.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'token-row';
    tokens.forEach((t, i) => {
      const span = document.createElement('span');
      span.className = `token ${COLORS[i % COLORS.length]}`;
      span.textContent = JSON.stringify(t).replace(/"/g,'');
      span.title = `Token ID: ${1000 + i * 137}`;
      row.appendChild(span);
    });
    out.appendChild(row);
    const info = document.createElement('p');
    info.style.cssText = 'margin-top:0.75rem;font-size:0.8rem;color:var(--text-3)';
    info.textContent = `${tokens.length} token${tokens.length !== 1 ? 's' : ''} generated`;
    out.appendChild(info);
    if (countEl) countEl.textContent = tokens.length;
  }

  btn.addEventListener('click', () => {
    const tokens = simpleTokenize(inp.value);
    renderTokens(tokens.length ? tokens : ['Hello', ' world', '!']);
  });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
  // Default demo
  inp.value = 'Transformers revolutionized AI!';
  btn.click();
}

// ─────────────────────────────────────────────────
//  LESSON 03: EMBEDDING VISUALIZATION (2D Scatter)
// ─────────────────────────────────────────────────
function initEmbeddingViz() {
  const canvas = document.getElementById('embedding-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = canvas.width  = canvas.offsetWidth  || 640;
  const H = canvas.height = canvas.offsetHeight || 360;

  const WORD_GROUPS = {
    royalty:  { color: '#a78bfa', words: [['king',0.72,0.82],['queen',0.78,0.75],['prince',0.68,0.66],['princess',0.75,0.60]] },
    animals:  { color: '#34d399', words: [['dog',0.28,0.55],['cat',0.22,0.60],['wolf',0.35,0.45],['lion',0.40,0.52]] },
    tech:     { color: '#38bdf8', words: [['computer',0.55,0.25],['laptop',0.62,0.30],['phone',0.50,0.20],['tablet',0.58,0.15]] },
    food:     { color: '#fbbf24', words: [['pizza',0.18,0.30],['burger',0.12,0.24],['sushi',0.22,0.18],['pasta',0.10,0.35]] },
    verbs:    { color: '#f472b6', words: [['run',0.82,0.28],['jump',0.88,0.22],['swim',0.78,0.18],['fly',0.85,0.35]] },
  };

  let hovered = null;
  const allWords = [];
  Object.entries(WORD_GROUPS).forEach(([grp, {color, words}]) => {
    words.forEach(([w, nx, ny]) => {
      allWords.push({ word: w, x: nx * W, y: ny * H, color, group: grp });
    });
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Background
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Axis labels
    ctx.fillStyle = 'rgba(100,116,139,0.6)';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('← semantic meaning →', W/2 - 60, H - 8);

    // Draw group ellipses
    Object.entries(WORD_GROUPS).forEach(([grp, {color, words}]) => {
      const pts = words.map(([w, nx, ny]) => [nx * W, ny * H]);
      const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      const rx = Math.max(...pts.map(p => Math.abs(p[0] - cx))) + 28;
      const ry = Math.max(...pts.map(p => Math.abs(p[1] - cy))) + 22;
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw points and labels
    allWords.forEach(pt => {
      const isHov = hovered === pt;
      const r = isHov ? 10 : 7;

      // Glow
      if (isHov) {
        ctx.save();
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = pt.color;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Dot
      ctx.fillStyle = isHov ? pt.color : pt.color + 'cc';
      ctx.beginPath(); ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2); ctx.fill();

      // Label
      ctx.font = isHov ? 'bold 13px Inter, sans-serif' : '12px Inter, sans-serif';
      ctx.fillStyle = isHov ? '#ffffff' : 'rgba(241,245,249,0.75)';
      ctx.fillText(pt.word, pt.x + 12, pt.y + 4);
    });

    // Legend
    let lx = 12, ly = 14;
    ctx.font = '11px Inter, sans-serif';
    Object.entries(WORD_GROUPS).forEach(([grp, {color}]) => {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(lx + 5, ly, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(148,163,184,0.8)';
      ctx.fillText(grp.charAt(0).toUpperCase() + grp.slice(1), lx + 14, ly + 4);
      lx += 85;
    });
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top)  * (H / rect.height);
    hovered = allWords.find(p => Math.hypot(p.x - mx, p.y - my) < 14) || null;
    draw();
  });
  canvas.addEventListener('mouseleave', () => { hovered = null; draw(); });

  draw();
}

// ─────────────────────────────────────────────────
//  LESSON 05-06: ATTENTION HEATMAP
// ─────────────────────────────────────────────────
function initAttentionViz() {
  const canvas = document.getElementById('attention-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const sentence = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
  const N = sentence.length;

  // Pre-computed attention weights (simulated, row = query, col = key)
  const ATTN_PATTERNS = {
    'The':  [0.55, 0.10, 0.05, 0.05, 0.20, 0.05],
    'cat':  [0.15, 0.50, 0.15, 0.05, 0.05, 0.10],
    'sat':  [0.05, 0.30, 0.40, 0.10, 0.05, 0.10],
    'on':   [0.05, 0.10, 0.25, 0.40, 0.05, 0.15],
    'the':  [0.30, 0.05, 0.05, 0.10, 0.40, 0.10],
    'mat':  [0.05, 0.10, 0.15, 0.25, 0.30, 0.15],
  };

  let selectedWord = 'cat';

  const CELL = 60, PAD = 90;
  const W = canvas.width  = N * CELL + PAD + 20;
  const H = canvas.height = N * CELL + PAD + 20;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function attnColor(w) {
    // Low = dark blue, high = bright purple/white
    const r = Math.round(lerp(15,  180, w));
    const g = Math.round(lerp(15,   80, w));
    const b = Math.round(lerp(40,  252, w));
    return `rgb(${r},${g},${b})`;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, W, H);

    const row = ATTN_PATTERNS[selectedWord];
    const queryIdx = sentence.indexOf(selectedWord);

    // Row and column labels
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';

    // Column headers (Keys)
    sentence.forEach((w, j) => {
      ctx.fillStyle = j === queryIdx ? '#a78bfa' : 'rgba(148,163,184,0.7)';
      ctx.fillText(w, PAD + j * CELL + CELL/2, 22);
    });
    // "Keys →" label
    ctx.fillStyle = 'rgba(100,116,139,0.6)';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('KEYS →', PAD/2 + (N * CELL)/2, 10);

    // Row — just draw the selected query row
    ctx.textAlign = 'right';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillStyle = '#a78bfa';
    ctx.fillText(selectedWord, PAD - 10, PAD + 0.5 * CELL + 4);

    // Cells for selected row
    row.forEach((w, j) => {
      const x = PAD + j * CELL;
      const y = PAD;
      ctx.fillStyle = attnColor(w);
      ctx.beginPath();
      ctx.roundRect(x + 4, y + 4, CELL - 8, CELL - 8, 6);
      ctx.fill();

      // Value text
      ctx.fillStyle = w > 0.3 ? '#fff' : 'rgba(255,255,255,0.6)';
      ctx.font = `bold ${w > 0.3 ? 14 : 12}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText((w * 100).toFixed(0) + '%', x + CELL/2, y + CELL/2 + 5);
    });

    // Draw small "other rows" dimmed
    sentence.forEach((qw, qi) => {
      if (qw === selectedWord) return;
      const r = ATTN_PATTERNS[qw];
      const y = PAD + (qi + 0.5) * CELL;  // offset for multi-row display

      // Row label
      ctx.textAlign = 'right';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = 'rgba(100,116,139,0.5)';
    });

    // Full matrix display
    ctx.fillStyle = 'rgba(100,116,139,0.6)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Query: "${selectedWord}" attending to all tokens`, PAD, PAD + CELL + 25);
    ctx.fillText('Hover the buttons above to change the query word', PAD, PAD + CELL + 42);
  }

  // Full matrix mode
  function drawFull() {
    const FCELL = 50, FPAD = 80;
    const FW = canvas.width  = N * FCELL + FPAD + 20;
    const FH = canvas.height = N * FCELL + FPAD + 20;
    ctx.clearRect(0, 0, FW, FH);
    ctx.fillStyle = '#0f0f23'; ctx.fillRect(0, 0, FW, FH);

    ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'center';
    sentence.forEach((w, j) => {
      ctx.fillStyle = 'rgba(148,163,184,0.7)';
      ctx.fillText(w, FPAD + j * FCELL + FCELL/2, 20);
    });
    ctx.textAlign = 'right';
    sentence.forEach((w, i) => {
      ctx.fillStyle = w === selectedWord ? '#a78bfa' : 'rgba(148,163,184,0.7)';
      ctx.fillText(w, FPAD - 8, FPAD + i * FCELL + FCELL/2 + 4);
    });

    sentence.forEach((qw, qi) => {
      const row = ATTN_PATTERNS[qw];
      row.forEach((wt, j) => {
        const x = FPAD + j * FCELL, y = FPAD + qi * FCELL;
        ctx.fillStyle = qw === selectedWord ? attnColor(wt) : attnColor(wt * 0.5);
        ctx.beginPath(); ctx.roundRect(x+3, y+3, FCELL-6, FCELL-6, 5); ctx.fill();
        if (wt > 0.15) {
          ctx.fillStyle = qw === selectedWord ? (wt > 0.3 ? '#fff' : 'rgba(255,255,255,0.6)') : 'rgba(255,255,255,0.3)';
          ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText((wt*100).toFixed(0)+'%', x + FCELL/2, y + FCELL/2 + 4);
        }
      });
    });
  }

  // Wire up buttons
  const btns = document.querySelectorAll('.attn-word-btn');
  btns.forEach(b => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      selectedWord = b.dataset.word;
      drawFull();
    });
  });

  // Initial draw
  canvas.width = N * 50 + 80 + 20;
  canvas.height = N * 50 + 80 + 20;
  drawFull();
}

// ─────────────────────────────────────────────────
//  LESSON 08: POSITIONAL ENCODING VISUALIZATION
// ─────────────────────────────────────────────────
function initPositionalEncodingViz() {
  const canvas = document.getElementById('pe-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = canvas.width  = canvas.offsetWidth  || 640;
  const H = canvas.height = 300;
  const POSITIONS = 50;
  const DIMS = [0, 1, 2, 3]; // Show first 4 dimensions

  const COLORS = ['#a78bfa', '#38bdf8', '#34d399', '#fbbf24'];

  function pe(pos, d) {
    if (d % 2 === 0) return Math.sin(pos / Math.pow(10000, d / 256));
    else             return Math.cos(pos / Math.pow(10000, (d-1) / 256));
  }

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0f0f23'; ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  for (let y = 0; y < H; y += H/4) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  const PAD = 30;
  const innerW = W - PAD * 2;
  const midY   = H / 2;

  // Draw zero line
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(PAD, midY); ctx.lineTo(W - PAD, midY); ctx.stroke();
  ctx.setLineDash([]);

  // Draw sine waves
  DIMS.forEach((dim, di) => {
    ctx.beginPath();
    ctx.strokeStyle = COLORS[di];
    ctx.lineWidth = 2;
    for (let pos = 0; pos <= POSITIONS; pos++) {
      const x = PAD + (pos / POSITIONS) * innerW;
      const val = pe(pos, dim);
      const y = midY - val * (H / 2 - 20);
      if (pos === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  // Legend
  ctx.font = '11px Inter, sans-serif';
  DIMS.forEach((dim, di) => {
    ctx.fillStyle = COLORS[di];
    ctx.fillRect(PAD + di * 120, H - 22, 14, 3);
    ctx.fillStyle = 'rgba(148,163,184,0.8)';
    ctx.fillText(`dim ${dim} (${dim%2===0?'sin':'cos'})`, PAD + di * 120 + 18, H - 15);
  });

  // Axis labels
  ctx.fillStyle = 'rgba(100,116,139,0.6)';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('Position →', W/2 - 25, H - 2);
  ctx.fillText('+1', W - PAD - 15, midY - H/2 + 32);
  ctx.fillText(' 0', 8, midY + 4);
  ctx.fillText('-1', W - PAD - 15, H - 25);
}

// ─────────────────────────────────────────────────
//  LESSON 09/10: ENCODER/DECODER ARCHITECTURE
// ─────────────────────────────────────────────────
function initArchViz(canvasId, type) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 500;
  const H = canvas.height = 400;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0f0f23'; ctx.fillRect(0, 0, W, H);

  function roundRect(x, y, w, h, r, fill, stroke) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  }

  function label(text, x, y, color = 'rgba(241,245,249,0.9)', size = 12) {
    ctx.font = `${size}px Inter, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
  }

  function arrow(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(100,116,139,0.5)';
    ctx.lineWidth = 1.5;
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    // arrowhead
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(100,116,139,0.5)';
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 8 * Math.cos(a - 0.4), y2 - 8 * Math.sin(a - 0.4));
    ctx.lineTo(x2 - 8 * Math.cos(a + 0.4), y2 - 8 * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  }

  const cx = W / 2;

  if (type === 'encoder') {
    const layers = [
      { y: 320, label: 'Input Embeddings\n+ Positional Encoding', fill: 'rgba(124,58,237,0.15)', stroke: 'rgba(124,58,237,0.4)', color: '#a78bfa' },
      { y: 250, label: 'Multi-Head\nSelf-Attention', fill: 'rgba(6,182,212,0.12)', stroke: 'rgba(6,182,212,0.35)', color: '#38bdf8' },
      { y: 185, label: 'Add & Layer Norm', fill: 'rgba(245,158,11,0.1)', stroke: 'rgba(245,158,11,0.3)', color: '#fbbf24' },
      { y: 120, label: 'Feed-Forward\nNetwork', fill: 'rgba(16,185,129,0.12)', stroke: 'rgba(16,185,129,0.35)', color: '#34d399' },
      { y: 55,  label: 'Add & Layer Norm', fill: 'rgba(245,158,11,0.1)', stroke: 'rgba(245,158,11,0.3)', color: '#fbbf24' },
    ];
    const BW = 220, BH = 48;
    layers.forEach((l, i) => {
      roundRect(cx - BW/2, l.y, BW, BH, 8, l.fill, l.stroke);
      const lines = l.label.split('\n');
      lines.forEach((line, li) => {
        label(line, cx, l.y + (li === 0 && lines.length === 2 ? 18 : 28) + li * 16, l.color, 12);
      });
      if (i < layers.length - 1) arrow(cx, l.y, cx, layers[i+1].y + BH);
    });
    label('ENCODER LAYER', cx, 22, 'rgba(148,163,184,0.6)', 10);
    // ×N bracket
    ctx.font = '13px Inter, sans-serif'; ctx.fillStyle = 'rgba(148,163,184,0.5)'; ctx.textAlign = 'right';
    ctx.fillText('× 6 layers', W - 10, H/2);
  }

  if (type === 'decoder') {
    const layers = [
      { y: 340, label: 'Output Embeddings\n+ Positional Encoding', fill: 'rgba(124,58,237,0.15)', stroke: 'rgba(124,58,237,0.4)', color: '#a78bfa' },
      { y: 275, label: 'Masked Multi-Head\nSelf-Attention', fill: 'rgba(236,72,153,0.12)', stroke: 'rgba(236,72,153,0.35)', color: '#f472b6' },
      { y: 210, label: 'Cross-Attention\n(to Encoder output)', fill: 'rgba(6,182,212,0.12)', stroke: 'rgba(6,182,212,0.35)', color: '#38bdf8' },
      { y: 148, label: 'Feed-Forward\nNetwork', fill: 'rgba(16,185,129,0.12)', stroke: 'rgba(16,185,129,0.35)', color: '#34d399' },
      { y: 86,  label: 'Linear + Softmax\n→ Next Token', fill: 'rgba(245,158,11,0.12)', stroke: 'rgba(245,158,11,0.35)', color: '#fbbf24' },
    ];
    const BW = 230, BH = 48;
    layers.forEach((l, i) => {
      roundRect(cx - BW/2, l.y, BW, BH, 8, l.fill, l.stroke);
      const lines = l.label.split('\n');
      lines.forEach((line, li) => {
        label(line, cx, l.y + (lines.length === 2 ? 18 : 28) + li * 16, l.color, 12);
      });
      if (i < layers.length - 1) arrow(cx, l.y, cx, layers[i+1].y + BH);
    });
    label('DECODER LAYER', cx, 22, 'rgba(148,163,184,0.6)', 10);
  }
}

// ─────────────────────────────────────────────────
//  LESSON 11: FULL TRANSFORMER ARCHITECTURE
// ─────────────────────────────────────────────────
function initFullTransformerViz() {
  const canvas = document.getElementById('full-tf-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 700;
  const H = canvas.height = 500;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0f0f23'; ctx.fillRect(0, 0, W, H);

  function box(x, y, w, h, fill, stroke, text, textColor = 'rgba(241,245,249,0.9)', fontSize = 11) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 6);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = textColor; ctx.textAlign = 'center';
    const lines = text.split('\n');
    lines.forEach((l, i) => ctx.fillText(l, x + w/2, y + h/2 + (i - (lines.length-1)/2) * 14 + 1));
  }

  function arr(x1, y1, x2, y2, color = 'rgba(100,116,139,0.5)') {
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const a = Math.atan2(y2-y1, x2-x1);
    ctx.beginPath(); ctx.fillStyle = color;
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 7*Math.cos(a-.4), y2 - 7*Math.sin(a-.4));
    ctx.lineTo(x2 - 7*Math.cos(a+.4), y2 - 7*Math.sin(a+.4));
    ctx.closePath(); ctx.fill();
  }

  function txt(t, x, y, color = 'rgba(100,116,139,0.7)', size = 10) {
    ctx.font = `${size}px Inter, sans-serif`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.fillText(t, x, y);
  }

  const EX = 80, DX = W - 80 - 160;
  const BW = 160, BH = 38;

  // ── ENCODER side ──
  txt('ENCODER', EX + BW/2, 22, 'rgba(167,139,250,0.8)', 11);
  box(EX, 35, BW, BH, 'rgba(124,58,237,0.15)', 'rgba(124,58,237,0.4)', 'Input Tokens', '#a78bfa');
  arr(EX+BW/2, 35, EX+BW/2, 80);
  box(EX, 83, BW, BH, 'rgba(124,58,237,0.1)', 'rgba(124,58,237,0.3)', 'Embeddings +\nPositional Enc', '#a78bfa');
  arr(EX+BW/2, 121, EX+BW/2, 142);
  // Encoder stack
  box(EX, 145, BW, 90, 'rgba(124,58,237,0.08)', 'rgba(124,58,237,0.25)', 'Multi-Head\nSelf-Attention\n+FFN ×6', '#a78bfa');
  arr(EX+BW/2, 235, EX+BW/2, 256);
  box(EX, 259, BW, BH, 'rgba(124,58,237,0.15)', 'rgba(124,58,237,0.4)', 'Encoder Output\n(Context)', '#a78bfa');

  // ── DECODER side ──
  txt('DECODER', DX + BW/2, 22, 'rgba(56,189,248,0.8)', 11);
  box(DX, 35, BW, BH, 'rgba(6,182,212,0.12)', 'rgba(6,182,212,0.35)', 'Output Tokens\n(so far)', '#38bdf8');
  arr(DX+BW/2, 35, DX+BW/2, 80);
  box(DX, 83, BW, BH, 'rgba(6,182,212,0.1)', 'rgba(6,182,212,0.3)', 'Embeddings +\nPositional Enc', '#38bdf8');
  arr(DX+BW/2, 121, DX+BW/2, 142);
  box(DX, 145, BW, BH, 'rgba(236,72,153,0.12)', 'rgba(236,72,153,0.35)', 'Masked\nSelf-Attention', '#f472b6');
  arr(DX+BW/2, 183, DX+BW/2, 200);
  // Cross-attention arrow from encoder to decoder
  arr(EX+BW, 278, DX, 218, 'rgba(245,158,11,0.6)');
  txt('context', (EX+BW + DX)/2, 248, 'rgba(251,191,36,0.7)', 10);
  box(DX, 203, BW, BH, 'rgba(6,182,212,0.12)', 'rgba(6,182,212,0.35)', 'Cross-Attention\n(Encoder→Decoder)', '#38bdf8');
  arr(DX+BW/2, 241, DX+BW/2, 258);
  box(DX, 261, BW, BH, 'rgba(16,185,129,0.12)', 'rgba(16,185,129,0.3)', 'Feed-Forward\n×6 layers', '#34d399');
  arr(DX+BW/2, 299, DX+BW/2, 320);
  box(DX, 323, BW, BH, 'rgba(245,158,11,0.12)', 'rgba(245,158,11,0.3)', 'Linear + Softmax', '#fbbf24');
  arr(DX+BW/2, 361, DX+BW/2, 382);
  box(DX, 385, BW, BH, 'rgba(245,158,11,0.15)', 'rgba(245,158,11,0.4)', 'Output Token', '#fbbf24');

  // Center label
  txt('← Encoder-Decoder Architecture →', W/2, H - 10, 'rgba(100,116,139,0.5)', 10);
}

// ─────────────────────────────────────────────────
//  LESSON 07: MULTI-HEAD ATTENTION VISUALIZATION
// ─────────────────────────────────────────────────
function initMultiHeadViz() {
  const canvas = document.getElementById('multihead-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 600;
  const H = canvas.height = 320;

  const HEADS = [
    { label: 'Head 1\n(Syntax)', color: '#a78bfa', ex: 'Subject→Verb\n"cat sat"' },
    { label: 'Head 2\n(Semantic)', color: '#38bdf8', ex: 'Noun→Object\n"sat mat"' },
    { label: 'Head 3\n(Position)', color: '#34d399', ex: 'Adjacent\n"on the"' },
    { label: 'Head 4\n(Coreference)', color: '#fbbf24', ex: '"it"→"cat"' },
  ];

  ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f0f23'; ctx.fillRect(0, 0, W, H);

  const HW = 110, HH = 60, gapX = (W - HEADS.length * HW) / (HEADS.length + 1);
  const topY = 70, botY = 240;

  // Input box
  ctx.beginPath(); ctx.roundRect(W/2-90, 15, 180, 35, 6);
  ctx.fillStyle = 'rgba(124,58,237,0.15)'; ctx.fill();
  ctx.strokeStyle = 'rgba(124,58,237,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.font = '12px Inter, sans-serif'; ctx.fillStyle = '#a78bfa'; ctx.textAlign = 'center';
  ctx.fillText('Input Embedding (Q, K, V)', W/2, 37);

  HEADS.forEach((h, i) => {
    const hx = gapX + i * (HW + gapX);
    const hy = topY;

    // Arrow from input to head
    ctx.beginPath(); ctx.strokeStyle = h.color + '77'; ctx.lineWidth = 1.5;
    ctx.moveTo(W/2, 50); ctx.lineTo(hx + HW/2, hy); ctx.stroke();

    // Head box
    ctx.beginPath(); ctx.roundRect(hx, hy, HW, HH, 8);
    ctx.fillStyle = h.color + '22'; ctx.fill();
    ctx.strokeStyle = h.color + '88'; ctx.stroke();
    ctx.font = '11px Inter, sans-serif'; ctx.fillStyle = h.color; ctx.textAlign = 'center';
    h.label.split('\n').forEach((l, li) => ctx.fillText(l, hx + HW/2, hy + 22 + li * 16));

    // Example text
    ctx.font = '9px Inter, sans-serif'; ctx.fillStyle = 'rgba(148,163,184,0.6)';
    h.ex.split('\n').forEach((l, li) => ctx.fillText(l, hx + HW/2, hy + HH + 14 + li * 12));

    // Arrow to concat box
    ctx.beginPath(); ctx.strokeStyle = h.color + '77';
    ctx.moveTo(hx + HW/2, hy + HH); ctx.lineTo(W/2, botY); ctx.stroke();
  });

  // Concat box
  ctx.beginPath(); ctx.roundRect(W/2-130, botY, 260, 38, 8);
  ctx.fillStyle = 'rgba(245,158,11,0.12)'; ctx.fill();
  ctx.strokeStyle = 'rgba(245,158,11,0.35)'; ctx.stroke();
  ctx.font = '12px Inter, sans-serif'; ctx.fillStyle = '#fbbf24'; ctx.textAlign = 'center';
  ctx.fillText('Concatenate + Linear Projection', W/2, botY + 23);

  // Output arrow
  ctx.beginPath(); ctx.strokeStyle = 'rgba(100,116,139,0.4)'; ctx.lineWidth = 1.5;
  ctx.moveTo(W/2, botY + 38); ctx.lineTo(W/2, H - 15); ctx.stroke();
  ctx.font = '11px Inter, sans-serif'; ctx.fillStyle = 'rgba(241,245,249,0.8)';
  ctx.fillText('Multi-Head Attention Output', W/2, H - 5);
}

// ─────────────────────────────────────────────────
//  SELF-ATTENTION STEP CALCULATOR
// ─────────────────────────────────────────────────
function initSelfAttnCalc() {
  const canvas = document.getElementById('self-attn-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 640;
  const H = canvas.height = 200;

  const words = ['The', 'animal', 'was', 'tired'];
  // Show attention of "tired" → all words
  const weights = [0.05, 0.65, 0.10, 0.20];

  ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f0f23'; ctx.fillRect(0, 0, W, H);

  const bw = 90, pad = (W - words.length * bw - (words.length-1) * 20) / 2;

  words.forEach((w, i) => {
    const x = pad + i * (bw + 20);
    const alpha = 0.15 + weights[i] * 0.85;
    const bh = 40 + weights[i] * 80;
    const by = H - 60 - bh;

    // Bar
    ctx.beginPath(); ctx.roundRect(x, by, bw, bh, 6);
    ctx.fillStyle = `rgba(124,58,237,${alpha})`; ctx.fill();
    ctx.strokeStyle = `rgba(124,58,237,${alpha + 0.2})`; ctx.lineWidth = 1.5; ctx.stroke();

    // Word label
    ctx.font = '13px Inter, sans-serif'; ctx.fillStyle = i === 1 ? '#a78bfa' : 'rgba(241,245,249,0.85)';
    ctx.textAlign = 'center';
    ctx.fillText(w, x + bw/2, H - 40);

    // Weight
    ctx.font = 'bold 12px Inter, sans-serif'; ctx.fillStyle = '#a78bfa';
    ctx.fillText((weights[i]*100).toFixed(0)+'%', x + bw/2, by - 6);
  });

  // Query label
  ctx.font = '11px Inter, sans-serif'; ctx.fillStyle = 'rgba(100,116,139,0.7)'; ctx.textAlign = 'left';
  ctx.fillText('Query: "tired" (What should I pay attention to?)', 10, 18);
  ctx.fillStyle = 'rgba(167,139,250,0.7)';
  ctx.fillText('"animal" gets 65% attention → resolves what was tired', 10, H - 8);
}

// ─────────────────────────────────────────────────
//  AUTO-INIT on page load
// ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTokenizationDemo();
  initEmbeddingViz();
  initAttentionViz();
  initPositionalEncodingViz();
  initMultiHeadViz();
  initSelfAttnCalc();
  initFullTransformerViz();
  initArchViz('encoder-canvas', 'encoder');
  initArchViz('decoder-canvas', 'decoder');

  // Resize canvases on window resize
  window.addEventListener('resize', () => {
    initEmbeddingViz();
    initPositionalEncodingViz();
    initMultiHeadViz();
    initSelfAttnCalc();
    initFullTransformerViz();
    initArchViz('encoder-canvas', 'encoder');
    initArchViz('decoder-canvas', 'decoder');
    initAttentionViz();
  });
});
