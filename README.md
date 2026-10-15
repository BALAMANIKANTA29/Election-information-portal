# 🇮🇳 Indian Election Information Portal

A non-partisan, neutral civic voting platform designed to empower citizens with transparent, accessible, and simple information about elections, candidates, political parties, constituencies, and verified policy commitments.

## ✨ Key Features

- **🌐 100% Full-Page Multilingual Support**: Seamless switching between **English (EN)**, **Hindi (HI)**, **Telugu (TE)**, and **Tamil (TA)** across all UI elements, headings, filters, and dynamic candidate/policy datasets.
- **👥 Contesting Candidates**: Comprehensive profiles including verified education, declared assets/wealth, criminal record status, biographies, and direct links to official ECI affidavits.
- **🗳️ Election Schedules & Calendars**: Statutory dates, notification phases, polling days, and counting milestones for Lok Sabha and State Assembly elections.
- **🏛️ Political Parties**: Ideology summaries, party symbols, founding history, and candidate affiliations.
- **📍 Constituencies & Areas**: Assembly and Parliamentary constituency statistics and active nominees.
- **⚖️ Side-by-Side Candidate Comparison**: Neutral side-by-side comparison matrix for educational qualifications, declared wealth, police records, and issue stances.
- **📜 Documented Policy Commitments**: Issue-by-issue policy tracking across Education, Healthcare, Employment, Infrastructure, and Governance with verifiable source citations.
- **🛡️ Statutory Resources & Helpline**: Integrated Model Code of Conduct (MCC) guidelines, 4-step voting instructions, and toll-free **1950** voter helpline assistance.
- **📝 Interactive Citizen Enquiry System**: A live citizen registry powered by SQLite to submit voter queries and view recent submissions.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router 7, Lucide Icons
- **Backend**: Node.js, Express.js REST API
- **Database**: SQLite (Node.js native `DatabaseSync` via `node:sqlite`)
- **Linting & Code Quality**: Oxlint

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Application (Frontend + Backend Concurrently)
```bash
npm run dev:all
```
- **Frontend**: [http://localhost:5173](http://localhost:5173) (or `http://localhost:5174`)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### 3. Individual Service Commands
- Run Frontend only: `npm run dev`
- Run Backend only: `npm run server`
- Run Linter: `npm run lint`
- Build for Production: `npm run build`

---

## 📂 Project Structure

```
├── public/                 # Static assets
├── server/                 # Express backend & SQLite database
│   ├── routes/             # REST API route handlers
│   │   ├── candidates.js
│   │   ├── constituencies.js
│   │   ├── elections.js
│   │   ├── enquiries.js
│   │   ├── parties.js
│   │   ├── policies.js
│   │   └── resources.js
│   ├── db.js               # SQLite schema & automatic seeder
│   └── index.js            # Express server entry point
├── src/
│   ├── components/         # Reusable UI cards, search bars, filter panels
│   ├── context/            # Multilingual state & complete translation maps
│   ├── data/               # Bundled datasets (fallback & offline support)
│   ├── pages/              # Application pages (Home, Candidates, Compare, etc.)
│   ├── services/           # API client layer with automatic offline fallback
│   ├── App.jsx             # Route definitions & layout
│   └── main.jsx            # React root mount
├── package.json
└── vite.config.js          # Vite config with backend API proxy (/api -> :5000)
```

---

## ⚖️ Neutrality Disclaimer
This portal is non-partisan and civic-focused. It does not endorse, rate, rank, or recommend any candidate or political party. All information is sourced directly from publicly accessible government notifications, Election Commission of India (ECI) affidavits, and verified party manifestos.
