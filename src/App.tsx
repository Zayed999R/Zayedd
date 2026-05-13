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

export default function App() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [chat, setChat] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello 👋 I am Verse AI. Ask me anything about crypto, Web3, or blockchain technologies. You can also upload images of charts or contracts for analysis.",
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
          systemInstruction: "You are Verse AI, a sophisticated crypto and Web3 assistant. You specialize in blockchain technology, DeFi, NFTs, and crypto markets. You can analyze images of market charts, smart contracts, or Web3 interfaces. Provide accurate, technical yet accessible information. Be professional, direct, and helpful. If a user asks for financial advice, clarify that you provide information for educational purposes and are not a financial advisor. \n\nSPECIFIC VERSE INSTRUCTIONS:\n- If a user asks about earning from Verse or Verse earnings: Provide the registration link http://hub.vgdh.io and ask them to register a wallet.\n- If a user asks about the Verse community or joining the Verse ecosystem: Provide the community link https://t.me/GetVerse/177601 and ask them to join. \n- When directing users to the community, instruct them to mention @Zayed999R and say: 'im new here reffar by : @Zayed999R'",
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
    } catch (error) {
      console.error("Gemini API Error:", error);
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I encountered an error connecting to my neural network. Please check your connection or try again later.",
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Verse <span className="text-cyan-400">AI</span>
              <span className="text-[10px] uppercase tracking-widest bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-slate-400 font-medium">BETA</span>
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-cyan-400 transition">Market</a>
          <a href="#" className="hover:text-cyan-400 transition">DeFi</a>
          <a href="#" className="hover:text-cyan-400 transition">NFTs</a>
          <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition flex items-center gap-2">
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
              <div className={`w-8 h-8 rounded-lg shrink-0 mt-1 flex items-center justify-center border ${
                msg.role === "user" 
                  ? "bg-slate-800 border-slate-700" 
                  : "bg-cyan-500/10 border-cyan-500/20"
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4 text-slate-400" /> : <Bot className="w-4 h-4 text-cyan-400" />}
              </div>
              
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
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
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
        <p className="text-[10px] text-center text-slate-500 mt-3 tracking-wide uppercase font-medium">
          Powered by Gemini • Verse AI does not provide financial advice
        </p>
      </footer>
    </div>
  );
}

