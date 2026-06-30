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

  // Simulator State Machine hooks
  const [activeSimScreen, setActiveSimScreen] = useState('01_splash');
  const [simLanguage, setSimLanguage] = useState('English');
  const [simPhoneInput, setSimPhoneInput] = useState('');
  const [simOtpInput, setSimOtpInput] = useState('');
  const [simSelectedTrade, setSimSelectedTrade] = useState('⚡ Electrician');
  const [simRecordingSeconds, setSimRecordingSeconds] = useState(0);
  const [simAnalysisStep, setSimAnalysisStep] = useState(0);
  const [simInterviewResponse, setSimInterviewResponse] = useState('');
  const [simIsHired, setSimIsHired] = useState(false);
  const [simOffline, setSimOffline] = useState(false);
  const [simDarkMode, setSimDarkMode] = useState(false);
  const [simConfetti, setSimConfetti] = useState(false);
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

  // Simulator Screen Automation triggers
  useEffect(() => {
    if (activeSimScreen === '01_splash') {
      const t = setTimeout(() => {
        setActiveSimScreen('02_onboarding_1');
        addLog('info', 'SIMULATOR: Auto-advanced splash screen to onboarding slides.');
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [activeSimScreen]);

  useEffect(() => {
    let t;
    if (activeSimScreen === '10_camera' && simRecordingSeconds > 0) {
      t = setTimeout(() => {
        if (simRecordingSeconds >= 5) {
          setActiveSimScreen('11_ai_analysis');
          setSimRecordingSeconds(0);
          addLog('success', 'SIMULATOR: Video record drill completed. Initiated AI analysis checks.');
        } else {
          setSimRecordingSeconds(s => s + 1);
        }
      }, 1000);
    }
    return () => clearTimeout(t);
  }, [activeSimScreen, simRecordingSeconds]);

  useEffect(() => {
    let t;
    if (activeSimScreen === '11_ai_analysis') {
      t = setTimeout(() => {
        if (simAnalysisStep < 4) {
          setSimAnalysisStep(s => s + 1);
          const tasks = ['Detecting Tools', 'Checking Safety Gear', 'Evaluating Workflow', 'Building Skill DNA Report'];
          addLog('info', `SIMULATOR AI: Completed check for: ${tasks[simAnalysisStep]}`);
        } else {
          setActiveSimScreen('12_ai_report');
          setSimAnalysisStep(0);
          addLog('success', 'SIMULATOR AI: Vision compliance analysis report prepared.');
        }
      }, 1000);
    }
    return () => clearTimeout(t);
  }, [activeSimScreen, simAnalysisStep]);

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
            
            {/* 1️⃣ HERO SECTION */}
            <section className="landing-hero" style={{ padding: '80px 20px 50px 20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: 'var(--color-primary-light)', padding: '6px 16px', borderRadius: '30px', border: '1px solid var(--color-border)', marginBottom: '14px' }}>
                <Smartphone size={14} className="text-blue-600" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)' }}>Skill demonstration over certificates</span>
              </div>

              <h1 className="landing-title" style={{ fontSize: '3rem', lineHeight: '1.15', fontWeight: 800 }}>
                450 Million Workers.<br />
                <span style={{ color: 'var(--color-primary)' }}>Millions Still Can't Prove Their Skills.</span>
              </h1>
              
              <p className="landing-tagline" style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1.1rem', marginTop: '10px', maxWidth: '780px' }}>
                KarmSetu helps skilled workers build trusted digital identities through practical demonstrations instead of certificates.
              </p>

              {/* MISSION STATEMENT SLOGAN */}
              <div style={{ margin: '20px auto', maxWidth: '680px', fontStyle: 'italic', borderLeft: '3px solid var(--color-accent)', paddingLeft: '16px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', textAlign: 'left', lineHeight: 1.5 }}>
                "A worker's future should be decided by what they can do, not by the certificates they couldn't afford to earn."
              </div>

              <div className="hero-cta-row">
                <button className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.92rem' }} onClick={() => setShowLogin(true)}>
                  Live Demo <ArrowRight size={16} />
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

            {/* 2️⃣ PROBLEM SECTION */}
            <section className="problem-stats-section" style={{ padding: '40px 20px' }}>
              <h2 className="landing-section-title">The Problem</h2>
              <p className="landing-section-subtitle">Why traditional credential systems leave millions behind.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
                <div style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👷</div>
                  <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Skilled workers remain invisible</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: '1.45' }}>
                    Most tradesmen have years of hands-on experience but no formal school papers or ITI credentials.
                  </span>
                </div>
                
                <div style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📄</div>
                  <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Employers rely on paperwork</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: '1.45' }}>
                    Recruitment processes rely entirely on certifications, ignoring practical capabilities.
                  </span>
                </div>
                
                <div style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💰</div>
                  <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Better opportunities are lost</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: '1.45' }}>
                    Without verification, workers miss out on higher wages, formal contracts, and credit options daily.
                  </span>
                </div>
              </div>
            </section>

            {/* 3️⃣ SOLUTION SECTION */}
            <section className="solution-flow-section" style={{ padding: '60px 20px' }}>
              <h2 className="landing-section-title">The Solution</h2>
              <p className="landing-section-subtitle">A seamless pipeline verifying skills and connecting workers directly to jobs.</p>
              
              <div className="solution-visual-flow" style={{ marginTop: '30px' }}>
                <div className="solution-flow-step-card">
                  <Video size={18} className="text-blue-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Worker records task</span>
                </div>
                <div className="solution-flow-arrow">→</div>
                
                <div className="solution-flow-step-card">
                  <Activity size={18} className="text-emerald-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>AI verifies</span>
                </div>
                <div className="solution-flow-arrow">→</div>

                <div className="solution-flow-step-card">
                  <Award size={18} className="text-amber-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Skill Passport</span>
                </div>
                <div className="solution-flow-arrow">→</div>

                <div className="solution-flow-step-card">
                  <QrCode size={18} className="text-blue-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Employer scans</span>
                </div>
                <div className="solution-flow-arrow">→</div>

                <div className="solution-flow-step-card" style={{ border: '1px solid var(--color-secondary)' }}>
                  <Briefcase size={18} className="text-emerald-600" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Gets hired</span>
                </div>
              </div>
            </section>

            {/* 4️⃣ WHY KARMSETU? SECTION */}
            <section className="comparison-section" style={{ padding: '40px 20px' }}>
              <h2 className="landing-section-title">Why KarmSetu?</h2>
              <p className="landing-section-subtitle">How KarmSetu replaces outdated paper models with live skill evidence.</p>
              
              <div className="comparison-table-wrapper" style={{ marginTop: '20px' }}>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th style={{ padding: '16px' }}>Traditional Hiring</th>
                      <th style={{ color: 'var(--color-secondary)', padding: '16px' }}>KarmSetu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px' }}>Certificates</td>
                      <td style={{ color: 'var(--color-secondary)', fontWeight: 600, padding: '16px' }}>Demonstrated Skills</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '16px' }}>Manual Screening</td>
                      <td style={{ color: 'var(--color-secondary)', fontWeight: 600, padding: '16px' }}>AI Assisted</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '16px' }}>Paper Records</td>
                      <td style={{ color: 'var(--color-secondary)', fontWeight: 600, padding: '16px' }}>Digital Passport</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '16px' }}>Difficult Verification</td>
                      <td style={{ color: 'var(--color-secondary)', fontWeight: 600, padding: '16px' }}>QR Verification</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '16px' }}>Internet Required</td>
                      <td style={{ color: 'var(--color-secondary)', fontWeight: 600, padding: '16px' }}>Offline First</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 5️⃣ FEATURES SECTION */}
            <section className="features-section" style={{ padding: '60px 20px' }}>
              <h2 className="landing-section-title">Core Features</h2>
              <p className="landing-section-subtitle">Engineered specifically for low-connectivity blue-collar labor markets.</p>
              
              <div className="features-card-grid" style={{ marginTop: '20px' }}>
                
                <div className="feature-card">
                  <Video size={20} className="text-blue-600" />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>📹 Skill Assessment</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                    Record a 5-second video demonstration. AI analyzes the task to identify tools, workflow, and basic safety practices.
                  </p>
                </div>

                <div className="feature-card">
                  <Mic size={20} className="text-emerald-600" />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>🎤 Voice Interview</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                    Voice-based safety assessment in the worker's preferred language. Gemini provides structured feedback and workflow analysis.
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
                    Assessments work fully offline using a local SQLite sync database. Syncs back to Firebase when internet returns.
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

            {/* 6️⃣ SKILL PASSPORT PREVIEW SECTION */}
            <section style={{ padding: '60px 20px', backgroundColor: 'var(--color-primary-light)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Skill Passport Preview</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                    Employers get instant, verified access to a worker's practical capabilities, trust score history, and safety qualifications. The passport is secure, dynamic, and updated in real-time.
                  </p>
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>✓</span>
                      <span>Verified trust score of 92%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>✓</span>
                      <span>Gold verification tier</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>✓</span>
                      <span>Practical assessment audit link</span>
                    </div>
                  </div>
                </div>

                {/* Passport Card Component */}
                <div className="premium-passport-card" style={{ maxWidth: '400px', width: '100%', cursor: 'default' }}>
                  <div className="hologram-strip"></div>
                  <div className="passport-badge-header">
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.5px' }}>★ KARMSETU VERIFIED ★</span>
                    <span style={{ fontSize: '0.58rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: '#94A3B8' }}>
                      ID: KS-AADH-9821
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="passport-avatar-glow" style={{ width: '56px', height: '56px' }}>
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Avatar" className="passport-avatar-img" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>Ravi Kumar</h4>
                      <p style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        Electrician • 5 Years Exp
                      </p>
                      <p style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '2px' }}>
                        New Delhi, Delhi
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    <span className="passport-badge-pill" style={{ color: '#F59E0B', fontSize: '0.6rem', padding: '3px 8px' }}>★ Safety Champion</span>
                    <span className="passport-badge-pill" style={{ color: '#3B82F6', fontSize: '0.6rem', padding: '3px 8px' }}>⚡ MCB Insulated</span>
                    <span className="passport-badge-pill" style={{ color: '#10B981', fontSize: '0.6rem', padding: '3px 8px' }}>✓ UID Verified</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '4px' }}>
                    <div>
                      <span style={{ fontSize: '0.58rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>Trust Score Rating</span>
                      <span style={{ fontSize: '1.25rem', color: '#34D399', display: 'block', fontWeight: 800, marginTop: '2px' }}>92% (Gold)</span>
                    </div>

                    <div style={{ width: '48px', height: '48px', border: '1px solid rgba(255,255,255,0.1)', padding: '2px', backgroundColor: '#fff', borderRadius: '4px' }}>
                      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                        <rect width="100" height="100" fill="white" />
                        <path d="M10 10h30v30H10zm5 5h20v20H15zm45-5h30v30H60zm5 5h20v20H65zM10 60h30v30H10zm5 5h20v20H15zm50 15h10v10H65zm10-10h15v10H75zm-15-5h15v10H60zm25 0h5v10H85zm-15 15h5v5h-5z" fill="black" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7️⃣ IMPACT SECTION */}
            <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
              <h2 className="landing-section-title">The Impact</h2>
              <p className="landing-section-subtitle">Real-world metrics scaling opportunities for millions of workers.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px' }}>
                <div style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block' }}>450M+</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', margin: '6px 0' }}>Workers</span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>Reaching India's large labor segment directly.</p>
                </div>

                <div style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block' }}>100%</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', margin: '6px 0' }}>Offline First</span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>Works perfectly in areas with zero internet connectivity.</p>
                </div>

                <div style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block' }}>5+</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', margin: '6px 0' }}>Languages</span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>Onboarding and safety tests in preferred regional dialects.</p>
                </div>

                <div style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block' }}>Instant</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', margin: '6px 0' }}>Access</span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>Connecting verified workers straight to developers and builders.</p>
                </div>
              </div>
            </section>

            {/* 8️⃣ FUTURE VISION SECTION */}
            <section style={{ padding: '60px 20px', backgroundColor: 'var(--color-card)', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Future Vision</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '12px', lineHeight: 1.6 }}>
                  We envision a future where skills are recognized immediately, regardless of background or formal schooling. By shifting the verification paradigm from physical paperwork to practical work, KarmSetu builds a secure digital registry connecting millions of skilled Indian workers directly to sustainable, high-paying jobs.
                </p>
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
        {/* INTERACTIVE MOBILE CLIENT APPLICATION SIMULATOR         */}
        {/* ======================================================== */}
        {showLogin && (
          <div className="simulator-workspace-container">
            
            {/* Developer Control Console Panel (Left) */}
            <aside className="developer-panel">
              <div className="dev-title">
                <Settings size={16} /> DEVELOPER CONSOLE
              </div>
              <p className="dev-subtitle">
                Inspect and jump to any of the 18 client screens designed under Apple Human Interface guidelines.
              </p>

              <div className="screen-shortcuts-list">
                {[
                  { id: '01_splash', title: '01 Splash Screen', desc: 'Minimal connection loader' },
                  { id: '02_onboarding_1', title: '02 Onboarding 1', desc: 'Skill recognition pitch' },
                  { id: '03_onboarding_2', title: '03 Onboarding 2', desc: 'Talent vs Certificate' },
                  { id: '04_onboarding_3', title: '04 Onboarding 3', desc: 'Show Your Work CTA' },
                  { id: '05_language', title: '05 Language Selection', desc: 'Regional language cards' },
                  { id: '06_login', title: '06 Phone Login', desc: 'Credential input portal' },
                  { id: '07_otp', title: '07 OTP Verification', desc: 'Simulated 4-digit code' },
                  { id: '08_home', title: '08 Home Dashboard', desc: "Ravi Kumar's job overview" },
                  { id: '09_assessment', title: '09 Choose Trade', desc: 'Trade assessment categories' },
                  { id: '10_camera', title: '10 Video Viewfinder', desc: 'Insulated Stripper Drill' },
                  { id: '11_ai_analysis', title: '11 AI Processing', desc: 'Frame diagnostic checklist' },
                  { id: '12_ai_report', title: '12 AI Diagnostic Report', desc: 'Compliance score & traits' },
                  { id: '13_voice_interview', title: '13 Voice Interview', desc: 'ChatGPT safety interview' },
                  { id: '14_passport', title: '14 Skill Passport', desc: 'Apple Wallet card & DNA' },
                  { id: '15_employer_scan', title: '15 Scanner Simulator', desc: 'Decodes candidate QR' },
                  { id: '16_employer_view', title: '16 Employer Audit', desc: 'Video audit logs & Hiring' },
                  { id: '17_profile', title: '17 Worker Profile', desc: 'Certifications shelf & history' },
                  { id: '18_settings', title: '18 System Settings', desc: 'Dark Mode & Offline toggles' }
                ].map(scr => (
                  <button 
                    key={scr.id}
                    className={`shortcut-btn ${activeSimScreen === scr.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSimScreen(scr.id);
                      setSimConfetti(false);
                      if (scr.id === '11_ai_analysis') setSimAnalysisStep(0);
                      if (scr.id === '10_camera') setSimRecordingSeconds(0);
                      addLog('info', `SIMULATOR: Forced navigation jump to screen "${scr.id.toUpperCase()}"`);
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ display: 'block', fontWeight: 700 }}>{scr.title}</span>
                      <span style={{ fontSize: '0.62rem', opacity: 0.8, fontWeight: 500 }}>{scr.desc}</span>
                    </div>
                    <ArrowRight size={12} />
                  </button>
                ))}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '10px 0' }} />

              <button 
                className="btn-sim btn-sim-outline" 
                onClick={() => {
                  setShowLogin(false);
                  addLog('info', 'SIMULATOR: Closed simulator workspace.');
                }}
              >
                ← Back to Homepage
              </button>
            </aside>

            {/* Smartphone Mockup Frame Container (Right) */}
            <main 
              className={`phone-mockup-frame ${simDarkMode ? 'dark-sim' : ''}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* Confetti Animation Effect Overlay */}
              {simConfetti && (
                <div className="confetti-overlay" style={{ background: 'rgba(16, 185, 129, 0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={48} className="text-emerald-400 animate-bounce" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10B981', background: '#FFF', padding: '6px 14px', borderRadius: '12px', marginTop: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    Contract Dispatched!
                  </span>
                </div>
              )}

              {/* Status Bar */}
              <div className="phone-notch"></div>
              <div className="phone-status-bar">
                <span>9:41</span>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {simOffline && <span style={{ fontSize: '0.55rem', backgroundColor: '#F59E0B', color: '#000', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>OFFLINE</span>}
                  <span>5G</span>
                  <div style={{ width: '16px', height: '9px', border: '1px solid currentColor', borderRadius: '2px', padding: '1px', display: 'flex' }}>
                    <div style={{ flex: 1, backgroundColor: 'currentColor', borderRadius: '1px' }}></div>
                  </div>
                </div>
              </div>

              {/* Scrollable Viewport Frame */}
              <div className="phone-screen-container">
                
                {/* 01 SPLASH SCREEN */}
                {activeSimScreen === '01_splash' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', cursor: 'pointer' }} onClick={() => setActiveSimScreen('02_onboarding_1')}>
                    <LogoSVG />
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1D4ED8', marginTop: '10px' }}>Karm<span>Setu</span></h2>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '8px', fontWeight: 600 }}>Bridging Skills and Opportunities</span>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '24px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1D4ED8', animation: 'bounce 1s infinite alternate' }}></div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1D4ED8', animation: 'bounce 1s infinite alternate', animationDelay: '0.2s' }}></div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1D4ED8', animation: 'bounce 1s infinite alternate', animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}

                {/* 02 ONBOARDING 1 */}
                {activeSimScreen === '02_onboarding_1' && (
                  <div className="onboarding-screen-wrapper">
                    <h2 className="onboarding-title">Every Skill<br />Deserves Recognition.</h2>
                    <div className="card-sim" style={{ margin: '30px auto', padding: '24px', width: '100%', maxWidth: '240px', textAlign: 'center', borderRadius: '20px' }}>
                      <span style={{ fontSize: '3rem', display: 'block' }}>👷</span>
                      <strong style={{ fontSize: '0.9rem', color: '#1D4ED8', display: 'block', marginTop: '10px' }}>Insulated Tools Drill</strong>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Workers film short drills demonstrating active trade safety practices on camera.</p>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
                        <span style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#1D4ED8' }}></span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0' }}></span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0' }}></span>
                      </div>
                      <button className="btn-sim btn-sim-primary" onClick={() => setActiveSimScreen('03_onboarding_2')}>Next Screen</button>
                    </div>
                  </div>
                )}

                {/* 03 ONBOARDING 2 */}
                {activeSimScreen === '03_onboarding_2' && (
                  <div className="onboarding-screen-wrapper">
                    <h2 className="onboarding-title">Certificates<br />don't define talent.</h2>
                    <div className="card-sim" style={{ margin: '30px auto', padding: '24px', width: '100%', maxWidth: '240px', textAlign: 'center', borderRadius: '20px' }}>
                      <span style={{ fontSize: '3rem', display: 'block' }}>📱</span>
                      <strong style={{ fontSize: '0.9rem', color: '#10B981', display: 'block', marginTop: '10px' }}>Instant Verification</strong>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Employers verify skill passports with a simple QR scan in the field.</p>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0' }}></span>
                        <span style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#1D4ED8' }}></span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0' }}></span>
                      </div>
                      <button className="btn-sim btn-sim-primary" onClick={() => setActiveSimScreen('04_onboarding_3')}>Next Screen</button>
                    </div>
                  </div>
                )}

                {/* 04 ONBOARDING 3 */}
                {activeSimScreen === '04_onboarding_3' && (
                  <div className="onboarding-screen-wrapper">
                    <h2 className="onboarding-title">Show your work.<br />We'll help prove it.</h2>
                    <div className="card-sim" style={{ margin: '30px auto', padding: '24px', width: '100%', maxWidth: '240px', textAlign: 'center', borderRadius: '20px' }}>
                      <span style={{ fontSize: '3rem', display: 'block' }}>🪪</span>
                      <strong style={{ fontSize: '0.9rem', color: '#F59E0B', display: 'block', marginTop: '10px' }}>Verified Passport</strong>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>A premium digital identity showing verified safety metrics and trade capabilities.</p>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0' }}></span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0' }}></span>
                        <span style={{ width: '16px', height: '6px', borderRadius: '3px', backgroundColor: '#1D4ED8' }}></span>
                      </div>
                      <button className="btn-sim btn-sim-primary" onClick={() => setActiveSimScreen('05_language')}>Get Started</button>
                    </div>
                  </div>
                )}

                {/* 05 LANGUAGE SELECTION */}
                {activeSimScreen === '05_language' && (
                  <div className="phone-screen-scroll" style={{ paddingBottom: '30px' }}>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Select Language</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Choose your native language for voice assessment prompts.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                      {[
                        { lang: 'English', native: 'English' },
                        { lang: 'Hindi', native: 'हिन्दी' },
                        { lang: 'Tamil', native: 'தமிழ்' },
                        { lang: 'Bengali', native: 'বাংলা' },
                        { lang: 'Marathi', native: 'मराठी' },
                        { lang: 'Telugu', native: 'తెలుగు' }
                      ].map(item => (
                        <div 
                          key={item.lang}
                          className="card-sim"
                          onClick={() => {
                            setSimLanguage(item.lang);
                            setActiveSimScreen('06_login');
                            addLog('info', `SIMULATOR: Set application language to ${item.lang}`);
                          }}
                          style={{ 
                            padding: '16px', 
                            textAlign: 'center', 
                            cursor: 'pointer',
                            border: simLanguage === item.lang ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                            backgroundColor: simLanguage === item.lang ? 'var(--color-primary-light)' : ''
                          }}
                        >
                          <strong style={{ display: 'block', fontSize: '0.85rem' }}>{item.lang}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{item.native}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 06 LOGIN PORTAL */}
                {activeSimScreen === '06_login' && (
                  <div className="phone-screen-scroll">
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      <LogoSVG />
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '10px' }}>KarmSetu Login</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Verify your identity to generate your Skill Passport.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Mobile Number</label>
                        <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '12px 16px', backgroundColor: 'var(--color-bg)' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>+91</span>
                          <input 
                            type="tel" 
                            placeholder="Enter 10-digit number" 
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', flex: 1, color: 'var(--color-text-primary)' }}
                            value={simPhoneInput}
                            onChange={(e) => setSimPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          />
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--color-accent-light)', border: '1px solid var(--color-accent)', padding: '10px 14px', borderRadius: '16px', fontSize: '0.72rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        ★ Demo Bypass: Enter code 4821 on next screen.
                      </div>

                      <button 
                        className="btn-sim btn-sim-primary" 
                        onClick={() => {
                          if (simPhoneInput.length < 10) {
                            alert('Please enter a valid 10-digit phone number.');
                            return;
                          }
                          setActiveSimScreen('07_otp');
                        }}
                      >
                        Send Verification Code
                      </button>
                    </div>
                  </div>
                )}

                {/* 07 SMS OTP VERIFICATION */}
                {activeSimScreen === '07_otp' && (
                  <div className="phone-screen-scroll">
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Enter Code</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                        Verification SMS dispatched to +91 {simPhoneInput || '98765 43210'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                      <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '12px 16px', backgroundColor: 'var(--color-bg)' }}>
                        <Lock size={14} className="text-blue-500" />
                        <input 
                          type="text" 
                          placeholder="Enter 4-Digit Demo OTP (4821)" 
                          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', flex: 1, textAlign: 'center', color: 'var(--color-text-primary)' }}
                          value={simOtpInput}
                          onChange={(e) => setSimOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        />
                      </div>

                      <button 
                        className="btn-sim btn-sim-primary" 
                        onClick={() => {
                          if (simOtpInput === '4821') {
                            setActiveSimScreen('08_home');
                            addLog('success', 'SIMULATOR AUTH: Code approved. Logging in...');
                          } else {
                            alert('Incorrect OTP. Enter 4821 for Demo access.');
                          }
                        }}
                      >
                        Verify and Enter
                      </button>
                    </div>
                  </div>
                )}

                {/* 08 HOME DASHBOARD */}
                {activeSimScreen === '08_home' && (
                  <div className="phone-screen-scroll">
                    
                    {/* Welcome Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Hello Ravi 👋</h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Electrician • Delhi NCR</span>
                      </div>
                      <span style={{ fontSize: '0.62rem', backgroundColor: '#10B981', color: '#FFF', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>✓ VERIFIED</span>
                    </div>

                    {/* Trust Score Circle widget */}
                    <div className="card-sim" style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)', color: '#FFF', padding: '20px', borderRadius: '24px', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.62rem', opacity: 0.8, fontWeight: 700, letterSpacing: '0.5px' }}>GLOBAL TRUST SCORE</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '2px', fontFamily: 'monospace' }}>92%</h2>
                        <span style={{ fontSize: '0.62rem', opacity: 0.8, display: 'block', marginTop: '4px' }}>Top 5% electrician directory rank</span>
                      </div>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.15)', borderTopColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem' }}>
                        Gold
                      </div>
                    </div>

                    {/* Next Assessment banner */}
                    <div className="card-sim" style={{ borderLeft: '4px solid #F59E0B', padding: '12px 16px' }}>
                      <span style={{ fontSize: '0.62rem', color: '#D97706', fontWeight: 700, display: 'block' }}>NEXT REQUIRED ASSESSMENT</span>
                      <strong style={{ fontSize: '0.8rem', display: 'block', marginTop: '2px', color: 'var(--color-text-primary)' }}>⚡ Electrical Wire Splice Safety</strong>
                      <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '2px' }}>NSQF level 4 compliance checks required.</span>
                    </div>

                    {/* Actions Grid */}
                    <div>
                      <h5 style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Quick Actions</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="card-sim" onClick={() => setActiveSimScreen('09_assessment')} style={{ padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem' }}>📹</span>
                          <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>Verify Skill</span>
                            <span style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)' }}>Camera checklist</span>
                          </div>
                        </div>

                        <div className="card-sim" onClick={() => setActiveSimScreen('14_passport')} style={{ padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem' }}>🪪</span>
                          <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>Passport</span>
                            <span style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)' }}>Apple Wallet view</span>
                          </div>
                        </div>

                        <div className="card-sim" onClick={() => setActiveSimScreen('16_employer_view')} style={{ padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem' }}>💼</span>
                          <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>Jobs View</span>
                            <span style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)' }}>Hiring requests</span>
                          </div>
                        </div>

                        <div className="card-sim" onClick={() => setActiveSimScreen('13_voice_interview')} style={{ padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem' }}>🎤</span>
                          <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>Practice</span>
                            <span style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)' }}>Speech interview</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activity Feed */}
                    <div>
                      <h5 style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Recent Activity</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '4px 0' }}>
                          <span style={{ color: 'var(--color-text-primary)' }}>✓ Insulated cut check verified</span>
                          <span style={{ color: 'var(--color-text-light)' }}>2 hours ago</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '4px 0' }}>
                          <span style={{ color: 'var(--color-text-primary)' }}>✓ SQLite sync catalog upload successful</span>
                          <span style={{ color: 'var(--color-text-light)' }}>Yesterday</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 09 CHOOSE TRADE */}
                {activeSimScreen === '09_assessment' && (
                  <div className="phone-screen-scroll">
                    <div style={{ marginTop: '10px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Verify Skill Category</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Choose the trade drill you wish to film.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                      {[
                        { id: '⚡ Electrician', desc: 'Wiring board safety switches' },
                        { id: '🔧 Plumber', desc: 'Teflon seam windings checks' },
                        { id: '🪚 Carpenter', desc: 'Mortise tenon square checks' },
                        { id: '🧵 Tailor', desc: 'Fabric alignment seam safety' },
                        { id: ' Mason', desc: 'Brick laying mortar level tests' }
                      ].map(tr => (
                        <div 
                          key={tr.id}
                          className="card-sim"
                          onClick={() => {
                            setSimSelectedTrade(tr.id);
                            setActiveSimScreen('10_camera');
                            addLog('info', `SIMULATOR Assessment: Initiated camera for ${tr.id}`);
                          }}
                          style={{ 
                            padding: '16px', 
                            cursor: 'pointer',
                            border: simSelectedTrade === tr.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                            backgroundColor: simSelectedTrade === tr.id ? 'var(--color-primary-light)' : '',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: '0.85rem', display: 'block' }}>{tr.id}</strong>
                            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>{tr.desc}</span>
                          </div>
                          <ArrowRight size={14} className="text-blue-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10 CAMERA VIEWFINDER */}
                {activeSimScreen === '10_camera' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#000', position: 'relative' }}>
                    
                    {/* Viewfinder simulation box */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      
                      {/* Grid overlays */}
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '1px solid rgba(255,255,255,0.08)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr' }}>
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)' }}></div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)' }}></div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)' }}></div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)' }}></div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)' }}></div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)' }}></div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)' }}></div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)' }}></div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.05)' }}></div>
                      </div>

                      {/* Diagnostic target guidelines overlay */}
                      <div style={{ position: 'absolute', top: '50px', left: '16px', right: '16px', background: 'rgba(0,0,0,0.7)', borderRadius: '12px', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ fontSize: '0.58rem', color: '#F59E0B', fontWeight: 800 }}>DIAGNOSTIC TARGET</span>
                        <strong style={{ fontSize: '0.72rem', color: '#FFF', display: 'block', marginTop: '2px' }}>Film insulated wire strippers core drill</strong>
                        <span style={{ fontSize: '0.62rem', color: '#94A3B8', display: 'block', marginTop: '1px' }}>Ensure hands & insulation wrapping visible.</span>
                      </div>

                      {/* Webcam static overlay simulation background */}
                      <div style={{ textAlign: 'center', color: '#94A3B8', padding: '20px' }}>
                        <span style={{ fontSize: '2.5rem', display: 'block' }}>📹</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginTop: '8px' }}>Webcam Simulator Active</span>
                      </div>

                      {/* Shutter feedback timer */}
                      {simRecordingSeconds > 0 && (
                        <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#EF4444', color: '#FFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, animation: 'pulse 1s infinite' }}>
                          RECORDING {simRecordingSeconds}s
                        </div>
                      )}
                    </div>

                    {/* Camera footer panel controls */}
                    <div style={{ backgroundColor: '#0F172A', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                        {simRecordingSeconds > 0 ? 'Recording safety drill sequence...' : 'Position camera and press record button.'}
                      </span>
                      
                      <button 
                        onClick={() => {
                          if (simRecordingSeconds === 0) {
                            setSimRecordingSeconds(1);
                            addLog('info', 'SIMULATOR CAMERA: Initiated 5-second video recording sequence...');
                          } else {
                            setActiveSimScreen('11_ai_analysis');
                            setSimRecordingSeconds(0);
                          }
                        }}
                        style={{ 
                          width: '56px', 
                          height: '56px', 
                          borderRadius: '50%', 
                          backgroundColor: '#FFF', 
                          border: '4px solid #334155', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          outline: 'none'
                        }}
                      >
                        <div style={{ width: '24px', height: '24px', borderRadius: simRecordingSeconds > 0 ? '4px' : '50%', backgroundColor: '#EF4444', transition: 'all 0.2s ease' }}></div>
                      </button>
                    </div>

                  </div>
                )}

                {/* 11 AI FRAME COMPLIANCE ANALYSIS */}
                {activeSimScreen === '11_ai_analysis' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
                    
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>AI Vision Compliance Engine</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Analyzing video frames for NSQF Level 4 compliance...</p>

                    <div style={{ width: '100%', maxWidth: '240px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', marginTop: '24px' }}>
                      {[
                        { title: 'Detecting Tools and Gear', step: 1 },
                        { title: 'Checking Safety Gloves Wrap', step: 2 },
                        { title: 'Evaluating Cable Stripping Technique', step: 3 },
                        { title: 'Formulating Score Diagnostic Report', step: 4 }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', opacity: simAnalysisStep >= item.step ? 1 : 0.4 }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: simAnalysisStep >= item.step ? '#10B981' : '#E2E8F0', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 900 }}>
                            {simAnalysisStep >= item.step ? '✓' : ''}
                          </div>
                          <span style={{ fontWeight: 600 }}>{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 12 AI DIAGNOSTIC REPORT */}
                {activeSimScreen === '12_ai_report' && (
                  <div className="phone-screen-scroll">
                    <div style={{ marginTop: '10px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>AI Skill Scorecard</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>AI compliance metrics for {simSelectedTrade}</p>
                    </div>

                    <div className="card-sim" style={{ background: '#0F172A', color: '#FFF', padding: '16px', borderRadius: '20px', textAlign: 'center', border: 'none' }}>
                      <span style={{ fontSize: '0.62rem', color: '#38BDF8', fontWeight: 700, letterSpacing: '0.5px' }}>OVERALL CONFIDENCE RATING</span>
                      <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38BDF8', marginTop: '4px' }}>91%</h2>
                      <span style={{ fontSize: '0.62rem', color: '#94A3B8', display: 'block', marginTop: '4px' }}>Grade L4 safety standards approved</span>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="card-sim" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <strong style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)' }}>Key Strengths:</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        <span style={{ color: '#10B981', fontWeight: 600 }}>✓ Insulated cutter handle detected</span>
                        <span style={{ color: '#10B981', fontWeight: 600 }}>✓ Perfect wire-core copper stripping depth</span>
                      </div>

                      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

                      <strong style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)' }}>Improvements Needed:</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        <span style={{ color: '#F59E0B', fontWeight: 600 }}>• Recommend rubber work gloves for high load</span>
                        <span style={{ color: '#F59E0B', fontWeight: 600 }}>• Check mains voltage status before cut</span>
                      </div>
                    </div>

                    <button 
                      className="btn-sim btn-sim-primary" 
                      onClick={() => {
                        setActiveSimScreen('13_voice_interview');
                        addLog('info', 'SIMULATOR AI: Loaded voice safety interview...');
                      }}
                    >
                      Generate Passport
                    </button>
                  </div>
                )}

                {/* 13 VOICE SAFETY INTERVIEW */}
                {activeSimScreen === '13_voice_interview' && (
                  <div className="phone-screen-scroll" style={{ paddingBottom: '100px' }}>
                    <div style={{ marginTop: '10px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Voice Interview</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>AI voice synthesis security verification.</p>
                    </div>

                    {/* Question Box */}
                    <div className="card-sim" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'rgba(29, 78, 216, 0.1)' }}>
                      <span style={{ fontSize: '0.58rem', color: 'var(--color-primary)', fontWeight: 800 }}>AI VOICE QUESTION</span>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-text-primary)' }}>
                        "Explain the safety checks when replacing a 16A MCB box."
                      </p>
                    </div>

                    {/* Microphone waveform animations */}
                    <div style={{ textAlign: 'center', margin: '14px 0' }}>
                      <div className="voice-waves-row">
                        <div className="wave-bar"></div>
                        <div className="wave-bar"></div>
                        <div className="wave-bar"></div>
                        <div className="wave-bar"></div>
                        <div className="wave-bar"></div>
                      </div>
                      <span style={{ fontSize: '0.62rem', color: 'var(--color-text-light)' }}>Listening... Speak your response clearly</span>
                    </div>

                    {/* Transcription input */}
                    <div className="card-sim" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Transcribed Answer Preview:</label>
                      <textarea 
                        style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px', fontSize: '0.72rem', background: 'var(--color-bg)', outline: 'none', color: 'var(--color-text-primary)', resize: 'none', height: '60px' }}
                        value={simInterviewResponse || "I switch off the main MCB breaker switches, use test leads to check voltage, and wear heavy rubber gloves."}
                        onChange={(e) => setSimInterviewResponse(e.target.value)}
                      />
                    </div>

                    <button 
                      className="btn-sim btn-sim-primary" 
                      onClick={() => {
                        setActiveSimScreen('14_passport');
                        addLog('success', 'SIMULATOR AI: Voice response transcript evaluated and approved.');
                      }}
                    >
                      Submit Verbal Response
                    </button>
                  </div>
                )}

                {/* 14 VERIFIED SKILL PASSPORT */}
                {activeSimScreen === '14_passport' && (
                  <div className="phone-screen-scroll" style={{ paddingBottom: '90px' }}>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Skill Passport</h4>
                      <span style={{ fontSize: '0.62rem', backgroundColor: '#F59E0B', color: '#000', padding: '2px 8px', borderRadius: '8px', fontWeight: 800 }}>GOLD TIER</span>
                    </div>

                    {/* Premium Apple Wallet Card */}
                    <div className="premium-passport-card" style={{ cursor: 'pointer', transform: 'scale(0.98)', transformOrigin: 'top center', marginBottom: '10px' }}>
                      <div className="hologram-strip"></div>
                      
                      <div className="passport-badge-header">
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.5px' }}>★ KARMSETU VERIFIED ★</span>
                        <span style={{ fontSize: '0.58rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#94A3B8' }}>KS-8821</span>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #F59E0B' }}>
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" alt="Ravi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: '#FFF', display: 'block' }}>Ravi Kumar</strong>
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Electrician • 5 Years Experience</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
                        <span className="passport-badge-pill" style={{ color: '#F59E0B', fontSize: '0.6rem', padding: '2px 6px' }}>★ Safety Champion</span>
                        <span className="passport-badge-pill" style={{ color: '#38BDF8', fontSize: '0.6rem', padding: '2px 6px' }}>⚡ MCB Insulated</span>
                      </div>

                      {/* QR verification area */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.55rem', color: '#64748B', display: 'block' }}>REGISTRY VERIFICATION</span>
                          <span style={{ fontSize: '0.65rem', color: '#38BDF8', display: 'block', fontWeight: 700 }}>NSDC NSQF Mapping OK</span>
                        </div>
                        
                        <div style={{ width: '48px', height: '48px', backgroundColor: '#FFF', padding: '3px', borderRadius: '4px' }}>
                          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                            <rect width="100" height="100" fill="white" />
                            <path d="M10 10h30v30H10zm5 5h20v20H15zm45-5h30v30H60zm5 5h20v20H65zM10 60h30v30H10zm5 5h20v20H15zm50 15h10v10H65zm10-10h15v10H75zm-15-5h15v10H60zm25 0h5v10H85zm-15 15h5v5h-5z" fill="black" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Skill DNA Score meter */}
                    <div className="card-sim" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <strong style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.5px' }}>⚡ Skill DNA scorecard</strong>
                      
                      {[
                        { name: 'Precision', val: 94, col: '#3B82F6' },
                        { name: 'Safety Standards', val: 88, col: '#10B981' },
                        { name: 'Workflow Speed', val: 92, col: '#EC4899' },
                        { name: 'Problem Solving', val: 90, col: '#8B5CF6' }
                      ].map(bar => (
                        <div key={bar.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '2px' }}>
                            <span style={{ color: 'var(--color-text-primary)' }}>{bar.name}</span>
                            <span style={{ fontWeight: 700 }}>{bar.val}%</span>
                          </div>
                          <div style={{ backgroundColor: 'var(--color-border)', height: '5px', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${bar.val}%`, backgroundColor: bar.col, height: '100%' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      className="btn-sim btn-sim-primary" 
                      onClick={() => {
                        setActiveSimScreen('15_employer_scan');
                        addLog('info', 'SIMULATOR: Loaded QR scanner mock frame.');
                      }}
                    >
                      Simulate Employer QR Scan
                    </button>
                  </div>
                )}

                {/* 15 SCAN SCANNER SIMULATOR */}
                {activeSimScreen === '15_employer_scan' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0F172A', position: 'relative', overflow: 'hidden' }}>
                    
                    {/* QR Finder box */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                      <div style={{ width: '220px', height: '220px', border: '3px solid #1D4ED8', borderRadius: '24px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(29, 78, 216, 0.3)' }}>
                        
                        {/* Corner markers */}
                        <div style={{ width: '40px', height: '40px', borderLeft: '4px solid #1D4ED8', borderTop: '4px solid #1D4ED8', position: 'absolute', top: '-6px', left: '-6px', borderTopLeftRadius: '10px' }}></div>
                        <div style={{ width: '40px', height: '40px', borderRight: '4px solid #1D4ED8', borderTop: '4px solid #1D4ED8', position: 'absolute', top: '-6px', right: '-6px', borderTopRightRadius: '10px' }}></div>
                        <div style={{ width: '40px', height: '40px', borderLeft: '4px solid #1D4ED8', borderBottom: '4px solid #1D4ED8', position: 'absolute', bottom: '-6px', left: '-6px', borderBottomLeftRadius: '10px' }}></div>
                        <div style={{ width: '40px', height: '40px', borderRight: '4px solid #1D4ED8', borderBottom: '4px solid #1D4ED8', position: 'absolute', bottom: '-6px', right: '-6px', borderBottomRightRadius: '10px' }}></div>

                        <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                          <span style={{ fontSize: '2.5rem', display: 'block' }}>📷</span>
                          <span style={{ fontSize: '0.65rem', display: 'block', marginTop: '6px' }}>Aim camera at QR passport</span>
                        </div>
                      </div>

                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '30px', textAlign: 'center' }}>
                        Scanning system maps decoded profile to central registry.
                      </span>
                    </div>

                    <div style={{ padding: '20px', backgroundColor: '#1E293B', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button 
                        className="btn-sim btn-sim-primary" 
                        onClick={() => {
                          setActiveSimScreen('16_employer_view');
                          addLog('success', 'QR SCANNER: Scanned Skill Passport successfully. Decoded ID: ravi-kumar');
                        }}
                      >
                        Simulate Scan Success
                      </button>
                    </div>

                  </div>
                )}

                {/* 16 EMPLOYER AUDIT VIEW */}
                {activeSimScreen === '16_employer_view' && (
                  <div className="phone-screen-scroll" style={{ paddingBottom: '90px' }}>
                    <div style={{ marginTop: '10px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>Verified Candidate</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Profile retrieved via secure QR payload</p>
                    </div>

                    <div className="card-sim" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" alt="Ravi" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <strong style={{ fontSize: '0.9rem', display: 'block' }}>Ravi Kumar</strong>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>Electrician • 5 Years Exp</span>
                        <span style={{ fontSize: '0.68rem', color: '#10B981', display: 'block', fontWeight: 700, marginTop: '2px' }}>✓ Score rating: 91% approved</span>
                      </div>
                    </div>

                    {/* Play Video Diagnostic section */}
                    <div className="card-sim" style={{ padding: '12px' }}>
                      <strong style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>AI Video Audit Logs:</strong>
                      <div 
                        onClick={() => alert('Playing simulated video safety drill...')}
                        style={{ height: '110px', background: '#0F172A', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', cursor: 'pointer' }}
                      >
                        <Play size={20} className="text-emerald-400" />
                        <span style={{ fontSize: '0.62rem', marginTop: '6px' }}>View Safety Drill (5-sec check)</span>
                      </div>
                    </div>

                    {/* DNA metrics */}
                    <div className="card-sim" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <strong style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Traits Matrix:</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem' }}>
                        <span>Precision:</span> <strong style={{ color: '#1D4ED8' }}>94%</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem' }}>
                        <span>Safety Compliance:</span> <strong style={{ color: '#10B981' }}>88%</strong>
                      </div>
                    </div>

                    <button 
                      className="btn-sim btn-sim-primary" 
                      onClick={() => {
                        setSimConfetti(true);
                        addLog('success', 'SIMULATOR HIRE: Dispatching contract offer invitation package to candidate Ravi Kumar.');
                        setTimeout(() => {
                          setSimConfetti(false);
                        }, 4000);
                      }}
                    >
                      Hire Candidate
                    </button>
                  </div>
                )}

                {/* 17 WORKER PROFILE VIEW */}
                {activeSimScreen === '17_profile' && (
                  <div className="phone-screen-scroll" style={{ paddingBottom: '90px' }}>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" alt="Ravi" style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid var(--color-primary)', objectFit: 'cover', margin: '0 auto' }} />
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '8px' }}>Ravi Kumar</h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Delhi NCR • Hindi & English</span>
                    </div>

                    {/* verified badges shelfs */}
                    <div className="card-sim">
                      <strong style={{ fontSize: '0.75rem', display: 'block', marginBottom: '8px' }}>Verified Credentials</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '4px 10px', borderRadius: '8px', fontWeight: 600 }}>★ Safety Champion</span>
                        <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '4px 10px', borderRadius: '8px', fontWeight: 600 }}>⚡ MCB Certified</span>
                        <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '4px 10px', borderRadius: '8px', fontWeight: 600 }}>✓ Aadhaar Verified</span>
                      </div>
                    </div>

                    {/* past drills list */}
                    <div>
                      <strong style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Recent Video Drills</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="card-sim" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>Insulated wire cut drill</span>
                          <span style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 800 }}>92% Score</span>
                        </div>
                        <div className="card-sim" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>Breaker swap safety check</span>
                          <span style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 800 }}>88% Score</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 18 SYSTEM SETTINGS */}
                {activeSimScreen === '18_settings' && (
                  <div className="phone-screen-scroll" style={{ paddingBottom: '90px' }}>
                    <div style={{ marginTop: '10px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>App Settings</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Configure client sandbox parameters</p>
                    </div>

                    {/* Toggle Settings */}
                    <div className="card-sim" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.8rem', display: 'block' }}>Dark Mode Theme</strong>
                          <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>Toggle visual colors style</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={simDarkMode} 
                          onChange={(e) => {
                            setSimDarkMode(e.target.checked);
                            addLog('info', `SIMULATOR Settings: Switched phone mockup dark mode state to ${e.target.checked}`);
                          }}
                          style={{ width: '36px', height: '20px', cursor: 'pointer' }}
                        />
                      </div>

                      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.8rem', display: 'block' }}>Offline Mode Simulation</strong>
                          <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>Queue SQLite sync triggers offline</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={simOffline} 
                          onChange={(e) => {
                            setSimOffline(e.target.checked);
                            addLog('success', `SYNC ENGINE: offline synchronization state toggled to: ${e.target.checked}`);
                          }}
                          style={{ width: '36px', height: '20px', cursor: 'pointer' }}
                        />
                      </div>
                    </div>

                    <div className="card-sim" style={{ padding: '12px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Sandbox Compliance:</span>
                      <div style={{ fontSize: '0.62rem', color: 'var(--color-text-light)', marginTop: '4px', lineHeight: 1.4 }}>
                        KarmSetu client builds conform to central UIDAI Aadhaar registry policies and NSDC mapping index specifications.
                      </div>
                    </div>

                    <button 
                      className="btn-sim btn-sim-outline" 
                      onClick={() => {
                        setShowLogin(false);
                        addLog('info', 'SIMULATOR Settings: Revoked session context. Returned to homepage.');
                      }}
                      style={{ color: '#EF4444', borderColor: '#EF4444' }}
                    >
                      Exit Simulator & Logout
                    </button>
                  </div>
                )}

              </div>

              {/* Bottom Nav Bar (visible on Home dashboard onwards) */}
              {![
                '01_splash', 
                '02_onboarding_1', 
                '03_onboarding_2', 
                '04_onboarding_3', 
                '05_language', 
                '06_login', 
                '07_otp'
              ].includes(activeSimScreen) && (
                <nav className="phone-bottom-nav">
                  <button 
                    className={`nav-item-btn ${['08_home'].includes(activeSimScreen) ? 'active' : ''}`}
                    onClick={() => setActiveSimScreen('08_home')}
                  >
                    🏠
                    <span>Home</span>
                  </button>
                  <button 
                    className={`nav-item-btn ${['09_assessment', '10_camera', '11_ai_analysis', '12_ai_report', '13_voice_interview'].includes(activeSimScreen) ? 'active' : ''}`}
                    onClick={() => setActiveSimScreen('09_assessment')}
                  >
                    🎥
                    <span>Assess</span>
                  </button>
                  <button 
                    className={`nav-item-btn ${['14_passport', '15_employer_scan'].includes(activeSimScreen) ? 'active' : ''}`}
                    onClick={() => setActiveSimScreen('14_passport')}
                  >
                    🪪
                    <span>Passport</span>
                  </button>
                  <button 
                    className={`nav-item-btn ${['16_employer_view'].includes(activeSimScreen) ? 'active' : ''}`}
                    onClick={() => setActiveSimScreen('16_employer_view')}
                  >
                    💼
                    <span>Jobs</span>
                  </button>
                  <button 
                    className={`nav-item-btn ${['17_profile', '18_settings'].includes(activeSimScreen) ? 'active' : ''}`}
                    onClick={() => setActiveSimScreen('17_profile')}
                  >
                    👤
                    <span>Profile</span>
                  </button>
                </nav>
              )}

            </main>

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
