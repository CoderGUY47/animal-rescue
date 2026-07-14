"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaCompass, FaArrowRight, FaPaw } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function OnboardingOverlay() {
  const [completed, setCompleted] = useState<boolean>(true); // default to true to avoid server-side flash
  const [mounted, setMounted] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  
  // Slide 1 Swipe state
  const [swipeX, setSwipeX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);

  // Slide 3 Loading progress
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

  // Slide 3 Loading process
  useEffect(() => {
    if (step === 3) {
      const duration = 2500; // 2.5 seconds minimum
      const intervalTime = 30;
      const stepValue = 100 / (duration / intervalTime);
      
      const timer = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              localStorage.setItem("onboarding_completed", "true");
              setCompleted(true);
            }, 600);
            return 100;
          }
          return prev + stepValue;
        });
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [step]);

  if (!mounted || completed) return null;

  // Swipe Action Handler
  const handleStart = (clientX: number) => {
    setIsSwiping(true);
    startX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isSwiping || !trackRef.current) return;
    const trackWidth = trackRef.current.clientWidth;
    const buttonWidth = 44; // White handle button width
    const maxSwipe = trackWidth - buttonWidth - 8; // 4px padding on both sides
    const currentX = clientX - startX.current;
    
    if (currentX < 0) {
      setSwipeX(0);
    } else if (currentX >= maxSwipe) {
      setSwipeX(maxSwipe);
      // Completed Swipe -> directly to Step 3 Loading
      setIsSwiping(false);
      setStep(3);
    } else {
      setSwipeX(currentX);
    }
  };

  const handleEnd = () => {
    setIsSwiping(false);
    if (trackRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const buttonWidth = 44;
      const maxSwipe = trackWidth - buttonWidth - 8;
      if (swipeX < maxSwipe) {
        setSwipeX(0); // Reset snap back to start if it did not reach the absolute end
      } else {
        setStep(3);
      }
    }
  };

  return (
    <div className="absolute inset-0 min-h-screen z-100 flex flex-col justify-between overflow-hidden bg-[#111224] text-white select-none">
      
      {/* Decorative Brand Glow Background Spots */}
      {/* Pink (#ff91c4) and Orange (#f07b31) brand mesh blurs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#ff91c4]/15 rounded-full filter blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#f07b31]/15 rounded-full filter blur-3xl animate-pulse pointer-events-none [animation-delay:2s]" />

      {/* STEP 1: Welcome Splash */}
      {step === 1 && (
        <div className="relative flex-1 flex flex-col justify-between p-6">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/onboarding_bg_1.png"
              alt="Welcome Background"
              fill
              className="object-cover opacity-35 mix-blend-lighten"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111224] via-[#111224]/60 to-[#111224]/85" />
          </div>

          {/* Top Info & Brand Logo */}
          <div className="relative z-10 pt-16 flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in-95 duration-1000">
            <Image
              src="/logo.svg"
              alt="Rescue Connect Logo"
              width={128}
              height={128}
              className="w-32 h-32 object-contain drop-shadow-[0_8px_32px_rgba(240,123,49,0.3)] animate-pulse"
            />
          </div>

          {/* Bottom Heading & Swipe Slider */}
          <div className="relative z-10 pb-12 flex flex-col gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Save Stray Animals <br />
                <span className="bg-gradient-to-r from-[#f07b31] via-[#ffb555] to-[#ff91c4] bg-clip-text text-transparent shadow-sm">
                  with Love & Care
                </span>
              </h1>
              <p className="text-xs text-slate-300/90 max-w-xs leading-relaxed">
                Instantly report emergencies, map nearby animal shelters, and stay connected to rescue volunteers on the ground.
              </p>
            </div>

            {/* Premium Swipe Track */}
            <div 
              ref={trackRef}
              className="h-14 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-full p-1 flex items-center justify-between relative select-none overflow-hidden touch-none shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
              onMouseDown={(e) => handleStart(e.clientX)}
              onMouseMove={(e) => {
                if (e.buttons === 1) handleMove(e.clientX);
              }}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
            >
              {/* Swipe Progress Fill matching brand colors */}
              <div 
                className="absolute left-1 top-1 bottom-1 bg-gradient-to-r from-[#f07b31]/30 to-[#ff91c4]/30 rounded-full transition-all pointer-events-none"
                style={{ width: `${swipeX + 22}px` }}
              />

              {/* Glowing Swipe Handle with Brand Colors */}
              <div 
                style={{ transform: `translateX(${swipeX}px)` }}
                className={cn(
                  "w-11 h-11 rounded-full bg-gradient-to-r from-[#f07b31] to-[#ff91c4] text-white flex items-center justify-center shadow-[0_0_15px_rgba(240,123,49,0.4)] cursor-grab transition-all absolute left-1 z-20 hover:scale-105 active:scale-95 border border-white/20",
                  isSwiping ? "cursor-grabbing shadow-[0_0_20px_rgba(240,123,49,0.6)]" : ""
                )}
              >
                <FaArrowRight className="w-4 h-4 text-white animate-pulse" />
              </div>

              {/* Centered Guide Text */}
              <div className="w-full text-center text-xs font-bold text-slate-300/80 pointer-events-none select-none z-10 tracking-wider">
                Swipe to Get Started
              </div>

              {/* Right Arrow Endcap */}
              <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center absolute right-1 select-none pointer-events-none z-0">
                <FaCompass className="w-4 h-4 text-[#ffb555] animate-spin-slow" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Loading Screen (Helping Animal Illustration) */}
      {step === 3 && (
        <div className="relative flex-1 flex flex-col justify-between p-6 bg-[#111224]">
          {/* Main Top Header */}
          <div className="pt-12 text-center space-y-2">
            <div className="relative w-16 h-16 bg-[#303256]/60 rounded-full flex items-center justify-center border border-white/10 mx-auto shadow-md">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide">Initializing Core Services...</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Setting up secure location beacons and checking in with emergency dispatch volunteers.
            </p>
          </div>

          {/* Central Human Helping Injured Animal Illustration */}
          <div className="my-auto flex flex-col items-center text-center gap-6">
            <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#303256]/20 animate-pulse">
              <Image
                src="/loading_rescue_illustration.png"
                alt="Human helping injured animal"
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111224] via-[#111224]/10 to-transparent" />
            </div>

            <div className="space-y-1.5 px-4">
              <span className="text-[#f07b31] font-bold text-xs uppercase tracking-widest block">Deploying Helpers</span>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                "Together, we can bridge the gap between stray animals in pain and immediate medical volunteers."
              </p>
            </div>
          </div>

          {/* Loading Progress Slider */}
          <div className="pb-12 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-1">
              <span>Establishing connection...</span>
              <span className="text-[#ffb555]">{Math.round(loadingProgress)}%</span>
            </div>
            
            {/* Progress Track */}
            <div className="w-full h-2.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
              <div 
                style={{ width: `${loadingProgress}%` }}
                className="h-full bg-gradient-to-r from-[#f07b31] via-[#ffb555] to-[#ff91c4] rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
