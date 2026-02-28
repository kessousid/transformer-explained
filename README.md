# ⚡ Transformer Explained

> A free, interactive course explaining how Transformer models and Large Language Models work. No math degree required.

**GitHub Pages:** [https://kessousid.github.io/transformer-explained/](https://kessousid.github.io/transformer-explained/)

**Streamlit App:** [https://transformer-explained.streamlit.app](https://transformer-explained.streamlit.app) *(deploy via Streamlit Cloud — see below)*

---

## 📚 Course Overview

11 interactive lessons across 4 modules — from zero to understanding modern LLMs.

### Module 1: Foundations
- Lesson 1: Introduction to Transformers
- Lesson 2: Tokenization
- Lesson 3: Word Embeddings

### Module 2: The Attention Mechanism
- Lesson 4: The Sequence Problem (Why RNNs failed)
- Lesson 5: The Attention Mechanism
- Lesson 6: Self-Attention
- Lesson 7: Multi-Head Attention

### Module 3: The Architecture
- Lesson 8: Positional Encoding
- Lesson 9: The Encoder
- Lesson 10: The Decoder

### Module 4: Modern LLMs
- Lesson 11: The Full Transformer & Modern LLMs

---

## ✨ Features

- 🎯 **Beginner-friendly** — No prior ML knowledge required
- 🎨 **Beautiful dark UI** — Professional AI-themed design
- ⚡ **Interactive visualizations** — Canvas-based diagrams for every concept
- 🧠 **Animated slideshows** — 5–7 slides per lesson with smooth animations
- 📊 **Live demos** — Tokenize your own text, explore embedding spaces, visualize attention
- ✅ **Quizzes** — Knowledge checks after every lesson
- 📈 **Progress tracking** — Your progress is saved locally
- 📱 **Responsive** — Works on mobile and desktop

---

## 🚀 Getting Started

### View locally (static site)
Just open `index.html` in your browser — no server required!

### Run locally (Streamlit)
```bash
pip install streamlit
streamlit run streamlit_app.py
```

### Deploy to Streamlit Cloud (free)
1. Go to **[share.streamlit.io](https://share.streamlit.io)**
2. Sign in with GitHub
3. Click **New app** → select `kessousid/transformer-explained`
4. Main file: `streamlit_app.py`
5. Click **Deploy** → live in ~60 seconds!

### GitHub Pages (already live)
**[https://kessousid.github.io/transformer-explained/](https://kessousid.github.io/transformer-explained/)**

---

## 🗂️ Project Structure

```
/
├── index.html              # Landing page
├── README.md
├── css/
│   └── styles.css          # Complete design system (~600 lines)
├── js/
│   ├── app.js              # Navigation, slideshow, quiz, progress
│   └── visualizations.js   # Canvas-based interactive diagrams
└── lessons/
    ├── 01-introduction.html
    ├── 02-tokenization.html
    ├── 03-embeddings.html
    ├── 04-the-problem.html
    ├── 05-attention.html
    ├── 06-self-attention.html
    ├── 07-multihead-attention.html
    ├── 08-positional-encoding.html
    ├── 09-encoder.html
    ├── 10-decoder.html
    └── 11-full-transformer.html
```

---

## 🧠 Concepts Covered

| Concept | Description |
|---|---|
| Tokenization | How text is split into tokens (BPE) |
| Embeddings | Dense vector representations of tokens |
| Attention | Q, K, V mechanism — the core innovation |
| Self-Attention | How sequences attend to themselves |
| Multi-Head Attention | Parallel attention heads for richer understanding |
| Positional Encoding | Sinusoidal encoding of word order |
| Encoder | Reading and understanding input |
| Decoder | Auto-regressive text generation |
| LLM Variants | BERT (encoder-only), GPT (decoder-only), T5 (enc-dec) |

---

## 🔬 Based On

- **"Attention Is All You Need"** — Vaswani et al., 2017 ([arxiv](https://arxiv.org/abs/1706.03762))
- The original GPT, BERT, and T5 papers
- Anthropic's and OpenAI's public research

---

## 📄 License

MIT — Free to use, share, and modify.

---

*Built for AI learners everywhere. If this helped you, ⭐ star the repo!*
