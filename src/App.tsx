/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Loader2, Link2, ExternalLink, Image as ImageIcon, X } from "lucide-react";

// Types
type Role = "ai" | "user";

interface Attachment {
  base64: string;
  mimeType: string;
}

interface Message {
  role: Role;
  text: string;
  attachment?: Attachment;
}

// Verse logo component with gradient background and customized V path
export function VerseLogo({ className = "w-6 h-6", glow = false }: { className?: string; glow?: boolean }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${glow ? "shadow-lg shadow-cyan-500/20" : ""}`}>
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
        {/* Rounded-edge V shape */}
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

export default function App() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [chat, setChat] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello 👋 I am Zayed AI. I am a smart assistant here to chat freely and help you with almost anything — from general conversations, learning, ideas, and tech, to Crypto, Web3, blockchain, and NFTs. Ask me anything!",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result?.toString().split(",")[1];
      if (base64) {
        setAttachment({
          base64,
          mimeType: file.type,
        });
      }
    };
    reader.readAsDataURL(file);
    // Reset input value to allow the same file to be picked again
    e.target.value = "";
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const sendMessage = async () => {
    if ((!message.trim() && !attachment) || isLoading) return;

    const userText = message.trim();
    const currentAttachment = attachment;
    
    const userMessage: Message = { 
      role: "user", 
      text: userText || "Analyzed image",
      attachment: currentAttachment || undefined
    };
    
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setAttachment(null);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let contents: any;

      if (currentAttachment) {
        contents = {
          parts: [
            {
              inlineData: {
                data: currentAttachment.base64,
                mimeType: currentAttachment.mimeType,
              },
            },
            { text: userText || "Analyze this image in the context of Web3/Crypto." },
          ],
        };
      } else {
        contents = userText;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction: `You are Zayed AI, a sophisticated, highly intelligent assistant built to chat freely with everyone and give fast, helpful, and smart responses. 
          You can answer almost anything people ask: from simple "Hi", daily conversations, and creative suggestions to specialized topics like technology, learning, ideas, Crypto, Web3, Blockchain, NFTs, and more.
          You can analyze images of market charts, smart contracts, or Web3 interfaces. Provide accurate, accessible yet smart information. Be friendly, professional, direct, and helpful.
          If a user asks for financial advice, clarify that you provide information for educational purposes and are not a financial advisor.

          VERSE ECOSYSTEM INFO:
          - Verse is the native token of the Verse ecosystem, built to power the community, Web3 innovation, and future decentralized utilities.
          - It plays an important role inside the ecosystem by supporting community engagement, rewards & utilities, future Web3 integrations, and ecosystem growth and development.
          - Verse aims to create a stronger connection between technology, community, and the future of decentralized innovation.

          SPECIFIC VERB COMMANDS:
          - If a user asks about earning from Verse or Verse earnings: Provide the registration link http://hub.vgdh.io and ask them to register a wallet.
          - If a user asks about the Verse community or joining the Verse ecosystem: Provide the community link https://t.me/GetVerse/177601 and ask them to join. 
          - When directing users to the community, instruct them to mention @Zayed999R and say: 'im new here reffar by : @Zayed999R'`,
        },
      });

      const aiReply = response.text || "I'm sorry, I couldn't process that request.";

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: aiReply,
        },
      ]);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      let errorMessage = "I encountered an error connecting to my neural network. Please try again later.";
      
      if (error?.message?.includes("PERMISSION_DENIED") || error?.status === 403) {
        errorMessage = "API Permission Denied. Please ensure your GEMINI_API_KEY is correctly set in the 'Settings > Secrets' panel of AI Studio.";
      } else if (error?.message?.includes("API_KEY_INVALID")) {
        errorMessage = "Invalid API Key. Please check your GEMINI_API_KEY in the 'Settings > Secrets' panel.";
      }

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-200 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#050816]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <VerseLogo className="w-10 h-10" glow={true} />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Zayed <span className="text-cyan-400">AI</span>
              <span className="text-[10px] uppercase tracking-widest bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-slate-400 font-medium">BETA</span>
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-cyan-400 transition" id="nav-item-market">Market</a>
          <a href="#" className="hover:text-cyan-400 transition" id="nav-item-defi">DeFi</a>
          <a href="#" className="hover:text-cyan-400 transition" id="nav-item-nfts">NFTs</a>
          <a 
            href="https://t.me/GetVerse/177601" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] hover:bg-[#229ED9]/20 transition-all font-semibold"
            id="nav-telegram-channel"
          >
            Telegram <Send className="w-3 h-3" />
          </a>
          <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition flex items-center gap-2" id="nav-wallet-button">
             Wallet <ExternalLink className="w-3 h-3" />
          </button>
        </nav>
      </header>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full scrollbar-thin scrollbar-thumb-white/10"
      >
        <AnimatePresence mode="popLayout">
          {chat.map((msg, index) => (
            <motion.div
              key={`${index}-${msg.role}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "user" ? (
                <div className="w-9 h-9 rounded-lg shrink-0 mt-1 flex items-center justify-center border bg-slate-800 border-slate-700">
                  <User className="w-4.5 h-4.5 text-slate-400" />
                </div>
              ) : (
                <VerseLogo className="w-9 h-9" />
              )}
              
              <div
                className={`max-w-[85%] p-4 rounded-2xl shadow-xl ${
                  msg.role === "user"
                    ? "bg-cyan-600 text-white rounded-tr-none shadow-cyan-900/10"
                    : "bg-white/5 backdrop-blur-md border border-white/10 rounded-tl-none text-slate-200"
                }`}
              >
                <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.attachment && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
                      <img 
                        src={`data:${msg.attachment.mimeType};base64,${msg.attachment.base64}`} 
                        alt="User attachment" 
                        className="max-w-full h-auto object-cover max-h-64"
                      />
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-4"
            >
              <VerseLogo className="w-9 h-9" />
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs text-slate-400 font-medium tracking-wide">Processing through blockchain...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Input Area */}
      <footer className="p-4 md:p-6 border-t border-white/5 bg-[#050816]/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {attachment && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative inline-block"
              >
                <div className="w-24 h-24 rounded-xl border border-cyan-500/30 overflow-hidden shadow-lg shadow-cyan-500/10">
                  <img 
                    src={`data:${attachment.mimeType};base64,${attachment.base64}`} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={removeAttachment}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 relative">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-all disabled:opacity-50"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search Web3, analyze tokens, or ask questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all disabled:opacity-50"
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={(!message.trim() && !attachment) || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 px-6 h-12 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 group"
            >
              <span className="hidden sm:inline">Send</span>
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-2 mt-4" id="footer-links-container">
          <a 
            href="https://t.me/GetVerse/177601" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] hover:bg-[#229ED9]/20 hover:border-[#229ED9]/30 transition-all text-xs font-semibold tracking-wide shadow-lg shadow-[#229ED9]/5 cursor-pointer"
            id="telegram-channel-link"
          >
            <Send className="w-3.5 h-3.5 text-[#229ED9] transform rotate-45 -translate-y-0.5" />
            <span>Join Verse Telegram Channel</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          
          <p className="text-[10px] text-center text-slate-500 tracking-wide uppercase font-medium" id="footer-disclaimer-text">
            Powered by Gemini • Zayedd AI does not provide financial advice
          </p>
        </div>
      </footer>
    </div>
  );
}

