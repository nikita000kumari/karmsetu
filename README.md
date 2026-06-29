# KarmSetu — Skills deserve trust, not just certificates.

> **"A worker's future should be decided by what they can do, not by the certificates they couldn't afford to earn."**

KarmSetu is an offline-first digital skill verification platform built for India's informal workforce. Instead of relying on certificates, workers demonstrate their skills through practical tasks and receive a verified digital Skill Passport that employers can trust.

👉 **Live Demo Portal URL**: [https://nikita000kumari.github.io/karmsetu/](https://nikita000kumari.github.io/karmsetu/)

---

## ⚡ The Problem

* **450M+** Informal Workers in India
* **80%+** Lack formal documentation or certificates
* **Thousands** Miss out on higher-paying employment and formal credit daily

Millions of skilled carpenters, plumbers, electricians, and tailors possess years of practical experience but struggle to access formal job markets. Without physical paper credentials, they are locked out of higher-paying contracts, formal credit, and social security.

---

## ⚖️ Why Current Hiring Fails

| Traditional Hiring | KarmSetu |
| :--- | :--- |
| **Resume** | Practical Skill Demo |
| **Certificates** | AI Skill Verification |
| **Manual Interviews** | Voice Assessment |
| **Paper Documents** | Digital Skill Passport |
| **Internet Required** | Offline-first |

---

## 💡 Our Solution

KarmSetu bridges this gap by creating a digital Skill Passport using on-device tests, voice checks, and offline syncing.

1. **Practical Demonstration**: Workers film a short video performing a standard trade task.
2. **AI Analysis & Feedback**: The platform detects workflow patterns, tool grips, and safety practices.
3. **Voice Interview**: A quick local-language safety follow-up checks vocational concepts.
4. **Digital Skill Passport**: Generated instantly, containing verifiable skill ratings and badges.
5. **Secure Scanning**: Employers scan the passport QR code to confirm credentials on-site.

---

## ⚙️ How KarmSetu Works

```
Worker
  ↓
Video Recording
  ↓
Local Storage (SQLite)
  ↓
Sync Engine
  ↓
Firebase
  ↓
Gemini Analysis
  ↓
Skill Passport
  ↓
Employer Verification
```

---

## 📈 How the Trust Score is Generated

Employers need a clear reason to trust a worker's score. KarmSetu calculates the rating transparently:

* **40% Practical Demonstration**: AI analysis of tool safety, alignment, and execution.
* **30% Voice Assessment**: Verification of safety procedures in the worker's native language.
* **20% Experience Logs**: Self-reported work history, duration, and reference check ledger.
* **10% Community Verification**: Peer signatures and contractor feedback ratings.

---

## 🚀 Core Features

*   **📹 Skill Assessment**: Workers record a 5-second video demonstration. AI analyzes the recorded task to identify tools, workflow, and basic safety practices.
*   **🎤 Voice Interview**: Voice-based assessment in the worker's preferred language. Gemini provides structured feedback and identifies visible workflow patterns.
*   **📄 Skill Passport**: Instantly generated digital passport containing trust scores, verified skill badges, and past project links.
*   **📷 QR Verification**: Employers scan a worker's QR code on any device without installing an app to pull real-time verification logs.
*   **📶 Offline Support**: Assessments work fully offline using a local SQLite sync engine, syncing to Firebase automatically when internet connectivity returns.
*   **🌍 Regional Languages**: Complete onboarding in Hindi, Bengali, Tamil, Telugu, and Marathi to eliminate literacy barriers.

---

## 🛠️ Tech Stack

*   **AI**: Gemini, Speech Recognition, Computer Vision
*   **Backend**: Firebase
*   **Mobile**: React Native
*   **Storage**: SQLite

---

## 📁 Repository Folder Structure

```text
karmsetu/
├── dist/                # Production distribution builds
├── src/
│   ├── assets/          # Project screenshot assets
│   ├── App.css          # Premium responsive styling sheet
│   ├── App.jsx          # Primary workspace portal & interactive landing
│   ├── main.jsx         # React application entry point
│   └── index.css        # Core layout resets and variables
├── index.html           # Main HTML container layout
├── package.json         # Build dependencies and commands registry
└── README.md            # Premium repository documentation
```

---

## ⚙️ Installation & Setup

To run the codebase workspace locally:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/nikita000kumari/karmsetu.git
    cd karmsetu
    ```

2.  **Install Node Dependencies**:
    ```bash
    npm install
    ```

3.  **Start Local Dev Server**:
    ```bash
    npm run dev
    ```

4.  **Run Production Compilation Build**:
    ```bash
    npm run build
    ```

---

## 🔮 Roadmap

*   [x] Mobile number verification (Demo Mode)
*   [x] Camera skill assessment video analysis simulation
*   [x] Skill Passport QR verification mapping
*   [ ] Direct integration with NSDC Skill India portal credentials
*   [ ] Micro-lending bank portal mapping for certified passport holders
*   [ ] Insurance policy underwriting based on verified Safety badges

---

## 🤝 Team & Contributors

*   **Nikita Kumari** (Lead Developer & Co-Founder) — specialized in React interfaces, SQLite syncing, and Gemini model pipelines.
