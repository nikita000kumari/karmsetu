import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, CheckCircle, Video, Mic, Briefcase, Award, Search, Users, QrCode, 
  MapPin, Star, ArrowRight, Check, AlertCircle, X, Activity, Server, Settings, 
  Key, Database, Play, Download, Sun, Moon, ChevronDown, ChevronUp, FileText,
  User, CheckCircle2, Lock, Plus, Upload, BookOpen, Trash, LogOut, Compass, Info,
  Smartphone, Code, HelpCircle, HardDrive, Globe, AlertTriangle
} from 'lucide-react';

// Firebase imports
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, updateDoc, collection } from 'firebase/firestore';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

import './App.css';

// SVG logo of KarmSetu: Bridge forming "K"
const LogoSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '34px', height: '34px' }}>
    <path d="M25 15 C25 15, 25 35, 25 50 C25 65, 25 85, 25 85 H35 C35 70, 35 60, 35 50 C35 40, 35 30, 35 15 H25 Z" fill="#1E40AF" />
    <path d="M15 85 C15 65, 25 45, 50 45 C75 45, 85 65, 85 85 H73 C73 70, 65 57, 50 57 C35 57, 27 70, 27 85 H15 Z" fill="#1E40AF" />
    <path d="M50 45 L78 17 H92 L57 52 Z" fill="#10B981" />
    <path d="M50 57 L80 85 H94 L57 50 Z" fill="#F59E0B" />
    <circle cx="85" cy="17" r="5" fill="#F59E0B" />
  </svg>
);

// SVG Github Icon
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const TRADE_SHOWCASE = {
  Electrician: {
    checks: "Wiring, MCB switches, Multimeter diagnostics",
    vision: "Verifies insulated gloves, tool handles, wire color striping",
    voice: "Grades distribution box MCB shutdown and parallel wire safety checklist",
    confidence: "94%"
  },
  Plumber: {
    checks: "Teflon joints, pressure gauge checks, pipe layouts",
    vision: "Verifies Teflon tape winding directions and leak gauge stability",
    voice: "Grades pressure gauge tests and PPR water pipe connection guidelines",
    confidence: "92%"
  },
  Tailor: {
    checks: "Draft alignment, stitching lines, machine settings",
    vision: "Checks fabric pattern matching and stitch straightness coordinates",
    voice: "Grades pattern layout matches and sewing thread tension presets",
    confidence: "89%"
  },
  Carpenter: {
    checks: "Timber measurements, chisel angles, wood joints",
    vision: "Verifies square ruler angles and mortise-and-tenon joints alignment",
    voice: "Grades timber moisture levels check and joint prep safety guidelines",
    confidence: "91%"
  }
};

const QUESTION_BANKS = {
  Electrician: [
    {
      q: "Distribution Box: What is the first safety action you take before stripping wire inside a distribution panel?",
      keywords: ["power off", "mains", "mcb", "voltage", "tester", "gloves", "mains switch"]
    }
  ],
  Plumber: [
    {
      q: "Leaks: What precaution do you take before assembling a threaded pipe joint to prevent micro leaks?",
      keywords: ["teflon", "tape", "sealant", "thread", "clean", "grease", "tighten"]
    }
  ],
  Tailor: [
    {
      q: "Fabric Prep: Why is it important to pre-wash linen or heavy cotton fabrics before patterns are drafted?",
      keywords: ["shrink", "shrinkage", "size", "iron", "measure", "fit", "stretch"]
    }
  ],
  Carpenter: [
    {
      q: "Timber Check: How do you identify if a teak plank has excessive moisture content before planning joints?",
      keywords: ["moisture meter", "weight", "warp", "dry", "humidity", "crack"]
    }
  ]
};

const INITIAL_WORKERS = [
  {
    id: 'ravi-kumar',
    name: 'Ravi Kumar',
    phone: '9876543210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    skill: 'Electrician',
    experience: '5 Years',
    location: 'Dwarka, New Delhi',
    trustScore: 89,
    language: 'Hindi',
    skillsDNA: { precision: 92, safety: 88, problemSolving: 81, speed: 90, communication: 76 },
    verifiedSkills: ['Wiring & Connections', 'MCB Configuration', 'Visual Junction Check', 'Safety Standards Mapping'],
    level: 'Gold',
    badges: ['Safety Champion', 'Fast Learner'],
    videoUrl: 'simulated_wiring_assessment',
    voiceTranscript: 'I ensure the main circuit breaker is switched off and lock it. I test the wire with a voltage tester before I strip any insulation. I always wear insulated rubber sole shoes and work gloves.',
    achievements: [
      { name: 'Safety Champion', desc: 'No assessment infractions' },
      { name: 'Fast Learner', desc: 'Completed voice exam on first try' }
    ]
  },
  {
    id: 'arjun-singh',
    name: 'Arjun Singh',
    phone: '9911223344',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    skill: 'Plumber',
    experience: '7 Years',
    location: 'Noida, Uttar Pradesh',
    trustScore: 94,
    language: 'Hindi',
    skillsDNA: { precision: 95, safety: 92, problemSolving: 90, speed: 86, communication: 88 },
    verifiedSkills: ['PPR Fitting', 'Leak Detection', 'Drainage Design', 'Pressure Testing'],
    level: 'Master',
    badges: ['Precision Expert', '100 Jobs'],
    videoUrl: 'simulated_leak_assessment',
    voiceTranscript: 'First, locate the main shut-off valve. Then, clear the pipes by opening the lowest faucet in the house. I always use Teflon tape on threads to ensure no micro leaks exist.',
    achievements: [
      { name: 'Precision Expert', desc: '95%+ precision score' },
      { name: '100 Jobs', desc: 'Completed 100+ tasks' }
    ]
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    phone: '9812345678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    skill: 'Tailor',
    experience: '4 Years',
    location: 'Gurugram, Haryana',
    trustScore: 86,
    language: 'English',
    skillsDNA: { precision: 90, safety: 85, problemSolving: 78, speed: 92, communication: 80 },
    verifiedSkills: ['Pattern Drafting', 'Fabric Layout', 'Seam Stitching', 'Measurement accuracy'],
    level: 'Silver',
    badges: ['Fast Learner'],
    videoUrl: 'simulated_tailoring_assessment',
    voiceTranscript: 'Before cutting the fabric, I double check all measurements on my sheet. I match patterns when laying out pieces, and make sure the sewing machine tension is set correctly for the fabric weight.',
    achievements: [
      { name: 'Fast Learner', desc: 'Scored 92% speed on first try' }
    ]
  }
];

const INITIAL_QUALIFICATIONS = [
  { id: 'qual-1', name: 'Aadhaar e-KYC Identity Verification', body: 'UIDAI', code: 'AADH-9821-DEL', status: 'verified' },
  { id: 'qual-2', name: 'PMKVY Vocational Wireman Grade II', body: 'NSDC India', code: 'NSDC-L4-WIRING', status: 'verified' }
];

export default function App() {
  // Theme state
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('karmsetu_theme') || 'dark';
  });

  // User role flow state: none | employer | worker
  const [userRole, setUserRole] = useState('none');
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState('worker'); // worker | employer

  // MVP Worker Flow wizard state: choose_trade | record_video | video_processing | voice_question | passport_generated
  const [workerFlowStep, setWorkerFlowStep] = useState('choose_trade');

  // Selected trade for the worker during signup
  const [workerSelectedTrade, setWorkerSelectedTrade] = useState('Electrician');

  // Employer active tab: directory | stats
  const [employerActiveTab, setEmployerActiveTab] = useState('directory');

  // Interactive UI Preview slide state: home | assessment | passport | settings
  const [uiPreviewSlide, setUiPreviewSlide] = useState('home');

  // Selected trade for landing page showcase
  const [showcaseTrade, setShowcaseTrade] = useState('Electrician');

  // Login variables
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');

  // Qualification list
  const [qualList, setQualList] = useState(INITIAL_QUALIFICATIONS);

  // Search/Filters Candidates Directory
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrade, setFilterTrade] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');

  // Selected Candidate (Employer dashboard view)
  const [workers, setWorkers] = useState(() => {
    try {
      const saved = localStorage.getItem('karmsetu_workers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3 && parsed.every(w => w.skillsDNA && w.verifiedSkills)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Cache corrupted:", e);
    }
    localStorage.removeItem('karmsetu_workers');
    return INITIAL_WORKERS;
  });
  
  const [selectedWorkerId, setSelectedWorkerId] = useState('ravi-kumar');
  const [hiredWorkerId, setHiredWorkerId] = useState(null);
  const [showResume, setShowResume] = useState(false);

  // QR Code Scanner simulator overlay
  const [qrScannedCandidateId, setQrScannedCandidateId] = useState(null);

  // Cloud backend variables
  const [showConfig, setShowConfig] = useState(false);
  const [firebaseConfigInput, setFirebaseConfigInput] = useState(() => {
    return localStorage.getItem('karmsetu_firebase_config_input') || '';
  });
  const [geminiKey, setGeminiKey] = useState(() => {
    return localStorage.getItem('karmsetu_gemini_key') || '';
  });
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [realSmsActive, setRealSmsActive] = useState(false);

  // SQLite Console logs queue
  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'info', text: 'INFO: Initiated KarmSetu SQLite Sync Engine.' },
    { type: 'query', text: 'SQL: SELECT * FROM workers ORDER BY trustScore DESC;' },
    { type: 'success', text: 'SQL: Loaded 3 verified profiles from cached storage.' }
  ]);
  const [consoleOpen, setConsoleOpen] = useState(false);

  // Video Assessment states
  const [cameraActive, setCameraActive] = useState(false);
  const [recordingState, setRecordingState] = useState('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [processingStages, setProcessingStages] = useState({
    tools: 'waiting',
    safety: 'waiting',
    technique: 'waiting',
    workflow: 'waiting'
  });

  // Voice Interview states
  const [voiceMessages, setVoiceMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceInputText, setVoiceInputText] = useState('');

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const consoleBottomRef = useRef(null);

  // Theme Sync
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('karmsetu_theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    addLog('info', `SYSTEM: Switched UI Theme to: ${nextTheme.toUpperCase()}`);
  };

  // Sync state helpers
  useEffect(() => {
    localStorage.setItem('karmsetu_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  const addLog = (type, text) => {
    setConsoleLogs(prev => [...prev, { type, text }]);
  };

  // Firebase connect
  useEffect(() => {
    if (!firebaseConfigInput) return;
    try {
      const config = JSON.parse(firebaseConfigInput.trim());
      if (config.projectId) {
        localStorage.setItem('karmsetu_firebase_config_input', firebaseConfigInput);
        const app = getApps().length === 0 ? initializeApp(config) : getApp();
        const firestore = getFirestore(app);
        const firebaseAuth = getAuth(app);
        setDb(firestore);
        setAuth(firebaseAuth);
        setRealSmsActive(true);
        addLog('success', `FIREBASE: Connected to project: ${config.projectId}. Real Phone SMS enabled.`);
      }
    } catch (e) {
      addLog('warning', `FIREBASE_ERROR: Invalid config JSON.`);
    }
  }, [firebaseConfigInput]);

  // Firebase sync list
  useEffect(() => {
    if (!db) return;
    addLog('info', 'SQL: Subscribing to Firestore remote workers channel...');
    const unsubscribe = onSnapshot(collection(db, 'workers'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_WORKERS.forEach(async (w) => {
          await setDoc(doc(db, 'workers', w.id), w);
        });
        return;
      }
      const loaded = [];
      snapshot.forEach(docSnap => loaded.push(docSnap.data()));
      setWorkers(loaded);
      addLog('success', `SYNC: Loaded ${loaded.length} profiles from Firestore.`);
    });
    return () => unsubscribe();
  }, [db]);

  const updateWorkerProfile = async (workerId, fields) => {
    if (db) {
      try {
        await updateDoc(doc(db, 'workers', workerId), fields);
        addLog('success', `FIREBASE: Sync document 'workers/${workerId}' updated on Firestore.`);
      } catch (err) {
        setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, ...fields } : w));
        addLog('warning', `FIREBASE_SYNC_FAILED: ${err.message}. Changes saved locally.`);
      }
    } else {
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, ...fields } : w));
      addLog('success', 'SQL: Local state database record updated.');
    }
  };

  const setupRecaptcha = () => {
    if (!auth) return null;
    try {
      const existing = document.getElementById('recaptcha-container');
      if (existing) existing.innerHTML = '';
      
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          addLog('warning', 'AUTH: reCAPTCHA expired. Please try again.');
        }
      });
      return verifier;
    } catch (e) {
      addLog('warning', `AUTH_RECAPTCHA_ERROR: ${e.message}`);
      return null;
    }
  };

  // OTP login triggers (Real SMS with Demo Fallback)
  const handleSendOTP = () => {
    if (!phoneInput || phoneInput.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    if (realSmsActive && auth) {
      const verifier = setupRecaptcha();
      if (verifier) {
        addLog('info', `AUTH: Requesting real SMS OTP via Firebase Auth for +91${phoneInput}...`);
        signInWithPhoneNumber(auth, `+91${phoneInput}`, verifier)
          .then((result) => {
            setConfirmationResult(result);
            setOtpSent(true);
            addLog('success', `SMS_SERVICE: Real OTP dispatched successfully to +91 ${phoneInput}`);
          })
          .catch((err) => {
            addLog('warning', `SMS_FAILED: ${err.message}. Falling back to simulated Demo Mode (OTP: 4821).`);
            setRealSmsActive(false);
            setOtpSent(true);
          });
      } else {
        setOtpSent(true);
        addLog('query', `SMS_SERVICE: Dispatched simulated code to +91 ${phoneInput}`);
      }
    } else {
      setOtpSent(true);
      addLog('query', `SMS_SERVICE: Dispatched simulated code to +91 ${phoneInput}`);
    }
  };

  const handleVerifyOTP = () => {
    if (realSmsActive && confirmationResult) {
      addLog('info', `AUTH: Confirming real SMS OTP code "${otpInput}"...`);
      confirmationResult.confirm(otpInput)
        .then((result) => {
          addLog('success', `AUTH: Successfully verified real mobile +91 ${phoneInput}. Session type: WORKER`);
          setUserRole('worker');
          setWorkerFlowStep('choose_trade');
          setPhoneInput('');
          setOtpInput('');
          setOtpSent(false);
          setConfirmationResult(null);
        })
        .catch((err) => {
          addLog('warning', `AUTH_ERROR: Invalid code. ${err.message}`);
          alert('Incorrect SMS code. Please try again or use Demo Bypass/Quick Skip.');
        });
    } else {
      if (otpInput === '4821') {
        addLog('success', `AUTH: Successfully verified +91 ${phoneInput} via Demo Mode. Session type: WORKER`);
        setUserRole('worker');
        setWorkerFlowStep('choose_trade');
        setPhoneInput('');
        setOtpInput('');
        setOtpSent(false);
      } else {
        alert('Demo OTP code is 4821. (To use a real SMS, connect Firebase under Cloud Setup).');
      }
    }
  };

  const handleEmployerLogin = () => {
    addLog('success', 'AUTH: Employer credentials approved. Session type: EMPLOYER');
    setUserRole('employer');
    setEmployerActiveTab('directory');
  };

  const handleLogout = () => {
    addLog('info', `AUTH: Revoked active session for ${userRole.toUpperCase()}. Redirected to login landing page.`);
    setUserRole('none');
    setShowLogin(false);
    setQrScannedCandidateId(null);
  };

  // Skill Camera diagnostics guidelines
  const getCameraGuidelines = (trade) => {
    switch (trade) {
      case 'Plumber':
        return {
          title: 'Teflon Seam Winding Check',
          desc: 'Verify thread sealing tape overlaps clockwise along pipes.',
          checklist: ['Inspected Teflon wraps', 'Wrench connection fitting', 'Leak detection pressure', 'Gauge bar stability']
        };
      case 'Tailor':
        return {
          title: 'Pattern Seam Alignment',
          desc: 'Measure grainline layout matches sewing templates.',
          checklist: ['Stitch straightness', 'Fabric thread tension', 'Double stitch safety locks', 'Presser foot height']
        };
      case 'Carpenter':
        return {
          title: 'Mortise Tenon Joint Alignment',
          desc: 'Chisel flat vertical alignment check checks out.',
          checklist: ['Tenon flush test', 'Chisel wood grain alignment', 'Square tool accuracy', 'Tape measure validation']
        };
      case 'Electrician':
      default:
        return {
          title: 'Insulated Stripper Cable Diagnostic',
          desc: 'Insulate tools, switch breaker off, and check copper diameter.',
          checklist: ['Insulation cut check', 'Voltage tester check', 'Clamp screw torque', 'Copper core thickness']
        };
    }
  };

  const activeOverlay = getCameraGuidelines(workerSelectedTrade);

  // Video Assessment webcam helpers
  const startCamera = async () => {
    setCameraActive(true);
    setRecordingState('idle');
    setRecordingSeconds(0);
    addLog('info', `HARDWARE: Loading webcam device layer for ${workerSelectedTrade} verification...`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        addLog('success', 'HARDWARE: Media Stream connected.');
      }
    } catch (e) {
      addLog('warning', 'HARDWARE: Webcam device missing or blocked. Activating software diagnostics simulator.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    addLog('info', 'HARDWARE: Released webcam camera lock.');
  };

  const startRecording = () => {
    setRecordingState('recording');
    addLog('query', `SQL: INSERT INTO assessments (trade, type, status) VALUES ('${workerSelectedTrade}', 'video', 'recording');`);
    let secs = 0;
    const interval = setInterval(() => {
      secs++;
      setRecordingSeconds(secs);
      if (secs >= 5) {
        clearInterval(interval);
        finishRecording();
      }
    }, 1000);
  };

  const finishRecording = () => {
    setRecordingState('finished');
    stopCamera();
    setWorkerFlowStep('video_processing');
    simulateAIEngine();
  };

  const simulateAIEngine = () => {
    addLog('info', 'AI_ENGINE: Processing video frames for safety compliance...');
    setProcessingStages({ tools: 'scanning', safety: 'waiting', technique: 'waiting', workflow: 'waiting' });
    
    setTimeout(() => {
      addLog('success', `AI_VISION: Checked: ${activeOverlay.checklist[0]}`);
      setProcessingStages(prev => ({ ...prev, tools: 'done', safety: 'scanning' }));
      
      setTimeout(() => {
        addLog('success', `AI_VISION: Checked: ${activeOverlay.checklist[1]}`);
        setProcessingStages(prev => ({ ...prev, safety: 'done', technique: 'scanning' }));
        
        setTimeout(() => {
          addLog('success', `AI_VISION: Checked: ${activeOverlay.checklist[2]}`);
          setProcessingStages(prev => ({ ...prev, technique: 'done', workflow: 'scanning' }));
          
          setTimeout(() => {
            addLog('success', `AI_VISION: Checked: ${activeOverlay.checklist[3]}`);
            setProcessingStages(prev => ({ ...prev, workflow: 'done' }));
            
            setTimeout(() => {
              addLog('success', 'AI_ENGINE: Verification metrics scores generated.');
              // Instantly initiate follow-up voice interview question
              startVoiceInterview(workerSelectedTrade);
              setWorkerFlowStep('voice_question');
            }, 600);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // Voice AI speech evaluators
  const startVoiceInterview = (trade) => {
    const list = QUESTION_BANKS[trade] || QUESTION_BANKS.Electrician;
    setVoiceMessages([
      { sender: 'ai', text: `Welcome to KarmSetu AI Voice Verification. Let's finish with one follow-up safety question for the ${trade} trade.` },
      { sender: 'ai', text: list[0].q }
    ]);
  };

  const evaluateSpeech = async (question, answer) => {
    if (!geminiKey) {
      addLog('info', 'AI_ENGINE: No Gemini API Key. Running local keyword evaluator.');
      const questions = QUESTION_BANKS[workerSelectedTrade] || QUESTION_BANKS.Electrician;
      let matches = 0;
      questions[0].keywords.forEach(word => {
        if (answer.toLowerCase().includes(word)) matches++;
      });
      return {
        safety: Math.min(84 + (matches * 6), 96),
        communication: 80,
        problemSolving: Math.min(80 + (matches * 7), 94),
        speed: 85,
        feedback: `Transcribed response: "${answer}". Safety requirements checked out. updated scorecard metrics.`
      };
    }

    addLog('query', 'AI_ENGINE: Querying Gemini API...');
    const promptText = `
      Evaluate this candidate response: "${answer}" to this trade question: "${question}".
      Return ONLY a raw JSON block:
      {
        "safety": 92,
        "communication": 80,
        "problemSolving": 88,
        "speed": 85,
        "feedback": "Custom evaluation feedback sentence here."
      }
    `;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      addLog('warning', `AI_ENGINE_ERROR: ${e.message}. Using backup scoring.`);
      return { safety: 88, communication: 80, problemSolving: 85, speed: 85, feedback: 'Grade calculated via backup engine.' };
    }
  };

  const handleVoiceMessageSubmit = async (text) => {
    if (!text.trim()) return;
    const questions = QUESTION_BANKS[workerSelectedTrade] || QUESTION_BANKS.Electrician;
    const newChat = [...voiceMessages, { sender: 'worker', text }];
    setVoiceMessages(newChat);

    const currentQ = questions[0];

    setTimeout(async () => {
      addLog('info', 'AI_ENGINE: Formulating speech test grade summary...');
      const evaluation = await evaluateSpeech(currentQ.q, text);
      
      setVoiceMessages(prev => [...prev, { sender: 'ai', text: evaluation.feedback }]);
      
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(evaluation.feedback));
      }

      // Generate the verified passport card details
      const updatedDNA = {
        precision: 93,
        safety: evaluation.safety,
        problemSolving: evaluation.problemSolving,
        speed: evaluation.speed,
        communication: evaluation.communication
      };
      
      const avgScore = Math.round((evaluation.safety + evaluation.problemSolving + evaluation.communication) / 3);

      updateWorkerProfile('ravi-kumar', {
        skill: workerSelectedTrade,
        trustScore: Math.max(avgScore, 90),
        skillsDNA: updatedDNA,
        verifiedSkills: Array.from(new Set([...workers.find(w => w.id === 'ravi-kumar')?.verifiedSkills || [], `${workerSelectedTrade} Level L4`, 'AI Video Approved']))
      });

      addLog('success', 'SYNC: Generated digital Skill Passport with verified QR code mappings.');
      
      setTimeout(() => {
        setWorkerFlowStep('passport_generated');
      }, 1500);

    }, 1200);
  };

  const toggleMicListener = () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Speech) {
      if (!recognitionRef.current) {
        const rec = new Speech();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-IN';
        rec.onstart = () => setIsListening(true);
        rec.onresult = (e) => {
          const result = e.results[0][0].transcript;
          addLog('info', `SPEECH_RECOGNITION: Transcribed "${result}"`);
          handleVoiceMessageSubmit(result);
        };
        rec.onend = () => setIsListening(false);
        recognitionRef.current = rec;
      }
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        const mockResponses = {
          Electrician: "I switch off the main MCB breaker switches, use test leads to check voltage, and wear heavy rubber gloves.",
          Plumber: "I always use Teflon tape on threads clockwise, clean them, and tighten with a wrench.",
          Tailor: "I pre-wash linen cotton fabrics before pattern drafts to prevent fabric shrinkage.",
          Carpenter: "I check timber moisture with a digital moisture meter and ensure levels are below 12%."
        };
        handleVoiceMessageSubmit(mockResponses[workerSelectedTrade] || mockResponses.Electrician);
        setIsListening(false);
      }, 2500);
    }
  };

  const handleSimulatedQRScan = () => {
    addLog('success', `QR_SCANNER: Successfully scanned Skill Passport. Decoded candidate: ravi-kumar`);
    setUserRole('employer');
    setEmployerActiveTab('directory');
    setSelectedWorkerId('ravi-kumar');
    setQrScannedCandidateId('ravi-kumar');
    setHiredWorkerId(null);
  };

  const handleSaveBackendConfig = (jsonInput, keyInput) => {
    try {
      if (jsonInput) {
        JSON.parse(jsonInput.trim());
        setFirebaseConfigInput(jsonInput);
      }
      setGeminiKey(keyInput);
      localStorage.setItem('karmsetu_gemini_key', keyInput);
      setShowConfig(false);
      addLog('success', 'SYSTEM: Cloud credentials successfully configured.');
    } catch (e) {
      alert('Invalid Firebase Config JSON format.');
    }
  };

  // Filter list
  const filteredList = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = filterTrade === 'All' || w.skill === filterTrade;
    const matchesLoc = filterLocation === 'All' || w.location.includes(filterLocation);
    return matchesSearch && matchesTrade && matchesLoc;
  });

  const selectedWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];
  const raviWorker = workers.find(w => w.id === 'ravi-kumar') || workers[0];

  return (
    <div className="app-container">
      
      {/* HEADER BAR */}
      <header className="main-header">
        <div className="logo-group">
          <LogoSVG />
          <span className="logo-text" style={{ cursor: 'pointer' }} onClick={handleLogout}>
            Karm<span>Setu</span>
          </span>
          <div className="infra-badge">
            <Shield size={12} className="text-blue-500" /> NSDC Trust Mapped
          </div>
        </div>

        {/* Dynamic header options depending on Session role */}
        {userRole === 'employer' && (
          <nav className="nav-tabs">
            <button 
              className={`nav-tab-btn ${employerActiveTab === 'directory' ? 'active' : ''}`}
              onClick={() => setEmployerActiveTab('directory')}
            >
              <Users size={14} /> Candidate Directory
            </button>
            <button 
              className={`nav-tab-btn ${employerActiveTab === 'stats' ? 'active' : ''}`}
              onClick={() => setEmployerActiveTab('stats')}
            >
              <Activity size={14} /> Stats Index
            </button>
          </nav>
        )}

        <div className="header-actions">
          {/* GitHub Header link button */}
          <a 
            href="https://github.com/nikita000kumari/karmsetu" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-outline" 
            style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.75rem', padding: '6px 12px', textDecoration: 'none' }}
          >
            <GithubIcon /> GitHub
          </a>

          <button 
            className={`btn-secondary ${showConfig ? 'active' : ''}`}
            onClick={() => setShowConfig(!showConfig)}
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            <Settings size={13} /> Cloud Setup
          </button>

          <button className="theme-btn" onClick={toggleTheme}>
            {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {userRole !== 'none' && (
            <button className="btn-outline text-red-500" onClick={handleLogout} style={{ display: 'flex', gap: '4px', padding: '6px 12px' }}>
              <LogOut size={13} /> Logout
            </button>
          )}
        </div>
      </header>

      {/* Cloud Configuration panel */}
      {showConfig && (
        <div style={{ backgroundColor: 'var(--color-card)', borderBottom: '1px solid var(--color-border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} /> Connect Firebase Database & Gemini AI API
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                Firebase Config JSON
              </label>
              <textarea 
                placeholder='Paste raw config JSON here: { "apiKey": "...", "projectId": "...", "firestoreDb": "..." }'
                value={firebaseConfigInput}
                onChange={(e) => setFirebaseConfigInput(e.target.value)}
                style={{ width: '100%', height: '90px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px', fontSize: '0.7rem', fontFamily: 'monospace' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                Google Gemini API Key
              </label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '6px 10px', marginBottom: '10px' }}>
                <Key size={14} className="text-amber-500" />
                <input 
                  type="password" 
                  placeholder="Paste Gemini API Key" 
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.75rem', color: 'var(--color-text-primary)' }}
                />
              </div>
              <p style={{ fontSize: '0.68rem', color: 'var(--color-text-light)' }}>
                * Binds credentials inside browser storage. Enable real-time cross-device sync and real generative voice scoring!
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button className="btn-primary" onClick={() => handleSaveBackendConfig(firebaseConfigInput, geminiKey)} style={{ fontSize: '0.75rem' }}>
              Save Credentials
            </button>
            <button className="btn-outline" onClick={() => setShowConfig(false)} style={{ fontSize: '0.75rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* WORKSPACE CONTENT AREA */}
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* ======================================================== */}
        {/* SCREEN 1: Pitch Landing Page                             */}
        {/* ======================================================== */}
        {userRole === 'none' && !showLogin && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            
            {/* HERO SECTION */}
            <section className="landing-hero">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: 'var(--color-primary-light)', padding: '6px 16px', borderRadius: '30px', border: '1px solid var(--color-border)' }}>
                <Smartphone size={14} className="text-blue-600" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)' }}>Worker records camera drill</span>
                <span style={{ color: 'var(--color-text-light)' }}>•</span>
                <QrCode size={14} className="text-amber-600" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-accent)' }}>Employer scans Skill Passport</span>
              </div>

              <h1 className="landing-title">
                Every Skill Deserves Recognition.
              </h1>
              
              <p className="landing-tagline">
                Helping India's informal workforce prove skills through practical demonstrations instead of certificates.
              </p>

              <div className="hero-cta-row">
                <button className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.92rem' }} onClick={() => setShowLogin(true)}>
                  View Prototype <ArrowRight size={16} />
                </button>
                <a 
                  href="https://github.com/nikita000kumari/karmsetu" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-outline" 
                  style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '12px 28px', fontSize: '0.92rem', textDecoration: 'none' }}
                >
                  <GithubIcon /> GitHub
                </a>
              </div>
            </section>

            {/* Meet Ravi Section */}
            <section className="meet-ravi-section">
              <div className="meet-ravi-card">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                  👨‍🔧
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Meet Ravi <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>• Electrician</span>
                  </h4>
                  <div className="ravi-badge-grid">
                    <span className="ravi-badge">10 Years Experience</span>
                    <span className="ravi-badge" style={{ color: 'var(--color-danger)' }}>No Formal Certificate</span>
                    <span className="ravi-badge" style={{ color: 'var(--color-secondary)' }}>KarmSetu Verified</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginTop: '4px' }}>
                    "I had years of experience wiring panels, but larger builders rejected me without papers. With KarmSetu, I filmed my wiring test, answered one safety voice check, got my Skill Passport, and was hired instantly on-site."
                  </p>
                </div>
              </div>
            </section>

            {/* Problem Section */}
            <section className="problem-stats-section">
              <h2 className="landing-section-title">The Problem</h2>
              <p className="landing-section-subtitle">Why traditional credential systems leave millions behind.</p>
              
              <div className="problem-flow-box">
                <div>
                  <div className="problem-stat-huge">450M+</div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Informal Workers</span>
                </div>
                
                <div className="problem-flow-arrow">→</div>
                
                <div className="problem-flow-step">
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-danger)' }}>No Verification</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Most tradesmen have years of experience but no formal certifications.</span>
                </div>
                
                <div className="problem-flow-arrow">→</div>
                
                <div className="problem-flow-step">
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>Locked Out</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>No paper proof means no high-paying jobs, no banking loans, and zero recognition.</span>
                </div>
              </div>
            </section>

            {/* Why Existing Solutions Fail Table */}
            <section className="comparison-section">
              <h2 className="landing-section-title">Why Existing Solutions Fail</h2>
              <p className="landing-section-subtitle">How KarmSetu replaces outdated paper models with live skill evidence.</p>
              
              <div className="comparison-table-wrapper">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Parameters</th>
                      <th>Traditional Certification</th>
                      <th style={{ color: 'var(--color-secondary)' }}>KarmSetu Trust Protocol</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Core Evidence</strong></td>
                      <td>Written Resume (Self-declared)</td>
                      <td style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Live Practical Skill Evidence</td>
                    </tr>
                    <tr>
                      <td><strong>Validation</strong></td>
                      <td>Paper Certificate (Easy to forge)</td>
                      <td style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Real-Time Video Demonstration</td>
                    </tr>
                    <tr>
                      <td><strong>Verification Engine</strong></td>
                      <td>Slow Manual Inspections</td>
                      <td style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>AI Vision & Dialect Diagnostics</td>
                    </tr>
                    <tr>
                      <td><strong>Connectivity</strong></td>
                      <td>Always Online Required</td>
                      <td style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Offline-First Local Database</td>
                    </tr>
                    <tr>
                      <td><strong>Languages</strong></td>
                      <td>English/Hindi Only</td>
                      <td style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Regional Dialect Speech Support</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Solution Visual Flow */}
            <section className="solution-flow-section">
              <h2 className="landing-section-title">The Solution</h2>
              <p className="landing-section-subtitle">A seamless pipeline connecting worker skill verification directly to jobs.</p>
              
              <div className="solution-visual-flow">
                <div className="solution-flow-step-card">
                  <User size={18} className="text-blue-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Worker Signup</span>
                </div>
                <div className="solution-flow-arrow">→</div>
                
                <div className="solution-flow-step-card">
                  <Video size={18} className="text-blue-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Records Video</span>
                </div>
                <div className="solution-flow-arrow">→</div>
                
                <div className="solution-flow-step-card">
                  <Activity size={18} className="text-emerald-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>AI Analysis</span>
                </div>
                <div className="solution-flow-arrow">→</div>
                
                <div className="solution-flow-step-card">
                  <Mic size={18} className="text-amber-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Voice Check</span>
                </div>
                <div className="solution-flow-arrow">→</div>
                
                <div className="solution-flow-step-card">
                  <Award size={18} className="text-blue-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Skill Passport</span>
                </div>
                <div className="solution-flow-arrow">→</div>
                
                <div className="solution-flow-step-card">
                  <QrCode size={18} className="text-amber-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Employer Scan</span>
                </div>
                <div className="solution-flow-arrow">→</div>
                
                <div className="solution-flow-step-card" style={{ border: '1px solid var(--color-secondary)' }}>
                  <Briefcase size={18} className="text-emerald-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Job Hired</span>
                </div>
              </div>
            </section>

            {/* Features Showcase Grid */}
            <section className="features-section">
              <h2 className="landing-section-title">Platform Features</h2>
              <p className="landing-section-subtitle">Engineered specifically for low-connectivity blue-collar labor markets.</p>
              
              <div className="features-card-grid">
                
                <div className="feature-card">
                  <Video size={20} className="text-blue-600" />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>📹 Skill Assessment</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                    Record a 5-second video demonstration. Edge computer vision inspects tool grips, safety attire, and technique compliance.
                  </p>
                </div>

                <div className="feature-card">
                  <Mic size={20} className="text-emerald-600" />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>🎤 Voice Interview</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                    Respond to follow-up safety questions in your local dialect. Speech synthesis grades responses dynamically.
                  </p>
                </div>

                <div className="feature-card">
                  <Award size={20} className="text-amber-600" />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>📄 Skill Passport</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                    Instant creation of digital credentials showing trust ratings, verified badges, and personal experience portfolios.
                  </p>
                </div>

                <div className="feature-card">
                  <QrCode size={20} className="text-blue-600" />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>📷 QR Verification</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                    No app download required for employers. Simply scan the passport QR code to pull verified worker logs from our backend.
                  </p>
                </div>

                <div className="feature-card">
                  <HardDrive size={20} className="text-emerald-600" />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>📶 Offline Support</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                    Assessments work fully offline using a local SQLite sync database. Syncs back to Firebase automatically when internet returns.
                  </p>
                </div>

                <div className="feature-card">
                  <Globe size={20} className="text-amber-600" />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>🌍 Regional Languages</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                    Complete onboarding and tests available in Hindi, Tamil, Telugu, Marathi, and Bengali to eliminate literacy barriers.
                  </p>
                </div>

              </div>
            </section>

            {/* System Architecture */}
            <section className="architecture-section">
              <h2 className="landing-section-title">System Architecture</h2>
              <p className="landing-section-subtitle">How our frontend diagnostics interface communicates with AI models and secure databases.</p>

              <div className="arch-visual-card">
                <div className="arch-stack">
                  
                  <div className="arch-layer">
                    <div className="arch-layer-title">
                      <Smartphone size={14} /> Client Interface
                    </div>
                    <div className="arch-layer-components">
                      <div className="arch-component">React Native Mobile App</div>
                      <div className="arch-component">Web Speech Speech-to-Text API</div>
                      <div className="arch-component">Local Camera View Finder</div>
                    </div>
                  </div>

                  <div className="arch-layer">
                    <div className="arch-layer-title">
                      <Activity size={14} /> AI Engine Layer
                    </div>
                    <div className="arch-layer-components">
                      <div className="arch-component" style={{ borderColor: 'var(--color-accent)' }}>Google Gemini 1.5 Safety Grader</div>
                      <div className="arch-component">OpenCV Coordinate Grid checks</div>
                    </div>
                  </div>

                  <div className="arch-layer">
                    <div className="arch-layer-title">
                      <Database size={14} /> Database & Sync
                    </div>
                    <div className="arch-layer-components">
                      <div className="arch-component">Firebase Firestore Sync</div>
                      <div className="arch-component">SQLite Offline sync</div>
                      <div className="arch-component" style={{ borderColor: 'var(--color-secondary)' }}>UIDAI Aadhaar Verification API</div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* UI Preview phone mockup slider */}
            <section className="ui-preview-section">
              <h2 className="landing-section-title">Product UI Preview</h2>
              <p className="landing-section-subtitle">Toggle through the core mobile screens of the worker app.</p>
              
              <div className="ui-preview-hub">
                
                {/* Left panel selectors */}
                <div className="preview-nav-panel">
                  <button 
                    className={`preview-nav-btn ${uiPreviewSlide === 'home' ? 'active' : ''}`}
                    onClick={() => setUiPreviewSlide('home')}
                  >
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>1. Home Onboarding</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Select trade categories and login</span>
                  </button>

                  <button 
                    className={`preview-nav-btn ${uiPreviewSlide === 'assessment' ? 'active' : ''}`}
                    onClick={() => setUiPreviewSlide('assessment')}
                  >
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>2. Camera Assessment</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Video safety recording checklist</span>
                  </button>
                </div>

                {/* Center Phone Frame */}
                <div className="phone-mockup-frame">
                  <div className="phone-notch"></div>
                  
                  {/* Phone screen contents */}
                  <div className="phone-screen-content">
                    {uiPreviewSlide === 'home' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary)' }}>Choose Trade Category</span>
                        <div style={{ border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px', backgroundColor: 'var(--color-card)' }}>
                          <strong>⚡ Electrician</strong>
                          <p style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>wiring boards and switchbox checks</p>
                        </div>
                        <div style={{ border: '1.5px solid var(--color-primary)', borderRadius: '6px', padding: '8px', backgroundColor: 'var(--color-primary-light)' }}>
                          <strong>🚰 Plumber</strong>
                          <p style={{ fontSize: '0.65rem', color: 'var(--color-primary)' }}>Thread winding pipes and leak gauges</p>
                        </div>
                        <input type="tel" placeholder="Enter Mobile Number" style={{ width: '100%', padding: '6px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--color-border)' }} defaultValue="9876543210" disabled />
                        <button style={{ backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.7rem' }}>Get verification OTP</button>
                      </div>
                    )}

                    {uiPreviewSlide === 'assessment' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', height: '100%' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>Record Skill Assessment</span>
                        <div style={{ flex: 1, backgroundColor: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <span style={{ color: '#EF4444', fontSize: '0.65rem', position: 'absolute', top: '8px', right: '8px', fontWeight: 700 }}>• RECORDING</span>
                          <span style={{ color: '#fff', fontSize: '0.7rem' }}>Video viewfinder feed</span>
                        </div>
                        <div style={{ backgroundColor: 'var(--color-card)', padding: '6px', borderRadius: '6px', fontSize: '0.62rem', border: '1px solid var(--color-border)' }}>
                          <strong>Verify checks:</strong> Insulated handles, gloves, stable wire strip core size.
                        </div>
                      </div>
                    )}

                    {uiPreviewSlide === 'passport' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>Skill Passport</span>
                        <div style={{ border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--color-card)' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#E2E8F0' }}></div>
                            <div>
                              <strong style={{ fontSize: '0.75rem', display: 'block' }}>Ravi Kumar</strong>
                              <span style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)' }}>Electrician • dwarka, delhi</span>
                            </div>
                          </div>
                          <div style={{ backgroundColor: 'var(--color-secondary-light)', color: '#065F46', fontSize: '0.62rem', padding: '4px', borderRadius: '4px', textAlign: 'center', fontWeight: 700, marginBottom: '6px' }}>
                            ✓ NSQF LEVEL 4 CERTIFIED
                          </div>
                          <span style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)' }}>QR Code Verification</span>
                          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                            <svg viewBox="0 0 100 100" style={{ width: '40px', height: '40px' }}>
                              <rect width="100" height="100" fill="white" />
                              <path d="M10 10h30v30H10zm5 5h20v20H15zm45-5h30v30H60zm5 5h20v20H65zM10 60h30v30H10zm5 5h20v20H15zm50 15h10v10H65zm10-10h15v10H75zm-15-5h15v10H60zm25 0h5v10H85zm-15 15h5v5h-5z" fill="black" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {uiPreviewSlide === 'profile' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>SQLite Sync Settings</span>
                        <div style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px' }}>
                          <span style={{ display: 'block', fontSize: '0.62rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Offline Sync Queue</span>
                          <strong>2 Assessments pending sync</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)', alignSelf: 'center' }}></div>
                          <span style={{ fontSize: '0.65rem' }}>SQLite database sync enabled</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right panel selectors */}
                <div className="preview-nav-panel">
                  <button 
                    className={`preview-nav-btn ${uiPreviewSlide === 'passport' ? 'active' : ''}`}
                    onClick={() => setUiPreviewSlide('passport')}
                  >
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>3. Verified Passport</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>QR Passport and Skill DNA matrix</span>
                  </button>

                  <button 
                    className={`preview-nav-btn ${uiPreviewSlide === 'profile' ? 'active' : ''}`}
                    onClick={() => setUiPreviewSlide('profile')}
                  >
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>4. Profile Settings</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>SQLite offline status dashboard</span>
                  </button>
                </div>

              </div>
            </section>

            {/* Roadmap Section */}
            <section className="roadmap-section">
              <h2 className="landing-section-title">Development Roadmap</h2>
              <p className="landing-section-subtitle">Our milestone tracker from initial design to national integrations.</p>
              
              <div className="roadmap-list">
                {[
                  { text: "Registration & OTP Verification Flow", done: true },
                  { text: "Camera Skill Assessment Video checks", done: true },
                  { text: "Digital Skill Passport and QR Generation", done: true },
                  { text: "Interactive Employer Directory & Verification Console", done: false },
                  { text: "Government Integration (DigiLocker mapping)", done: false },
                  { text: "NSDC Skill India Certification matching", done: false }
                ].map((item, idx) => (
                  <div key={idx} className="roadmap-item">
                    <div className="roadmap-icon-box" style={{ 
                      backgroundColor: item.done ? 'var(--color-secondary-light)' : 'var(--color-primary-light)', 
                      color: item.done ? 'var(--color-secondary)' : 'var(--color-text-light)' 
                    }}>
                      {item.done ? '✓' : '⬜'}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: item.done ? 1 : 0.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Meet the Team Section */}
            <section className="team-section">
              <h2 className="landing-section-title">Meet the Team</h2>
              <p className="landing-section-subtitle">The creators and engineers behind the KarmSetu Trust Protocol.</p>
              
              <div className="team-grid">
                <div className="team-member-card">
                  <div className="team-avatar">NK</div>
                  <div className="team-info">
                    <h4 className="team-name">Nikita Kumari</h4>
                    <span className="team-role">Lead Developer & Co-Founder</span>
                    <p className="team-bio">
                      Full-stack developer specialized in React applications, Firebase infrastructure, and generative AI models integrations. Dedicated to building trust solutions for India's informal sectors.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Brand Footer */}
            <footer className="landing-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogoSVG />
                <span className="logo-text">Karm<span>Setu</span></span>
              </div>
              <p>© 2026 KarmSetu India. Skill India registries and NSDC mapping protocol compliant.</p>
              <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
                <a href="https://github.com/nikita000kumari/karmsetu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline', fontSize: '0.78rem' }}>
                  GitHub Codebase Repository
                </a>
              </div>
            </footer>

          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 2: Auth Login Panel (showLogin === true)          */}
        {/* ======================================================== */}
        {userRole === 'none' && showLogin && (
          <div className="login-screen-wrapper">
            <div className="login-card">
              
              {/* Back to landing link */}
              <span 
                onClick={() => setShowLogin(false)}
                style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
              >
                ← Back to Welcome Page
              </span>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <LogoSVG />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '8px', color: 'var(--color-primary)' }}>KarmSetu Login</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Choose your portal and enter authentication details.</p>
              </div>

              {/* Tab Selector */}
              <div className="user-type-selector">
                <button 
                  className={`user-type-btn ${loginTab === 'worker' ? 'active' : ''}`}
                  onClick={() => { setLoginTab('worker'); setOtpSent(false); }}
                >
                  <User size={16} /> Worker Portal
                </button>
                <button 
                  className={`user-type-btn ${loginTab === 'employer' ? 'active' : ''}`}
                  onClick={() => setLoginTab('employer')}
                >
                  <Briefcase size={16} /> Employer Portal
                </button>
              </div>

              {/* Worker Form */}
              {loginTab === 'worker' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  <div>
                    <label className="input-label">Choose Assessment Language</label>
                    <div className="lang-grid">
                      {['Hindi', 'English', 'Tamil', 'Bengali', 'Marathi', 'Telugu'].map(lang => (
                        <div 
                          key={lang}
                          className={`lang-chip ${selectedLanguage === lang ? 'active' : ''}`}
                          onClick={() => setSelectedLanguage(lang)}
                        >
                          <span style={{ fontWeight: 700 }}>{lang}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Mobile Number</label>
                    <div className="input-wrapper">
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>+91</span>
                      <input 
                        type="tel" 
                        placeholder="Enter mobile number" 
                        className="input-field"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div style={{ animation: 'slideUp 0.15s ease' }}>
                      <label className="input-label">Enter 4-Digit OTP Token</label>
                      <div className="input-wrapper">
                        <Lock size={14} className="text-blue-500" />
                        <input 
                          type="text" 
                          placeholder="Demo OTP code: 4821" 
                          className="input-field"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        />
                      </div>
                    </div>
                  )}

                  {!otpSent ? (
                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSendOTP}>
                      Get OTP verification Code
                    </button>
                  ) : (
                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleVerifyOTP}>
                      Verify and Login
                    </button>
                  )}

                  <span 
                    onClick={() => {
                      setUserRole('worker');
                      setWorkerFlowStep('choose_trade');
                      addLog('success', 'AUTH: Bypassed worker authentication via Quick Login.');
                    }}
                    style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textAlign: 'center', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Quick Demo Skip Login (Worker)
                  </span>

                  {/* Invisible Recaptcha target element */}
                  <div id="recaptcha-container"></div>

                </div>
              ) : (
                /* Employer Login */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label className="input-label">Corporate Email / Phone</label>
                    <div className="input-wrapper">
                      <input type="text" placeholder="Enter work email" className="input-field" defaultValue="hr@infra-builder.in" />
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Password</label>
                    <div className="input-wrapper">
                      <Lock size={14} className="text-blue-500" />
                      <input type="password" placeholder="••••••••" className="input-field" defaultValue="companypass" />
                    </div>
                  </div>

                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleEmployerLogin}>
                    Enter Employer Portal
                  </button>

                  <span 
                    onClick={() => {
                      setUserRole('employer');
                      setEmployerActiveTab('directory');
                      addLog('success', 'AUTH: Bypassed employer authentication via Quick Login.');
                    }}
                    style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textAlign: 'center', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Quick Demo Skip Login (Employer)
                  </span>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW: WORKER ASSESSMENT MVP WIZARD FLOW                  */}
        {/* ======================================================== */}
        {userRole === 'worker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', flex: 1 }}>
            
            {/* Step Wizard Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>Worker Skills Assessment Wizard</h3>
              <div style={{ display: 'flex', gap: '6px', fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                <span style={{ color: workerFlowStep === 'choose_trade' ? 'var(--color-primary)' : '' }}>1. Trade</span> • 
                <span style={{ color: workerFlowStep === 'record_video' ? 'var(--color-primary)' : '' }}>2. Camera Drill</span> • 
                <span style={{ color: workerFlowStep === 'video_processing' ? 'var(--color-primary)' : '' }}>3. AI Score</span> • 
                <span style={{ color: workerFlowStep === 'voice_question' ? 'var(--color-primary)' : '' }}>4. AI Voice</span> • 
                <span style={{ color: workerFlowStep === 'passport_generated' ? 'var(--color-primary)' : '' }}>5. Skill Passport</span>
              </div>
            </div>

            {/* WIZARD STEP 1: Choose a trade */}
            {workerFlowStep === 'choose_trade' && (
              <div className="dashboard-card" style={{ maxWidth: '600px', margin: '20px auto', width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Award size={32} className="text-blue-500" style={{ margin: '0 auto 10px auto' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Choose Your Trade Category</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Select the skill you want to verify on camera.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                  {[
                    { id: 'Electrician', label: 'Electrician (⚡)', desc: 'Wiring boards, MCBs & Switchboxes checks' },
                    { id: 'Plumber', label: 'Plumber (🚰)', desc: 'Thread winding pipes & Pressure seal joints' },
                    { id: 'Tailor', label: 'Tailor (🧵)', desc: 'Draft outlines & Machine stitch lines' },
                    { id: 'Carpenter', label: 'Carpenter (🪚)', desc: 'Timber joints & chisel alignment checks' }
                  ].map(tr => (
                    <div 
                      key={tr.id}
                      onClick={() => setWorkerSelectedTrade(tr.id)}
                      style={{ 
                        border: '1.5px solid', 
                        borderColor: workerSelectedTrade === tr.id ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: workerSelectedTrade === tr.id ? 'var(--color-primary-light)' : 'var(--color-card)',
                        padding: '16px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: workerSelectedTrade === tr.id ? 'var(--color-primary)' : '' }}>{tr.label}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '4px' }}>{tr.desc}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                  onClick={() => {
                    setWorkerFlowStep('record_video');
                    startCamera();
                  }}
                >
                  Start Camera Assessment <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* WIZARD STEP 2: Record Video Demonstration */}
            {workerFlowStep === 'record_video' && (
              <div className="camera-card" style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Record {workerSelectedTrade} Demo</h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Verify compliance criteria on camera</p>
                  </div>
                  <span style={{ fontSize: '0.72rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    5-Sec Shutter Drill
                  </span>
                </div>

                <div className="camera-stream-box" style={{ height: '300px' }}>
                  {cameraActive ? (
                    <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay playsInline muted></video>
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>
                      <p style={{ fontSize: '0.8rem' }}>Webcam streaming simulator online.</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', marginTop: '2px' }}>Click record button to initiate.</p>
                    </div>
                  )}

                  <div className="camera-crop-overlay">
                    <div className="camera-scan-bar"></div>
                    {recordingState === 'recording' && (
                      <div style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', position: 'absolute', top: '10px', right: '10px' }}>
                        RECORDING {recordingSeconds}s
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.75rem' }}>
                  <strong>Diagnostic Target: {activeOverlay.title}</strong>
                  <p style={{ color: 'var(--color-text-secondary)', marginTop: '2px', fontSize: '0.7rem' }}>{activeOverlay.desc}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {!cameraActive && recordingState === 'idle' ? (
                    <button className="btn-secondary" onClick={startCamera}>
                      Activate Camera Feed
                    </button>
                  ) : (
                    <button 
                      className={`camera-record-btn ${recordingState === 'recording' ? 'recording' : ''}`}
                      onClick={recordingState === 'idle' ? startRecording : finishRecording}
                    ></button>
                  )}
                </div>
              </div>
            )}

            {/* WIZARD STEP 3: AI Video Processing screen */}
            {workerFlowStep === 'video_processing' && (
              <div className="camera-card" style={{ maxWidth: '500px', margin: '40px auto', width: '100%', textAlign: 'center' }}>
                <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--color-primary-light)', borderTopColor: 'var(--color-secondary)', animation: 'spin 1s linear infinite' }}></div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>AI Vision Analyzing Video</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Checking frames for NSQF Level 4 compliance...</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px', textAlign: 'left', marginTop: '10px' }}>
                    {[
                      { name: activeOverlay.checklist[0], stage: processingStages.tools },
                      { name: activeOverlay.checklist[1], stage: processingStages.safety },
                      { name: activeOverlay.checklist[2], stage: processingStages.technique },
                      { name: activeOverlay.checklist[3], stage: processingStages.workflow }
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', opacity: step.stage === 'waiting' ? 0.4 : 1 }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                      backgroundColor: step.stage === 'done' ? 'var(--color-secondary)' : 'var(--color-border)', color: '#fff', fontSize: '8px' }}>
                          {step.stage === 'done' ? '✓' : ''}
                        </div>
                        <span>{step.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WIZARD STEP 4: AI Voice Follow-up Question */}
            {workerFlowStep === 'voice_question' && (
              <div className="voice-card" style={{ maxWidth: '600px', margin: '10px auto', width: '100%' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AI Voice Follow-up Interview</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Answer verbally or type. AI will evaluate safety practices.</p>
                </div>

                <div className="voice-chat-box" style={{ height: '200px' }}>
                  {voiceMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble ${msg.sender}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>

                <div className="voice-actions-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px', textAlign: 'center' }}>
                    {isListening ? '🎙 Listening... Speak your safety response now.' : 'Click mic to answer verbally, or type below.'}
                  </span>

                  <button className={`mic-btn-circle ${isListening ? 'listening' : ''}`} onClick={toggleMicListener} style={{ margin: '0 auto 12px auto' }}>
                    <Mic size={20} />
                  </button>

                  <div style={{ display: 'flex', width: '100%', gap: '6px' }}>
                    <input 
                      type="text" 
                      placeholder="Type your safety explanation here (fast simulator option)..." 
                      value={voiceInputText}
                      onChange={(e) => setVoiceInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleVoiceMessageSubmit(voiceInputText);
                          setVoiceInputText('');
                        }
                      }}
                      style={{ flex: 1, backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', outline: 'none' }}
                    />
                    <button className="btn-secondary" style={{ padding: '8px 16px' }} onClick={() => {
                      handleVoiceMessageSubmit(voiceInputText);
                      setVoiceInputText('');
                    }}>
                      Submit Answer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WIZARD STEP 5: Skill Passport Generated */}
            {workerFlowStep === 'passport_generated' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                
                {/* Score Summary */}
                <div className="dashboard-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Verification Scores</h3>
                    <span className="govt-verified-pill" style={{ backgroundColor: 'var(--color-secondary-light)', color: '#065F46' }}>
                      ✓ Verified L4
                    </span>
                  </div>

                  <div className="trust-index-banner" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%)' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px' }}>GLOBAL TRUST SCORE</span>
                      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, marginTop: '4px' }}>
                        {raviWorker?.trustScore} <span style={{ fontSize: '1rem', opacity: 0.7 }}>/ 100</span>
                      </h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        Tier: {raviWorker?.level}
                      </span>
                    </div>
                  </div>

                  {/* Skill DNA Score bars */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>⚡ SKILL DNA INDEX</h4>
                    <div className="dna-radar-grid">
                      {[
                        { name: 'Precision & Cut Accuracy', val: raviWorker?.skillsDNA?.precision || 92, color: '#3B82F6' },
                        { name: 'Safety Standards & Practices', val: raviWorker?.skillsDNA?.safety || 90, color: '#10B981' },
                        { name: 'Technical Problem Solving', val: raviWorker?.skillsDNA?.problemSolving || 85, color: '#8B5CF6' },
                        { name: 'Speed & Workflow Timing', val: raviWorker?.skillsDNA?.speed || 91, color: '#EC4899' },
                        { name: 'Communication & Dialect clarity', val: raviWorker?.skillsDNA?.communication || 80, color: '#F59E0B' }
                      ].map(bar => (
                        <div key={bar.name} className="dna-bar-block">
                          <div className="dna-bar-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                            <span>{bar.name}</span>
                            <span style={{ fontWeight: 700 }}>{bar.val}%</span>
                          </div>
                          <div className="dna-bar-track" style={{ backgroundColor: 'var(--color-border)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                            <div className="dna-bar-fill" style={{ width: `${bar.val}%`, backgroundColor: bar.color, height: '100%' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skill Passport Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div className="resume-sheet" style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-card)', marginTop: 0, boxShadow: 'var(--shadow-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px', marginBottom: '14px' }}>
                      <span className="logo-text" style={{ fontSize: '1rem' }}>Karm<span>Setu</span></span>
                      <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        DIGITAL SKILL PASSPORT
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                      <img src={raviWorker?.avatar} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{raviWorker?.name}</h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                          {raviWorker?.skill} • {raviWorker?.experience} Exp
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '14px' }}>
                      <div>
                        <span style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)', display: 'block' }}>VERIFIED SKILL BADGES</span>
                        <div className="badges-row" style={{ marginTop: '4px' }}>
                          {raviWorker?.verifiedSkills?.map((badge, idx) => (
                            <span key={idx} className="badge-pill" style={{ fontSize: '0.65rem' }}>
                              ✓ {badge}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* SVG QR Code */}
                      <div style={{ width: '60px', height: '60px', border: '1px solid var(--color-border)', padding: '4px', backgroundColor: '#fff', borderRadius: '4px' }}>
                        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                          <rect width="100" height="100" fill="white" />
                          <path d="M10 10h30v30H10zm5 5h20v20H15zm45-5h30v30H60zm5 5h20v20H65zM10 60h30v30H10zm5 5h20v20H15zm50 15h10v10H65zm10-10h15v10H75zm-15-5h15v10H60zm25 0h5v10H85zm-15 15h5v5h-5z" fill="black" />
                        </svg>
                      </div>
                    </div>

                    {/* MVP SIMULATOR BUTTON */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Info size={11} /> MVP SCANNER SIMULATOR
                      </span>
                      <button 
                        className="btn-accent" 
                        onClick={handleSimulatedQRScan}
                        style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                      >
                        <QrCode size={16} /> Scan QR Code as Employer
                      </button>
                    </div>

                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-outline" style={{ flex: 1 }} onClick={() => setWorkerFlowStep('choose_trade')}>
                      Restart MVP Flow
                    </button>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={handleLogout}>
                      Finished Demo
                    </button>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW: EMPLOYER PORTAL VIEWS                              */}
        {/* ======================================================== */}
        {userRole === 'employer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', flex: 1 }}>
            
            {/* Banner showing scanned profile via QR */}
            {qrScannedCandidateId && (
              <div style={{ backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '12px 20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'slideDown 0.2s ease' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  ⚡ VERIFIED PASSPORT DECODED: Scanned QR code for {selectedWorker?.name} ({selectedWorker?.skill}) successfully.
                </span>
                <button 
                  onClick={() => setQrScannedCandidateId(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Directory Tab */}
            {employerActiveTab === 'directory' && (
              <div className="directory-grid">
                
                {/* Left listing catalog */}
                <div className="candidates-list-card">
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Candidate Search</h3>
                  
                  <div className="search-filter-box" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="search-input-wrapper">
                      <Search size={14} className="search-icon" />
                      <input 
                        type="text" 
                        placeholder="Search by name or trade..." 
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          addLog('query', `SQL: SELECT * FROM workers WHERE name LIKE '%${e.target.value}%';`);
                        }}
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', color: 'var(--color-text-primary)', flex: 1 }}
                      />
                    </div>

                    <div className="filter-selects" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <select 
                        value={filterTrade} 
                        onChange={(e) => {
                          setFilterTrade(e.target.value);
                          addLog('query', `SQL: SELECT * FROM workers WHERE skill = '${e.target.value}';`);
                        }}
                        style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '6px', fontSize: '0.75rem', outline: 'none' }}
                      >
                        <option value="All">All Trades</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Tailor">Tailor</option>
                      </select>

                      <select 
                        value={filterLocation} 
                        onChange={(e) => {
                          setFilterLocation(e.target.value);
                          addLog('query', `SQL: SELECT * FROM workers WHERE location LIKE '%${e.target.value}%';`);
                        }}
                        style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '6px', fontSize: '0.75rem', outline: 'none' }}
                      >
                        <option value="All">All Locations</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Haryana">Haryana</option>
                      </select>
                    </div>
                  </div>

                  <div className="candidates-scroll">
                    {filteredList.map(w => (
                      <div 
                        key={w.id} 
                        className={`candidate-item ${selectedWorkerId === w.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedWorkerId(w.id);
                          setHiredWorkerId(null);
                          setShowResume(false);
                          addLog('query', `SQL: SELECT * FROM workers WHERE id = '${w.id}';`);
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={w.avatar} alt={w.name} className="candidate-avatar" />
                          <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block' }}>{w.name}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>{w.skill} • {w.experience}</span>
                          </div>
                        </div>
                        <span className="candidate-score-badge">{w.trustScore}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right detail profile pane */}
                <div className="profile-detail-card">
                  
                  <div className="profile-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                    <div className="profile-avatar-row" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <img src={selectedWorker?.avatar} alt="Avatar" className="profile-avatar-lg" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {selectedWorker?.name}
                          <span className="govt-verified-pill">
                            <CheckCircle size={10} style={{ color: 'var(--color-secondary)' }} /> Aadhaar Verified
                          </span>
                        </h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                          <MapPin size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                          {selectedWorker?.location}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-outline" onClick={() => setShowResume(!showResume)}>
                        <FileText size={14} /> {showResume ? 'Hide CV Details' : 'Generate AI CV'}
                      </button>

                      {hiredWorkerId === selectedWorker?.id ? (
                        <div style={{ backgroundColor: 'var(--color-secondary-light)', border: '1px solid var(--color-secondary)', color: '#065F46', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
                          ✓ Contract Offered Successfully
                        </div>
                      ) : (
                        <button 
                          className="btn-primary" 
                          onClick={() => {
                            setHiredWorkerId(selectedWorker?.id);
                            addLog('success', `HIRING_SERVICE: Dispatched contract offer to ${selectedWorker?.name}.`);
                            alert(`Contract offer sent to ${selectedWorker?.name}!`);
                          }}
                        >
                          Hire Candidate
                        </button>
                      )}
                    </div>
                  </div>

                  {showResume ? (
                    <div className="resume-sheet">
                      <div className="resume-header">
                        <div>
                          <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 800 }}>KARMSETU VERIFIED CONTRACTOR SUMMARY</h3>
                          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>National Skills Registry Mapped • Aadhaar Authenticated (XXXX-XXXX-4821)</span>
                        </div>
                        <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.68rem' }} onClick={() => alert('Downloading PDF profile packet...')}>
                          <Download size={12} /> Download PDF
                        </button>
                      </div>

                      <div className="resume-grid">
                        <div className="resume-sec">
                          <span className="resume-sec-title">Personal Information</span>
                          <span><strong>Candidate:</strong> {selectedWorker?.name}</span>
                          <span><strong>Profession:</strong> {selectedWorker?.skill}</span>
                          <span><strong>Experience:</strong> {selectedWorker?.experience}</span>
                          <span><strong>Location:</strong> {selectedWorker?.location}</span>
                        </div>

                        <div className="resume-sec">
                          <span className="resume-sec-title">Skill DNA Matrix</span>
                          {selectedWorker?.skillsDNA && Object.entries(selectedWorker.skillsDNA).map(([key, val]) => (
                            <span key={key}>• {key.toUpperCase()}: {val}%</span>
                          ))}
                        </div>

                        <div className="resume-sec" style={{ gridColumn: 'span 2' }}>
                          <span className="resume-sec-title">AI Vision Assessment Audit Logs</span>
                          <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                            Tested tools compliance, Insulated handles inspection, wire strip core width diagnostics. Output: 92% confidence rating check matches NSQF parameters.
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="profile-grid-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      
                      <div className="media-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Video size={14} className="text-blue-500" /> AI Vision Skill Assessment
                        </span>

                        <div className="video-frame-box">
                          <div className="video-play-overlay" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => alert('Starting simulated vision feed playback...')}>
                            <Play size={32} style={{ margin: '0 auto 6px auto' }} />
                            <p style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Watch Assessment Playback Feed</p>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                          <Mic size={14} className="text-blue-500" /> Voice Interview Transcript
                        </span>
                        <div className="transcript-block">
                          <blockquote>"{selectedWorker?.voiceTranscript}"</blockquote>
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                          <Activity size={14} className="text-emerald-500" /> Skill DNA scorecard
                        </span>

                        <div className="dna-card-box">
                          <div className="dna-title-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px', marginBottom: '8px' }}>
                            <span>Trade Traits</span>
                            <span>Rating %</span>
                          </div>
                          
                          <div className="dna-bars-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                              { name: 'Precision & Cut Accuracy', key: 'precision', color: '#3B82F6' },
                              { name: 'Safety Practices & Gear', key: 'safety', color: '#10B981' },
                              { name: 'Technical Problem Solving', key: 'problemSolving', color: '#8B5CF6' },
                              { name: 'Speed & Process timing', key: 'speed', color: '#EC4899' },
                              { name: 'Communication & Dialect', key: 'communication', color: '#F59E0B' }
                            ].map(trait => {
                              const val = selectedWorker?.skillsDNA ? selectedWorker.skillsDNA[trait.key] : 80;
                              return (
                                <div key={trait.key} className="dna-bar-block">
                                  <div className="dna-bar-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '2px' }}>
                                    <span>{trait.name}</span>
                                    <span>{val}%</span>
                                  </div>
                                  <div className="dna-bar-track" style={{ backgroundColor: 'var(--color-border)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div className="dna-bar-fill" style={{ width: `${val}%`, backgroundColor: trait.color, height: '100%' }}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ marginTop: '16px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Verified Credentials</span>
                          <div className="badges-row">
                            {selectedWorker?.verifiedSkills?.map((badge, idx) => (
                              <span key={idx} className="badge-pill">
                                ✓ {badge}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

            {/* Stats Index Tab */}
            {employerActiveTab === 'stats' && (
              <div className="dashboard-card" style={{ gap: '20px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>KarmSetu National Statistics Index</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '-10px' }}>
                  Live aggregate metrics tracking certified workers and deployment locations across India.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {[
                    { title: 'Total Contractors Mapped', count: '14,821', col: 'var(--color-primary)' },
                    { title: 'AI Verification Confidence', count: '93.4%', col: 'var(--color-secondary)' },
                    { title: 'Government Level L4 Certified', count: '89.2%', col: 'var(--color-accent)' },
                    { title: 'Contract Hire Success Rate', count: '96.8%', col: '#8B5CF6' }
                  ].map((stat, idx) => (
                    <div key={idx} style={{ backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>{stat.title}</span>
                      <h4 style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.col }}>{stat.count}</h4>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                  <div style={{ backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>Trade Distribution</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { name: 'Electrician', val: '45%' },
                        { name: 'Plumber', val: '30%' },
                        { name: 'Tailor', val: '15%' },
                        { name: 'Carpenter', val: '10%' }
                      ].map(trade => (
                        <div key={trade.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                          <span>{trade.name}</span>
                          <span style={{ fontWeight: 700 }}>{trade.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <Shield size={36} className="text-emerald-500" style={{ marginBottom: '8px' }} />
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Blockchain Security Mapping</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      All qualifications and skills DNA matrices are mapped to central databases with SHA-256 cryptographic verification hashes.
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Floating Bottom Console Logs Feed */}
      <div className="sync-console-drawer">
        <div className="console-title-bar" onClick={() => setConsoleOpen(!consoleOpen)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="console-status-dot"></div>
            <span>SQLite Sync Engine Logs Feed</span>
          </div>
          {consoleOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>

        {consoleOpen && (
          <div className="console-feed">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className={`console-row ${log.type}`}>
                {log.text}
              </div>
            ))}
            <div ref={consoleBottomRef}></div>
          </div>
        )}
      </div>

    </div>
  );
}
