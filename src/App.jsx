import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, CheckCircle, Video, Mic, Briefcase, Award, Search, Users, QrCode, 
  MapPin, TrendingUp, Plus, Phone, ArrowRight, Globe, RefreshCw, FileText, 
  Check, AlertCircle, X, Activity, Sparkles, Clock, Smartphone, Star, Play, 
  CheckCircle2, Compass, AlertTriangle, Menu, Send, ChevronRight, Sun, Moon, 
  FileCheck, Download, Code, Database, Server, Settings, Key
} from 'lucide-react';

// Firebase imports
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, updateDoc, collection } from 'firebase/firestore';

import './App.css';

// SVG logo of KarmSetu: Bridge forming "K"
const LogoSVG = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: '38px', height: '38px' }}>
    <path d="M25 15 C25 15, 25 35, 25 50 C25 65, 25 85, 25 85 H35 C35 70, 35 60, 35 50 C35 40, 35 30, 35 15 H25 Z" fill="#1E40AF" />
    <path d="M15 85 C15 65, 25 45, 50 45 C75 45, 85 65, 85 85 H73 C73 70, 65 57, 50 57 C35 57, 27 70, 27 85 H15 Z" fill="#1E40AF" />
    <path d="M50 45 L78 17 H92 L57 52 Z" fill="#10B981" />
    <path d="M50 57 L80 85 H94 L57 50 Z" fill="#F59E0B" />
    <circle cx="85" cy="17" r="5" fill="#F59E0B" />
  </svg>
);

const QUESTION_BANKS = {
  Electrician: [
    {
      q: "Distribution Box: What is the first safety action you take before stripping wire inside a distribution panel?",
      keywords: ["power off", "mains", "mcb", "voltage", "tester", "gloves", "mains switch"]
    },
    {
      q: "Circuit Design: Can you describe why we connect household ceiling fans in a parallel circuit instead of series?",
      keywords: ["voltage", "independent", "control", "series", "parallel", "resistance", "fuse"]
    },
    {
      q: "Fault Finding: How do you identify a short circuit in a system using a digital multimeter?",
      keywords: ["resistance", "continuity", "beep", "multimeter", "zero", "ohms", "leads"]
    }
  ],
  Plumber: [
    {
      q: "Leaks: What precaution do you take before assembling a threaded pipe joint to prevent micro leaks?",
      keywords: ["teflon", "tape", "sealant", "thread", "clean", "grease", "tighten"]
    },
    {
      q: "Blockage: What tool and approach do you use to clear a heavy fat deposit inside a main sewer pipe?",
      keywords: ["plunger", "drain snake", "chemical", "auger", "pressure", "water jet"]
    },
    {
      q: "System setup: How do you verify the pressure levels in a new PPR water supply piping network?",
      keywords: ["pressure gauge", "pump", "psi", "leakage", "water test", "bar"]
    }
  ],
  Tailor: [
    {
      q: "Fabric Prep: Why is it important to pre-wash linen or heavy cotton fabrics before patterns are drafted?",
      keywords: ["shrink", "shrinkage", "size", "iron", "measure", "fit", "stretch"]
    },
    {
      q: "Machine safety: What adjustment is needed when switching from light silk to heavy canvas denim?",
      keywords: ["needle", "tension", "thread", "stitch length", "presser foot", "speed"]
    },
    {
      q: "Pattern cuts: What precaution do you take when layout out templates on a checkered fabric grid?",
      keywords: ["match", "alignment", "grainline", "checks", "stripes", "seam allowance"]
    }
  ],
  Carpenter: [
    {
      q: "Timber Check: How do you identify if a teak plank has excessive moisture content before planning joints?",
      keywords: ["moisture meter", "weight", "warp", "dry", "humidity", "crack"]
    },
    {
      q: "Joint Assembly: Describe the steps to prepare a flush mortise and tenon joint using hand tools.",
      keywords: ["chisel", "saw", "mortise", "tenon", "glue", "clamp", "square", "measure"]
    },
    {
      q: "Finishing: What sanding grit progression do you use to prepare a veneer surface for PU polish?",
      keywords: ["grit", "sanding", "smooth", "veneer", "dust", "polish"]
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

export default function App() {
  // Theme state: dark / light modes
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('karmsetu_theme') || 'dark';
  });

  // Showcase state selectors
  const [showcaseView, setShowcaseView] = useState('dual');
  const [isOffline, setIsOffline] = useState(false);
  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('karmsetu_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  // Real Backend Configurations (Firebase + Gemini)
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [firebaseConfigInput, setFirebaseConfigInput] = useState(() => {
    const saved = localStorage.getItem('karmsetu_firebase_config_input');
    return saved || '';
  });
  const [geminiKey, setGeminiKey] = useState(() => {
    return localStorage.getItem('karmsetu_gemini_key') || '';
  });

  // Active Firebase SDK Database instance
  const [db, setDb] = useState(null);

  // Selected worker details (Employer Panel)
  const [selectedWorkerId, setSelectedWorkerId] = useState('ravi-kumar');
  const [hiredWorkerId, setHiredWorkerId] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Search & Filtering elements for Employer List
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrade, setFilterTrade] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');

  // SQLite Console logs queue for display
  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'info', text: 'INFO: Initiated KarmSetu SQLite Sync Engine.' },
    { type: 'query', text: 'SQL: SELECT * FROM workers ORDER BY trustScore DESC;' },
    { type: 'success', text: 'SQL: Loaded 3 verified profiles from cached storage.' }
  ]);

  // Worker App Navigation
  const [appStep, setAppStep] = useState('splash');
  const [onboardingSlide, setOnboardingSlide] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [currentTab, setCurrentTab] = useState('home');

  // AI Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedAssessmentSkill, setSelectedAssessmentSkill] = useState('Electrician');
  const [recordingState, setRecordingState] = useState('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [assessmentStep, setAssessmentStep] = useState('camera');
  const [processingStages, setProcessingStages] = useState({
    tools: 'waiting',
    safety: 'waiting',
    technique: 'waiting',
    workflow: 'waiting'
  });

  // Multistep Voice Interview states
  const [voiceStep, setVoiceStep] = useState(0);
  const [voiceMessages, setVoiceMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceInputText, setVoiceInputText] = useState('');
  const [voiceKeyMatches, setVoiceKeyMatches] = useState(0);

  // Offline sync states
  const [syncQueue, setSyncQueue] = useState(() => {
    const saved = localStorage.getItem('karmsetu_sync_queue');
    return saved ? JSON.parse(saved) : [];
  });

  // Onboarding touch swipe detection
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      if (onboardingSlide < 2) {
        setOnboardingSlide(prev => prev + 1);
      } else {
        setAppStep('auth');
      }
    } else if (isRightSwipe) {
      if (onboardingSlide > 0) {
        setOnboardingSlide(prev => prev - 1);
      }
    }
  };

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const consoleBottomRef = useRef(null);

  // Sync theme selection to document Element
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('karmsetu_theme', themeMode);
  }, [themeMode]);

  // Sync data store changes to localStorage
  useEffect(() => {
    localStorage.setItem('karmsetu_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('karmsetu_sync_queue', JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Autoscroll Developer log terminal
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Splash timeout
  useEffect(() => {
    if (appStep === 'splash') {
      const timer = setTimeout(() => {
        setAppStep('onboarding');
        addLog('info', 'INFO: Splash screen complete. Switched to Onboarding Carousel.');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [appStep]);

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  // Setup Web Speech API for voice diagnostics
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';
      
      recognition.onstart = () => {
        setIsListening(true);
        addLog('info', 'MICROPHONE: Started listening for speech inputs...');
      };
      
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        addLog('info', `MICROPHONE: Transcribed: "${text}"`);
        handleUserVoiceResponse(text);
      };
      
      recognition.onerror = (e) => {
        setIsListening(false);
        addLog('warning', `MICROPHONE_ERROR: ${e.error}. Falling back to keyboard input simulation.`);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  // Developer sync logger helper
  const addLog = (type, text) => {
    setConsoleLogs(prev => [...prev, { type, text }]);
  };

  // Switch between Light / Dark Mode
  const toggleThemeMode = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    addLog('info', `SYSTEM: Switched UI Theme mode to: ${nextTheme.toUpperCase()}`);
  };

  // Initialize and Connect Firebase
  useEffect(() => {
    if (!firebaseConfigInput) return;
    try {
      // Clean JSON string and parse
      const config = JSON.parse(firebaseConfigInput.trim());
      if (config.projectId) {
        localStorage.setItem('karmsetu_firebase_config_input', firebaseConfigInput);
        const app = getApps().length === 0 ? initializeApp(config) : getApp();
        const firestore = getFirestore(app);
        setDb(firestore);
        addLog('success', `FIREBASE: Connected to project: ${config.projectId}`);
      }
    } catch (err) {
      addLog('warning', `FIREBASE_PARSE_ERROR: Invalid config JSON input.`);
    }
  }, [firebaseConfigInput]);

  // Real-time Firestore sync listener
  useEffect(() => {
    if (!db) return;
    addLog('info', 'SQL: Subscribing to real-time Firestore sync channel for workers...');
    
    const unsubscribe = onSnapshot(collection(db, 'workers'), (snapshot) => {
      if (snapshot.empty) {
        // Seed Firestore collection with initial workers
        addLog('info', 'FIREBASE: Firestore database is empty. Seeding initial worker profiles...');
        INITIAL_WORKERS.forEach(async (w) => {
          await setDoc(doc(db, 'workers', w.id), w);
        });
        return;
      }

      const loadedWorkers = [];
      snapshot.forEach(docSnap => {
        loadedWorkers.push(docSnap.data());
      });
      setWorkers(loadedWorkers);
      addLog('success', `SYNC: Loaded ${loadedWorkers.length} synced profiles from Firestore remote database.`);
    });

    return () => unsubscribe();
  }, [db]);

  // Save or update worker document helper
  const updateWorkerData = async (workerId, fields) => {
    if (isOffline) {
      addLog('warning', 'SQL: Connection offline. Changes cached in localStorage state only.');
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, ...fields } : w));
      return;
    }

    if (db) {
      try {
        const docRef = doc(db, 'workers', workerId);
        await updateDoc(docRef, fields);
        addLog('success', `FIREBASE: Successfully updated doc 'workers/${workerId}' on Firestore.`);
      } catch (err) {
        addLog('warning', `FIREBASE_SYNC_FAILED: ${err.message}. Saving changes locally.`);
        setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, ...fields } : w));
      }
    } else {
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, ...fields } : w));
      addLog('success', 'SQL: Local state database updated successfully.');
    }
  };

  // User trigger verification SMS code
  const triggerOTP = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    setOtpSent(true);
    setOtpTimer(30);
    setOtpCode('4821');
    addLog('query', `SMS_SERVICE: Sent verification token to +91 ${phoneNumber}`);
  };

  const verifyOTP = () => {
    if (otpCode === '4821') {
      addLog('success', `AUTH: Successfully authenticated +91 ${phoneNumber} via local credentials.`);
      setAppStep('home');
      setCurrentTab('home');
      // Initialize Multi-question voice messages
      initiateVoiceInterview(selectedAssessmentSkill);
    } else {
      alert('Demo Code is 4821');
    }
  };

  // Start Camera Feed for verification checks
  const startCamera = async () => {
    setCameraActive(true);
    setRecordingState('idle');
    setRecordingSeconds(0);
    addLog('info', `HARDWARE: Loading video camera interface for ${selectedAssessmentSkill} verification...`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        addLog('success', 'HARDWARE: Video camera connected successfully.');
      }
    } catch (err) {
      addLog('warning', 'HARDWARE: System camera unavailable or blocked. Activating canvas diagnostics simulation.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
    addLog('info', 'HARDWARE: Released video camera hardware.');
  };

  // Simulated Video capture progress
  const startRecording = () => {
    setRecordingState('recording');
    addLog('query', `SQL: INSERT INTO assessments (status, trade, type) VALUES ('recording', '${selectedAssessmentSkill}', 'video');`);
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
    setAssessmentStep('processing');
    simulateAIProcessing();
  };

  // Detailed trade-specific vision checklists and triggers
  const getTradeVisionOverlays = (trade) => {
    switch (trade) {
      case 'Plumber':
        return {
          title: 'Fit Teflon Tape Seal',
          desc: 'Align thread tape winding clockwise.',
          checklist: ['Tape sealant wrap', 'Wrench clamping sizing', 'Leak test check', 'Pressure gauge hold']
        };
      case 'Tailor':
        return {
          title: 'Straight Seam Stitching',
          desc: 'Keep raw edges aligned along the 5/8" mark.',
          checklist: ['Seam straight guide', 'Fabric thread tension', 'Double seam locks', 'Presser foot height']
        };
      case 'Carpenter':
        return {
          title: 'Mortise Joint Chisel',
          desc: 'Maintain chisel flat face perpendicular to grain.',
          checklist: ['Tenon flush checking', 'Chisel wood direction', 'Square tool alignment', 'Mark line alignment']
        };
      case 'Electrician':
      default:
        return {
          title: 'Stripping 3-Core Cables',
          desc: 'Keep insulated copper cores nested inside guide wire.',
          checklist: ['Insulation cut check', 'Voltage tester test', 'Terminal clamp torque', 'Copper core thickness']
        };
    }
  };

  const activeOverlay = getTradeVisionOverlays(selectedAssessmentSkill);

  // AI assessment scanning simulator
  const simulateAIProcessing = () => {
    addLog('info', 'AI_ENGINE: Transferring recorded frames to Cloud Vision node...');
    setProcessingStages({ tools: 'scanning', safety: 'waiting', technique: 'waiting', workflow: 'waiting' });
    
    setTimeout(() => {
      addLog('success', `AI_VISION: Checked ${activeOverlay.checklist[0]}. 92% accuracy.`);
      setProcessingStages(prev => ({ ...prev, tools: 'done', safety: 'scanning' }));
      
      setTimeout(() => {
        addLog('success', `AI_VISION: Checked ${activeOverlay.checklist[1]}. Compliant.`);
        setProcessingStages(prev => ({ ...prev, safety: 'done', technique: 'scanning' }));
        
        setTimeout(() => {
          addLog('success', `AI_VISION: Checked ${activeOverlay.checklist[2]}. Accurate.`);
          setProcessingStages(prev => ({ ...prev, technique: 'done', workflow: 'scanning' }));
          
          setTimeout(() => {
            addLog('success', `AI_VISION: Checked ${activeOverlay.checklist[3]}. Finished.`);
            setProcessingStages(prev => ({ ...prev, workflow: 'done' }));
            
            setTimeout(() => {
              setAssessmentStep('result');
              addLog('success', 'AI_ENGINE: Finished processing skill DNA metrics scorecard.');
            }, 600);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // Generate Passport and update database (Local state or Firestore)
  const handleGeneratePassport = () => {
    const updatedTrust = 92;
    const skillsDNAUpdates = {
      precision: 93,
      safety: 90,
      problemSolving: 82,
      speed: 91,
      communication: 76
    };

    if (isOffline) {
      const syncItem = {
        id: `sync_${Date.now()}`,
        type: 'video_assessment',
        skill: selectedAssessmentSkill,
        trustScore: updatedTrust,
        dna: skillsDNAUpdates,
        timestamp: new Date().toLocaleString()
      };
      setSyncQueue(prev => [...prev, syncItem]);
      addLog('warning', `OFFLINE_SYNC: Connection offline. Saved assessment inside MMKV transaction cache queue.`);
      alert('Offline mode active. Skill Assessment saved locally. It will sync automatically when internet is available.');
      setCurrentTab('home');
      setAssessmentStep('camera');
      return;
    }

    // Call database updater
    updateWorkerData('ravi-kumar', {
      trustScore: updatedTrust,
      skillsDNA: skillsDNAUpdates,
      verifiedSkills: Array.from(new Set([...workers.find(w => w.id === 'ravi-kumar')?.verifiedSkills || [], `${selectedAssessmentSkill} AI Diagnostics`, 'Insulated Toolkit Compliant']))
    });
    
    setCurrentTab('passport');
    setAssessmentStep('camera');
  };

  // Sync Offline Queue items
  const syncOfflineQueue = () => {
    if (syncQueue.length === 0) return;
    addLog('info', `SYNC_ENGINE: Internet restored. Found ${syncQueue.length} pending SQL transactions to sync.`);
    
    updateWorkerData('ravi-kumar', {
      trustScore: 92,
      skillsDNA: {
        ...workers.find(w => w.id === 'ravi-kumar')?.skillsDNA,
        precision: 93,
        safety: 90,
        speed: 91
      },
      badges: Array.from(new Set([...workers.find(w => w.id === 'ravi-kumar')?.badges || [], 'Offline Sync Hero']))
    });

    addLog('success', `SYNC_ENGINE: Completed batch queries. SQLite cache flushed.`);
    setSyncQueue([]);
    alert('Synchronized offline diagnostics queue with cloud server successfully!');
  };

  // Multi-question Voice Interview
  const initiateVoiceInterview = (trade) => {
    const questionList = QUESTION_BANKS[trade] || QUESTION_BANKS.Electrician;
    setVoiceStep(0);
    setVoiceKeyMatches(0);
    setVoiceMessages([
      { sender: 'ai', text: `Namaste! Main KarmSetu AI hoon. Aiye, aapke ${trade} trade ki voice checking start karte hain.` },
      { sender: 'ai', text: questionList[0].q }
    ]);
  };

  // Evaluate voice responses with Gemini Flash API or fallback
  const evaluateAnswerWithGemini = async (question, answer) => {
    if (!geminiKey) {
      addLog('info', 'AI_ENGINE: No Gemini API Key. Running offline regex evaluator.');
      // Local keyword matching fallback
      const currentQuestionList = QUESTION_BANKS[selectedAssessmentSkill] || QUESTION_BANKS.Electrician;
      const currentQ = currentQuestionList[voiceStep];
      let matches = 0;
      currentQ.keywords.forEach(keyword => {
        if (answer.toLowerCase().includes(keyword)) {
          matches++;
        }
      });
      
      const scoreIncrease = matches >= 2 ? 4 : 2;
      return {
        safety: Math.min(85 + (matches * 3), 96),
        communication: 80,
        problemSolving: Math.min(82 + (matches * 4), 95),
        speed: 85,
        feedback: `Transcribed response: "${answer}". Matched ${matches} key safety terms. Updated safety & technique scores.`
      };
    }

    addLog('query', 'AI_ENGINE: Contacting Gemini 1.5 Flash API with transcript...');
    const promptText = `
      You are KarmSetu AI, an expert skill evaluator for vocational trades in India.
      A candidate for the trade "${selectedAssessmentSkill}" gave this answer: "${answer}" to this question: "${question}".
      
      Evaluate their skill across these parameters (score each 0-100):
      1. safety: Knowledge of safety rules, tools (gloves, MCB off, teflon tape).
      2. communication: Clarity and vocabulary.
      3. problemSolving: Diagnostic logic.
      4. speed: Performance in sequence of tasks.
      
      Return ONLY a raw JSON block with this structure (no extra text):
      {
        "safety": 90,
        "communication": 82,
        "problemSolving": 88,
        "speed": 85,
        "feedback": "Your short evaluation summary here."
      }
    `;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const data = await response.json();
      const resultText = data.candidates[0].content.parts[0].text;
      
      const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(jsonStr);
      
      addLog('success', `AI_ENGINE: Real Gemini API response parsed successfully! Safety: ${result.safety}%.`);
      return result;
    } catch (err) {
      addLog('warning', `AI_ENGINE_ERROR: ${err.message}. Falling back to default evaluator.`);
      return {
        safety: 88,
        communication: 82,
        problemSolving: 85,
        speed: 85,
        feedback: `Fallback evaluator graded answer. Updated safety & technique scores.`
      };
    }
  };

  const handleUserVoiceResponse = async (text) => {
    if (!text.trim()) return;

    // Add user response to dialogue list
    const currentQuestionList = QUESTION_BANKS[selectedAssessmentSkill] || QUESTION_BANKS.Electrician;
    const newMessages = [...voiceMessages, { sender: 'worker', text }];
    setVoiceMessages(newMessages);

    const currentQ = currentQuestionList[voiceStep];
    const nextStep = voiceStep + 1;
    
    // Check if there are more questions
    setTimeout(async () => {
      if (nextStep < currentQuestionList.length) {
        setVoiceStep(nextStep);
        setVoiceMessages(prev => [
          ...prev,
          { sender: 'ai', text: currentQuestionList[nextStep].q }
        ]);
        
        speakText(currentQuestionList[nextStep].q);
      } else {
        // Evaluate overall results using Gemini or Local fallback
        addLog('info', 'AI_ENGINE: Running overall diagnostics evaluation...');
        
        const evaluation = await evaluateAnswerWithGemini(currentQ.q, text);
        
        setVoiceMessages(prev => [
          ...prev,
          { sender: 'ai', text: evaluation.feedback }
        ]);

        speakText(evaluation.feedback);

        // Update database (Firestore or state)
        const updatedDNA = {
          precision: workers.find(w => w.id === 'ravi-kumar')?.skillsDNA.precision || 90,
          safety: evaluation.safety,
          problemSolving: evaluation.problemSolving,
          speed: evaluation.speed,
          communication: evaluation.communication
        };
        const updatedScore = Math.round((evaluation.safety + evaluation.problemSolving + evaluation.communication) / 3);

        updateWorkerData('ravi-kumar', {
          trustScore: Math.max(updatedScore, 89),
          skillsDNA: updatedDNA
        });
      }
    }, 1200);
  };

  const speakText = (text) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle speech listener
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        setIsListening(true);
        setTimeout(() => {
          const mockAnswers = [
            "Wiring breaker panels requires switching off the main breaker switches first. I check terminals with testers.",
            "fans connect parallel so each fan gets 220v. If one fails, the other fans keep running independently.",
            "I connect leads to digital multimeter, set dial to ohms continuity beep sound to check zero resistance."
          ];
          handleUserVoiceResponse(mockAnswers[voiceStep]);
          setIsListening(false);
        }, 3000);
      }
    }
  };

  // Save settings inside localStorage
  const saveBackendConfig = (configJson, geminiApiKey) => {
    try {
      if (configJson) {
        JSON.parse(configJson.trim()); // Validate
        setFirebaseConfigInput(configJson);
      }
      setGeminiKey(geminiApiKey);
      localStorage.setItem('karmsetu_gemini_key', geminiApiKey);
      setShowConfigDrawer(false);
      addLog('success', 'SYSTEM: Configuration credentials saved successfully.');
    } catch (e) {
      alert('Invalid Firebase Config JSON format. Please paste a clean JSON.');
    }
  };

  // Filter workers based on Search & Select triggers
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          worker.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = filterTrade === 'All' || worker.skill === filterTrade;
    
    let matchesLoc = true;
    if (filterLocation !== 'All') {
      matchesLoc = worker.location.toLowerCase().includes(filterLocation.toLowerCase());
    }

    return matchesSearch && matchesTrade && matchesLoc;
  });

  const currentWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  return (
    <div className="showcase-container">
      {/* Showcase Top Bar */}
      <header className="showcase-header">
        <div className="showcase-logo-group">
          <LogoSVG />
          <span className="logo-karmsetu">Karm<span className="logo-accent">Setu</span></span>
          <span className="showcase-badge">
            <Shield size={12} className="text-blue-500" /> PMKVY & NSDC Trust Infrastructure
          </span>
        </div>

        {/* Global Controls */}
        <div className="showcase-controls">
          {/* Collapsible config drawer button */}
          <button 
            className={`theme-mode-btn ${showConfigDrawer ? 'active' : ''}`}
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            title="Setup real Firebase remote sync and Gemini AI evaluation keys"
            style={{ display: 'flex', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Settings size={14} /> Backend Setup
          </button>

          <button className="theme-mode-btn" onClick={toggleThemeMode} title="Toggle between Dark and Light Mode">
            {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <div className="offline-toggle-container">
            <Clock size={16} className={isOffline ? "text-red-500 animate-pulse" : "text-emerald-500"} />
            <span>Offline Simulation</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isOffline} 
                onChange={(e) => {
                  setIsOffline(e.target.checked);
                  if (e.target.checked) {
                    addLog('warning', 'SYSTEM: Switched cloud database state to: OFFLINE');
                  } else {
                    addLog('success', 'SYSTEM: Internet connection restored. Syncing local queues...');
                    syncOfflineQueue();
                  }
                }} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="view-toggle">
            <button 
              className={`toggle-btn ${showcaseView === 'dual' ? 'active' : ''}`}
              onClick={() => setShowcaseView('dual')}
            >
              <Users size={15} /> Showcase (Dual)
            </button>
            <button 
              className={`toggle-btn ${showcaseView === 'phone' ? 'active' : ''}`}
              onClick={() => setShowcaseView('phone')}
            >
              <Smartphone size={15} /> Worker App
            </button>
            <button 
              className={`toggle-btn ${showcaseView === 'desktop' ? 'active' : ''}`}
              onClick={() => setShowcaseView('desktop')}
            >
              <Briefcase size={15} /> Employer Portal
            </button>
          </div>
        </div>
      </header>

      {/* Backend Settings Panel Drawer Overlay */}
      {showConfigDrawer && (
        <div style={{ backgroundColor: 'var(--color-card)', borderBottom: '1px solid var(--color-border)', padding: '20px', zIndex: '999', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.2s ease', position: 'relative' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} /> Connect Real Backend & Google Gemini AI API
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '-6px' }}>
            Paste your credentials below to enable live network database sync across different devices and get real-time evaluations from Google Gemini!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Firebase Config JSON
              </label>
              <textarea 
                placeholder='Paste raw config JSON here: { "apiKey": "...", "projectId": "...", "firestoreDb": "..." }'
                value={firebaseConfigInput}
                onChange={(e) => setFirebaseConfigInput(e.target.value)}
                style={{ width: '100%', height: '100px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', fontSize: '0.72rem', fontFamily: 'monospace' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Google Gemini API Key
              </label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '6px 10px', marginBottom: '14px' }}>
                <Key size={14} className="text-amber-500" />
                <input 
                  type="password" 
                  placeholder="Paste your Gemini AI API Key here" 
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  style={{ flex: '1', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', color: 'var(--color-text-primary)' }}
                />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-light)', lineHeight: '1.4' }}>
                * Leaves credentials saved inside local browser cookies/storage only. To get a free API Key, visit: <strong>Google AI Studio</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="btn-primary" onClick={() => saveBackendConfig(firebaseConfigInput, geminiKey)} style={{ fontSize: '0.8rem' }}>
              Save Credentials
            </button>
            <button className="btn-outline" onClick={() => setShowConfigDrawer(false)} style={{ fontSize: '0.8rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className={`showcase-workspace ${showcaseView === 'dual' ? 'dual-view' : ''}`}>
        
        {/* ======================================================== */}
        {/* LEFT PANE: Mobile App Device Frame                      */}
        {/* ======================================================== */}
        {(showcaseView === 'dual' || showcaseView === 'phone') && (
          <div className="mobile-pane">
            <div className="smartphone-frame">
              
              {/* Notch */}
              <div className="phone-notch">
                <div className="camera-lens"></div>
                <div className="speaker-grill"></div>
              </div>
              <div className="phone-home-indicator"></div>

              {/* Screen */}
              <div className="phone-screen">
                
                {/* Status Bar */}
                <div className="phone-status-bar">
                  <span>17:42</span>
                  <div className="status-bar-icons">
                    {isOffline ? (
                      <span className="text-red-500 font-extrabold" style={{ display: 'flex', alignItems: 'center' }}>🚫 Offline</span>
                    ) : (
                      <span className="text-emerald-500 font-bold" style={{ display: 'flex', alignItems: 'center' }}>📶 5G</span>
                    )}
                    <span>🔋 88%</span>
                  </div>
                </div>

                {/* Offline Sticky Banner */}
                {isOffline && (
                  <div className="offline-banner">
                    <AlertCircle size={11} /> SQLite Database Cache Active
                  </div>
                )}

                {/* ======================================================== */}
                {/* SCREEN: Splash                                           */}
                {/* ======================================================== */}
                {appStep === 'splash' && (
                  <div className="splash-screen">
                    <div className="splash-logo-container">
                      <LogoSVG />
                    </div>
                    <h1 style={{ color: 'var(--color-primary)', fontSize: '1.6rem', fontWeight: 800 }}>KarmSetu</h1>
                    <p className="splash-tagline">"Skills deserve trust, not just certificates."</p>
                    <div className="splash-loader"></div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* SCREEN: Onboarding                                       */}
                {/* ======================================================== */}
                {appStep === 'onboarding' && (
                  <div 
                    className="onboarding-screen"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ position: 'relative' }}
                  >
                    {/* Demo Skip Link */}
                    <span 
                      onClick={() => {
                        setAppStep('home');
                        setCurrentTab('home');
                        addLog('success', 'AUTH: Bypassed onboarding via Demo Skip trigger.');
                        initiateVoiceInterview(selectedAssessmentSkill);
                      }}
                      style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      Skip <ArrowRight size={12} />
                    </span>

                    <div className="onboarding-slider">
                      <div className="onboarding-image-container">
                        {onboardingSlide === 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div className="onboarding-vector-box">👨‍🔧</div>
                            <h2 className="onboarding-title" style={{ marginTop: '16px' }}>Your skills matter.</h2>
                            <p className="onboarding-text">KarmSetu creates a secure digital identity based on demonstrated trade skills rather than paperwork.</p>
                          </div>
                        )}
                        {onboardingSlide === 1 && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div className="onboarding-vector-box" style={{ borderColor: 'var(--color-secondary)' }}>🏢</div>
                            <h2 className="onboarding-title" style={{ marginTop: '16px' }}>Prove your work.</h2>
                            <p className="onboarding-text">Demonstrate your capabilities directly via short AI-guided video tests and regional speech drills.</p>
                          </div>
                        )}
                        {onboardingSlide === 2 && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div className="onboarding-vector-box" style={{ borderColor: 'var(--color-accent)' }}>💳</div>
                            <h2 className="onboarding-title" style={{ marginTop: '16px' }}>One Skill Passport.</h2>
                            <p className="onboarding-text">Generate a glassmorphic credential card containing tamperproof QR codes mapped to NSDC standards.</p>
                          </div>
                        )}
                      </div>

                      <div className="onboarding-dots">
                        {[0, 1, 2].map((i) => (
                          <span 
                            key={i} 
                            className={`dot ${onboardingSlide === i ? 'active' : ''}`}
                            onClick={() => setOnboardingSlide(i)}
                          ></span>
                        ))}
                      </div>
                    </div>

                    <button 
                      className="btn-primary" 
                      onClick={() => {
                        if (onboardingSlide < 2) {
                          setOnboardingSlide(prev => prev + 1);
                        } else {
                          setAppStep('auth');
                        }
                      }}
                      style={{ width: '100%', marginBottom: '10px' }}
                    >
                      {onboardingSlide === 2 ? 'Get Started' : 'Next'} <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* ======================================================== */}
                {/* SCREEN: Authentication                                   */}
                {/* ======================================================== */}
                {appStep === 'auth' && (
                  <div className="auth-screen" style={{ position: 'relative' }}>
                    {/* Demo Skip Link */}
                    <span 
                      onClick={() => {
                        setAppStep('home');
                        setCurrentTab('home');
                        addLog('success', 'AUTH: Bypassed auth via Demo Skip trigger.');
                        initiateVoiceInterview(selectedAssessmentSkill);
                      }}
                      style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      Skip <ArrowRight size={12} />
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)' }}>Select Language</h2>
                      <p className="auth-subtitle" style={{ fontSize: '0.82rem', marginBottom: '14px' }}>Choose the language for voice-guided assessments.</p>
                      
                      <div className="lang-grid">
                        {[
                          { key: 'Hindi', native: 'हिन्दी' },
                          { key: 'English', native: 'English' },
                          { key: 'Tamil', native: 'தமிழ்' },
                          { key: 'Bengali', native: 'বাংলা' },
                          { key: 'Marathi', native: 'मराठी' },
                          { key: 'Telugu', native: 'తెలుగు' }
                        ].map((lang) => (
                          <button 
                            key={lang.key}
                            className={`lang-btn ${selectedLanguage === lang.key ? 'active' : ''}`}
                            onClick={() => setSelectedLanguage(lang.key)}
                          >
                            <span>{lang.key}</span>
                            <span className="lang-native">{lang.native}</span>
                          </button>
                        ))}
                      </div>

                      <div className="input-group">
                        <label className="input-label">Mobile Number</label>
                        <div className="input-wrapper">
                          <span className="input-prefix">+91</span>
                          <input 
                            type="tel" 
                            placeholder="Enter mobile number" 
                            className="phone-input"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          />
                        </div>
                      </div>

                      {otpSent && (
                        <div className="input-group" style={{ animation: 'slideUp 0.2s ease' }}>
                          <label className="input-label">Enter 4-Digit OTP</label>
                          <input 
                            type="text" 
                            placeholder="Demo OTP: 4821" 
                            className="otp-input"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          />
                          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '6px', textAlign: 'right' }}>
                            Resend in {otpTimer}s
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      {isOffline && (
                        <div className="offline-notice">
                          <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          Offline mode active. System logins via local cached credentials.
                        </div>
                      )}
                      
                      {!otpSent ? (
                        <button className="btn-primary" style={{ width: '100%' }} onClick={triggerOTP}>
                          Send OTP Code
                        </button>
                      ) : (
                        <button className="btn-primary" style={{ width: '100%' }} onClick={verifyOTP}>
                          Verify & Proceed
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* BOTTOM TAB WRAPPER (After Login)                         */}
                {/* ======================================================== */}
                {appStep === 'home' && (
                  <div className="app-screen">
                    <div className="app-screen-content">
                      
                      {/* ======================================================== */}
                      {/* TAB: Home                                                */}
                      {/* ======================================================== */}
                      {currentTab === 'home' && (
                        <div>
                          {/* Welcome Header */}
                          <div className="home-header">
                            <div>
                              <h3>Hello Ravi 👋</h3>
                              <div className="govt-trust-badge">
                                <FileCheck size={11} /> Aadhaar Verified
                              </div>
                            </div>
                            <div className="badge-round-trust">
                              {workers.find(w => w.id === 'ravi-kumar')?.trustScore || 89}
                            </div>
                          </div>

                          {/* Trust Dashboard Score Card */}
                          <div className="trust-dashboard-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px' }}>SKILL TRUST INDEX</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                                <Shield size={10} /> Tier: {workers.find(w => w.id === 'ravi-kumar')?.level || 'Gold'}
                              </span>
                            </div>
                            <div className="trust-score-row">
                              <span className="trust-score-num">{workers.find(w => w.id === 'ravi-kumar')?.trustScore || 89}</span>
                              <span className="trust-score-denom">/ 100</span>
                            </div>
                            
                            {/* Score Track Bar */}
                            <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '99px', marginTop: '8px', overflow: 'hidden' }}>
                              <div style={{ width: `${workers.find(w => w.id === 'ravi-kumar')?.trustScore || 89}%`, height: '100%', backgroundColor: 'var(--color-secondary)', borderRadius: '99px' }}></div>
                            </div>
                          </div>

                          {/* Skill DNA Display */}
                          <div className="skill-dna-section">
                            <div className="section-header-compact">
                              <h4>⚡ SKILL DNA</h4>
                              <span className="dna-radar-badge">Verified Diagnostics</span>
                            </div>
                            
                            <div className="dna-bar-list">
                              {[
                                { name: 'Precision', key: 'precision', color: '#3B82F6' },
                                { name: 'Safety Standards', key: 'safety', color: '#10B981' },
                                { name: 'Problem Solving', key: 'problemSolving', color: '#8B5CF6' },
                                { name: 'Speed & Workflow', key: 'speed', color: '#EC4899' },
                                { name: 'Communication', key: 'communication', color: '#F59E0B' }
                              ].map((dna) => {
                                const val = workers.find(w => w.id === 'ravi-kumar')?.skillsDNA[dna.key] || 75;
                                return (
                                  <div key={dna.key} className="dna-bar-item">
                                    <div className="dna-bar-label">
                                      <span>{dna.name}</span>
                                      <span className="dna-bar-val">{val}%</span>
                                    </div>
                                    <div className="dna-bar-track">
                                      <div className="dna-bar-fill" style={{ width: `${val}%`, backgroundColor: dna.color }}></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Assessment recommendation alert */}
                          <div className="rec-card" onClick={() => { setCurrentTab('assessment'); setAssessmentStep('camera'); }}>
                            <div>
                              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block' }}>RECOMENDED TASK</span>
                              <span className="rec-desc">Complete {selectedAssessmentSkill} Safety Check</span>
                            </div>
                            <span className="rec-points">+5 Trust Score</span>
                          </div>

                          {/* Quick Actions Title */}
                          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Diagnostics</h4>
                          
                          {/* Grid */}
                          <div className="actions-grid">
                            <div className="action-tile" onClick={() => { setCurrentTab('assessment'); setAssessmentStep('camera'); }}>
                              <div className="action-tile-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                                <Video size={18} />
                              </div>
                              <span className="action-tile-title">Verify Skill</span>
                            </div>
                            
                            <div className="action-tile" onClick={() => { 
                              setCurrentTab('assessment'); 
                              setAssessmentStep('voice'); 
                              initiateVoiceInterview(selectedAssessmentSkill); 
                            }}>
                              <div className="action-tile-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                                <Mic size={18} />
                              </div>
                              <span className="action-tile-title">Voice AI</span>
                            </div>

                            <div className="action-tile" onClick={() => setCurrentTab('passport')}>
                              <div className="action-tile-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                                <QrCode size={18} />
                              </div>
                              <span className="action-tile-title">Passport</span>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* ======================================================== */}
                      {/* TAB: Assessment / Diagnostics                            */}
                      {/* ======================================================== */}
                      {currentTab === 'assessment' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          
                          {/* Camera scanning screen */}
                          {assessmentStep === 'camera' && (
                            <div className="camera-screen">
                              <div className="camera-header">
                                <span className="camera-title">{selectedAssessmentSkill} Verification</span>
                                <button className="camera-close" onClick={() => setCurrentTab('home')}>
                                  <X size={14} />
                                </button>
                              </div>

                              <div className="camera-preview-container">
                                {cameraActive ? (
                                  <video ref={videoRef} className="camera-video-stream" autoPlay playsInline muted></video>
                                ) : (
                                  <div className="video-player-mock">
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                      <p style={{ color: '#64748B', fontSize: '0.8rem' }}>Camera Stream simulation ready.</p>
                                      <p style={{ color: '#475569', fontSize: '0.72rem', marginTop: '2px' }}>Click record to run AI diagnostic scans.</p>
                                    </div>
                                  </div>
                                )}

                                {/* Crop overlay */}
                                <div className="camera-overlay-box">
                                  <div className="camera-overlay-corner top-left"></div>
                                  <div className="camera-overlay-corner top-right"></div>
                                  <div className="camera-overlay-corner bottom-left"></div>
                                  <div className="camera-overlay-corner bottom-right"></div>
                                  <div className="camera-scanning-line"></div>
                                  
                                  {recordingState === 'recording' && (
                                    <div style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: 700, alignSelf: 'center', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px' }}>
                                      REC {recordingSeconds}s
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Guidelines card */}
                              <div className="camera-guidelines">
                                <strong>Target: {activeOverlay.title}</strong>
                                <p style={{ color: '#94A3B8', fontSize: '0.68rem', marginTop: '2px' }}>{activeOverlay.desc}</p>
                              </div>

                              {/* Controls */}
                              <div className="camera-controls-footer">
                                <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '3px', borderRadius: '99px', marginBottom: '14px' }}>
                                  {['Electrician', 'Plumber', 'Carpenter', 'Tailor'].map(skill => (
                                    <span 
                                      key={skill} 
                                      className={`role-bubble ${selectedAssessmentSkill === skill ? 'active' : ''}`}
                                      onClick={() => {
                                        setSelectedAssessmentSkill(skill);
                                        addLog('info', `ASSESSMENT: Switched trade check template to: ${skill}`);
                                      }}
                                      style={{ color: '#fff', fontSize: '0.68rem', padding: '4px 10px', borderRadius: '99px', cursor: 'pointer', background: selectedAssessmentSkill === skill ? 'var(--color-primary)' : 'transparent' }}
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>

                                <div className="camera-shutter-container">
                                  {!cameraActive && recordingState === 'idle' ? (
                                    <button className="btn-secondary" onClick={startCamera}>
                                      Connect Camera
                                    </button>
                                  ) : (
                                    <button 
                                      className={`shutter-btn ${recordingState === 'recording' ? 'recording' : ''}`}
                                      onClick={recordingState === 'idle' ? startRecording : finishRecording}
                                    >
                                      <div className="shutter-btn-inner"></div>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* AI Processing Scanning */}
                          {assessmentStep === 'processing' && (
                            <div className="ai-processing-screen">
                              <div className="ai-scan-radar">
                                <div className="ai-scan-radar-inner">
                                  <Activity size={24} className="text-emerald-500" />
                                </div>
                              </div>

                              <h3 style={{ fontSize: '1.15rem' }}>AI Diagnostics Grade</h3>
                              <p style={{ color: '#64748B', fontSize: '0.78rem', marginBottom: '24px' }}>Checking workflow parameters...</p>

                              <div className="ai-checklist">
                                <div className={`checklist-item ${processingStages.tools === 'done' ? 'checked' : ''}`}>
                                  <div className="checklist-circle">
                                    {processingStages.tools === 'done' ? <Check size={8} /> : <div className="checklist-spinner"></div>}
                                  </div>
                                  <span>{activeOverlay.checklist[0]}</span>
                                </div>

                                <div className={`checklist-item ${processingStages.safety === 'done' ? 'checked' : ''} ${processingStages.safety === 'waiting' ? 'opacity-30' : ''}`}>
                                  <div className="checklist-circle">
                                    {processingStages.safety === 'done' ? <Check size={8} /> : processingStages.safety === 'scanning' ? <div className="checklist-spinner"></div> : ''}
                                  </div>
                                  <span>{activeOverlay.checklist[1]}</span>
                                </div>

                                <div className={`checklist-item ${processingStages.technique === 'done' ? 'checked' : ''} ${processingStages.technique === 'waiting' ? 'opacity-30' : ''}`}>
                                  <div className="checklist-circle">
                                    {processingStages.technique === 'done' ? <Check size={8} /> : processingStages.technique === 'scanning' ? <div className="checklist-spinner"></div> : ''}
                                  </div>
                                  <span>{activeOverlay.checklist[2]}</span>
                                </div>

                                <div className={`checklist-item ${processingStages.workflow === 'done' ? 'checked' : ''} ${processingStages.workflow === 'waiting' ? 'opacity-30' : ''}`}>
                                  <div className="checklist-circle">
                                    {processingStages.workflow === 'done' ? <Check size={8} /> : processingStages.workflow === 'scanning' ? <div className="checklist-spinner"></div> : ''}
                                  </div>
                                  <span>{activeOverlay.checklist[3]}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* AI Scorecard Result Screen */}
                          {assessmentStep === 'result' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.25s ease' }}>
                              <div style={{ backgroundColor: 'var(--color-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Verification complete</span>
                                <h3 style={{ fontSize: '1.25rem', marginTop: '4px' }}>{selectedAssessmentSkill} - Level L4</h3>
                                <div className="govt-trust-badge" style={{ marginTop: '6px' }}>
                                  <Shield size={12} /> 93% AI Confidence Rating
                                </div>
                              </div>

                              <div style={{ backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                                <h4 style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                                  <CheckCircle size={12} /> Verified Traits
                                </h4>
                                <ul style={{ fontSize: '0.75rem', paddingLeft: '14px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <li>Tool configuration matches PMKVY check sheet.</li>
                                  <li>Safety gloves checked and fully intact.</li>
                                </ul>
                              </div>

                              <div style={{ backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                                <h4 style={{ fontSize: '0.78rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                                  <AlertTriangle size={12} /> Improvement Area
                                </h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                  Review voltage checking sequences. Completed out of alignment.
                                </p>
                              </div>

                              <button className="btn-primary" style={{ width: '100%', marginTop: '6px' }} onClick={handleGeneratePassport}>
                                {isOffline ? 'Save locally' : 'Sync & Update Passport'}
                              </button>
                            </div>
                          )}

                          {/* Voice Interview chat panel */}
                          {assessmentStep === 'voice' && (
                            <div className="voice-chat-container">
                              <div className="voice-log-area">
                                {voiceMessages.map((msg, index) => (
                                  <div key={index} className={`voice-bubble ${msg.sender}`}>
                                    {msg.text}
                                  </div>
                                ))}
                              </div>

                              <div className="voice-controls-panel">
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: 600, textAlign: 'center' }}>
                                  {isListening ? '🎙 Listening... Speak clear regional trade terms' : `Question ${voiceStep + 1} of 3. Tap mic to reply.`}
                                </span>

                                <button className={`voice-mic-button ${isListening ? 'listening' : ''}`} onClick={toggleListening}>
                                  <Mic size={24} />
                                </button>

                                <div style={{ display: 'flex', width: '100%', gap: '6px', borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '6px' }}>
                                  <input 
                                    type="text" 
                                    placeholder="Simulate speech answer here..." 
                                    className="phone-input"
                                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                    value={voiceInputText}
                                    onChange={(e) => setVoiceInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleUserVoiceResponse(voiceInputText);
                                        setVoiceInputText('');
                                      }
                                    }}
                                  />
                                  <button className="btn-secondary" style={{ padding: '6px 10px' }} onClick={() => {
                                    handleUserVoiceResponse(voiceInputText);
                                    setVoiceInputText('');
                                  }}>
                                    <Send size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {/* ======================================================== */}
                      {/* TAB: Passport Card                                       */}
                      {/* ======================================================== */}
                      {currentTab === 'passport' && (
                        <div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '12px' }}>
                            Secure Skill Passport (Aadhaar Mapped)
                          </p>

                          <div className="passport-card">
                            <div className="passport-card-header">
                              <span className="logo-karmsetu" style={{ fontSize: '0.95rem', color: '#fff' }}>
                                Karm<span className="logo-accent">Setu</span>
                              </span>
                              <span className="passport-badge-text">VERIFIED CARD</span>
                            </div>

                            <div className="passport-avatar-row">
                              <img src={workers.find(w => w.id === 'ravi-kumar')?.avatar} alt="Avatar" className="passport-avatar" />
                              <div>
                                <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>{workers.find(w => w.id === 'ravi-kumar')?.name}</h3>
                                <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{workers.find(w => w.id === 'ravi-kumar')?.skill}</p>
                              </div>
                            </div>

                            <div className="passport-score-qr-row">
                              <div>
                                <span style={{ fontSize: '0.62rem', color: '#94A3B8', display: 'block' }}>TRUST RATING</span>
                                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'baseline' }}>
                                  {workers.find(w => w.id === 'ravi-kumar')?.trustScore}
                                  <span style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.6 }}>/100</span>
                                </span>
                                <div style={{ display: 'flex', color: 'var(--color-accent)', gap: '1px', marginTop: '2px' }}>
                                  <Star size={10} fill="currentColor" />
                                  <Star size={10} fill="currentColor" />
                                  <Star size={10} fill="currentColor" />
                                  <Star size={10} fill="currentColor" />
                                  <Star size={10} fill="currentColor" />
                                </div>
                              </div>

                              <div className="passport-qr">
                                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                                  <rect width="100" height="100" fill="white" />
                                  <path d="M10 10h30v30H10zm5 5h20v20H15zm45-5h30v30H60zm5 5h20v20H65zM10 60h30v30H10zm5 5h20v20H15zm50 15h10v10H65zm10-10h15v10H75zm-15-5h15v10H60zm25 0h5v10H85zm-15 15h5v5h-5z" fill="black" />
                                </svg>
                              </div>
                            </div>

                            <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '12px', paddingTop: '8px', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                              <div>
                                <span style={{ fontSize: '0.58rem', color: '#64748B', display: 'block' }}>EXPERIENCE</span>
                                <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{workers.find(w => w.id === 'ravi-kumar')?.experience}</span>
                              </div>
                              <div>
                                <span style={{ fontSize: '0.58rem', color: '#64748B', display: 'block' }}>CERTIFICATE</span>
                                <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>NSQF Level L4</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                            <button className="btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }} onClick={() => setShowResumeModal(true)}>
                              <FileCheck size={14} /> Open AI Resume Card
                            </button>
                            <button className="btn-outline" style={{ width: '100%', fontSize: '0.8rem' }} onClick={() => alert('Credentials QR copied to clipboard!')}>
                              Share credentials QR
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ======================================================== */}
                      {/* TAB: Jobs Recommendation                                */}
                      {/* ======================================================== */}
                      {currentTab === 'jobs' && (
                        <div>
                          <h4 style={{ fontSize: '0.85rem', marginBottom: '10px' }}>Recommended Jobs</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                              { title: 'Distribution Wireman', comp: 'L&T Infra', sal: '₹28,000/mo', match: '96%' },
                              { title: 'Hospital Maintenance', comp: 'Max Healthcare', sal: '₹24,000/mo', match: '92%' }
                            ].map((job, idx) => (
                              <div key={idx} style={{ backgroundColor: 'var(--color-bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-secondary-light)', color: '#065F46', padding: '1px 4px', borderRadius: '3px' }}>{job.match} Match</span>
                                  <h5 style={{ fontSize: '0.8rem', margin: '2px 0' }}>{job.title}</h5>
                                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{job.comp}</p>
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{job.sal}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ======================================================== */}
                      {/* TAB: Profile Settings                                    */}
                      {/* ======================================================== */}
                      {currentTab === 'profile' && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '12px' }}>
                            <img src={workers.find(w => w.id === 'ravi-kumar')?.avatar} alt="Avatar" style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
                            <div>
                              <h3 style={{ fontSize: '1rem' }}>Ravi Kumar</h3>
                              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Dwarka, New Delhi</p>
                              <span style={{ fontSize: '0.68rem', backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '99px', display: 'inline-block', marginTop: '2px', fontWeight: 700 }}>Gold Tier Contractor</span>
                            </div>
                          </div>

                          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Certificates Mapped</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ backgroundColor: 'var(--color-bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Award size={18} className="text-blue-500" />
                              <div>
                                <h5 style={{ fontSize: '0.78rem' }}>PMKVY Wireman L4</h5>
                                <p style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>Aadhaar cryptographic match verified</p>
                              </div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Award size={18} className="text-emerald-500" />
                              <div>
                                <h5 style={{ fontSize: '0.78rem' }}>KarmSetu Safety Expert</h5>
                                <p style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>Passed 3 vision safety drills</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Bottom Nav Bar */}
                    <div className="bottom-nav">
                      <div className={`bottom-nav-item ${currentTab === 'home' ? 'active' : ''}`} onClick={() => setCurrentTab('home')}>
                        <Compass size={18} />
                        <span>Home</span>
                      </div>
                      <div className={`bottom-nav-item ${currentTab === 'assessment' ? 'active' : ''}`} onClick={() => { setCurrentTab('assessment'); setAssessmentStep('camera'); }}>
                        <Video size={18} />
                        <span>Verify</span>
                      </div>
                      <div className={`bottom-nav-item ${currentTab === 'passport' ? 'active' : ''}`} onClick={() => setCurrentTab('passport')}>
                        <QrCode size={18} />
                        <span>Passport</span>
                      </div>
                      <div className={`bottom-nav-item ${currentTab === 'jobs' ? 'active' : ''}`} onClick={() => setCurrentTab('jobs')}>
                        <Briefcase size={18} />
                        <span>Jobs</span>
                      </div>
                      <div className={`bottom-nav-item ${currentTab === 'profile' ? 'active' : ''}`} onClick={() => setCurrentTab('profile')}>
                        <Award size={18} />
                        <span>Profile</span>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* RIGHT PANE: Employer Desktop Portal Workspace           */}
        {/* ======================================================== */}
        {(showcaseView === 'dual' || showcaseView === 'desktop') && (
          <div className="employer-pane">
            <div className="employer-container">
              
              {/* Header */}
              <div className="employer-header-row">
                <div>
                  <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem' }}>
                    <Briefcase size={22} className="text-blue-500" />
                    KarmSetu Employer Console
                  </h1>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Real-time skill diagnostics checks & contractor directories matching NSDC frameworks.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      setSelectedWorkerId('ravi-kumar');
                      addLog('query', 'SMS_SERVICE: QR Scan trigger received. Fetching profiles...');
                      addLog('success', 'CLOUD_SYNC: Profile downloaded: Ravi Kumar (Electrician).');
                      alert('Simulating passport QR scan: Connected to Ravi Kumar\'s credentials card.');
                    }}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <QrCode size={16} /> Scan QR Passport
                  </button>
                </div>
              </div>

              {/* Advanced Search & Filtering (Functional) */}
              <div style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px' }}>
                  
                  {/* Text search */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--color-text-light)' }} />
                    <input 
                      type="text" 
                      placeholder="Search contractors by name or trade..." 
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        addLog('query', `SQL: SELECT * FROM workers WHERE name LIKE '%${e.target.value}%';`);
                      }}
                      className="phone-input"
                      style={{ padding: '8px 10px 8px 30px', fontSize: '0.8rem' }}
                    />
                  </div>

                  {/* Trade dropdown selector */}
                  <select 
                    value={filterTrade} 
                    onChange={(e) => {
                      setFilterTrade(e.target.value);
                      addLog('query', `SQL: SELECT * FROM workers WHERE skill = '${e.target.value}';`);
                    }}
                    className="phone-input"
                    style={{ padding: '8px 10px 8px 10px', fontSize: '0.8rem', paddingLeft: '6px' }}
                  >
                    <option value="All">All Trades</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Tailor">Tailor</option>
                  </select>

                  {/* Location selector */}
                  <select 
                    value={filterLocation} 
                    onChange={(e) => {
                      setFilterLocation(e.target.value);
                      addLog('query', `SQL: SELECT * FROM workers WHERE location LIKE '%${e.target.value}%';`);
                    }}
                    className="phone-input"
                    style={{ padding: '8px 10px 8px 10px', fontSize: '0.8rem', paddingLeft: '6px' }}
                  >
                    <option value="All">All Locations</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Noida">Uttar Pradesh</option>
                    <option value="Gurugram">Haryana</option>
                  </select>

                </div>
              </div>

              {/* Main directory split view */}
              <div className="employer-split-layout">
                
                {/* Left Listing */}
                <div className="worker-list-card">
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                    Verified Contractors ({filteredWorkers.length})
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {filteredWorkers.map(worker => (
                      <div 
                        key={worker.id}
                        className={`worker-list-item ${selectedWorkerId === worker.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedWorkerId(worker.id);
                          setHiredWorkerId(null);
                          setShowResumeModal(false);
                          addLog('query', `SQL: SELECT * FROM workers WHERE id = '${worker.id}';`);
                        }}
                        style={{ border: '1px solid var(--color-border)', padding: '8px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedWorkerId === worker.id ? 'var(--color-primary-light)' : 'var(--color-card)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={worker.avatar} alt={worker.name} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                          <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block' }}>{worker.name}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>{worker.skill} • {worker.experience}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '1px 5px', borderRadius: '4px', background: '#FFF' }}>
                          {worker.trustScore}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Profile detail panel */}
                <div style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '20px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '14px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <img src={currentWorker.avatar} alt="Avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--color-primary-light)' }} />
                      <div>
                        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {currentWorker.name}
                          <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-secondary-light)', color: '#065F46', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            Aadhaar Match Verified
                          </span>
                        </h2>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                          <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                          {currentWorker.location}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setShowResumeModal(!showResumeModal)}>
                        <FileCheck size={14} /> {showResumeModal ? 'Hide CV Card' : 'Generate AI CV'}
                      </button>
                      
                      {hiredWorkerId === currentWorker.id ? (
                        <div style={{ backgroundColor: 'var(--color-secondary-light)', border: '1px solid var(--color-secondary)', padding: '8px 14px', borderRadius: '8px', color: '#065F46', fontWeight: 'bold', fontSize: '0.8rem' }}>
                          ✓ Contract Offered
                        </div>
                      ) : (
                        <button className="btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => {
                          setHiredWorkerId(currentWorker.id);
                          addLog('success', `HIRING_SERVICE: Sent formal job contract offer to ${currentWorker.name}.`);
                          alert(`Formal job offer and contract sent to ${currentWorker.name}.`);
                        }}>
                          Hire Worker
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Resume View Card if visible */}
                  {showResumeModal && (
                    <div className="resume-modal-card">
                      <div className="resume-header-row">
                        <div>
                          <h3 style={{ fontSize: '1.05rem', color: 'var(--color-primary)' }}>KARMSETU VERIFIED CV SUMMARY</h3>
                          <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>National Skill Development Mapped (Aadhaar: XXXX-XXXX-9821)</span>
                        </div>
                        <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '0.68rem' }} onClick={() => alert('Resume PDF ready to download!')}>
                          <Download size={12} /> Download PDF
                        </button>
                      </div>

                      <div className="resume-grid">
                        <div className="resume-section">
                          <span className="resume-sec-title">Personal Profile</span>
                          <span><strong>Name:</strong> {currentWorker.name}</span>
                          <span><strong>Trade:</strong> {currentWorker.skill}</span>
                          <span><strong>Experience:</strong> {currentWorker.experience}</span>
                          <span><strong>Location:</strong> {currentWorker.location}</span>
                        </div>

                        <div className="resume-section">
                          <span className="resume-sec-title">Skill DNA Score card</span>
                          {Object.entries(currentWorker.skillsDNA).map(([key, val]) => (
                            <span key={key}>• {key.toUpperCase()}: {val}%</span>
                          ))}
                        </div>

                        <div className="resume-section" style={{ gridColumn: 'span 2' }}>
                          <span className="resume-sec-title">AI Video Diagnostic Proof</span>
                          <span style={{ color: 'var(--color-text-secondary)' }}>Checked: Tools compliance, Safety gloves check, Connection clamping torque alignment. Match: 92% accuracy.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Standard detail view */}
                  {!showResumeModal && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '14px' }}>
                      
                      {/* Left: Video proof */}
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <Video size={14} className="text-blue-500" /> AI Vision Assessment Proof
                        </span>
                        
                        <div style={{ backgroundColor: '#0B0F19', height: '160px', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ textAlign: 'center' }}>
                            <Play size={28} className="text-white" style={{ margin: '0 auto 6px auto', cursor: 'pointer' }} />
                            <p style={{ fontSize: '0.72rem', color: '#64748B' }}>Watch Vision Diagnostic Feed</p>
                          </div>
                        </div>

                        <div style={{ marginTop: '12px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <Mic size={14} className="text-blue-500" /> Voice Interview Transcript
                          </span>
                          <div style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '8px 10px', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            <blockquote>"{currentWorker.voiceTranscript}"</blockquote>
                          </div>
                        </div>
                      </div>

                      {/* Right: Skill DNA */}
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <Activity size={14} className="text-emerald-500" /> AI Skill DNA Analysis
                        </span>

                        <div style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px' }}>
                          <div className="dna-bar-list">
                            {[
                              { name: 'Precision', key: 'precision', color: '#3B82F6' },
                              { name: 'Safety Standards', key: 'safety', color: '#10B981' },
                              { name: 'Problem Solving', key: 'problemSolving', color: '#8B5CF6' },
                              { name: 'Speed & Performance', key: 'speed', color: '#EC4899' },
                              { name: 'Communication', key: 'communication', color: '#F59E0B' }
                            ].map(dna => {
                              const val = currentWorker.skillsDNA[dna.key];
                              return (
                                <div key={dna.key} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700 }}>
                                    <span>{dna.name}</span>
                                    <span>{val}%</span>
                                  </div>
                                  <div className="dna-bar-track">
                                    <div className="dna-bar-fill" style={{ width: `${val}%`, backgroundColor: dna.color }}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Badges list */}
                        <div style={{ marginTop: '14px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Digital Badges</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {currentWorker.verifiedSkills.map((badge, idx) => (
                              <span 
                                key={idx} 
                                style={{ fontSize: '0.68rem', backgroundColor: 'var(--color-secondary-light)', color: '#065F46', padding: '2px 8px', borderRadius: '99px', border: '1px solid rgba(16,185,129,0.12)' }}
                              >
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

            </div>
          </div>
        )}

      </div>

      {/* Floating SQLite Sync logs console */}
      <div className="sql-sync-console">
        <div className="console-header">
          <div className="console-title">
            <div className="console-dot"></div>
            <span>SQLite Local DB Console (Logs Feed)</span>
          </div>
          <Server size={12} />
        </div>
        <div className="console-body">
          {consoleLogs.map((log, index) => (
            <div key={index} className={`console-line ${log.type}`}>
              {log.text}
            </div>
          ))}
          <div ref={consoleBottomRef}></div>
        </div>
      </div>

    </div>
  );
}
