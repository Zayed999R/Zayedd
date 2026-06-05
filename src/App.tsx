/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, Bot, User, Loader2, Link2, ExternalLink, Image as ImageIcon, X, 
  TrendingUp, TrendingDown, GraduationCap, Languages, Calculator, Cpu, 
  Code, Briefcase, Globe, Heart, Sparkles, HelpCircle, BookOpen, Trash2, 
  PenLine, Plus, Menu, Copy, Check, Volume2, VolumeX, Mic, MicOff, 
  Sun, Moon, UserCheck, FileText, RefreshCw, Sparkle 
} from "lucide-react";

// Types & Definitions
type Role = "ai" | "user";

interface Attachment {
  base64: string;
  mimeType: string;
  fileName?: string;
  fileSize?: string;
}

interface Message {
  id: string;
  role: Role;
  text: string;
  attachment?: Attachment;
  timestamp: string;
  assistantId?: string;
}

interface ChatThread {
  id: string;
  name: string;
  assistantId: string;
  messages: Message[];
  createdAt: string;
}

interface UserProfile {
  name: string;
  role: string;
  avatarColor: string;
}

// Sparkline graph visual generator for the Crypto ticker
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const width = 50;
  const height = 16;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className="w-12 h-4 shrink-0 overflow-visible ml-1.5 opacity-80" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={positive ? "#10b981" : "#f43f5e"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// Live Crypto Ticker with TV news headline marquee style
export function MarketTicker() {
  interface TickerCoin {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    sparkline: number[];
    color: string;
    priceFlashing?: "up" | "down" | null;
  }

  const initialCoins: TickerCoin[] = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 68432.10, change24h: 2.34, sparkline: [67100, 67400, 67200, 67900, 68100, 68000, 68432], color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3456.80, change24h: 1.12, sparkline: [3410, 3430, 3420, 3440, 3460, 3450, 3456.8], color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
    { id: "solana", symbol: "SOL", name: "Solana", price: 168.45, change24h: 5.67, sparkline: [158, 160, 162, 161, 165, 167, 168.45], color: "text-purple-500 bg-purple-500/10 border border-purple-500/20" },
    { id: "verse", symbol: "VERSE", name: "Verse Token", price: 0.002415, change24h: 12.45, sparkline: [0.0021, 0.0022, 0.00215, 0.0023, 0.00235, 0.0024, 0.002415], color: "text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 font-bold animate-pulse" },
  ];

  const [coins, setCoins] = useState<TickerCoin[]>(initialCoins);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prev) =>
        prev.map((coin) => {
          const changePercent = (Math.random() - 0.46) * 0.12; 
          const oldPrice = coin.price;
          const newPrice = Number((coin.price * (1 + changePercent / 100)).toFixed(coin.symbol === "VERSE" ? 6 : 2));
          const direction = newPrice > oldPrice ? "up" : "down";

          let newSparkline = [...coin.sparkline];
          if (newSparkline.length > 10) newSparkline.shift();
          newSparkline.push(newPrice);

          return {
            ...coin,
            price: newPrice,
            change24h: Number((coin.change24h + changePercent).toFixed(2)),
            sparkline: newSparkline,
            priceFlashing: direction,
          };
        })
      );

      setTimeout(() => {
        setCoins((prev) => prev.map((c) => ({ ...c, priceFlashing: null })));
      }, 1500);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const renderCoinItem = (coin: TickerCoin, idx: number) => {
    const isUp = coin.change24h >= 0;
    return (
      <div 
        key={`${coin.symbol}-${idx}`} 
        className="flex items-center gap-3 whitespace-nowrap py-1 select-none pr-6 border-r border-slate-700/30 text-xs shrink-0"
      >
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-black font-mono ${coin.color}`}>
          {coin.symbol}
        </span>
        <span 
          className={`font-mono font-bold tracking-tight text-xs transition-all duration-300 ${
            coin.priceFlashing === "up" 
              ? "text-emerald-500 scale-105" 
              : coin.priceFlashing === "down" 
                ? "text-rose-500 scale-105" 
                : "text-slate-300"
          }`}
        >
          ${coin.symbol === "VERSE" ? coin.price.toFixed(6) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <span className={`flex items-center gap-0.5 text-[11px] font-bold ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
          {isUp ? "+" : ""}{coin.change24h}%
        </span>
        <Sparkline data={coin.sparkline} positive={isUp} />
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 relative z-25 flex items-center h-8 overflow-hidden select-none" id="tv-headline-ticker">
      {/* Live icon and marquee label */}
      <div className="absolute left-0 top-0 bottom-0 px-3 bg-rose-600 font-mono font-black text-[9px] tracking-widest text-white flex items-center z-30 border-r border-rose-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-1.5 shrink-0" />
        VERSE NET
      </div>
      
      {/* Scroll Marquee loops */}
      <div className="pl-24 w-full overflow-hidden">
        <div className="animate-ticker flex items-center gap-6 py-1">
          <div className="flex items-center gap-6">
            {coins.map((coin, idx) => renderCoinItem(coin, idx))}
          </div>
          <div className="flex items-center gap-6">
            {coins.map((coin, idx) => renderCoinItem(coin, idx))}
          </div>
          <div className="flex items-center gap-6">
            {coins.map((coin, idx) => renderCoinItem(coin, idx))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Upgraded high-tech Verse Token logo component
export function VerseLogo({ className = "w-6 h-6", glow = false }: { className?: string; glow?: boolean }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${glow ? "drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]" : ""}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <radialGradient id="verseRadial" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#2AEEFF" />
            <stop offset="45%" stopColor="#1C75E5" />
            <stop offset="100%" stopColor="#D400E5" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#verseRadial)" />
        <path 
          d="M33 36 C33 36 44 60 48.5 67.5 C49.2 68.7 50.8 68.7 51.5 67.5 C56 60 67 36 67 36" 
          stroke="white" 
          strokeWidth="14" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
    </div>
  );
}

// Assistant Presets Config
const ASSISTANTS = [
  {
    id: "general",
    name: "General AI Assistant",
    tagline: "Your smart, all-purpose assistant with bilingual precision to tackle any idea.",
    icon: Sparkle,
    color: "cyan",
    gradient: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-400/20",
    hoverBg: "hover:bg-cyan-500/10",
    systemPrompt: "All-purpose multi-modal smart replies",
    suggestedPrompts: [
      { text: "Help me write a creative email requesting a partnership", label: "Partnership Mail" },
      { text: "What is the core difference between centralized and decentralized intelligence?", label: "Central vs Decentralized" },
    ]
  },
  {
    id: "seo",
    name: "SEO Strategist",
    tagline: "Drive organic search traffic with technical audits & metadata structures.",
    icon: Briefcase,
    color: "emerald",
    gradient: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-400/20",
    hoverBg: "hover:bg-emerald-500/10",
    systemPrompt: "Specialized On-page/Off-page SEO consulting",
    suggestedPrompts: [
      { text: "Provide an On-Page SEO Checklist for standard React e-commerce apps", label: "React SEO Checklist" },
      { text: "How do Core Web Vitals influence our organic Google rankings?", label: "Core Web Vitals Guide" },
    ]
  },
  {
    id: "code",
    name: "Coding Wizard",
    tagline: "Your expert TypeScript, React, and general full-stack code companion.",
    icon: Code,
    color: "purple",
    gradient: "from-purple-500/20 to-fuchsia-500/20 text-purple-400 border-purple-400/20",
    hoverBg: "hover:bg-purple-500/10",
    systemPrompt: "Advanced programming debugging & template scaffolding",
    suggestedPrompts: [
      { text: "Write a complete custom React hook for handling local storage synchronization", label: "Custom Storage Hook" },
      { text: "Explain how React Suspense and Error Boundaries handle asynchronous API loads", label: "Async Suspense Debug" },
    ]
  },
  {
    id: "study",
    name: "Study Coach",
    tagline: "Ace your exams & assignments with Feynman learning methods and breakdowns.",
    icon: GraduationCap,
    color: "amber",
    gradient: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-400/20",
    hoverBg: "hover:bg-amber-500/10",
    systemPrompt: "Active recall study notes & concepts breaks",
    suggestedPrompts: [
      { text: "Explain Quantum Entanglement simply using the Feynman study technique", label: "Feynman Quantum study" },
      { text: "Create 5 mock math questions testing Compound interest calculations", label: "Compound Interest quiz" },
    ]
  },
  {
    id: "crypto",
    name: "Web3 & Crypto Analyst",
    tagline: "Audit smart contracts, study liquidity pools, and evaluate tokenomics.",
    icon: Calculator,
    color: "rose",
    gradient: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-400/20",
    hoverBg: "hover:bg-rose-500/10",
    systemPrompt: "Specialist DeFi protocol explorer & blockchain audit helper",
    suggestedPrompts: [
      { text: "How does an Automated Market Maker (AMM) calculate price slippage?", label: "AMM slippage engine" },
      { text: "Explain the differences between Layer 1 security and Layer 2 Optimistic rollups", label: "L1 vs L2 security parameters" },
    ]
  },
  {
    id: "verse",
    name: "Verse Hub Guide",
    tagline: "Dive into the $VERSE ecosystem rewards, utilities and community portals.",
    icon: Globe,
    color: "blue",
    gradient: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-400/20",
    hoverBg: "hover:bg-blue-500/10",
    systemPrompt: "Official community referral tracker & token integrations",
    suggestedPrompts: [
      { text: "What are the core utility mechanics of the VERSE Token? Show me the register hub", label: "VERSE Utility Mechanics" },
      { text: "How do I claim community rewards and join the Telegram discussion groups?", label: "Join Verse Community" },
    ]
  }
];

export default function App() {
  // Global App States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeAssistantId, setActiveAssistantId] = useState<string>("general");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messagePrompt, setMessagePrompt] = useState<string>("Hello, eVerseChatGPT AI!");

  // Speech and Sound States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // File Upload State (Previews & Payload handlers)
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  // Profile States
  const [profile, setProfile] = useState<UserProfile>({
    name: "Zayed Pioneer",
    role: "Full-Stack Dev",
    avatarColor: "from-cyan-500 to-indigo-600",
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Copy Feedback state
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Conversation Threads list persistence
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Speech Recognition hook variables (HTML5 Web Speech API browser checking)
  const recognitionRef = useRef<any>(null);

  // Active assistant configurations mapper helper
  const activeAssistant = ASSISTANTS.find(a => a.id === activeAssistantId) || ASSISTANTS[0];

  // 1. Initialize states & persistent variables from LocalStorage
  useEffect(() => {
    // Read Dark/Light state settings
    const storedTheme = localStorage.getItem("everse_theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    }

    // Read stored profile
    const storedProfile = localStorage.getItem("everse_profile");
    if (storedProfile) {
      try { setProfile(JSON.parse(storedProfile)); } catch(_) {}
    }

    // Read Chat threads lists
    const storedThreads = localStorage.getItem("everse_threads");
    if (storedThreads) {
      try {
        const parsed: ChatThread[] = JSON.parse(storedThreads);
        if (parsed.length > 0) {
          setThreads(parsed);
          setActiveThreadId(parsed[0].id);
        } else {
          instantiateDefaultThread();
        }
      } catch (err) {
        instantiateDefaultThread();
      }
    } else {
      instantiateDefaultThread();
    }
  }, []);

  // Sync threads list with local storage
  const saveThreads = (updatedThreads: ChatThread[]) => {
    setThreads(updatedThreads);
    localStorage.setItem("everse_threads", JSON.stringify(updatedThreads));
  };

  // Switch dark/light themes helper
  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    localStorage.setItem("everse_theme", nextTheme ? "dark" : "light");
  };

  // Instantiates a default initial thread
  const instantiateDefaultThread = () => {
    const defaultThread: ChatThread = {
      id: "thread_" + Date.now(),
      name: "eVerse Welcome Chat",
      assistantId: "general",
      messages: [
        {
          id: "msg_welcome",
          role: "ai",
          text: "Hello 👋 I am your eVerseChatGPT AI. I have been supercharged with specific modules to answer all queries! \n\nYou can select any specialized AI assistant from our active sidebar panel to optimize responses for your task (SEO Strategy, Engineering Code, Study Tutoring, Deep Crypto research or Verse integrations). Bengali & English languages are fully supported! Ask me anything.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          assistantId: "general"
        }
      ],
      createdAt: new Date().toISOString()
    };
    setThreads([defaultThread]);
    setActiveThreadId(defaultThread.id);
    localStorage.setItem("everse_threads", JSON.stringify([defaultThread]));
  };

  const getActiveThread = (): ChatThread | undefined => {
    return threads.find(t => t.id === activeThreadId);
  };

  // Spark speech synthesizer (TTS voice reader)
  const handleToggleVoiceOutput = (text: string, msgId: string) => {
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip simple markdown clutter for clean auditory narration
    const cleanText = text.replace(/[*#`_\-\[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Filter Bengali and Hindi unicode range
    const containsBengali = /[\u0980-\u09FF]/.test(cleanText);
    utterance.lang = containsBengali ? "bn-BD" : "en-US";

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Trigger web speech recognition API hook (STT microphone typist)
  const handleToggleVoiceInput = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("This browser doesn't natively support Speech Recognition APIs. Please try using modern Chrome or Safari browsers.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const rec = new SpeechRec();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US"; // Fallback general mode

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      if (resultText) {
        setMessagePrompt((prev) => prev ? prev + " " + resultText : resultText);
      }
    };

    rec.onerror = (e: any) => {
      console.error("Speech Recognition error:", e);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  // Sync profile details trigger
  const updateProfileDetails = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem("everse_profile", JSON.stringify(updated));
    setIsProfileModalOpen(false);
  };

  // Handles standard file loaders for image uploads and conversions
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload standard image formats.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result?.toString().split(",")[1];
      if (base64) {
        setAttachment({
          base64,
          mimeType: file.type,
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + " KB"
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // refresh inputs
  };

  // Handles standard PDF file inputs and processes PDF Summaries using backend
  const handlePDFFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a standard document PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result?.toString().split(",")[1];
      if (base64) {
        setAttachment({
          base64,
          mimeType: "application/pdf",
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + " KB"
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // refresh inputs
  };

  // Auto Scroll chat threads
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [threads, isLoading, activeThreadId]);

  // Command to spawn a new clean chat thread
  const handleNewThreadSpawn = () => {
    const newThread: ChatThread = {
      id: "thread_" + Date.now(),
      name: "eVerse Conversation",
      assistantId: activeAssistantId,
      messages: [
        {
          id: "msg_" + Date.now(),
          role: "ai",
          text: `You have successfully initialized a clean conversation thread with your **${activeAssistant.name}**! Ask me any questions, or drag & drop files/PDFs here to receive robust solutions.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          assistantId: activeAssistantId
        }
      ],
      createdAt: new Date().toISOString()
    };
    saveThreads([newThread, ...threads]);
    setActiveThreadId(newThread.id);
    setIsSidebarOpen(false);
  };

  // Delete an entire chat thread
  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = threads.filter(t => t.id !== id);
    if (filtered.length === 0) {
      instantiateDefaultThread();
    } else {
      saveThreads(filtered);
      if (activeThreadId === id) {
        setActiveThreadId(filtered[0].id);
      }
    }
  };

  // Rename an existing chat thread directly
  const handleRenameThreadPrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = threads.find(t => t.id === id);
    if (!target) return;
    const currentName = target.name;
    const newName = prompt("Enter a new title for this chat stream:", currentName);
    if (newName && newName.trim()) {
      const updated = threads.map(t => t.id === id ? { ...t, name: newName.trim() } : t);
      saveThreads(updated);
    }
  };

  // Send messaging trigger
  const handlePublishMessage = async (overridePrompt?: string) => {
    const finalPrompt = (overridePrompt || messagePrompt).trim();
    if ((!finalPrompt && !attachment) || isLoading) return;

    const currentThread = getActiveThread();
    if (!currentThread) return;

    // Create user message
    const userMsg: Message = {
      id: "msg_user_" + Date.now(),
      role: "user",
      text: finalPrompt || (attachment?.mimeType === "application/pdf" ? "Summary of loaded PDF Document" : "Analysis of uploaded Image attachment"),
      attachment: attachment || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assistantId: activeAssistantId
    };

    // Update active screen state
    const nextMsgList = [...currentThread.messages, userMsg];
    const updatedThreads = threads.map(t => {
      if (t.id === currentThread.id) {
        // Automatically rename draft threads on the first real text message
        const nextTitle = (t.name === "eVerse Welcome Chat" || t.name === "eVerse Conversation") && finalPrompt 
          ? finalPrompt.substring(0, 30) + (finalPrompt.length > 30 ? "..." : "") 
          : t.name;

        return {
          ...t,
          messages: nextMsgList,
          name: nextTitle,
          assistantId: activeAssistantId
        };
      }
      return t;
    });

    saveThreads(updatedThreads);
    setMessagePrompt("");
    setAttachment(null);
    setIsLoading(true);

    try {
      // Stream payload history formatted precisely for backend model extraction
      const apiPayload = nextMsgList.map(m => ({
        role: m.role,
        text: m.text,
        attachment: m.attachment ? {
          base64: m.attachment.base64,
          mimeType: m.attachment.mimeType
        } : undefined
      }));

      // Call Express Back-end Endpoint 
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: apiPayload,
          assistantId: activeAssistantId
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Server responded with an unexpected status code.");
      }

      const val = await res.json();
      const aiReplyText = val.text;

      // Construct AI response box
      const aiResponseMsg: Message = {
        id: "msg_ai_" + Date.now(),
        role: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assistantId: activeAssistantId
      };

      const finalThreadsList = threads.map(t => {
        if (t.id === currentThread.id) {
          return {
            ...t,
            messages: [...nextMsgList, aiResponseMsg]
          };
        }
        return t;
      });

      saveThreads(finalThreadsList);

    } catch (err: any) {
      console.error("eVerse AI Communication failure:", err);
      const errBox: Message = {
        id: "msg_err_" + Date.now(),
        role: "ai",
        text: `⚠️ **Connection Failure**: ${err.message || "Failed to establish secure communications with the eVerse AI Engine. Please check your internet or retry."}\n\n*Make sure that your GEMINI_API_KEY environment variable is successfully set in Settings > Secrets.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assistantId: activeAssistantId
      };

      const fallbackThreadsList = threads.map(t => {
        if (t.id === currentThread.id) {
          return { ...t, messages: [...nextMsgList, errBox] };
        }
        return t;
      });

      saveThreads(fallbackThreadsList);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerates the last assistant response
  const handleRegenerateLastResponse = async () => {
    const currentThread = getActiveThread();
    if (!currentThread || isLoading) return;

    const currentMessages = [...currentThread.messages];
    if (currentMessages.length < 2) return;

    // Pop the last AI response (as well as any errors)
    let tempMsgArr = [...currentMessages];
    const lastMsg = tempMsgArr[tempMsgArr.length - 1];
    
    if (lastMsg.role === "ai") {
      tempMsgArr.pop();
    } else {
      return; // Can only regenerate if the last item is AI
    }

    // Set updated messages list state
    const cleanThreadsList = threads.map(t => {
      if (t.id === currentThread.id) {
        return { ...t, messages: tempMsgArr };
      }
      return t;
    });

    setThreads(cleanThreadsList);
    setIsLoading(true);

    try {
      const apiPayload = tempMsgArr.map(m => ({
        role: m.role,
        text: m.text,
        attachment: m.attachment ? {
          base64: m.attachment.base64,
          mimeType: m.attachment.mimeType
        } : undefined
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: apiPayload,
          assistantId: activeAssistantId
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Server side generation error.");
      }

      const val = await res.json();
      const aiReplyText = val.text;

      const regeneratedMsg: Message = {
        id: "msg_regen_" + Date.now(),
        role: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assistantId: activeAssistantId
      };

      const finalRegenThreads = threads.map(t => {
        if (t.id === currentThread.id) {
          return { ...t, messages: [...tempMsgArr, regeneratedMsg] };
        }
        return t;
      });

      saveThreads(finalRegenThreads);

    } catch (err: any) {
      console.error("Regeneration Failed:", err);
      const errorBubble: Message = {
        id: "msg_err_regen_" + Date.now(),
        role: "ai",
        text: `⚠️ **Regeneration Failed**: ${err.message || "Failed to contact your server's backend processor to formulate responses."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assistantId: activeAssistantId
      };

      const regenErrorThreads = threads.map(t => {
        if (t.id === currentThread.id) {
          return { ...t, messages: [...tempMsgArr, errorBubble] };
        }
        return t;
      });

      saveThreads(regenErrorThreads);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard layout handlers for instant transmissions
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePublishMessage();
    }
  };

  // Triggers prompt selection and injects to state
  const handleLoadSuggestedPrompt = (promptText: string) => {
    setMessagePrompt(promptText);
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  };

  // Standard Clipboard copy actions with popup state timer resets
  const handleCopyTextToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2500);
  };

  const currentThread = getActiveThread();

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${isDarkMode ? "bg-[#0b0f19] text-slate-100" : "bg-[#f5f8ff] text-slate-800"}`}>
      
      {/* Background neon flares for the cyberpunk/crypto aesthetic values */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[45%] bg-[#1c75e5]/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-15%] w-[45%] h-[45%] bg-[#d400e5]/10 blur-[130px] rounded-full" />
        </div>
      )}

      {/* Main Container Layer */}
      <div className="flex flex-col h-screen relative z-10 overflow-hidden">
        
        {/* Live TV headlines crypto metrics ticker */}
        <MarketTicker />

        {/* Dynamic header navbar for mobiles and mode settings */}
        <header className={`px-4 py-3 flex items-center justify-between border-b ${isDarkMode ? "bg-slate-900/60 border-slate-800/80 backdrop-blur-md" : "bg-white/80 border-slate-200 backdrop-blur-md"}`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-700/20 bg-slate-800/10 hover:bg-slate-800/20 cursor-pointer"
              title="Open Sidebar"
              id="mobile-menu-trigger"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <VerseLogo className="w-8 h-8" glow={isDarkMode} />
              <div className="leading-tight">
                <h1 className="text-base font-black tracking-tight flex items-center gap-1.5">
                  <span>eVerseChatGPT</span>
                  <span className="text-cyan-400">AI</span>
                </h1>
                <p className="text-[9px] font-medium text-slate-400 select-none uppercase tracking-widest leading-none">
                  V3.5 Supercharged Beta
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active profile pill tracker button */}
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${isDarkMode ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-cyan-300" : "bg-white border-slate-200 hover:bg-slate-50 text-indigo-600"}`}
              id="header-profile-pill"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{profile.name}</span>
            </button>

            {/* Dark & Light toggle option */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition duration-200 border cursor-pointer ${isDarkMode ? "bg-slate-800/50 border-slate-700/60 hover:bg-slate-700/50 text-yellow-400" : "bg-white border-slate-200 hover:bg-slate-100 text-indigo-500"}`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="dark-light-mode-toggle"
            >
              {isDarkMode ? <Sun className="w-4 h-4 animate-spin-once" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Double-Split Screen Area Layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Lg screens Sidebar layout */}
          <aside className={`hidden lg:flex flex-col w-72 shrink-0 border-r transition-all duration-300 ${isDarkMode ? "bg-[#080d19]/90 border-slate-800/80" : "bg-white border-slate-200"}`}>
            
            {/* New chat Stream triggers */}
            <div className="p-4 border-b border-slate-800/10 dark:border-slate-800/50">
              <button 
                onClick={handleNewThreadSpawn}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white shadow-lg shadow-cyan-500/15 transition-all flex items-center justify-center gap-2 cursor-pointer outline-none hover:scale-[1.02] active:scale-[0.98]"
                id="sidebar-new-chat-btn"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat Stream</span>
              </button>
            </div>

            {/* Thread selector panels list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin dark:scrollbar-thumb-slate-800">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-500 px-3 mb-2">
                ACTIVE PIPELINES
              </h4>
              {threads.map((t) => {
                const isActive = t.id === activeThreadId;
                const threadAssist = ASSISTANTS.find(a => a.id === t.assistantId) || ASSISTANTS[0];
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`group flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? (isDarkMode ? "bg-slate-800/80 border border-slate-700/60 font-semibold" : "bg-indigo-50 border border-indigo-100 font-semibold text-indigo-900")
                        : (isDarkMode ? "hover:bg-slate-800/30 border border-transparent" : "hover:bg-slate-100/50 border border-transparent")
                    }`}
                    id={`thread-item-${t.id}`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <threadAssist.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-400 animate-pulse" : "text-slate-400"}`} />
                      <div className="truncate pr-1">
                        <p className={`text-xs truncate ${isActive ? (isDarkMode ? "text-slate-100" : "text-indigo-950") : (isDarkMode ? "text-slate-400" : "text-slate-600")}`}>
                          {t.name}
                        </p>
                        <span className="text-[9px] text-slate-500 block leading-tight font-mono capitalize">
                          {threadAssist.name}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action controls */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleRenameThreadPrompt(t.id, e)} 
                        className="p-1 rounded hover:bg-slate-700/25 text-slate-400 hover:text-cyan-400"
                        title="Rename Chat"
                        id={`rename-btn-${t.id}`}
                      >
                        <PenLine className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteThread(t.id, e)} 
                        className="p-1 rounded hover:bg-slate-700/25 text-slate-400 hover:text-rose-400"
                        title="Delete Stream"
                        id={`delete-btn-${t.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selector Module for core active assistants */}
            <div className={`p-4 border-t ${isDarkMode ? "bg-slate-900/50 border-slate-800/50" : "bg-slate-50/50 border-slate-200"}`}>
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2 px-1">
                AI COGNITIVE PLUGINS
              </h4>
              <div className="grid grid-cols-2 gap-1.5" id="assistants-grid-sidebar">
                {ASSISTANTS.map((as) => (
                  <button
                    key={as.id}
                    onClick={() => {
                      setActiveAssistantId(as.id);
                      // Auto trigger thread migration context if suitable
                      const t = getActiveThread();
                      if (t && t.messages.length === 1) {
                        const updated = threads.map(th => th.id === t.id ? { ...th, assistantId: as.id } : th);
                        saveThreads(updated);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border cursor-pointer transition-all duration-200 ${
                      activeAssistantId === as.id 
                        ? (isDarkMode ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" : "bg-indigo-50 border-indigo-400/40 text-indigo-700")
                        : (isDarkMode ? "bg-slate-800/10 border-slate-800/40 hover:bg-slate-800/30 text-slate-400" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500")
                    }`}
                    id={`assist-btn-bar-${as.id}`}
                  >
                    <as.icon className="w-3.5 h-3.5 mb-1" />
                    <span className="text-[9px] font-bold tracking-tight truncate max-w-full">
                      {as.id === "general" ? "General" : as.id === "seo" ? "SEO" : as.id === "code" ? "Coding" : as.id === "study" ? "Study" : as.id === "crypto" ? "Crypto" : "Verse"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Lower Profile settings card clickables */}
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className={`mt-4 flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${isDarkMode ? "bg-slate-800/10 border-slate-800/80 hover:bg-slate-800/40 text-slate-300" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"}`}
                id="sidebar-profile-box"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${profile.avatarColor} text-white font-mono font-bold flex items-center justify-center text-xs shadow-md shadow-slate-900/10 uppercase`}>
                  {profile.name.charAt(0)}
                </div>
                <div className="overflow-hidden leading-tight flex-1">
                  <h5 className="text-xs font-bold text-slate-200 dark:text-slate-100 truncate">{profile.name}</h5>
                  <p className="text-[9px] text-slate-500 dark:text-slate-450 truncate font-medium">{profile.role}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Core Chat Stream Area Viewports layout */}
          <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            
            {/* Main scroll stream container */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
              id="scrollable-messages-stream-core"
            >
              
              {/* Homepage onboarding state panel */}
              {currentThread && currentThread.messages.length <= 1 && (
                <div className="max-w-3xl mx-auto py-10 space-y-8" id="home-dashboard-panel-view">
                  
                  {/* Branding showcase card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`text-center space-y-3 p-8 rounded-3xl border relative overflow-hidden ${isDarkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200/80 shadow-sm"}`}
                  >
                    <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/5 blur-[75px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-44 h-44 bg-purple-500/5 blur-[75px] rounded-full pointer-events-none" />

                    <div className="flex items-center justify-center mb-2">
                      <div className="p-3 bg-cyan-700/10 rounded-2xl border border-cyan-500/20 shadow-inner flex items-center justify-center">
                        <VerseLogo className="w-12 h-12" glow={isDarkMode} />
                      </div>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                      Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">eVerseChatGPT AI</span>
                    </h2>
                    
                    <p className={`text-xs md:text-sm max-w-lg mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      Supercharge your study routines, analyze cryptocurrency parameters, optimize SEO footprints, audit code block syntax, or write smart bilingual text solutions natively.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[11px] leading-normal font-medium max-w-md mx-auto">
                      <span className={`px-2.5 py-1 rounded-full border ${isDarkMode ? "bg-slate-800/30 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                        💬 English & Bengali Support
                      </span>
                      <span className={`px-2.5 py-1 rounded-full border ${isDarkMode ? "bg-slate-800/30 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                        📂 PDF Summation Extractor
                      </span>
                      <span className={`px-2.5 py-1 rounded-full border ${isDarkMode ? "bg-slate-800/30 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                        🎙️ voice input / output
                      </span>
                    </div>
                  </motion.div>

                  {/* Active assistant selection showcase details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 px-1 border-l-2 border-cyan-400 pl-3">
                      Select Active Mind Assistant Mode
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3" id="main-assistant-selectors-cards">
                      {ASSISTANTS.map((as) => {
                        const isSelected = activeAssistantId === as.id;
                        return (
                          <div
                            key={as.id}
                            onClick={() => {
                              setActiveAssistantId(as.id);
                              // Sync thread id assistant type mapping
                              const updated = threads.map(th => th.id === currentThread.id ? { ...th, assistantId: as.id } : th);
                              saveThreads(updated);
                            }}
                            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                              isSelected 
                                ? "bg-gradient-to-br from-cyan-900/10 to-indigo-900/10 border-cyan-500/50 shadow-md shadow-cyan-500/5 scale-[1.02]" 
                                : (isDarkMode ? "bg-slate-900/30 border-slate-800/80 hover:border-slate-700/55 hover:bg-slate-900/60" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:scale-[1.01]")
                            }`}
                            id={`card-as-${as.id}`}
                          >
                            <div className="flex items-center gap-2 mb-2 font-bold text-xs">
                              <div className={`p-1.5 rounded-lg border ${as.gradient} shadow-inner`}>
                                <as.icon className="w-3.5 h-3.5" />
                              </div>
                              <span className={isDarkMode ? "text-slate-100" : "text-slate-800"}>{as.name}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">
                              {as.tagline}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic suggestions prompts tailored to active assistant */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 px-1 border-l-2 border-cyan-400 pl-3">
                      Recommended Prompts for {activeAssistant.name}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="home-prompts-suggestions">
                      {activeAssistant.suggestedPrompts.map((p, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleLoadSuggestedPrompt(p.text)}
                          className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left group transition-all cursor-pointer ${
                            isDarkMode 
                              ? "bg-slate-900/20 border-slate-800/80 hover:bg-slate-800/30 hover:border-slate-700/60" 
                              : "bg-white border-slate-200 hover:bg-indigo-50/40 hover:border-indigo-200 shadow-sm"
                          }`}
                          id={`prompt-suggestion-${pIdx}`}
                        >
                          <div className={`p-1.5 rounded-lg bg-cyan-700/10 text-cyan-400 mt-0.5 shrink-0 transition-transform group-hover:scale-115`}>
                            <Sparkles className="w-3 h-3" />
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold transition-colors ${isDarkMode ? "text-slate-200 group-hover:text-cyan-300" : "text-slate-700 group-hover:text-indigo-600"}`}>
                              {p.label}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 lines-clamp-1 truncate block max-w-md">
                              {p.text}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat thread box renderer container */}
              <AnimatePresence mode="popLayout">
                {currentThread && currentThread.messages.map((msg) => {
                  const isUser = msg.role === "user";
                  const voiceIsActive = speakingMsgId === msg.id;

                  // Resolve assistant badges based on message active assignments
                  const msgAssist = ASSISTANTS.find(a => a.id === msg.assistantId) || activeAssistant;

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35 }}
                      className={`flex gap-3 md:gap-4 max-w-4xl mx-auto ${isUser ? "flex-row-reverse" : "flex-row"}`}
                      id={`bubble-${msg.id}`}
                    >
                      {/* Avatar generators */}
                      {isUser ? (
                        <div className={`w-8 h-8 rounded-xl shrink-0 mt-1.5 font-bold uppercase font-mono text-white flex items-center justify-center text-xs border shadow bg-gradient-to-br ${profile.avatarColor} border-slate-700/30`}>
                          {profile.name.charAt(0)}
                        </div>
                      ) : (
                        <div className="p-1 rounded-xl shrink-0 mt-1 border border-slate-800/40 bg-slate-900 flex items-center justify-center h-8 w-8 relative">
                          <VerseLogo className="w-5 h-5 animate-spin-once" />
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse border border-slate-900" />
                        </div>
                      )}

                      {/* Main Message box */}
                      <div className="flex-1 max-w-[85%] flex flex-col space-y-1">
                        
                        {/* Upper name label details */}
                        <div className={`flex items-center gap-2 text-[10px] px-1 ${isUser ? "justify-end" : "justify-start"}`}>
                          <span className={`font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            {isUser ? profile.name : "eVerse AI Engine"}
                          </span>
                          {!isUser && (
                            <span 
                              className={`px-1.5 py-0.2 rounded border font-bold text-[8px] uppercase tracking-wider ${msgAssist.gradient}`}
                            >
                              {msgAssist.name}
                            </span>
                          )}
                          <span className="text-slate-500 font-mono italic">
                            {msg.timestamp}
                          </span>
                        </div>

                        {/* Content text block layout */}
                        <div
                          className={`p-4 rounded-2xl relative shadow ${
                            isUser
                              ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none shadow-cyan-500/5 border border-cyan-500/20"
                              : (isDarkMode 
                                ? "bg-slate-900/60 border border-slate-800/80 rounded-tl-none text-slate-100 text-sm" 
                                : "bg-white border border-slate-200 rounded-tl-none text-slate-800 text-sm")
                          }`}
                        >
                          
                          {/* Attachments preview indicators */}
                          {msg.attachment && (
                            <div className="mb-3 rounded-xl overflow-hidden border border-slate-800/30 bg-slate-950/20 max-w-md shadow-sm">
                              {msg.attachment.mimeType === "application/pdf" ? (
                                <div className="p-3 flex items-center gap-3">
                                  <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
                                    <FileText className="w-6 h-6" />
                                  </div>
                                  <div className="truncate text-left leading-snug">
                                    <p className={`text-xs font-black truncate text-wrap break-all ${isUser ? "text-white" : "text-slate-200"}`}>
                                      {msg.attachment.fileName || "document_report.pdf"}
                                    </p>
                                    <span className="text-[10px] text-slate-400 block font-mono">
                                      {msg.attachment.fileSize || "1.2 MB"} • PDF summing
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <img 
                                  src={`data:${msg.attachment.mimeType};base64,${msg.attachment.base64}`} 
                                  alt="Loaded user attachment visual" 
                                  className="max-w-full h-auto object-cover max-h-72 block"
                                />
                              )}
                            </div>
                          )}

                          {/* Markdown formatted text output text content area */}
                          <div className="prose prose-sm dark:prose-invert max-w-none text-xs md:text-[13px] leading-relaxed whitespace-pre-wrap font-sans">
                            {msg.text}
                          </div>

                          {/* Interactive control buttons below AI bot replies */}
                          {!isUser && (
                            <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/10 dark:border-slate-800/50 justify-end">
                              
                              {/* Voice player toggle trigger button */}
                              <button
                                onClick={() => handleToggleVoiceOutput(msg.text, msg.id)}
                                className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-[10px] font-bold ${
                                  voiceIsActive 
                                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse" 
                                    : (isDarkMode ? "bg-slate-800/30 border-slate-800/80 hover:bg-slate-800/70 text-slate-400 hover:text-slate-200" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800")
                                }`}
                                title={voiceIsActive ? "Stop voice narration" : "Read message out loud"}
                                id={`tts-toggle-${msg.id}`}
                              >
                                {voiceIsActive ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                <span>{voiceIsActive ? "Mute Speech" : "Speak Voice"}</span>
                              </button>

                              {/* Clipboard copying helper actions button */}
                              <button
                                onClick={() => handleCopyTextToClipboard(msg.text, msg.id)}
                                className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-[10px] font-bold ${
                                  copiedMsgId === msg.id 
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                    : (isDarkMode ? "bg-slate-800/30 border-slate-800/80 hover:bg-slate-800/70 text-slate-400 hover:text-slate-200" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800")
                                }`}
                                title="Copy full response"
                                id={`copy-toggle-${msg.id}`}
                              >
                                {copiedMsgId === msg.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedMsgId === msg.id ? "Copied" : "Copy"}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Response generation loaders */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-3 md:gap-4 max-w-4xl mx-auto"
                    id="loader-generation-item-chat"
                  >
                    <div className="p-1 rounded-xl mt-1 border border-slate-800/40 bg-slate-900 flex items-center justify-center h-8 w-8">
                      <Loader2 className="w-4.5 h-4.5 text-cyan-400 animate-spin" />
                    </div>
                    <div className="flex-1 max-w-[85%] flex flex-col space-y-1">
                      <div className="text-[10px] px-1 text-slate-500 font-bold">
                        eVerse AI Engine computing...
                      </div>
                      <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isDarkMode ? "bg-slate-900/60 border-slate-800/80 rounded-tl-none" : "bg-white border-slate-200 rounded-tl-none"}`}>
                        <div className="flex space-x-1.5 justify-center items-center py-1">
                          <span className="sr-only">Thinking...</span>
                          <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce" />
                        </div>
                        <span className="text-xs text-slate-400 select-none">Generating intelligent, fast solution...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input area control dashboard for messages, attachments & STT mics */}
            <footer className={`p-4 border-t ${isDarkMode ? "bg-slate-900/50 border-slate-800/80 backdrop-blur-md" : "bg-white border-slate-200 shadow-xl"}`}>
              <div className="max-w-4xl mx-auto space-y-4">
                
                {/* Embedded dynamic control row for active assistants & files actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs">
                  
                  {/* File Thumbnail preloaded indicators */}
                  <div>
                    <AnimatePresence>
                      {attachment && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="relative inline-block"
                          id="attachment-preview-box"
                        >
                          <div className={`p-2 rounded-xl border flex items-center gap-2.5 max-w-xs shadow ${isDarkMode ? "bg-slate-900/80 border-cyan-500/30" : "bg-slate-50 border-slate-300"}`}>
                            {attachment.mimeType === "application/pdf" ? (
                              <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                            ) : (
                              <img 
                                src={`data:${attachment.mimeType};base64,${attachment.base64}`} 
                                alt="Preview layout" 
                                className="w-6 h-6 object-cover rounded-lg shrink-0"
                              />
                            )}
                            <div className="truncate text-left leading-tight pr-5">
                              <p className={`text-[10px] font-bold truncate max-w-[120px] ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                                {attachment.fileName}
                              </p>
                              <span className="text-[9px] text-slate-500 font-mono block">
                                {attachment.fileSize}
                              </span>
                            </div>
                            <button 
                              onClick={() => setAttachment(null)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition shadow cursor-pointer border border-rose-400"
                              title="Delete source attachment"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Message details stats / Regenerations trigger controls */}
                  <div className="flex items-center gap-3 ml-auto">
                    {currentThread && currentThread.messages.length > 1 && (
                      <button
                        onClick={handleRegenerateLastResponse}
                        disabled={isLoading}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black tracking-wide cursor-pointer uppercase transition-all disabled:opacity-40 disabled:pointer-events-none hover:scale-[1.01] ${isDarkMode ? "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300" : "bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-600"}`}
                        title="Regenerate last answer"
                        id="regenerate-last-answer-trigger"
                      >
                        <RefreshCw className="w-3 h-3 text-cyan-400" />
                        <span>Regenerate Response</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary messaging bar layout */}
                <div className="flex gap-2 items-end relative">
                  
                  {/* Embedded hidden file triggers */}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <input 
                    type="file"
                    ref={pdfInputRef}
                    onChange={handlePDFFileChange}
                    accept="application/pdf"
                    className="hidden"
                  />

                  {/* Add Image attachments clickable triggers button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl border shrink-0 cursor-pointer transition duration-200 ${isDarkMode ? "bg-slate-800/30 border-slate-800/80 hover:border-slate-700/50 text-slate-400 hover:text-cyan-400" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-indigo-600"}`}
                    title="Upload Image details"
                    id="image-picker-trigger"
                  >
                    <ImageIcon className="w-4.5 h-4.5" />
                  </button>

                  {/* Add PDF summary attachments clickable triggers button */}
                  <button
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={isLoading}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl border shrink-0 cursor-pointer transition duration-200 ${isDarkMode ? "bg-slate-800/30 border-slate-800/80 hover:border-slate-700/50 text-slate-400 hover:text-rose-400" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-indigo-600"}`}
                    title="Load PDF Document for Summation"
                    id="pdf-picker-trigger"
                  >
                    <FileText className="w-4.5 h-4.5" />
                  </button>

                  {/* STT speech dictation microphone trigger toggle button */}
                  <button
                    onClick={handleToggleVoiceInput}
                    disabled={isLoading}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl border shrink-0 transition duration-200 relative cursor-pointer ${
                      isListening 
                        ? "bg-rose-500 border-rose-500 text-white animate-pulse" 
                        : (isDarkMode ? "bg-slate-800/30 border-slate-800/80 hover:border-slate-700/50 text-slate-400 hover:text-cyan-400" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-indigo-600")
                    }`}
                    title={isListening ? "Listening... click to capture transcripts" : "Speech-To-Text Voice Input"}
                    id="stt-dictation-mic"
                  >
                    {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
                    {isListening && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                      </span>
                    )}
                  </button>

                  {/* Primary text input */}
                  <div className="flex-1 relative">
                    <textarea
                      ref={messageInputRef}
                      placeholder={isListening ? "Listening to your voice..." : "Ask eVerse AI, analyze images, summarize PDFs..."}
                      value={messagePrompt}
                      onChange={(e) => setMessagePrompt(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={isLoading}
                      rows={1}
                      className={`w-full max-h-32 resize-none rounded-xl pl-4 pr-10 py-3 text-xs md:text-sm outline-none transition duration-200 border scrollbar-none outline-none ${
                        isDarkMode 
                          ? "bg-slate-900/80 border-slate-800/80 text-slate-200 focus:bg-slate-900 focus:border-cyan-500/50" 
                          : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500"
                      }`}
                    />
                    <div className="absolute right-3.5 bottom-3.5 text-slate-500 pointer-events-none text-[10px] hidden sm:block font-mono">
                      Enter
                    </div>
                  </div>

                  {/* Transmission push button */}
                  <button
                    onClick={() => handlePublishMessage()}
                    disabled={(!messagePrompt.trim() && !attachment) || isLoading}
                    className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 h-11 px-5 rounded-xl text-white font-bold text-xs md:text-sm shadow-md shadow-cyan-500/10 transition hover:scale-[1.01] active:scale-[0.99] shrink-0 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
                    id="main-publish-message-trigger"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>

                </div>
              </div>

              {/* Telegram reference community networks link & warning models */}
              <div className="flex flex-col items-center justify-center gap-2 mt-4" id="e-verse-footer-navs">
                <a 
                  href="https://t.me/GetVerse/177601" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] hover:bg-[#229ED9]/20 hover:border-[#229ED9]/30 transition-all text-xs font-semibold tracking-wide shadow cursor-pointer text-[10px]"
                  id="telegram-channel-direct-link"
                >
                  <Send className="w-3 h-3 text-[#229ED9] transform rotate-45 -translate-y-0.5" />
                  <span>Join Official $VERSE Community Telegram</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
                
                <p className="text-[9px] text-center text-slate-500 font-mono tracking-wide uppercase select-none font-medium">
                  eVerseChatGPT AI Platforms • Not Financial Advice • Powered by Gemini AI Core
                </p>
              </div>
            </footer>
          </main>
        </div>

        {/* 2. Side overlay menu slide panel drawer for mobile viewports */}
        <AnimatePresence>
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              
              {/* Back backdrop grey mask clickable handler */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
              />

              {/* Sliding sidebar box */}
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                className={`relative w-80 max-w-[85vw] h-full flex flex-col border-r shadow-2xl z-20 ${isDarkMode ? "bg-[#080d19] border-slate-800" : "bg-white border-slate-200"}`}
                id="mobile-drawer-inner-sidebar"
              >
                
                {/* Header info close btn controls */}
                <div className="p-4 flex items-center justify-between border-b dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <VerseLogo className="w-7 h-7" glow={isDarkMode} />
                    <span className="font-extrabold text-sm tracking-tight text-white dark:text-slate-100 dark:bg-white/5 bg-[#050816]/5 border dark:border-white/5 px-2 py-0.5 rounded-lg text-slate-200">
                      eVerse AI Pipelines
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-lg border dark:border-slate-800 text-slate-400 hover:text-slate-100 cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Spawn thread button */}
                <div className="p-4 border-b dark:border-slate-800">
                  <button 
                    onClick={handleNewThreadSpawn}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Chat Stream</span>
                  </button>
                </div>

                {/* Mobile Threads scrolling menu lists */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                  <h4 className="text-[9px] font-bold tracking-widest uppercase text-slate-500 px-3 mb-2">
                    ACTIVE PIPELINES
                  </h4>
                  {threads.map((t) => {
                    const isActive = t.id === activeThreadId;
                    const threadAssist = ASSISTANTS.find(a => a.id === t.assistantId) || ASSISTANTS[0];
                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setActiveThreadId(t.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`group flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition duration-150 ${
                          isActive 
                            ? (isDarkMode ? "bg-slate-800/80 border border-slate-700/60 font-semibold" : "bg-indigo-50 border border-indigo-100 font-semibold text-indigo-900")
                            : (isDarkMode ? "hover:bg-slate-800/30 border border-transparent" : "hover:bg-slate-100/50 border border-transparent")
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <threadAssist.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                          <div className="truncate">
                            <p className="text-xs truncate text-slate-100 dark:text-slate-200">
                              {t.name}
                            </p>
                            <span className="text-[8px] text-slate-500 block leading-none font-mono tracking-wide capitalize">
                              {threadAssist.name}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          <button 
                            onClick={(e) => handleRenameThreadPrompt(t.id, e)} 
                            className="p-1 rounded text-slate-400 hover:text-cyan-400"
                            id={`rename-mobile-${t.id}`}
                          >
                            <PenLine className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteThread(t.id, e)} 
                            className="p-1 rounded text-slate-400 hover:text-rose-400"
                            id={`delete-mobile-${t.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Assistants selectors row */}
                <div className="p-4 border-t dark:border-slate-800 bg-slate-900/30 dark:bg-slate-900/50">
                  <h4 className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mb-2 px-1">
                    AI COGNITIVE PLUGINS
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5" id="mobile-assistants-panel-row">
                    {ASSISTANTS.map((as) => (
                      <button
                        key={as.id}
                        onClick={() => {
                          setActiveAssistantId(as.id);
                          // Sync thread selection assistant
                          const t = getActiveThread();
                          if (t && t.messages.length === 1) {
                            const updated = threads.map(th => th.id === t.id ? { ...th, assistantId: as.id } : th);
                            saveThreads(updated);
                          }
                          setIsSidebarOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border cursor-pointer transition duration-150 ${
                          activeAssistantId === as.id 
                            ? (isDarkMode ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" : "bg-indigo-50 border-indigo-400/40 text-indigo-700")
                            : (isDarkMode ? "bg-slate-800/10 border-slate-800/45 text-slate-400" : "bg-white border-slate-200 text-slate-550")
                        }`}
                        id={`mob-assist-btn-${as.id}`}
                      >
                        <as.icon className="w-3.5 h-3.5 mb-1" />
                        <span className="text-[9px] font-bold truncate max-w-full">
                          {as.id === "general" ? "General" : as.id === "seo" ? "SEO" : as.id === "code" ? "Coding" : as.id === "study" ? "Study" : as.id === "crypto" ? "Crypto" : "Verse"}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Profile section block item */}
                  <div 
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="mt-4 flex items-center gap-3 p-2.5 rounded-xl border dark:border-slate-800 hover:bg-slate-850 cursor-pointer"
                    id="mobile-drawer-profile-card"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${profile.avatarColor} text-white font-mono font-bold flex items-center justify-center text-xs shadow`}>
                      {profile.name.charAt(0)}
                    </div>
                    <div className="truncate leading-tight flex-1">
                      <h5 className="text-xs font-bold text-slate-100 truncate">{profile.name}</h5>
                      <span className="text-[9px] text-slate-500 font-medium truncate">{profile.role}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 3. User Profile editing modal popup details component */}
        <AnimatePresence>
          {isProfileModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              
              {/* Back gray mask dark overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
              />

              {/* Center Modal Dialogue */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl border relative overflow-hidden z-20 ${isDarkMode ? "bg-[#0b101c] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
                id="user-profile-modal-dialog"
              >
                {/* Glowing neon shapes inside profile modal */}
                {isDarkMode && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-[50px] rounded-full pointer-events-none" />
                )}

                {/* Close control button */}
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-800/10 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-350 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                {/* Profile Header titles */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-white dark:text-slate-100">
                      User Profile Configuration
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Setup your avatar identity details for the AI engines.
                    </p>
                  </div>
                </div>

                {/* Submitting profiles form values elements */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const name = fd.get("name")?.toString() || profile.name;
                    const role = fd.get("role")?.toString() || profile.role;
                    const avatarColor = fd.get("color")?.toString() || profile.avatarColor;
                    updateProfileDetails({ name, role, avatarColor });
                  }}
                  className="space-y-4 text-xs"
                >
                  {/* Name field inputs */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">Your Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      defaultValue={profile.name}
                      maxLength={25}
                      required
                      className={`w-full p-2.5 rounded-xl border outline-none font-bold ${
                        isDarkMode 
                          ? "bg-slate-900/80 border-slate-800 text-slate-100 focus:border-cyan-500/50" 
                          : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-400"
                      }`}
                    />
                  </div>

                  {/* Role field inputs */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">User Role / Bio</label>
                    <input 
                      type="text" 
                      name="role" 
                      defaultValue={profile.role}
                      maxLength={30}
                      required
                      className={`w-full p-2.5 rounded-xl border outline-none font-bold ${
                        isDarkMode 
                          ? "bg-slate-900/80 border-slate-800 text-slate-100 focus:border-cyan-500/50" 
                          : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-400"
                      }`}
                    />
                  </div>

                  {/* Dynamic Color Avatar swatch gradients selections */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">Avatar Swatch Color</label>
                    <input 
                      type="hidden" 
                      id="selected-avatar-color" 
                      name="color" 
                      defaultValue={profile.avatarColor}
                    />
                    
                    <div className="grid grid-cols-4 gap-2" id="avatar-color-picker-grid">
                      {[
                        { val: "from-cyan-500 to-indigo-600", label: "Midnight Cyan" },
                        { val: "from-purple-600 to-pink-500", label: "Nebula Purple" },
                        { val: "from-emerald-500 to-teal-600", label: "Defi Mint" },
                        { val: "from-amber-500 to-rose-500", label: "Sunset Verse" }
                      ].map((sw) => {
                        const isSelectedColor = sw.val === profile.avatarColor;
                        return (
                          <button
                            key={sw.val}
                            type="button"
                            onClick={() => {
                              const hiddenInput = document.getElementById("selected-avatar-color") as HTMLInputElement;
                              if (hiddenInput) hiddenInput.value = sw.val;
                              // re-render trick on avatar modal values
                              setProfile(prev => ({ ...prev, avatarColor: sw.val }));
                            }}
                            className={`p-3 rounded-xl border text-[10px] bg-gradient-to-br ${sw.val} text-white font-bold h-12 flex items-center justify-center text-center transition cursor-pointer hover:scale-103 ${
                              isSelectedColor ? "border-white ring-2 ring-cyan-400" : "border-transparent"
                            }`}
                            title={sw.label}
                          >
                            🎨 {sw.label.split(" ")[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Form button control row */}
                  <div className="pt-4 flex items-center gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsProfileModalOpen(false)}
                      className={`px-4 py-2 rounded-xl border font-bold transition cursor-pointer ${
                        isDarkMode 
                          ? "bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-250" 
                          : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600 font-medium"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-cyan-500 to-indigo-650 hover:from-cyan-600 hover:to-indigo-700 transition shadow cursor-pointer shadow-cyan-500/10"
                    >
                      Save Configuration
                    </button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
