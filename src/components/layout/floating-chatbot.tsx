"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaw, FaTimes, FaPaperPlane, FaSpinner, FaBriefcaseMedical } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "react-toastify";

type ChatMessage = {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
};

const REGIONAL_QUICK_ACTIONS: Record<string, { label: string; value: string }[]> = {
  English: [
    { label: "🩸 Bleeding", value: "bleeding" },
    { label: "🦴 Broken Bone", value: "fracture" },
    { label: "☀️ Heat Stroke", value: "heatstroke" },
    { label: "💨 Choking", value: "choking" },
  ],
  Spanish: [
    { label: "🩸 Sangrado", value: "bleeding" },
    { label: "🦴 Hueso Roto", value: "fracture" },
    { label: "☀️ Golpe de Calor", value: "heatstroke" },
    { label: "💨 Asfixia", value: "choking" },
  ],
  French: [
    { label: "🩸 Saignement", value: "bleeding" },
    { label: "🦴 Os Cassé", value: "fracture" },
    { label: "☀️ Coup de Chaleur", value: "heatstroke" },
    { label: "💨 Étouffement", value: "choking" },
  ],
  German: [
    { label: "🩸 Blutung", value: "bleeding" },
    { label: "🦴 Knochenbruch", value: "fracture" },
    { label: "☀️ Hitzschlag", value: "heatstroke" },
    { label: "💨 Ersticken", value: "choking" },
  ],
  Hindi: [
    { label: "🩸 रक्तस्राव", value: "bleeding" },
    { label: "🦴 टूटी हड्डी", value: "fracture" },
    { label: "☀️ लू लगना", value: "heatstroke" },
    { label: "💨 दम घुटना", value: "choking" },
  ],
  Bengali: [
    { label: "🩸 রক্তপাত", value: "bleeding" },
    { label: "🦴 ভাঙা হাড়", value: "fracture" },
    { label: "☀️ হিট স্ট্রোক", value: "heatstroke" },
    { label: "💨 শ্বাসরোধ", value: "choking" },
  ]
};

const REGIONAL_WELCOME_MESSAGES: Record<string, string> = {
  English: "🐾 **Hello! I am your Rescue First-Aid Bot.**\n\nIf you have found a stray or sick animal, type its symptoms or select an issue below to get immediate first-aid instructions.",
  Spanish: "🐾 **¡Hola! Soy su Asistente de Primeros Auxilios de Rescate.**\n\nSi ha encontrado un animal callejero o enfermo, escriba sus síntomas o elija un problema a continuación para recibir instrucciones de primeros auxilios inmediatas.",
  French: "🐾 **Bonjour ! Je suis votre Assistant de Premiers Secours pour Animaux.**\n\nSi vous avez trouvé un animal errant ou malade, écrivez ses symptômes ou choisissez un problème ci-dessous pour recevoir des instructions de premiers secours immédiates.",
  German: "🐾 **Hallo! Ich bin Ihr Tierrettungs-Erste-Hilfe-Assistent.**\n\nWenn Sie ein streunendes oder krankes Tier gefunden haben, beschreiben Sie die Symptome oder wählen Sie unten ein Problem aus, um Erste-Hilfe-Anweisungen zu erhalten.",
  Hindi: "🐾 **नमस्ते! मैं आपका पशु बचाव प्राथमिक चिकित्सा सहायक हूँ।**\n\nयदि आपको कोई आवारा या बीमार जानवर मिला है, तो उसके लक्षण लिखें या तत्काल प्राथमिक चिकित्सा निर्देश प्राप्त करने के लिए नीचे दिए गए विकल्प चुनें।",
  Bengali: "🐾 **হ্যালো! আমি আপনার পশু উদ্ধার প্রাথমিক চিকিৎসা সহকারী।**\n\nআপনি যদি কোনো পথভ্রষ্ট বা অসুস্থ পশু খুঁজে পান, তবে তার লক্ষণগুলি লিখুন বা তাত্ক্ষণিক প্রাথমিক চিকিৎসার নির্দেশাবলী পেতে নীচের একটি বিকল্প নির্বাচন করুন।"
};

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "🐾 **Hello! I am your Rescue First-Aid Bot.**\n\nIf you have found a stray or sick animal, type its symptoms or select an issue below to get immediate first-aid instructions.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("English");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        message: text.trim(),
        history: messages.slice(-5), // Send last 5 messages for simple context
        language: lang
      });

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: response.data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to the rescue assistant.");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: "⚠️ **Connection Error:** I was unable to connect to the AI brain. Please stabilize the animal and head to a veterinary clinic immediately. Consult the **Map** tab for directions.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (value: string) => {
    handleSend(value);
  };

  // DOM element references
  const chatCardRef = useRef<HTMLDivElement>(null);
  const fabBtnRef = useRef<HTMLButtonElement>(null);
  const fabContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Drag coordinates references to bypass React state re-rendering lag
  const chatDragPos = useRef({ x: 0, y: 0 });
  const isDraggingChat = useRef(false);
  const chatStartPos = useRef({ x: 0, y: 0 });

  const fabDragPos = useRef({ x: 0, y: 0 });
  const isDraggingFabRef = useRef(false);
  const fabStartPos = useRef({ x: 0, y: 0 });
  const dragDistance = useRef(0);

  // Slider Desktop mouse-drag-to-scroll references
  const isSliderDown = useRef(false);
  const sliderStartX = useRef(0);
  const sliderScrollLeft = useRef(0);

  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isSliderDown.current = true;
    if (!sliderRef.current) return;
    sliderStartX.current = e.pageX - sliderRef.current.offsetLeft;
    sliderScrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleSliderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSliderDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - sliderStartX.current) * 1.5; // Scroll speed modifier
    sliderRef.current.scrollLeft = sliderScrollLeft.current - walk;
  };

  const handleSliderMouseUpOrLeave = () => {
    isSliderDown.current = false;
  };

  // FAB Drag Event Handlers
  const handleFabPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingFabRef.current = true;
    dragDistance.current = 0;
    fabStartPos.current = {
      x: e.clientX - fabDragPos.current.x,
      y: e.clientY - fabDragPos.current.y
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleFabPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingFabRef.current || !fabContainerRef.current) return;
    const newX = e.clientX - fabStartPos.current.x;
    const newY = e.clientY - fabStartPos.current.y;

    const movementX = Math.abs(newX - fabDragPos.current.x);
    const movementY = Math.abs(newY - fabDragPos.current.y);
    dragDistance.current += movementX + movementY;

    // Clamp coordinates strictly within the mobile layout frame boundaries
    const containerWidth = Math.min(448, typeof window !== "undefined" ? window.innerWidth : 448);
    const containerHeight = typeof window !== "undefined" ? window.innerHeight : 800;

    const minX = -(containerWidth - 72);
    const maxX = 8;
    const minY = -(containerHeight - 160);
    const maxY = 20;

    const clampedX = Math.max(minX, Math.min(maxX, newX));
    const clampedY = Math.max(minY, Math.min(maxY, newY));

    fabDragPos.current = { x: clampedX, y: clampedY };
    fabContainerRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
  };

  const handleFabPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingFabRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Treat as click only if movement was minimal
    if (dragDistance.current < 6) {
      setIsOpen(!isOpen);
    }
  };

  // Chat Card Drag Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent drag triggers when clicking buttons, inputs, form components, or the messages viewport
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('input') ||
      (e.target as HTMLElement).closest('form') ||
      (e.target as HTMLElement).closest('.overflow-y-auto')
    ) return;

    isDraggingChat.current = true;
    chatStartPos.current = {
      x: e.clientX - chatDragPos.current.x,
      y: e.clientY - chatDragPos.current.y
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingChat.current || !chatCardRef.current) return;
    const newX = e.clientX - chatStartPos.current.x;
    const newY = e.clientY - chatStartPos.current.y;

    // Clamp coordinates strictly within the mobile layout frame boundaries
    const containerWidth = Math.min(448, typeof window !== "undefined" ? window.innerWidth : 448);
    const containerHeight = typeof window !== "undefined" ? window.innerHeight : 800;

    const cardWidth = Math.min(360, containerWidth - 16);
    const minX = -(containerWidth - cardWidth);
    const maxX = 0;
    const minY = -(containerHeight - 480);
    const maxY = 0;

    const clampedX = Math.max(minX, Math.min(maxX, newX));
    const clampedY = Math.max(minY, Math.min(maxY, newY));

    chatDragPos.current = { x: clampedX, y: clampedY };
    chatCardRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingChat.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Persistent coordinate and language-welcome sync hook on mount/open state changes
  useEffect(() => {
    const savedLang = localStorage.getItem("app-language") || "English";
    setLang(savedLang);
    
    // Dynamically translate the default welcome message if user hasn't started chatting yet
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [
          {
            ...prev[0],
            text: REGIONAL_WELCOME_MESSAGES[savedLang] || REGIONAL_WELCOME_MESSAGES.English
          }
        ];
      }
      return prev;
    });

    if (isOpen && chatCardRef.current) {
      chatCardRef.current.style.transform = `translate(${chatDragPos.current.x}px, ${chatDragPos.current.y}px)`;
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-20 z-50 pointer-events-none w-full max-w-md left-1/2 -translate-x-1/2 px-4">
      {/* Chat Window Panel */}
      {isOpen && (
        <Card
          ref={chatCardRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ transform: `translate(${chatDragPos.current.x}px, ${chatDragPos.current.y}px)` }}
          className="absolute bottom-20 right-4 w-[calc(100%-32px)] sm:w-[360px] h-[420px] border border-border/30 shadow-xl rounded-xl flex flex-col overflow-hidden bg-black/30 backdrop-blur-lg pointer-events-auto animate-in slide-in-from-bottom-5 duration-300 select-none cursor-grab active:cursor-grabbing touch-none z-50"
        >
          {/* Header */}
          <div className="bg-transparent border-b border-border/15 p-2.5 text-foreground flex justify-between items-center select-none">
            <div className="flex items-center gap-3">
              <div className="bg-transparent shrink-0">
                {/* Custom mini AI Rescue Bot SVG - Paw Print Style */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-9 h-9 select-none" id="rescue-bot-header">
                  {/* Base Outer Circle */}
                  <circle cx="64" cy="64" r="58" fill="#fcfbf7" stroke="#654a3e" strokeWidth="5" />
                  
                  {/* Arm & Paw Base Outline (beige-tan) */}
                  <path d="M22,95 Q45,65 40,40 Q40,30 48,28 Q56,26 64,30 Q72,34 78,40 Q84,46 90,52 Q96,58 92,72 Q88,86 76,123" fill="#fae8cf" stroke="#654a3e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Left Spot on Arm */}
                  <path d="M26,80 Q32,80 34,70 Q36,60 28,62 Z" fill="#f59ba7" opacity="0.85" />
                  
                  {/* Right Spot on Arm */}
                  <path d="M68,110 Q66,95 72,92 Q78,90 74,105 Z" fill="#f59ba7" opacity="0.85" />
                  
                  {/* Main Pad (kidney bean shape) */}
                  <path d="M48,68 Q64,52 80,68 Q85,82 64,84 Q43,82 48,68 Z" fill="#f09fa9" stroke="#664b3f" strokeWidth="4" />
                  
                  {/* Toes (four pink pads) */}
                  <ellipse cx="40" cy="40" rx="7" ry="9" fill="#f09fa9" stroke="#664b3f" strokeWidth="4" transform="rotate(-15 40 40)" />
                  <ellipse cx="56" cy="33" rx="7" ry="10" fill="#f09fa9" stroke="#664b3f" strokeWidth="4" transform="rotate(-5 56 33)" />
                  <ellipse cx="74" cy="36" rx="7" ry="10" fill="#f09fa9" stroke="#664b3f" strokeWidth="4" transform="rotate(10 74 36)" />
                  <ellipse cx="88" cy="48" rx="6.5" ry="9" fill="#f09fa9" stroke="#664b3f" strokeWidth="4" transform="rotate(25 88 48)" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base leading-none flex items-center gap-1.5 text-foreground">
                  Rescue Assistant
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse inline-block" />
                </h3>
                <span className="text-sm text-muted-foreground font-medium">First-Aid Veterinary Guide</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted/40 active:scale-95 transition-all"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto pt-0 px-4 pb-0 flex flex-col gap-3 scrollbar-none">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm border leading-relaxed animate-in fade-in zoom-in-95 duration-200",
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground self-end rounded-tr-none border-primary/20"
                    : "bg-muted/40 text-foreground self-start rounded-tl-none border-border"
                )}
              >
                {/* Simple Markdown Bold/List formatting logic */}
                <div className="whitespace-pre-line space-y-1">
                  {msg.text.split("\n").map((line, idx) => {
                    // check for markdown bullet lists
                    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
                      return (
                        <div key={idx} className="flex gap-1.5 pl-1.5">
                          <span className="text-primary font-bold">•</span>
                          <span>{line.replace(/^[\*\-]\s+/, "")}</span>
                        </div>
                      );
                    }
                    // check for bold texts
                    if (line.includes("**")) {
                      const parts = line.split("**");
                      return (
                        <div key={idx}>
                          {parts.map((part, pIdx) =>
                             pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold text-foreground">{part}</strong> : part
                          )}
                        </div>
                      );
                    }
                    return <div key={idx}>{line}</div>;
                  })}
                </div>
                <span className={cn(
                  "text-[8px] mt-1 self-end opacity-60",
                  msg.sender === "user" ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {loading && (
              <div className="bg-muted/40 text-foreground self-start rounded-2xl rounded-tl-none px-4 py-3 text-xs border max-w-[80%] flex items-center gap-2">
                <FaSpinner className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Typing guides...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Buttons Slider */}
          <div
            ref={sliderRef}
            onMouseDown={handleSliderMouseDown}
            onMouseMove={handleSliderMouseMove}
            onMouseUp={handleSliderMouseUpOrLeave}
            onMouseLeave={handleSliderMouseUpOrLeave}
            className="flex flex-row items-center gap-2 overflow-x-auto -mb-3 px-4 scrollbar-none w-full select-none cursor-grab active:cursor-grabbing border-0 bg-transparent"
          >
            {(REGIONAL_QUICK_ACTIONS[lang] || REGIONAL_QUICK_ACTIONS.English).map((action) => (
              <button
                key={action.value}
                type="button"
                onClick={() => handleQuickAction(action.label)}
                disabled={loading}
                className="text-[11px] bg-card border border-border px-3.5 py-1.5 rounded-full hover:border-primary/50 text-foreground hover:text-primary transition-colors cursor-pointer active:scale-95 disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="px-3 -pb-10 pt-1 bg-transparent flex gap-2 border-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a rescue/first-aid question..."
              disabled={loading}
              className="flex-1 border bg-background/50 backdrop-blur-sm rounded-full px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 border-border"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !inputText.trim()}
              className="rounded-full shrink-0 h-9 w-9 bg-primary text-primary-foreground"
            >
              <FaPaperPlane className="w-3.5 h-3.5" />
            </Button>
          </form>

        </Card>
      )}

      {/* Floating Trigger FAB Container */}
      <div 
        ref={fabContainerRef}
        onPointerDown={handleFabPointerDown}
        onPointerMove={handleFabPointerMove}
        onPointerUp={handleFabPointerUp}
        style={{ transform: `translate(${fabDragPos.current.x}px, ${fabDragPos.current.y}px)` }}
        className="absolute bottom-0 right-4 pointer-events-auto select-none group cursor-grab active:cursor-grabbing touch-none"
      >
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full mb-3.5 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full shadow-lg whitespace-nowrap z-101 pointer-events-none select-none animate-bounce">
            Chat now
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-primary w-0 h-0" />
          </div>
        )}
        <button
          type="button"
          className="w-16 h-16 flex items-center justify-center bg-transparent border-none shadow-none touch-none focus:outline-none focus:ring-0 pointer-events-none"
          title="AI Emergency Helper"
        >
          {isOpen ? (
            <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border border-white/20 active:scale-95 transition-all pointer-events-auto">
              <FaTimes className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-full h-full pointer-events-auto">
              {/* Custom Paw Print Cat SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-14 h-14 select-none filter drop-shadow-md" id="rescue-bot-fab">
                {/* Base Outer Circle */}
                <circle cx="64" cy="64" r="58" fill="#fcfbf7" stroke="#654a3e" strokeWidth="5" />
                
                {/* Arm & Paw Base Outline (beige-tan) */}
                <path d="M22,95 Q45,65 40,40 Q40,30 48,28 Q56,26 64,30 Q72,34 78,40 Q84,46 90,52 Q96,58 92,72 Q88,86 76,123" fill="#fae8cf" stroke="#654a3e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Left Spot on Arm */}
                <path d="M26,80 Q32,80 34,70 Q36,60 28,62 Z" fill="#f59ba7" opacity="0.85" />
                
                {/* Right Spot on Arm */}
                <path d="M68,110 Q66,95 72,92 Q78,90 74,105 Z" fill="#f59ba7" opacity="0.85" />
                
                {/* Main Pad (kidney bean shape) */}
                <path d="M48,68 Q64,52 80,68 Q85,82 64,84 Q43,82 48,68 Z" fill="#f09fa9" stroke="#664b3f" strokeWidth="4" />
                
                {/* Toes (four pink pads) */}
                <ellipse cx="40" cy="40" rx="7" ry="9" fill="#f09fa9" stroke="#664b3f" strokeWidth="4" transform="rotate(-15 40 40)" />
                <ellipse cx="56" cy="33" rx="7" ry="10" fill="#f09fa9" stroke="#664b3f" strokeWidth="4" transform="rotate(-5 56 33)" />
                <ellipse cx="74" cy="36" rx="7" ry="10" fill="#f09fa9" stroke="#664b3f" strokeWidth="4" transform="rotate(10 74 36)" />
                <ellipse cx="88" cy="48" rx="6.5" ry="9" fill="#f09fa9" stroke="#664b3f" strokeWidth="4" transform="rotate(25 88 48)" />
              </svg>
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-400 border-2 border-white dark:border-slate-800"></span>
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
