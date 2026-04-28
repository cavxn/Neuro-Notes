# NeuroNotes 🧠

> NeuroNotes is a local, offline cognitive-tracking system. It leverages SpaCy NLP and interactive React Flow graphing to automatically extract, cluster, and intelligently resurface insights via dynamic spaced repetition.

![NeuroNotes UI Overview](/frontend/public/favicon.ico) *(Aesthetic placeholder: NeuroNotes)*

---

## 🚀 Key Features

- **Intelligent Offline Processing:** Runs entirely locally using `SpaCy` and `Sumy` NLP. Automatically extracts core insights and concepts from unstructured raw text without needing expensive OpenAI API calls!
- **Cognitive Map Visualization:** Visualizes relationships through an interactive, drag-and-drop 2D graph network using `reactflow`.
- **AI Cognitive Companion:** Features an offline chatbot wrapper that intercepts your input and uses heuristic pattern mapping to search your brain structure for answers, highlighting gaps or missing ideas.
- **Memory Resurfacing Engine:** Features a Spaced-Repetition algorithm that passively identifies chronologically "forgotten" memory graphs, pulling them back into a specialized reviewing queue.
- **Unified Semantic Search:** A globally bound `Cmd+K` palette allows instantaneous retrieval of any specific memory or concept vector across the entire SQLite store.

## 🛠 Tech Stack Core

**Frontend Suite:**
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- Graphics: React Flow, Tailwind CSS, Framer Motion

**Backend Infrastructure:**
- Logic Core: Python FastAPI
- Database Engine: SQLite (Mapped natively to process graph-oriented Nodes/Edges)
- Machine Learning Models: SpaCy English language arrays (`en_core_web_sm`), NLTK Punkt

## 🏁 How to Run

1. Clone up your repository instance.
   ```bash
   git clone https://github.com/cavxn/Neuro-Notes.git
   cd Neuro-Notes
   ```

2. Boot the centralized engine. This script concurrently spins up the FastAPI cluster, establishes internal python dependencies on port 8000, and boots the Next.js visualizer on port 3000.
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. Open `http://localhost:3000` to begin mapping your thoughts!

## 📂 Architecture

- `/backend/` -> Contains API wrappers, graph logic, and SQLite schemas.
- `/frontend/` -> Contains Next.js views, UI glassmorphic styles, and interactive widgets.
- `start.sh` -> System-agnostic concurrent environment bootloader.
