# KarmSetu — Skills deserve trust, not just certificates.

> **"A worker's future should be decided by what they can do, not by the certificates they couldn't afford to earn."**

Millions of skilled carpenters, plumbers, electricians, and tailors in India possess years of practical experience but struggle to access formal job markets. Without physical paper credentials, they are locked out of higher-paying contracts, formal credit, and social security.

KarmSetu bridges this gap by helping informal workers build a trusted digital skill identity based on demonstrated work rather than paperwork. Workers film a short video of themselves performing standard trade drills, which our verification engine parses for tool compliance and safety habits to generate a verified, swipeable **Skill Passport** that employers can scan on-site.

👉 **Live Interactive Portal**: [https://nikita000kumari.github.io/karmsetu/](https://nikita000kumari.github.io/karmsetu/)

---

## 🎨 Interactive Client App Simulation

To give judges and mentors a direct preview of the mobile client experience, we have built an **Interactive Smartphone Simulator** directly inside our live portal.

Rather than clicking through a static sequence of forms, you can select any of the **8 core client screens** in the **Developer Control Panel** to jump directly to any step of the end-to-end verification journey.

### Mapped Mobile Simulator Screens (1 to 8)
1. **01 Login & OTP (Authentication)**: Support for regional language selection cards, phone login prefix inputs, and bypass code bypassing (uses code `4821` to simulate).
2. **02 Home Dashboard (Home)**: Ravi Kumar's workspace metric feed displaying global trust score (92%), trade credentials shelf, and required safety verification tasks.
3. **03 Choose Trade (Trade Selection)**: Drill listing panel mapping active trade rules (Electrician, Plumber, Tailor, Carpenter, Mason).
4. **04 Camera Viewfinder (Camera & Capturing)**: Active video camera capture guide mockup overlay highlighting safety checklist drills.
5. **05 AI Result & Report (Gemini Diagnostics)**: Real-time status diagnostics loading sequences parsing candidate strengths, observations, recommended safety improvements, and confidence scores.
6. **06 Skill Passport (Wow Screen)**: Apple Wallet-style holographic identity card showing verified safety compliance meters and central registry secure QR tags.
7. **07 Employer Verify (QR Verification)**: SECURE QR scanning overlay retrieval matching diagnostic audit playback checklists and dispatch contract hiring callbacks.
8. **08 Profile & Settings (Polish & Sync Console)**: Settings manager control panels with dark theme overrides and offline SQLite synchronization log toggles.

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

* [x] **Expo setup & Base Navigation** — Set up app shell routing, theme typography tokens, outline buttons, and core card components.
* [x] **Authentication Flow** — Build regional language selections and passwordless phone verification using demo OTP bypass overrides.
* [x] **Home & Trade Selection Dashboard** — Implement active dashboard listings to review next required safety tasks for candidate trade categories.
* [x] **Camera & Capture Viewfinder** — Establish active overlay lines showing safety bounding box guides and recording cues.
* [x] **Gemini AI Diagnostic parsing** — Connect prompts to return structured candidate evaluations covering strengths, observations, safety recommendations, and confidence ratings.
* [x] **Premium Skill Passport (Wow Card)** — Style Apple Wallet holographic identity badges presenting verified Trust Score DNA parameters.
* [x] **Employer QR Verification** — Code secure scanner matching loops, verified drill logs review, and dispatch callbacks.
* [x] **Polish & Offline SQLite synchronization** — Add dark theme switches and local transaction database sync console feeds.

---

## 🤝 Team & Contributors

* **Nikita Kumari** (Lead Developer & Creator) — specialized in React client interfaces, SQLite sync pipelines, and LLM orchestration.
