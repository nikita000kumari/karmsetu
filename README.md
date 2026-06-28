# KarmSetu 🌉
> **"Skills deserve trust, not just certificates."**

Empower India's informal workforce by creating a trusted digital identity based on demonstrated skills rather than paperwork. Mapped directly to NSDC levels and PMKVY standard checks.

---

## 🚀 Key Features

* **Dual-View Dashboard**: Smartphone preview frame (Worker App) and Desktop Workspace (Employer Portal) side-by-side.
* **Skill DNA**: Interactive visual parameters tracking trade precision, safety practices, speed, problem solving, and communication.
* **AI Vision Skill Assessment**: Live camera diagnostics overlay matching trade-specific guidelines (Electrician, Plumber, Tailor, Carpenter).
* **AI Speech diagnostics**: ChatGPT-style voice interview. Transcribes speech and evaluates safety answers dynamically using Google Gemini API.
* **Cryptographic Passports**: Glassmorphic digital credential card with secure SVG QR code and DigiLocker/Aadhaar verification tags.
* **Employer Directory Console**: Real-time filters (location, trade), full CV generators, and hiring offer triggers.
* **Offline Database Cache**: Toggle offline mode to cache assessment results in local MMKV queues and sync automatically when connection is restored.
* **SQLite Sync Console**: Visual logging feed printing real database queries and transaction outputs.

---

## 🛠️ Setup & Local Development

1. **Clone & Install**:
   ```bash
   git clone https://github.com/nikita000kumari/karmsetu.git
   cd karmsetu
   npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
3. **Open Browser**: Navigate to `http://localhost:5173/`

---

## 🔗 Cloud Backend & AI Integration

Click **Backend Setup** inside the top header to configure:
1. **Firebase Firestore**: Paste your web project config JSON to sync data in real-time across multiple devices.
2. **Google Gemini API**: Paste your API key from Google AI Studio to run real generative AI voice grading!
