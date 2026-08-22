# 🤖 Job Application AI Agent

An autonomous AI Co-Pilot for job seekers that analyzes job postings, calculates ATS match scores, identifies skill gaps, tailors resume bullet points, and generates customized cover letters.

---

## 📁 Repository Structure

```
├── backend/            # FastAPI Python server (Scraper, LLM Matcher & Pipeline)
│   ├── app/            # API Router, Services & Pydantic Schemas
│   ├── alembic/        # Database Migrations
│   └── requirements.txt
│
└── frontend/           # Next.js App Router UI (Tailwind CSS, Framer Motion)
    ├── src/
    │   ├── app/        # Next.js Pages & ApplyAI Design System
    │   ├── components/ # UI Components, Navbar & Tab Views
    │   └── lib/        # API Client Services
    └── package.json
```

---

## ⚡ Quick Start

### 1. Start FastAPI Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or `.venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Start Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.
