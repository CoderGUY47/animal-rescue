"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function OnboardingOverlay() {
  const [completed, setCompleted] = useState<boolean>(true); // default to true to avoid server-side flash
  const [mounted, setMounted] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("onboarding_completed");
    if (!saved) {
      setCompleted(false);
    }
  }, []);

  // Scroll Lock layout effect
  useEffect(() => {
    const parent = document.getElementById("mobile-layout-container");
    if (parent && !completed) {
      parent.style.overflow = "hidden";
      parent.style.maxHeight = "100vh";
    }
    return () => {
      if (parent) {
        parent.style.overflow = "";
        parent.style.maxHeight = "";
      }
    };
  }, [completed]);

  // Splash Loading progress timer
  useEffect(() => {
    if (mounted && !completed) {
      const duration = 3000; // 3 seconds splash screen load time
      const intervalTime = 30;
      const stepValue = 100 / (duration / intervalTime);
      
      const timer = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              localStorage.setItem("onboarding_completed", "true");
              setCompleted(true);
            }, 500);
            return 100;
          }
          return prev + stepValue;
        });
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [mounted, completed]);

  if (!mounted || completed) return null;

  return (
    <div className="absolute inset-0 min-h-screen z-100 flex flex-col justify-between overflow-hidden bg-[#111224] text-white select-none">
      
      {/* Decorative Brand Glow Background Spots */}
      {/* Pink (#ff91c4) and Orange (#f07b31) brand mesh blurs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#ff91c4]/15 rounded-full filter blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#f07b31]/15 rounded-full filter blur-3xl animate-pulse pointer-events-none [animation-delay:2s]" />

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/onboarding_bg_1.png"
          alt="Welcome Background"
          fill
          className="object-cover opacity-25 mix-blend-lighten"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111224] via-[#111224]/50 to-[#111224]/80" />
      </div>

      {/* Main Centered Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8 gap-8 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Brand App Logo */}
        <div className="relative flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Rescue Connect Logo"
            width={144}
            height={144}
            className="w-36 h-36 object-contain drop-shadow-[0_12px_40px_rgba(240,123,49,0.35)] animate-pulse"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Save Stray Animals <br />
            <span className="bg-gradient-to-r from-[#f07b31] via-[#ffb555] to-[#ff91c4] bg-clip-text text-transparent shadow-sm">
              with Love & Care
            </span>
          </h1>
          <p className="text-xs text-slate-300/80 max-w-xs leading-relaxed mx-auto">
            Instantly report emergencies, map nearby animal shelters, and stay connected to rescue volunteers on the ground.
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress Bar */}
      <div className="relative z-10 pb-16 px-8 space-y-3 w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400/80 px-1 tracking-wider uppercase">
          <span>Connecting to dispatch...</span>
          <span className="text-[#ffb555]">{Math.round(loadingProgress)}%</span>
        </div>
        
        {/* Progress Track */}
        <div className="w-full h-2 bg-slate-950 border border-white/5 rounded-full overflow-hidden shadow-inner">
          <div 
            style={{ width: `${loadingProgress}%` }}
            className="h-full bg-gradient-to-r from-[#f07b31] via-[#ffb555] to-[#ff91c4] rounded-full transition-all duration-100"
          />
        </div>
      </div>
      
    </div>
  );
}
