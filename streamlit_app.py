"""
Transformer Explained — Streamlit App
Interactive course on how Transformer/LLM models work.
"""

import streamlit as st
import re
from pathlib import Path

# ── PAGE CONFIG ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Transformer Explained",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── PATHS ────────────────────────────────────────────────────────────────────
BASE = Path(__file__).parent
CSS_PATH = BASE / "css" / "styles.css"
APP_JS_PATH = BASE / "js" / "app.js"
VIZ_JS_PATH = BASE / "js" / "visualizations.js"

CSS     = CSS_PATH.read_text(encoding="utf-8")
APP_JS  = APP_JS_PATH.read_text(encoding="utf-8")
VIZ_JS  = VIZ_JS_PATH.read_text(encoding="utf-8")

# ── LESSON REGISTRY ──────────────────────────────────────────────────────────
LESSONS = [
    {"key": "home",  "label": "🏠  Course Home",             "file": "index.html",                          "module": None},
    {"key": "01",    "label": "01 · Introduction",           "file": "lessons/01-introduction.html",        "module": "Module 1 · Foundations"},
    {"key": "02",    "label": "02 · Tokenization",           "file": "lessons/02-tokenization.html",        "module": "Module 1 · Foundations"},
    {"key": "03",    "label": "03 · Word Embeddings",        "file": "lessons/03-embeddings.html",          "module": "Module 1 · Foundations"},
    {"key": "04",    "label": "04 · The Sequence Problem",   "file": "lessons/04-the-problem.html",         "module": "Module 2 · Attention"},
    {"key": "05",    "label": "05 · Attention Mechanism",    "file": "lessons/05-attention.html",           "module": "Module 2 · Attention"},
    {"key": "06",    "label": "06 · Self-Attention",         "file": "lessons/06-self-attention.html",      "module": "Module 2 · Attention"},
    {"key": "07",    "label": "07 · Multi-Head Attention",   "file": "lessons/07-multihead-attention.html", "module": "Module 2 · Attention"},
    {"key": "08",    "label": "08 · Positional Encoding",    "file": "lessons/08-positional-encoding.html", "module": "Module 3 · Architecture"},
    {"key": "09",    "label": "09 · The Encoder",            "file": "lessons/09-encoder.html",             "module": "Module 3 · Architecture"},
    {"key": "10",    "label": "10 · The Decoder",            "file": "lessons/10-decoder.html",             "module": "Module 3 · Architecture"},
    {"key": "11",    "label": "11 · Full Transformer & LLMs","file": "lessons/11-full-transformer.html",    "module": "Module 4 · Modern LLMs"},
]

LESSON_KEYS  = [l["key"]   for l in LESSONS]
LESSON_LABELS = [l["label"] for l in LESSONS]

# ── SESSION STATE ─────────────────────────────────────────────────────────────
if "page" not in st.session_state:
    st.session_state.page = "home"

# Handle URL query params for direct linking
qp = st.query_params
if "lesson" in qp and qp["lesson"] in LESSON_KEYS:
    st.session_state.page = qp["lesson"]

# ── HTML PROCESSOR ────────────────────────────────────────────────────────────
def build_html(lesson: dict) -> str:
    """Read an HTML lesson file and return a self-contained HTML string."""
    path = BASE / lesson["file"]
    if not path.exists():
        return f"<p>File not found: {lesson['file']}</p>"

    html = path.read_text(encoding="utf-8")

    # 1. Inline CSS (replace <link> tag)
    html = re.sub(
        r'<link[^>]+styles\.css[^>]*>',
        f"<style>\n{CSS}\n/* ── Streamlit overrides ── */\n"
        "body { background: #080818; overflow-x: hidden; }\n"
        ".lesson-layout { min-height: unset; }\n"
        ".sidebar, .sidebar-toggle, .lesson-topbar, .lesson-progress-bar { display: none !important; }\n"
        ".lesson-content { margin-left: 0 !important; max-width: 100% !important; }\n"
        ".lesson-body { padding: 1.5rem 1.25rem 3rem; max-width: 820px; margin: 0 auto; }\n"
        "</style>",
        html,
        flags=re.IGNORECASE,
    )

    # 2. Inline JS files
    html = re.sub(
        r'<script\s+src="[^"]*app\.js[^"]*"[^>]*>\s*</script>',
        f"<script>\n{APP_JS}\n</script>",
        html,
        flags=re.IGNORECASE,
    )
    html = re.sub(
        r'<script\s+src="[^"]*visualizations\.js[^"]*"[^>]*>\s*</script>',
        f"<script>\n{VIZ_JS}\n</script>",
        html,
        flags=re.IGNORECASE,
    )

    # 3. Intercept lesson href clicks → postMessage → Streamlit
    #    Replace lesson links with javascript:postMessage calls
    def replace_href(m):
        href = m.group(1)
        # Resolve lesson key from filename
        for l in LESSONS:
            if l["file"].endswith(href) or l["file"] == href or \
               href.endswith(l["file"].split("/")[-1]):
                return f'href="#" onclick="window.parent.postMessage({{type:\'lesson\',key:\'{l[\"key\"]}\'}},\'*\');return false;"'
        if href in ("../index.html", "index.html", "../"):
            return 'href="#" onclick="window.parent.postMessage({type:\'lesson\',key:\'home\'},\'*\');return false;"'
        return m.group(0)  # leave unchanged

    html = re.sub(r'href="([^"#][^"]*\.html)"', replace_href, html)

    # 4. Add postMessage listener script + Streamlit communication
    listener_script = """
<script>
(function() {
  // Listen for postMessage navigation from child → parent is automatic above.
  // Also: intercept all remaining <a> tags with html paths
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href]').forEach(function(a) {
      var h = a.getAttribute('href');
      if (h && h.endsWith('.html') && !h.startsWith('http')) {
        a.addEventListener('click', function(e) {
          e.preventDefault();
          window.parent.postMessage({type:'lesson', href: h}, '*');
        });
      }
    });
  });
})();
</script>
"""
    html = html.replace("</body>", listener_script + "\n</body>")

    return html


# ── SIDEBAR ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown(
        """
        <div style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0 1rem">
          <div style="width:32px;height:32px;background:linear-gradient(135deg,#7c3aed,#06b6d4);
                      border-radius:8px;display:flex;align-items:center;justify-content:center;
                      font-size:1rem;flex-shrink:0">⚡</div>
          <span style="font-weight:700;font-size:0.95rem">Transformer Explained</span>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Module groupings for visual separation
    current_module = None
    for lesson in LESSONS:
        mod = lesson["module"]
        if mod and mod != current_module:
            current_module = mod
            st.markdown(
                f"<p style='font-size:0.68rem;font-weight:700;text-transform:uppercase;"
                f"letter-spacing:0.08em;color:#64748b;margin:0.75rem 0 0.25rem'>{mod}</p>",
                unsafe_allow_html=True,
            )
        is_active = st.session_state.page == lesson["key"]
        btn_style = (
            "background:rgba(124,58,237,0.2);border:1px solid rgba(124,58,237,0.4);"
            "color:#a78bfa;font-weight:600;"
        ) if is_active else ""
        if st.button(
            lesson["label"],
            key=f"nav_{lesson['key']}",
            use_container_width=True,
            help=lesson.get("module"),
        ):
            st.session_state.page = lesson["key"]
            st.query_params["lesson"] = lesson["key"]
            st.rerun()

    st.markdown("---")
    st.markdown(
        "<p style='font-size:0.75rem;color:#64748b;text-align:center'>"
        "Based on \"Attention Is All You Need\" (2017)</p>",
        unsafe_allow_html=True,
    )

# ── MAIN CONTENT ──────────────────────────────────────────────────────────────
# Remove Streamlit default padding
st.markdown(
    "<style>section.main > div { padding-top: 0.5rem !important; } "
    "header { display: none !important; } "
    "footer { display: none !important; }</style>",
    unsafe_allow_html=True,
)

# Find active lesson
active = next((l for l in LESSONS if l["key"] == st.session_state.page), LESSONS[0])

# Build and render the HTML
html_content = build_html(active)

# Render — full height iframe
st.components.v1.html(html_content, height=920, scrolling=True)

# ── JS → Python navigation (postMessage handler) ─────────────────────────────
# Use a hidden component to listen for postMessage events
nav_listener = """
<script>
window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'lesson' && e.data.key) {
        // Communicate to Streamlit via URL param change
        const url = new URL(window.parent.location.href);
        url.searchParams.set('lesson', e.data.key);
        window.parent.history.pushState({}, '', url.toString());
        window.parent.location.reload();
    }
});
</script>
"""
st.components.v1.html(nav_listener, height=0)
