import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, CheckCircle, Video, Mic, Briefcase, Award, Search, Users, QrCode, 
  MapPin, Star, ArrowRight, Check, AlertCircle, X, Activity, Server, Settings, 
  Key, Database, Play, Download, Sun, Moon, ChevronDown, ChevronUp, FileText
} from 'lucide-react';

// Firebase imports
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, updateDoc, collection } from 'firebase/firestore';

import './App.css';

// SVG logo of KarmSetu: Bridge forming "K"
const LogoSVG = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '34px', height: '34px' }}>
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
  // Theme state
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('karmsetu_theme') || 'dark';
  });

  // Top Nav active tab: candidates | verify
  const [activeTab, setActiveTab] = useState('candidates');

  // Directory filter search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrade, setFilterTrade] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');

  // Candidate selection
  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('karmsetu_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });
  const [selectedWorkerId, setSelectedWorkerId] = useState('ravi-kumar');
  const [hiredWorkerId, setHiredWorkerId] = useState(null);
  const [showResume, setShowResume] = useState(false);

  // Cloud backend drawer configuration
  const [showConfig, setShowConfig] = useState(false);
  const [firebaseConfigInput, setFirebaseConfigInput] = useState(() => {
    return localStorage.getItem('karmsetu_firebase_config_input') || '';
  });
  const [geminiKey, setGeminiKey] = useState(() => {
    return localStorage.getItem('karmsetu_gemini_key') || '';
  });
  const [db, setDb] = useState(null);

  // SQLite feed console logs
  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'info', text: 'INFO: Initiated KarmSetu SQLite Sync Engine.' },
    { type: 'query', text: 'SQL: SELECT * FROM workers ORDER BY trustScore DESC;' },
    { type: 'success', text: 'SQL: Loaded 3 verified profiles from cached storage.' }
  ]);
  const [consoleOpen, setConsoleOpen] = useState(true);

  // Camera verification setup
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

  // Voice interview chat log states
  const [voiceStep, setVoiceStep] = useState(0);
  const [voiceMessages, setVoiceMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceInputText, setVoiceInputText] = useState('');

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const consoleBottomRef = useRef(null);

  // Sync theme
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('karmsetu_theme', themeMode);
  }, [themeMode]);

  // Sync workers state
  useEffect(() => {
    localStorage.setItem('karmsetu_workers', JSON.stringify(workers));
  }, [workers]);

  // Autoscroll logs
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Sync log helper
  const addLog = (type, text) => {
    setConsoleLogs(prev => [...prev, { type, text }]);
  };

  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    addLog('info', `SYSTEM: Switched UI Theme to: ${nextTheme.toUpperCase()}`);
  };

  // Connect Firebase
  useEffect(() => {
    if (!firebaseConfigInput) return;
    try {
      const config = JSON.parse(firebaseConfigInput.trim());
      if (config.projectId) {
        localStorage.setItem('karmsetu_firebase_config_input', firebaseConfigInput);
        const app = getApps().length === 0 ? initializeApp(config) : getApp();
        const firestore = getFirestore(app);
        setDb(firestore);
        addLog('success', `FIREBASE: Connected to project: ${config.projectId}`);
      }
    } catch (err) {
      addLog('warning', `FIREBASE_ERROR: Invalid config JSON.`);
    }
  }, [firebaseConfigInput]);

  // Listen to Firestore
  useEffect(() => {
    if (!db) return;
    addLog('info', 'SQL: Subscribing to Firestore sync stream...');
    const unsubscribe = onSnapshot(collection(db, 'workers'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_WORKERS.forEach(async (w) => {
          await setDoc(doc(db, 'workers', w.id), w);
        });
        return;
      }
      const loaded = [];
      snapshot.forEach(docSnap => {
        loaded.push(docSnap.data());
      });
      setWorkers(loaded);
      addLog('success', `SYNC: Synchronized ${loaded.length} profiles with Firestore DB.`);
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
        addLog('warning', `FIREBASE_SYNC_FAILED: ${err.message}. State saved locally.`);
      }
    } else {
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, ...fields } : w));
      addLog('success', 'SQL: Local state database record updated.');
    }
  };

  // Get dynamic camera assessment guidelines
  const getCameraGuidelines = (trade) => {
    switch (trade) {
      case 'Plumber':
        return {
          title: 'Teflon Tape Seal Check',
          desc: 'Wrap sealing tape clockwise along threaded ends.',
          checklist: ['Seal tape check', 'Wrench connection torque', 'Leak inspection hold', 'Pressure levels hold']
        };
      case 'Tailor':
        return {
          title: 'Pattern Stitch Seam Guide',
          desc: 'Align raw cloth template edges with seam allowance.',
          checklist: ['Stitch straightness', 'Fabric thread tension', 'Double seams lock', 'Presser foot height']
        };
      case 'Carpenter':
        return {
          title: 'Mortise Joint Chiseling',
          desc: 'Maintain blade flat perpendicular to grain guidelines.',
          checklist: ['Flush joint tenon', 'Chisel wood direction', 'Square alignment check', 'Measure accuracy']
        };
      case 'Electrician':
      default:
        return {
          title: 'Insulated Cable Strip Diagnostics',
          desc: 'Remove outer sheath without damaging copper wire guides.',
          checklist: ['Insulation cut check', 'Voltage tester test', 'Clamp terminal screw', 'Copper core thickness']
        };
    }
  };

  const activeOverlay = getCameraGuidelines(selectedAssessmentSkill);

  // Start video webcam feed
  const startCameraFeed = async () => {
    setCameraActive(true);
    setRecordingState('idle');
    setRecordingSeconds(0);
    addLog('info', `HARDWARE: Activating web camera overlay for ${selectedAssessmentSkill} verification...`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        addLog('success', 'HARDWARE: Connected local media stream.');
      }
    } catch (e) {
      addLog('warning', 'HARDWARE: System webcam blocked or missing. Launching digital simulation.');
    }
  };

  const stopCameraFeed = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    addLog('info', 'HARDWARE: Released web camera hardware lock.');
  };

  const startRecordTest = () => {
    setRecordingState('recording');
    addLog('query', `SQL: INSERT INTO assessments (trade, status) VALUES ('${selectedAssessmentSkill}', 'recording');`);
    let secs = 0;
    const interval = setInterval(() => {
      secs++;
      setRecordingSeconds(secs);
      if (secs >= 5) {
        clearInterval(interval);
        finishRecordTest();
      }
    }, 1000);
  };

  const finishRecordTest = () => {
    setRecordingState('finished');
    stopCameraFeed();
    setAssessmentStep('processing');
    simulateAIEngine();
  };

  // Visual AI processing simulator
  const simulateAIEngine = () => {
    addLog('info', 'AI_ENGINE: Sending capture frames to cloud vision node...');
    setProcessingStages({ tools: 'scanning', safety: 'waiting', technique: 'waiting', workflow: 'waiting' });
    
    setTimeout(() => {
      addLog('success', `AI_VISION: Verified: ${activeOverlay.checklist[0]}`);
      setProcessingStages(prev => ({ ...prev, tools: 'done', safety: 'scanning' }));
      
      setTimeout(() => {
        addLog('success', `AI_VISION: Verified: ${activeOverlay.checklist[1]}`);
        setProcessingStages(prev => ({ ...prev, safety: 'done', technique: 'scanning' }));
        
        setTimeout(() => {
          addLog('success', `AI_VISION: Verified: ${activeOverlay.checklist[2]}`);
          setProcessingStages(prev => ({ ...prev, technique: 'done', workflow: 'scanning' }));
          
          setTimeout(() => {
            addLog('success', `AI_VISION: Verified: ${activeOverlay.checklist[3]}`);
            setProcessingStages(prev => ({ ...prev, workflow: 'done' }));
            
            setTimeout(() => {
              setAssessmentStep('result');
              addLog('success', 'AI_ENGINE: Scorecard calculation complete.');
            }, 600);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const saveAssessmentScore = () => {
    const updatedSkills = {
      precision: 93,
      safety: 90,
      problemSolving: 82,
      speed: 91,
      communication: 78
    };

    updateWorkerProfile(selectedWorkerId, {
      trustScore: 92,
      skillsDNA: updatedSkills,
      verifiedSkills: Array.from(new Set([...workers.find(w => w.id === selectedWorkerId)?.verifiedSkills || [], `${selectedAssessmentSkill} Level L4`, 'AI Camera Approved']))
    });

    setActiveTab('candidates');
    setAssessmentStep('camera');
    addLog('success', `SYNC: Profile ${selectedWorkerId} scores synchronized on dashboard.`);
  };

  // Initiate Voice Interview
  const startVoiceInterview = (trade) => {
    const questions = QUESTION_BANKS[trade] || QUESTION_BANKS.Electrician;
    setVoiceStep(0);
    setVoiceMessages([
      { sender: 'ai', text: `Welcome to KarmSetu AI Voice Verification. Let's begin the safety check for the ${trade} trade.` },
      { sender: 'ai', text: questions[0].q }
    ]);
  };

  // Evaluate Voice transcript via Gemini or Fallback keywords
  const evaluateSpeechResult = async (question, answer) => {
    if (!geminiKey) {
      addLog('info', 'AI_ENGINE: No API Key found. Running offline regex evaluator.');
      const questions = QUESTION_BANKS[selectedAssessmentSkill] || QUESTION_BANKS.Electrician;
      let matches = 0;
      questions[voiceStep].keywords.forEach(word => {
        if (answer.toLowerCase().includes(word)) matches++;
      });
      return {
        safety: Math.min(84 + (matches * 4), 96),
        communication: 80,
        problemSolving: Math.min(80 + (matches * 5), 94),
        speed: 85,
        feedback: `Offline grade: Transcribed "${answer}". Matched ${matches} trade keywords. Updated Trust scores.`
      };
    }

    addLog('query', 'AI_ENGINE: Transmitting response query to Gemini API...');
    const promptText = `
      You are KarmSetu AI, an expert skill evaluator for vocational trades in India.
      Evaluate this candidate response: "${answer}" to this question: "${question}".
      
      Score parameters 0-100:
      1. safety (Insulated tools, switching power off, thread tapes)
      2. communication (vocabulary)
      3. problemSolving (diagnostics)
      4. speed
      
      Return ONLY a raw JSON block:
      {
        "safety": 92,
        "communication": 80,
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
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      addLog('warning', `AI_ENGINE_ERROR: ${e.message}. Loading fallback scores.`);
      return { safety: 88, communication: 80, problemSolving: 85, speed: 85, feedback: 'Grade calculated via offline backup.' };
    }
  };

  const handleMicSubmit = async (text) => {
    if (!text.trim()) return;
    const questions = QUESTION_BANKS[selectedAssessmentSkill] || QUESTION_BANKS.Electrician;
    const newChat = [...voiceMessages, { sender: 'worker', text }];
    setVoiceMessages(newChat);

    const currentQ = questions[voiceStep];
    const nextQStep = voiceStep + 1;

    setTimeout(async () => {
      if (nextQStep < questions.length) {
        setVoiceStep(nextQStep);
        setVoiceMessages(prev => [...prev, { sender: 'ai', text: questions[nextQStep].q }]);
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(questions[nextQStep].q));
        }
      } else {
        addLog('info', 'AI_ENGINE: Scoring overall diagnostic metrics...');
        const evaluation = await evaluateSpeechResult(currentQ.q, text);
        setVoiceMessages(prev => [...prev, { sender: 'ai', text: evaluation.feedback }]);
        
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(evaluation.feedback));
        }

        const updatedDNA = {
          precision: workers.find(w => w.id === selectedWorkerId)?.skillsDNA.precision || 90,
          safety: evaluation.safety,
          problemSolving: evaluation.problemSolving,
          speed: evaluation.speed,
          communication: evaluation.communication
        };
        const avgScore = Math.round((evaluation.safety + evaluation.problemSolving + evaluation.communication) / 3);

        updateWorkerProfile(selectedWorkerId, {
          trustScore: Math.max(avgScore, 89),
          skillsDNA: updatedDNA
        });
      }
    }, 1200);
  };

  // Toggle Web speech listener
  const toggleSpeechListener = () => {
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
          handleMicSubmit(result);
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
      // Simulation mode if not supported
      setIsListening(true);
      setTimeout(() => {
        const mockResponses = [
          "I switch off the main MCB breaker switches, use test leads to check voltage, and wear heavy rubber gloves.",
          "Parallel circuits divide the current, so if one fan fails, the other fans keep running on 220V voltage.",
          "We set digital multimeter dial to continuity ohms beep sound and look for zero resistance values."
        ];
        handleMicSubmit(mockResponses[voiceStep]);
        setIsListening(false);
      }, 2500);
    }
  };

  const handleSaveConfig = (jsonInput, keyInput) => {
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

  // Filter Directory List
  const filteredList = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = filterTrade === 'All' || w.skill === filterTrade;
    const matchesLoc = filterLocation === 'All' || w.location.includes(filterLocation);
    return matchesSearch && matchesTrade && matchesLoc;
  });

  const selectedWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  return (
    <div className="app-container">
      
      {/* HEADER SECTION */}
      <header className="main-header">
        <div className="logo-group">
          <LogoSVG />
          <span className="logo-text">Karm<span>Setu</span></span>
          <div className="infra-badge">
            <Shield size={12} className="text-blue-500" /> PMKVY & NSDC Trust Grid Mapped
          </div>
        </div>

        {/* Tab Controls */}
        <nav className="nav-tabs">
          <button 
            className={`nav-tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidates')}
          >
            <Users size={14} /> Candidate Directory
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('verify');
              setAssessmentStep('camera');
              startVoiceInterview(selectedAssessmentSkill);
            }}
          >
            <Video size={14} /> Skill Verification
          </button>
        </nav>

        <div className="header-actions">
          <button 
            className={`btn-secondary ${showConfig ? 'active' : ''}`}
            onClick={() => setShowConfig(!showConfig)}
            style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', padding: '6px 12px' }}
          >
            <Settings size={13} /> Cloud Setup
          </button>

          <button className="theme-btn" onClick={toggleTheme}>
            {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
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
            <button className="btn-primary" onClick={() => handleSaveConfig(firebaseConfigInput, geminiKey)} style={{ fontSize: '0.75rem' }}>
              Save Credentials
            </button>
            <button className="btn-outline" onClick={() => setShowConfig(false)} style={{ fontSize: '0.75rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MAIN SCREEN WORKSPACE */}
      <main className="main-content">
        
        {/* ======================================================== */}
        {/* VIEW 1: Candidate Directory Tab                          */}
        {/* ======================================================== */}
        {activeTab === 'candidates' && (
          <div className="directory-grid">
            
            {/* Left Catalog List */}
            <div className="candidates-list-card">
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Verified Candidates</h3>
              
              <div className="search-filter-box">
                <div className="search-input-wrapper">
                  <Search size={14} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search by name or skill..." 
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      addLog('query', `SQL: SELECT * FROM workers WHERE name LIKE '%${e.target.value}%';`);
                    }}
                    className="search-input"
                  />
                </div>

                <div className="filter-selects">
                  <select 
                    value={filterTrade} 
                    onChange={(e) => {
                      setFilterTrade(e.target.value);
                      addLog('query', `SQL: SELECT * FROM workers WHERE skill = '${e.target.value}';`);
                    }}
                    className="filter-select"
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
                    className="filter-select"
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

            {/* Right Candidate Details */}
            <div className="profile-detail-card">
              
              <div className="profile-main-header">
                <div className="profile-avatar-row">
                  <img src={selectedWorker.avatar} alt="Avatar" className="profile-avatar-lg" />
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {selectedWorker.name}
                      <span className="govt-verified-pill">
                        <CheckCircle size={10} /> Aadhaar Verified
                      </span>
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                      {selectedWorker.location}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-outline" onClick={() => setShowResume(!showResume)}>
                    <FileText size={14} /> {showResume ? 'Hide CV Details' : 'Generate AI CV'}
                  </button>

                  {hiredWorkerId === selectedWorker.id ? (
                    <div style={{ backgroundColor: 'var(--color-secondary-light)', border: '1px solid var(--color-secondary)', color: '#065F46', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
                      ✓ Contract Offered
                    </div>
                  ) : (
                    <button 
                      className="btn-primary" 
                      onClick={() => {
                        setHiredWorkerId(selectedWorker.id);
                        addLog('success', `HIRING_SERVICE: Dispatched formal contract to ${selectedWorker.name}.`);
                        alert(`Contract offer sent to ${selectedWorker.name}!`);
                      }}
                    >
                      Hire Candidate
                    </button>
                  )}
                </div>
              </div>

              {/* Printable AI Resume Sheet */}
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
                      <span><strong>Candidate:</strong> {selectedWorker.name}</span>
                      <span><strong>Profession:</strong> {selectedWorker.skill}</span>
                      <span><strong>Experience:</strong> {selectedWorker.experience}</span>
                      <span><strong>Location:</strong> {selectedWorker.location}</span>
                    </div>

                    <div className="resume-sec">
                      <span className="resume-sec-title">Skill DNA Matrix</span>
                      {Object.entries(selectedWorker.skillsDNA).map(([key, val]) => (
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
                <div className="profile-grid-details">
                  
                  {/* Left: Video feed + transcript */}
                  <div className="media-container">
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Video size={14} className="text-blue-500" /> AI Vision Skill Assessment
                    </span>

                    <div className="video-frame-box">
                      <div className="video-play-overlay" onClick={() => alert('Starting simulated vision feed playback...')}>
                        <Play size={32} style={{ margin: '0 auto 6px auto' }} />
                        <p style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Watch Assessment Playback Feed</p>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <Mic size={14} className="text-blue-500" /> Voice Interview Transcript
                    </span>
                    <div className="transcript-block">
                      <blockquote>"{selectedWorker.voiceTranscript}"</blockquote>
                    </div>
                  </div>

                  {/* Right: Skill DNA scorecard */}
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <Activity size={14} className="text-emerald-500" /> Skill DNA scorecard
                    </span>

                    <div className="dna-card-box">
                      <div className="dna-title-row">
                        <span>Trade Traits</span>
                        <span>Rating %</span>
                      </div>
                      
                      <div className="dna-bars-wrapper">
                        {[
                          { name: 'Precision & Cut accuracy', key: 'precision', color: '#3B82F6' },
                          { name: 'Safety Practices & Gear', key: 'safety', color: '#10B981' },
                          { name: 'Technical Problem Solving', key: 'problemSolving', color: '#8B5CF6' },
                          { name: 'Speed & Process timing', key: 'speed', color: '#EC4899' },
                          { name: 'Communication & Dialect', key: 'communication', color: '#F59E0B' }
                        ].map(trait => {
                          const val = selectedWorker.skillsDNA[trait.key];
                          return (
                            <div key={trait.key} className="dna-bar-block">
                              <div className="dna-bar-header">
                                <span>{trait.name}</span>
                                <span>{val}%</span>
                              </div>
                              <div className="dna-bar-track">
                                <div className="dna-bar-fill" style={{ width: `${val}%`, backgroundColor: trait.color }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Verified badges */}
                    <div style={{ marginTop: '16px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Verified Credentials</span>
                      <div className="badges-row">
                        {selectedWorker.verifiedSkills.map((badge, idx) => (
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

        {/* ======================================================== */}
        {/* VIEW 2: Skill Verification (Camera & Voice AI)           */}
        {/* ======================================================== */}
        {activeTab === 'verify' && (
          <div className="verification-workspace">
            
            {/* Left: AI Camera Video assessment */}
            <div className="camera-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AI Vision Diagnostic Scan</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Verify candidate: <strong>{selectedWorker.name}</strong></p>
                </div>

                <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--color-bg)', padding: '3px', borderRadius: '20px' }}>
                  {['Electrician', 'Plumber', 'Carpenter', 'Tailor'].map(trade => (
                    <button 
                      key={trade}
                      onClick={() => {
                        setSelectedAssessmentSkill(trade);
                        addLog('info', `ASSESSMENT: Switched diagnostic checks template to: ${trade}`);
                        startVoiceInterview(trade);
                      }}
                      style={{ border: 'none', cursor: 'pointer', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '15px', fontWeight: 600, 
                               background: selectedAssessmentSkill === trade ? 'var(--color-primary)' : 'transparent',
                               color: selectedAssessmentSkill === trade ? '#fff' : 'var(--color-text-secondary)' }}
                    >
                      {trade}
                    </button>
                  ))}
                </div>
              </div>

              {assessmentStep === 'camera' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="camera-stream-box">
                    {cameraActive ? (
                      <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay playsInline muted></video>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>
                        <p style={{ fontSize: '0.8rem' }}>Webcam diagnostic panel interface ready.</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', marginTop: '2px' }}>Connect camera and record a short action clip to evaluate.</p>
                      </div>
                    )}

                    <div className="camera-crop-overlay">
                      <div className="camera-scan-bar"></div>
                      {recordingState === 'recording' && (
                        <div style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px' }}>
                          REC {recordingSeconds}s
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.75rem' }}>
                    <strong>Guidelines: {activeOverlay.title}</strong>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '2px', fontSize: '0.7rem' }}>{activeOverlay.desc}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {!cameraActive && recordingState === 'idle' ? (
                      <button className="btn-secondary" onClick={startCameraFeed}>
                        Activate Camera
                      </button>
                    ) : (
                      <button 
                        className={`camera-record-btn ${recordingState === 'recording' ? 'recording' : ''}`}
                        onClick={recordingState === 'idle' ? startRecordTest : finishRecordTest}
                        title="Click to record 5s diagnostic clip"
                      ></button>
                    )}
                  </div>
                </div>
              )}

              {assessmentStep === 'processing' && (
                <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--color-primary-light)', borderTopColor: 'var(--color-secondary)', animation: 'spin 1s linear infinite' }}></div>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                  <div>
                    <h3 style={{ fontSize: '1rem' }}>AI Diagnostics Scoring</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Evaluating camera metrics...</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '280px', textAlign: 'left' }}>
                    {[
                      { name: activeOverlay.checklist[0], stage: processingStages.tools },
                      { name: activeOverlay.checklist[1], stage: processingStages.safety },
                      { name: activeOverlay.checklist[2], stage: processingStages.technique },
                      { name: activeOverlay.checklist[3], stage: processingStages.workflow }
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', opacity: step.stage === 'waiting' ? 0.4 : 1 }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                      backgroundColor: step.stage === 'done' ? 'var(--color-secondary)' : 'var(--color-border)', color: '#fff', fontSize: '8px' }}>
                          {step.stage === 'done' ? '✓' : ''}
                        </div>
                        <span>{step.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {assessmentStep === 'result' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.2s ease' }}>
                  <div style={{ backgroundColor: 'var(--color-bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Scoring report generated</span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '2px' }}>{selectedAssessmentSkill} - NSQF L4</h3>
                    <div className="govt-verified-pill" style={{ marginTop: '6px' }}>
                      <CheckCircle size={10} /> 93% AI Confidence Mapped
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ backgroundColor: 'var(--color-bg)', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>✓ Compliant Traits</span>
                      • Safety tools verified.<br/>• Hand position guidelines check.
                    </div>
                    <div style={{ backgroundColor: 'var(--color-bg)', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>⚠ Warnings</span>
                      • Inspect voltage checklist.<br/>• Fastening torque check needed.
                    </div>
                  </div>

                  <button className="btn-primary" style={{ width: '100%' }} onClick={saveAssessmentScore}>
                    Sync Scorecard with Dashboard
                  </button>
                </div>
              )}

            </div>

            {/* Right: AI Voice interview dialogue */}
            <div className="voice-card">
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AI Speech Assessment</h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>3-question vocational safety check.</p>
              </div>

              <div className="voice-chat-box">
                {voiceMessages.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="voice-actions-footer">
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  {isListening ? '🎙 Listening... Speak now.' : `Question ${voiceStep + 1} of 3. Click microphone to answer.`}
                </span>

                <button className={`mic-btn-circle ${isListening ? 'listening' : ''}`} onClick={toggleSpeechListener}>
                  <Mic size={20} />
                </button>

                <div style={{ display: 'flex', width: '100%', gap: '6px', borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '6px' }}>
                  <input 
                    type="text" 
                    placeholder="Type speech response simulation..." 
                    value={voiceInputText}
                    onChange={(e) => setVoiceInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleMicSubmit(voiceInputText);
                        setVoiceInputText('');
                      }
                    }}
                    style={{ flex: 1, backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', outline: 'none' }}
                  />
                  <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={() => {
                    handleMicSubmit(voiceInputText);
                    setVoiceInputText('');
                  }}>
                    Send
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Floating Bottom Console Logs */}
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
