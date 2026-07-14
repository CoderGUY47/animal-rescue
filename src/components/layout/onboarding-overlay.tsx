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

  const handleAllow = async () => {
    if (!activePrompt) return;

    const currentPrompt = activePrompt;
    // Close the prompt modal first
    setActivePrompt(null);

    if (currentPrompt === 'location') {
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Location permission granted:", position);
            setPermissions((prev) => ({ ...prev, location: true }));
          },
          (error) => {
            console.warn("Location permission error or denied:", error);
            // Mark as true so they are not blocked
            setPermissions((prev) => ({ ...prev, location: true }));
          },
          { enableHighAccuracy: false, timeout: 5000 }
        );
      } else {
        setPermissions((prev) => ({ ...prev, location: true }));
      }
    } else if (currentPrompt === 'contacts') {
      if (typeof window !== "undefined" && 'contacts' in navigator && 'ContactsManager' in window) {
        try {
          await (navigator as any).contacts.select(['name'], { multiple: false });
          setPermissions((prev) => ({ ...prev, contacts: true }));
        } catch (err) {
          console.warn("Contacts Picker API error:", err);
          setPermissions((prev) => ({ ...prev, contacts: true }));
        }
      } else {
        setPermissions((prev) => ({ ...prev, contacts: true }));
      }
    } else if (currentPrompt === 'gallery') {
      if (typeof window !== "undefined") {
        try {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.click();
        } catch (err) {
          console.warn("File picker trigger failed:", err);
        }
      }
      setPermissions((prev) => ({ ...prev, gallery: true }));
    }
  };

  const handleDeny = () => {
    setActivePrompt(null);
  };

  return (
    <div className="absolute inset-0 min-h-screen z-100 flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none">
      
      {/* Decorative Premium Glow Background Spots */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full filter blur-3xl animate-pulse pointer-events-none [animation-delay:2s]" />

      {/* STEP 1: Welcome Splash */}
      {step === 1 && (
        <div className="relative flex-1 flex flex-col justify-between p-6">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/onboarding_bg_1.png"
              alt="Welcome Background"
              fill
              className="object-cover opacity-60 mix-blend-lighten"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/80" />
          </div>

          {/* Top Info & Stepper */}
          <div className="relative z-10 pt-10 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">
                Welcome
              </span>
            </div>
            
            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-1 rounded-full bg-primary transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="w-2 h-1 rounded-full bg-slate-800 transition-all duration-300" />
              <span className="w-2 h-1 rounded-full bg-slate-800 transition-all duration-300" />
            </div>
          </div>

          {/* Bottom Heading & Swipe Slider */}
          <div className="relative z-10 pb-8 flex flex-col gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Save Stray Animals <br />
                <span className="bg-gradient-to-r from-primary via-rose-400 to-violet-500 bg-clip-text text-transparent shadow-sm">
                  with Confidence
                </span>
              </h1>
              <p className="text-xs text-slate-300/90 max-w-xs leading-relaxed">
                Instantly report emergencies, map nearby animal shelters, and stay connected to rescue volunteers on the ground.
              </p>
            </div>

            {/* Premium Swipe Track */}
            <div 
              ref={trackRef}
              className="h-14 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full p-1 flex items-center justify-between relative select-none overflow-hidden touch-none shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
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
              {/* Swipe Progress Fill */}
              <div 
                className="absolute left-1 top-1 bottom-1 bg-gradient-to-r from-primary/30 to-violet-500/30 rounded-full transition-all pointer-events-none"
                style={{ width: `${swipeX + 22}px` }}
              />

              {/* Glowing Swipe Handle */}
              <div 
                style={{ transform: `translateX(${swipeX}px)` }}
                className={cn(
                  "w-11 h-11 rounded-full bg-gradient-to-r from-primary to-violet-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-grab transition-all absolute left-1 z-20 hover:scale-105 active:scale-95 border border-white/20",
                  isSwiping ? "cursor-grabbing shadow-[0_0_20px_rgba(239,68,68,0.6)]" : ""
                )}
              >
                <FaArrowRight className="w-4 h-4 text-white animate-pulse" />
              </div>

              {/* Centered Guide Text */}
              <div className="w-full text-center text-xs font-bold text-slate-300/80 pointer-events-none select-none z-10 tracking-wide">
                Swipe to Explore
              </div>

              {/* Right Arrow Endcap */}
              <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center absolute right-1 select-none pointer-events-none z-0">
                <FaCompass className="w-4 h-4 text-primary animate-spin-slow" />
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
              src="/onboarding_bg_2_new.png"
              alt="Permissions Background"
              fill
              className="object-cover opacity-45 mix-blend-lighten"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80" />
          </div>

          {/* Top Title & OS badge */}
          <div className="relative z-10 pt-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-1 rounded-full bg-slate-800" />
                  <span className="w-6 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="w-2 h-1 rounded-full bg-slate-800" />
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Access Permissions
                </h2>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-slate-300 tracking-wider shadow-inner uppercase">
                {osName.includes("Mobile") || osName.includes("Android") || osName.includes("iOS") ? (
                  <FaMobileAlt className="w-3 h-3 text-primary" />
                ) : (
                  <FaLaptop className="w-3 h-3 text-primary" />
                )}
                {osName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Rapid rescues and coordinates require access to essential device sensors. Please allow the features below.
            </p>
          </div>

          {/* Permissions Form */}
          <div className="relative z-10 flex flex-col gap-3 my-auto">
            
            {/* Permission 1: GPS Location */}
            <div className={cn(
              "p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 backdrop-blur-md",
              permissions.location
                ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                : "bg-white/[0.02] border-white/5 hover:border-white/15"
            )}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-primary relative shadow-md">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-sm text-slate-100">GPS Location Services</span>
                  <span className="text-[11px] text-slate-400">Pinpoints animals in distress on the map.</span>
                </div>
              </div>
              <button
                onClick={() => !permissions.location && requestPermission('location')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 active:scale-95",
                  permissions.location 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "bg-white/10 hover:bg-primary hover:text-primary-foreground border border-white/10 text-white cursor-pointer"
                )}
              >
                {permissions.location ? (
                  <>
                    <FaCheckCircle className="w-3.5 h-3.5 animate-pulse" /> Granted
                  </>
                ) : "Grant"}
              </button>
            </div>

            {/* Permission 2: Contacts / Dialing */}
            <div className={cn(
              "p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 backdrop-blur-md",
              permissions.contacts
                ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                : "bg-white/[0.02] border-white/5 hover:border-white/15"
            )}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-primary relative shadow-md">
                  <FaAddressBook className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-sm text-slate-100">Call & Contacts Access</span>
                  <span className="text-[11px] text-slate-400">Dial local shelters and rescue drivers.</span>
                </div>
              </div>
              <button
                onClick={() => !permissions.contacts && requestPermission('contacts')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 active:scale-95",
                  permissions.contacts 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "bg-white/10 hover:bg-primary hover:text-primary-foreground border border-white/10 text-white cursor-pointer"
                )}
              >
                {permissions.contacts ? (
                  <>
                    <FaCheckCircle className="w-3.5 h-3.5 animate-pulse" /> Granted
                  </>
                ) : "Grant"}
              </button>
            </div>

            {/* Permission 3: Gallery Photos */}
            <div className={cn(
              "p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 backdrop-blur-md",
              permissions.gallery
                ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                : "bg-white/[0.02] border-white/5 hover:border-white/15"
            )}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-primary relative shadow-md">
                  <FaImage className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-sm text-slate-100">Gallery Media Access</span>
                  <span className="text-[11px] text-slate-400">Upload evidence photos of the animal.</span>
                </div>
              </div>
              <button
                onClick={() => !permissions.gallery && requestPermission('gallery')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 active:scale-95",
                  permissions.gallery 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "bg-white/10 hover:bg-primary hover:text-primary-foreground border border-white/10 text-white cursor-pointer"
                )}
              >
                {permissions.gallery ? (
                  <>
                    <FaCheckCircle className="w-3.5 h-3.5 animate-pulse" /> Granted
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
                "w-full py-4 rounded-2xl text-center font-bold text-sm transition-all duration-300 shadow-lg cursor-pointer",
                (permissions.location && permissions.contacts && permissions.gallery)
                  ? "bg-gradient-to-r from-primary to-violet-600 text-white hover:brightness-110 shadow-[0_4px_20px_rgba(239,68,68,0.25)] scale-100 active:scale-98"
                  : "bg-slate-900/50 text-slate-500 border border-slate-800/80 cursor-not-allowed scale-95"
              )}
            >
              Continue to Rescue Connect
            </button>
          </div>

          {/* Mock Prompt Popup Panel */}
          {activePrompt && (
            <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
              <div className="w-full max-w-xs bg-slate-900/95 border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-primary flex items-center justify-center shadow-inner relative">
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
                    {activePrompt === 'location' && <FaMapMarkerAlt className="w-6 h-6" />}
                    {activePrompt === 'contacts' && <FaAddressBook className="w-6 h-6" />}
                    {activePrompt === 'gallery' && <FaImage className="w-6 h-6" />}
                  </div>
                  <div className="space-y-2">
                    <span className="font-black text-base text-slate-100 block">Permission Prompt</span>
                    <p className="text-xs text-slate-400 leading-relaxed px-1">
                      Allow Animal Rescue Connect to utilize your device's {" "}
                      <span className="font-extrabold text-primary capitalize">{activePrompt}</span> sensor.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full mt-3">
                    <button
                      onClick={handleDeny}
                      className="py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-slate-400 transition-colors cursor-pointer"
                    >
                      Deny
                    </button>
                    <button
                      onClick={handleAllow}
                      className="py-2.5 rounded-xl bg-gradient-to-r from-primary to-violet-600 text-white hover:brightness-115 text-xs font-bold transition-all shadow-md cursor-pointer"
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
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent" />
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
                className="h-full bg-linear-to-r from-primary to-violet-500 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
