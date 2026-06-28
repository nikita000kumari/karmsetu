# KarmSetu — Skills deserve trust, not just certificates.

KarmSetu is a secure, offline-first digital trust protocol designed to empower India's informal workforce. By replacing paper-based credentials with live skill evidence, verified biometric e-KYC, and spoken dialect assessments, KarmSetu builds a reliable pathway connecting tradesmen directly to infrastructure jobs.

👉 **Live Demo Portal URL**: [https://nikita000kumari.github.io/karmsetu/](https://nikita000kumari.github.io/karmsetu/)

---

## ⚡ The Problem

Over **450 million informal workers** in India possess years of practical, on-the-job vocational experience but lack formal ITI certifications or paper degrees. Consequently, they are locked out of higher-paying contracts, formal credit loops, and social insurance, while construction builders waste days manually vetting skills on-site.

## 💡 The Solution

KarmSetu bridges this gap by issuing tamperproof digital **Skill Passports** mapped directly to National Skill Development Corporation (NSDC) frameworks. Workers prove their skills by recording a short video drill and completing a spoken dialect safety test. The platform evaluates their technique, validates their Aadhaar e-KYC, and generates a verified profile with a QR code that employers can scan to instantly inspect audit logs and confirm hiring.

---

## 🚀 Core Features

*   **📹 AI Skill Assessment**: Worker films a 5-second camera drill. Edge coordinate inspection checks safety gear compliance and correct tool alignment patterns.
*   **🎤 Spoken Voice Interview**: AI reads follow-up safety questions aloud. Workers answer verbally in regional dialects; the response is transcribed and graded.
*   **📄 Verified Skill Passport**: A digital identity containing verified badges, trust index scorecards, and practical project performance registries.
*   **📷 QR Verification**: Employers scan the passport QR code to instantly verify workers on-site without needing to download any app.
*   **📶 Offline-First Support**: Local SQLite sync database stores all assessment logs and transcripts in low-connectivity areas, syncing to Firestore when internet returns.

---

## 🛠️ Tech Stack

*   **Frontend Mobile**: React Native / Expo (Android & iOS)
*   **Web Portal**: React 18 / Vite / Vanilla CSS (Modern premium dark themes)
*   **Cloud Database**: Firebase Firestore (Real-time syncing)
*   **Local Database**: SQLite Synchronization Engine (Offline-first data buffers)
*   **AI Engine**: Google Gemini 1.5 Pro/Flash APIs (Spoken safety grader)
*   **Identity Layer**: UIDAI Aadhaar e-KYC API bindings

---

## 📐 System Architecture

```text
       +---------------------------------------------+
       |           React Native Mobile Client        |
       |  (Webcam viewfinder, Voice speech inputs)   |
       +---------------------+-----------------------+
                             |
                   (Local SQLite Sync Offline)
                             |
                             v
       +---------------------+-----------------------+
       |            KarmSetu Cloud Core              |
       +-------+---------------------+---------------+
               |                     |
               v                     v
       +-------+-------+     +-------+-------+
       |   Firebase    |     | Google Gemini |
       |   Firestore   |     |   1.5 Flash   |
       | (Remote Sync) |     | (Voice Grader)|
       +---------------+     +---------------+
```

---

## 📁 Repository Folder Structure

```text
karmsetu/
├── dist/                # Production distribution builds
├── src/
│   ├── App.css          # Premium responsive styling sheet
│   ├── App.jsx          # Primary workspace portal & interactive landing
│   ├── main.jsx         # React application entry point
│   └── index.css        # Core layout resets and variable variables
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

## 🔮 Future Roadmap

*   [x] Aadhaar e-KYC Verification Onboarding flow
*   [x] AI Video camera assessment simulation coordinates
*   [x] Skill Passport QR verification mapping
*   [ ] Direct integration with NSDC Skill India portal credentials
*   [ ] Micro-lending bank portal mapping for certified passport holders
*   [ ] Insurance policy underwriting based on verified Safety badges

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## 🤝 Contributors

*   **Nikita Kumari** (Lead Developer & Co-Founder) — specialized in React interfaces, SQLite syncing, and Gemini model pipelines.
