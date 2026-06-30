# KarmSetu — Skills deserve trust, not just certificates.

> **"A worker's future should be decided by what they can do, not by the certificates they couldn't afford to earn."**

Millions of skilled carpenters, plumbers, electricians, and tailors in India possess years of practical experience but struggle to access formal job markets. Without physical paper credentials, they are locked out of higher-paying contracts, formal credit, and social security.

KarmSetu bridges this gap by helping informal workers build a trusted digital skill identity based on demonstrated work rather than paperwork. Workers film a short video of themselves performing standard trade drills, which our verification engine parses for tool compliance and safety habits to generate a verified, swipeable **Skill Passport** that employers can scan on-site.

👉 **Live Interactive Portal**: [https://nikita000kumari.github.io/karmsetu/](https://nikita000kumari.github.io/karmsetu/)

---

## 🎨 Interactive Client App Simulation

To give judges and mentors a direct preview of the mobile client experience, we have built an **Interactive Smartphone Simulator** directly inside our live portal.

Rather than clicking through a static sequence of forms, you can select any of the **18 client screens** in the **Developer Control Panel** to jump directly to any state of the application.

### Mapped Mobile Screens (1 to 18)
1. **01 Splash Screen**: Centered logo connection loader (2s auto-timer transition).
2. **02 Onboarding 1**: Skill recognition pitch with trade task illustrations.
3. **03 Onboarding 2**: Practical verification over physical certificates illustration.
4. **04 Onboarding 3**: "Show your work. We'll help prove it" onboarding call-to-action.
5. **05 Language Selection**: Support for regional dialects (Hindi, English, Tamil, Bengali, Marathi, Telugu).
6. **06 Phone Login**: Minimalist credential input with country code prefix `+91`.
7. **07 OTP Verification**: Demo bypass code container (accepts code `4821` to log in).
8. **08 Home Dashboard**: Ravi Kumar's electrician feed showing Trust Score (92%), trade tier, and next required drills.
9. **09 Choose Trade**: Assessment list mapping trade rules (Electrician, Plumber, Carpenter, Tailor, Mason).
10. **10 Camera Viewfinder**: Simulated recording stream with rule targets, safety crops, and 5s drill countdown.
11. **11 AI Analysis**: Visual analysis frame checker running diagnostics checklist logs.
12. **12 AI Diagnostic Report**: Grade score, highlighted trade strengths, and recommended improvements.
13. **13 Voice Interview**: ChatGPT-style speech responder with voice waveforms and simulated voice-to-text typing.
14. **14 Skill Passport**: Apple Wallet-style digital passport showing verified tags, score, and central registry QR.
15. **15 Scanner Simulator**: Camera overlay viewfinder designed to scan worker QR codes.
16. **16 Employer View**: Scanned worker profile diagnostic summary with audit logs playback and "Hire" actions (confetti feedback).
17. **17 Worker Profile**: Avatar, verified credentials shelf, language selections, and past drills history.
18. **18 System Settings**: Settings panel supporting Dark Mode and offline database toggles.

---

## ⚙️ How the Trust Score is Calculated

Employers need a clear reason to trust a worker's score. KarmSetu calculates the rating transparently:

* **40% Practical Demonstration**: AI analysis of tool safety, alignment, and execution.
* **30% Voice Assessment**: Verification of safety procedures in the worker's native language.
* **20% Experience Logs**: Self-reported work history, duration, and reference check ledger.
* **10% Community Verification**: Peer signatures and contractor feedback ratings.

---

## 🛠️ Engineering Architecture

The platform runs on a robust offline-first synchronization architecture connecting local app states to remote servers.

### System Diagram

```text
+----------------------- CLIENT APP (Phone) -----------------------+
|                                                                  |
|   [1. Camera Drill]  -->  [2. Voice Check]  -->  [3. Passport]   |
|           |                       |                   ^          |
|           v                       v                   |          |
|   +---------------+       +---------------+           |          |
|   | SQLite Log    |       | Speech-to-Text|           |          |
|   | Buffer Queue  |       | Engine        |           |          |
|   +---------------+       +---------------+           |          |
|           |                       |                   |          |
+-----------|-----------------------|-------------------|----------+
            | (Auto Sync)           | (JSON API)        |
            v                       v                   |
+---------------------- CLOUD SERVICES ----------------------------+
|           |                       |                   |          |
|           v                       v                   |          |
|   +---------------+       +---------------+           |          |
|   | Firestore DB  |       | Gemini API    |           |          |
|   | Registry      |       | Trade Grades  | ----------+          |
|   +---------------+       +---------------+                      |
+------------------------------------------------------------------+
```

### Sync Pipeline: SQLite ➔ Firestore
When workers record an assessment offline, data is queued inside a local SQLite transaction log. The sync engine registers custom events (`SQL: INSERT INTO assessments...`) and pushes them to Firestore as soon as internet connectivity is detected.

---

## 💻 Local Installation & Run Guide

To run the client codebase and developer workspace locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/nikita000kumari/karmsetu.git
   cd karmsetu
   ```

2. **Install Node Dependencies**:
   ```bash
   npm install
   ```

3. **Start Local Dev Server**:
   ```bash
   npm run dev
   ```

4. **Compile Production Bundle**:
   ```bash
   npm run build
   ```

---

## 🔮 Implementation Roadmap

* [x] **Splash & Authentication**: Minimal connection loader, regional language cards, and simulated OTP bypass gate.
* [x] **Worker Portal**: Home dashboard, trade checklists, and interactive metric dials.
* [x] **AI Verification**: Computer vision tools tracking safety drills, checklist status processing, and voice safety waveforms.
* [x] **Skill Passport**: Apple Wallet-style digital identity card with interactive Skill DNA gauges and holographic profile indicators.
* [x] **Employer Scanning**: Dynamic QR scanning simulation, verified diagnostic playback audit logs, and contract hiring options with confetti metrics.
* [x] **Visual Design Sandbox**: Centralized controller to preview all screens, along with live Dark Mode and offline database toggles.
* [x] **Landing Portal**: Premium 8-step conversion homepage mapped around user pain points and system architecture.
* [ ] Integrate direct credentials sync to Skill India (NSDC) registries.
* [ ] Implement micro-lending API bindings for certified passport holders.

---

## 🤝 Team & Contributors

* **Nikita Kumari** (Lead Developer & Creator) — specialized in React client interfaces, SQLite sync pipelines, and LLM orchestration.
