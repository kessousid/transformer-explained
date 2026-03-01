/* ================================================
   TRANSFORMER EXPLAINED - Main Application JS
   Handles: slideshow, navigation, progress, quiz
   ================================================ */

// ── LESSON REGISTRY ────────────────────────────────
const LESSONS = [
  { id: '01', file: '01-introduction.html',        title: 'Introduction',           module: 1 },
  { id: '02', file: '02-tokenization.html',         title: 'Tokenization',           module: 1 },
  { id: '03', file: '03-embeddings.html',           title: 'Word Embeddings',        module: 1 },
  { id: '04', file: '04-the-problem.html',          title: 'The Sequence Problem',   module: 2 },
  { id: '05', file: '05-attention.html',            title: 'Attention Mechanism',    module: 2 },
  { id: '06', file: '06-self-attention.html',       title: 'Self-Attention',         module: 2 },
  { id: '07', file: '07-multihead-attention.html',  title: 'Multi-Head Attention',   module: 2 },
  { id: '08', file: '08-positional-encoding.html',  title: 'Positional Encoding',    module: 3 },
  { id: '09', file: '09-encoder.html',              title: 'The Encoder',            module: 3 },
  { id: '10', file: '10-decoder.html',              title: 'The Decoder',            module: 3 },
  { id: '11', file: '11-full-transformer.html',     title: 'The Full Transformer',   module: 4 },
];
const MODULE_NAMES = { 1: 'Foundations', 2: 'Attention', 3: 'Architecture', 4: 'Modern LLMs' };

// ── PROGRESS MANAGEMENT ────────────────────────────
const Progress = {
  key: 'tf_explained_progress',
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; }
    catch { return {}; }
  },
  mark(lessonId) {
    const p = this.get(); p[lessonId] = true;
    localStorage.setItem(this.key, JSON.stringify(p));
  },
  isDone(lessonId) { return !!this.get()[lessonId]; },
  count() { return Object.keys(this.get()).length; }
};

// ── SIDEBAR BUILDER ────────────────────────────────
function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const progress = Progress.get();
  const currentFile = window.location.pathname.split('/').pop();

  let moduleSections = {};
  LESSONS.forEach(l => {
    if (!moduleSections[l.module]) moduleSections[l.module] = [];
    moduleSections[l.module].push(l);
  });

  let html = `
    <div class="sidebar-header">
      <div class="logo-icon">⚡</div>
      Transformer Explained
    </div>
    <a href="../index.html" class="sidebar-home">🏠 Course Home</a>
    <div class="sidebar-modules">
  `;

  Object.entries(moduleSections).forEach(([modNum, lessons]) => {
    html += `<div class="sidebar-module-title">Module ${modNum}: ${MODULE_NAMES[modNum]}</div>`;
    lessons.forEach(l => {
      const done = progress[l.id];
      const active = currentFile === l.file;
      html += `
        <a href="${l.file}" class="sidebar-lesson${active ? ' active' : ''}${done ? ' completed' : ''}">
          <div class="lesson-num">${done ? '✓' : l.id}</div>
          <span>${l.title}</span>
          <span class="lesson-check">✓</span>
        </a>
      `;
    });
  });

  html += '</div>';
  sidebar.innerHTML = html;
}

// ── PROGRESS BAR ───────────────────────────────────
function updateProgressBar(currentSlide, totalSlides) {
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = ((currentSlide / totalSlides) * 100) + '%';
}

// ── SLIDESHOW ──────────────────────────────────────
class Slideshow {
  constructor(container) {
    this.container = container;
    this.slides = [...container.querySelectorAll('.slide')];
    this.current = 0;
    this.total = this.slides.length;
    this.prevBtn = container.querySelector('.slide-btn.prev');
    this.nextBtn = container.querySelector('.slide-btn.next');
    this.dotsContainer = container.querySelector('.slide-dots');
    this.counter = container.querySelector('.slide-counter');
    this.init();
  }

  init() {
    this.buildDots();
    this.updateUI();
    this.prevBtn?.addEventListener('click', () => this.go(this.current - 1));
    this.nextBtn?.addEventListener('click', () => this.go(this.current + 1));
    this.dotsContainer?.querySelectorAll('.slide-dot').forEach((d, i) =>
      d.addEventListener('click', () => this.go(i))
    );
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') this.go(this.current + 1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   this.go(this.current - 1);
    });
  }

  buildDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = this.slides.map((_, i) =>
      `<button class="slide-dot${i === 0 ? ' active' : ''}" aria-label="Slide ${i+1}"></button>`
    ).join('');
  }

  go(index) {
    if (index < 0 || index >= this.total) return;
    this.slides[this.current].classList.remove('active');
    this.current = index;
    this.slides[this.current].classList.add('active');
    this.updateUI();
    triggerSlideAnimations(this.slides[this.current]);
    updateProgressBar(this.current + 1, this.total);
    if (window._tts) window._tts.setSlide(index);
  }

  updateUI() {
    if (this.counter) this.counter.textContent = `${this.current + 1} / ${this.total}`;
    if (this.prevBtn) this.prevBtn.disabled = this.current === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.current === this.total - 1;
    this.dotsContainer?.querySelectorAll('.slide-dot').forEach((d, i) =>
      d.classList.toggle('active', i === this.current)
    );
  }
}

// ── SLIDE ANIMATIONS ───────────────────────────────
function triggerSlideAnimations(slide) {
  // Reset and re-animate .anim-box elements
  const boxes = slide.querySelectorAll('.anim-box');
  boxes.forEach((box, i) => {
    box.style.animation = 'none';
    requestAnimationFrame(() => {
      box.style.animation = `fadeInUp 0.4s ease ${i * 0.08}s both`;
    });
  });
  // Reset step items
  slide.querySelectorAll('.step-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 120);
  });
}

// ── QUIZ LOGIC ─────────────────────────────────────
function initQuiz() {
  const quiz = document.getElementById('quiz');
  if (!quiz) return;

  const opts = quiz.querySelectorAll('.quiz-option');
  const btn  = quiz.querySelector('.quiz-btn');
  const fb   = quiz.querySelector('.quiz-feedback');
  const correct = quiz.dataset.correct;
  let selected = null;

  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      if (btn && btn.dataset.submitted) return;
      opts.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selected = opt.dataset.value;
      if (btn) btn.disabled = false;
    });
  });

  btn?.addEventListener('click', () => {
    if (!selected) return;
    btn.dataset.submitted = '1';
    btn.disabled = true;
    opts.forEach(opt => {
      if (opt.dataset.value === correct) opt.classList.add('correct');
      else if (opt.dataset.value === selected) opt.classList.add('wrong');
    });
    if (fb) {
      fb.classList.add('show');
      const isRight = selected === correct;
      fb.classList.add(isRight ? 'correct-fb' : 'wrong-fb');
      fb.textContent = isRight
        ? '✅ ' + (quiz.dataset.successMsg || 'Correct! Great understanding.')
        : '❌ ' + (quiz.dataset.failMsg || 'Not quite — review the material above.');
    }
    // Mark lesson complete on correct answer
    const lessonId = document.body.dataset.lessonId;
    if (lessonId && selected === correct) {
      Progress.mark(lessonId);
      buildSidebar();
    }
  });
}

// ── SIDEBAR TOGGLE (mobile) ────────────────────────
function initSidebarToggle() {
  const btn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !sidebar) return;

  btn.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && e.target !== btn) {
      sidebar.classList.remove('open');
    }
  });
}

// ── SCROLL REVEAL ──────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

// ── TOPBAR PREV/NEXT BUTTONS ───────────────────────
function initTopbarNav() {
  const lessonId = document.body.dataset.lessonId;
  if (!lessonId) return;
  const idx = LESSONS.findIndex(l => l.id === lessonId);

  const prevBtn = document.getElementById('topbar-prev');
  const nextBtn = document.getElementById('topbar-next');

  if (prevBtn) {
    if (idx > 0) prevBtn.onclick = () => location.href = LESSONS[idx-1].file;
    else prevBtn.disabled = true;
  }
  if (nextBtn) {
    if (idx < LESSONS.length - 1) nextBtn.onclick = () => location.href = LESSONS[idx+1].file;
    else nextBtn.disabled = true;
  }
}

// ── MARK LESSON COMPLETE BUTTON ────────────────────
function initCompleteBtn() {
  const btn = document.getElementById('mark-complete');
  if (!btn) return;
  const lessonId = document.body.dataset.lessonId;
  if (lessonId && Progress.isDone(lessonId)) {
    btn.textContent = '✓ Completed';
    btn.classList.add('done');
  }
  btn.addEventListener('click', () => {
    if (lessonId) { Progress.mark(lessonId); buildSidebar(); }
    btn.textContent = '✓ Completed';
    btn.classList.add('done');
  });
}

// ── LANDING PAGE PROGRESS ──────────────────────────
function updateLandingProgress() {
  const countEl = document.getElementById('progress-count');
  if (countEl) countEl.textContent = Progress.count();

  const progress = Progress.get();
  document.querySelectorAll('.lesson-link').forEach(link => {
    const id = link.dataset.lessonId;
    if (id && progress[id]) link.classList.add('done');
  });
}

// ── INIT ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  initScrollReveal();
  initSidebarToggle();
  initTopbarNav();
  initQuiz();
  initCompleteBtn();
  updateLandingProgress();

  // Initialize slideshow if present
  const ssContainer = document.getElementById('slideshow');
  if (ssContainer) {
    const ss = new Slideshow(ssContainer);
    // Trigger animations for first slide
    const firstSlide = ssContainer.querySelector('.slide.active');
    if (firstSlide) {
      setTimeout(() => triggerSlideAnimations(firstSlide), 100);
      updateProgressBar(1, ss.total);
    }
  }

  // Typing animation
  const typingEl = document.querySelector('.typing-demo');
  if (typingEl) {
    const texts = typingEl.dataset.texts ? JSON.parse(typingEl.dataset.texts) : [];
    let tIdx = 0, cIdx = 0, deleting = false;
    function typeStep() {
      const t = texts[tIdx] || '';
      typingEl.textContent = deleting ? t.slice(0, cIdx--) : t.slice(0, cIdx++);
      if (!deleting && cIdx > t.length) { deleting = true; setTimeout(typeStep, 1500); return; }
      if (deleting && cIdx < 0)         { deleting = false; tIdx = (tIdx + 1) % texts.length; cIdx = 0; }
      setTimeout(typeStep, deleting ? 40 : 80);
    }
    if (texts.length) typeStep();
  }

  // TTS — only on lesson pages (body has data-lesson-id)
  if (document.body.dataset.lessonId) initTTS();
});

// ── TTS CONTROLLER ─────────────────────────────────
class TTSController {
  constructor(lessonId) {
    this.lessonId   = lessonId;
    this.narrations = (window.NARRATIONS && window.NARRATIONS[lessonId]) || [];
    this.synth      = window.speechSynthesis;
    this.rate       = 1;
    this.slideIndex = 0;
    this.playBtn    = null;
    this.textEl     = null;
    this.bar        = null;
  }

  buildBar() {
    const bar = document.createElement('div');
    bar.className = 'tts-bar';
    bar.id = 'tts-bar';
    bar.innerHTML = `
      <div class="tts-inner">
        <span class="tts-icon">🔊</span>
        <div class="tts-text" id="tts-text">Click ▶ to hear narration for this slide.</div>
        <div class="tts-controls">
          <button class="tts-btn" id="tts-play" title="Play / Pause">▶</button>
          <button class="tts-btn" id="tts-stop" title="Stop">■</button>
          <select class="tts-speed" id="tts-speed" title="Playback speed">
            <option value="0.75">0.75×</option>
            <option value="1" selected>1×</option>
            <option value="1.25">1.25×</option>
            <option value="1.5">1.5×</option>
          </select>
        </div>
        <button class="tts-toggle" id="tts-toggle" title="Hide player">✕</button>
      </div>
    `;
    document.body.appendChild(bar);
    this.bar     = bar;
    this.playBtn = document.getElementById('tts-play');
    this.textEl  = document.getElementById('tts-text');

    document.getElementById('tts-play').addEventListener('click',  () => this.togglePlay());
    document.getElementById('tts-stop').addEventListener('click',  () => this.stop());
    document.getElementById('tts-speed').addEventListener('change', e => { this.rate = parseFloat(e.target.value); });
    document.getElementById('tts-toggle').addEventListener('click', () => {
      bar.classList.add('hidden');
      const btn = document.createElement('button');
      btn.className = 'tts-reopen';
      btn.title = 'Open audio player';
      btn.textContent = '🔊';
      btn.addEventListener('click', () => { bar.classList.remove('hidden'); btn.remove(); });
      document.body.appendChild(btn);
    });

    // Show initial narration text
    const first = this.narrations[0];
    if (first && this.textEl) this.textEl.textContent = first;
  }

  setSlide(index) {
    this.slideIndex = index;
    const text = this.narrations[index];
    if (this.textEl) this.textEl.textContent = text || 'No narration for this slide.';
    // Auto-continue playback on slide change if TTS was already active
    const wasActive = this.synth.speaking || this.synth.paused;
    if (wasActive && text) this.speak(text);
  }

  speak(text) {
    if (!text || !this.synth) return;
    this.synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = this.rate;
    utt.onend  = () => this._setIdle();
    utt.onerror = () => this._setIdle();
    this.synth.speak(utt);
    if (this.playBtn) { this.playBtn.textContent = '⏸'; this.playBtn.classList.add('active'); }
  }

  togglePlay() {
    if (!this.synth) return;
    if (this.synth.speaking) {
      if (this.synth.paused) {
        this.synth.resume();
        if (this.playBtn) { this.playBtn.textContent = '⏸'; this.playBtn.classList.add('active'); }
      } else {
        this.synth.pause();
        if (this.playBtn) { this.playBtn.textContent = '▶'; this.playBtn.classList.remove('active'); }
      }
    } else {
      const text = this.narrations[this.slideIndex];
      if (text) this.speak(text);
    }
  }

  stop() {
    if (this.synth) this.synth.cancel();
    this._setIdle();
  }

  _setIdle() {
    if (this.playBtn) { this.playBtn.textContent = '▶'; this.playBtn.classList.remove('active'); }
  }
}

function initTTS() {
  if (!window.speechSynthesis) return;
  const lessonId = document.body.dataset.lessonId;
  if (!lessonId || !window.NARRATIONS) return;
  const tts = new TTSController(lessonId);
  tts.buildBar();
  window._tts = tts;
}
