"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaCompass, FaArrowRight, FaMapMarkerAlt, FaAddressBook, FaImage, FaCheckCircle, FaLaptop, FaMobileAlt } from "react-icons/fa";
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

  // Slide 2 Permissions state
  const [permissions, setPermissions] = useState({
    location: false,
    contacts: false,
    gallery: false
  });
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [osName, setOsName] = useState<string>("Unknown OS");

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

  // Detect OS on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      if (/android/i.test(ua)) setOsName("Android OS");
      else if (/iPad|iPhone|iPod/.test(ua)) setOsName("iOS Mobile");
      else if (/Macintosh/i.test(ua)) setOsName("macOS System");
      else if (/Windows/i.test(ua)) setOsName("Windows System");
      else if (/Linux/i.test(ua)) setOsName("Linux System");
    }
  }, []);

  // Slide 3 Loading process
  useEffect(() => {
    if (step === 3) {
      const duration = 3000; // 3 seconds minimum
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
      // Completed Swipe to Step 2
      setIsSwiping(false);
      setStep(2);
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
        setStep(2);
      }
    }
  };

  // Mock permission click triggers system prompt
  const requestPermission = (type: 'location' | 'contacts' | 'gallery') => {
    setActivePrompt(type);
  };

  const handleAllow = () => {
    if (activePrompt) {
      setPermissions((prev) => ({ ...prev, [activePrompt]: true }));
      setActivePrompt(null);
    }
  };

  const handleDeny = () => {
    setActivePrompt(null);
  };

  return (
    <div className="absolute inset-0 min-h-screen z-[100] flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none">
      
      {/* STEP 1: Welcome Splash */}
      {step === 1 && (
        <div className="relative flex-1 flex flex-col justify-between p-6">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/onboarding_bg_1.png"
              alt="Welcome Background"
              fill
              className="object-cover opacity-80"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
          </div>

          {/* Top Info */}
          <div className="relative z-10 pt-10 flex flex-col items-center text-center">
            <span className="bg-primary/20 backdrop-blur-md border border-primary/30 px-3.5 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-widest animate-pulse">
              Animal Rescue Connect
            </span>
          </div>

          {/* Bottom Heading & Swipe Slider */}
          <div className="relative z-10 pb-8 flex flex-col gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                Save Stray Animals <br />
                <span className="text-primary bg-clip-text">with Confidence</span>
              </h1>
              <p className="text-sm text-slate-300 max-w-sm">
                Instantly report emergencies, map nearby animal shelters, and stay connected to rescue volunteers on the ground.
              </p>
            </div>

            {/* Premium Swipe Track */}
            <div 
              ref={trackRef}
              className="h-14 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-full p-1 flex items-center justify-between relative select-none overflow-hidden touch-none"
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
              {/* White Sliding Handle */}
              <div 
                style={{ transform: `translateX(${swipeX}px)` }}
                className={cn(
                  "w-11 h-11 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg cursor-grab transition-all absolute left-1 z-20",
                  isSwiping ? "cursor-grabbing scale-95" : ""
                )}
              >
                <FaCompass className="w-5.5 h-5.5 text-blue-600 dark:text-blue-600" />
              </div>

              {/* Centered Guide Text */}
              <div className="w-full text-center text-xs font-semibold text-slate-300 pointer-events-none select-none z-10">
                Swipe to Explore
              </div>

              {/* Right Arrow Endcap */}
              <div className="w-11 h-11 rounded-full bg-primary/25 backdrop-blur-sm border border-primary/45 text-white flex items-center justify-center absolute right-1 select-none pointer-events-none z-0">
                <FaArrowRight className="w-4 h-4 text-white/95 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Permissions System Screen */}
      {step === 2 && (
        <div className="relative flex-1 flex flex-col justify-between p-6">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/onboarding_bg_2.png"
              alt="Permissions Background"
              fill
              className="object-cover opacity-30"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
          </div>

          {/* Top Title & OS badge */}
          <div className="relative z-10 pt-10 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-extrabold">Grant Permissions</h2>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-xs font-semibold text-slate-300">
                {osName.includes("Mobile") || osName.includes("Android") || osName.includes("iOS") ? (
                  <FaMobileAlt className="w-3 h-3 text-primary" />
                ) : (
                  <FaLaptop className="w-3 h-3 text-primary" />
                )}
                {osName}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Please grant the following device permissions to enable rapid rescues and location coordination.
            </p>
          </div>

          {/* Permissions Form */}
          <div className="relative z-10 flex flex-col gap-4 my-auto">
            {/* Permission 1: GPS Location */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">GPS Location Services</span>
                  <span className="text-xs text-slate-400">Pinpoints animals in distress on map.</span>
                </div>
              </div>
              <button
                onClick={() => !permissions.location && requestPermission('location')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  permissions.location 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
                    : "bg-primary text-primary-foreground hover:bg-primary/95"
                )}
              >
                {permissions.location ? (
                  <>
                    <FaCheckCircle className="w-3.5 h-3.5" /> Granted
                  </>
                ) : "Grant"}
              </button>
            </div>

            {/* Permission 2: Contacts / Dialing */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaAddressBook className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">Call & Contacts Access</span>
                  <span className="text-xs text-slate-400">Dial local shelters and rescue drivers.</span>
                </div>
              </div>
              <button
                onClick={() => !permissions.contacts && requestPermission('contacts')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  permissions.contacts 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
                    : "bg-primary text-primary-foreground hover:bg-primary/95"
                )}
              >
                {permissions.contacts ? (
                  <>
                    <FaCheckCircle className="w-3.5 h-3.5" /> Granted
                  </>
                ) : "Grant"}
              </button>
            </div>

            {/* Permission 3: Gallery Photos */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaImage className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">Gallery Media Access</span>
                  <span className="text-xs text-slate-400">Upload evidence photos of the animal.</span>
                </div>
              </div>
              <button
                onClick={() => !permissions.gallery && requestPermission('gallery')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  permissions.gallery 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
                    : "bg-primary text-primary-foreground hover:bg-primary/95"
                )}
              >
                {permissions.gallery ? (
                  <>
                    <FaCheckCircle className="w-3.5 h-3.5" /> Granted
                  </>
                ) : "Grant"}
              </button>
            </div>
          </div>

          {/* Continue Action */}
          <div className="relative z-10 pb-6">
            <button
              onClick={() => permissions.location && permissions.contacts && permissions.gallery && setStep(3)}
              disabled={!(permissions.location && permissions.contacts && permissions.gallery)}
              className={cn(
                "w-full py-4 rounded-full text-center font-bold text-sm transition-all duration-300 shadow-lg",
                (permissions.location && permissions.contacts && permissions.gallery)
                  ? "bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-primary/20 scale-100"
                  : "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed scale-95"
              )}
            >
              Continue to Rescue Connect
            </button>
          </div>

          {/* Mock Prompt Popup Panel */}
          {activePrompt && (
            <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-6">
              <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl animate-in scale-in duration-200">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    {activePrompt === 'location' && <FaMapMarkerAlt className="w-6 h-6" />}
                    {activePrompt === 'contacts' && <FaAddressBook className="w-6 h-6" />}
                    {activePrompt === 'gallery' && <FaImage className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1">
                    <span className="font-extrabold text-sm block">Permission Request</span>
                    <p className="text-xs text-slate-400">
                      Animal Rescue Connect is requesting access to your device's {" "}
                      <span className="font-semibold text-white capitalize">{activePrompt}</span> info.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 w-full mt-2">
                    <button
                      onClick={handleDeny}
                      className="py-2.5 rounded-full border border-slate-800 hover:bg-white/5 text-xs font-bold text-slate-400"
                    >
                      Deny
                    </button>
                    <button
                      onClick={handleAllow}
                      className="py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold"
                    >
                      Allow Access
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Loading Screen (Helping Animal Illustration) */}
      {step === 3 && (
        <div className="relative flex-1 flex flex-col justify-between p-6 bg-slate-950">
          
          {/* Main Top Header */}
          <div className="pt-10 text-center space-y-1">
            <h2 className="text-2xl font-black text-white tracking-wide">Initializing Core Services...</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Setting up secure location beacons and checking in with emergency dispatch volunteers.
            </p>
          </div>

          {/* Central Human Helping Injured Animal Illustration */}
          <div className="my-auto flex flex-col items-center text-center gap-6">
            <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 animate-pulse">
              <Image
                src="/loading_rescue_illustration.png"
                alt="Human helping injured animal"
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
            </div>

            <div className="space-y-1.5 px-4">
              <span className="text-primary font-bold text-xs uppercase tracking-widest block">Deploying Helpers</span>
              <p className="text-xs text-slate-400 max-w-xs">
                "Together, we can bridge the gap between stray animals in pain and immediate medical volunteers."
              </p>
            </div>
          </div>

          {/* Loading Progress Slider */}
          <div className="pb-8 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-1">
              <span>Establishing connection...</span>
              <span className="text-primary">{Math.round(loadingProgress)}%</span>
            </div>
            
            {/* Progress Track */}
            <div className="w-full h-2.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
              <div 
                style={{ width: `${loadingProgress}%` }}
                className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
