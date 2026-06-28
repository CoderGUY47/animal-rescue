"use client";

import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export function SosOverlay() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsActive(!!customEvent.detail);
    };

    window.addEventListener('sos-trigger', handleTrigger);
    return () => {
      window.removeEventListener('sos-trigger', handleTrigger);
    };
  }, []);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-[9999] bg-red-400 flex items-center justify-center">
      <button
        onClick={() => setIsActive(false)}
        className="w-14 h-14 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-lg hover:bg-white/30 active:scale-95 transition-all pointer-events-auto"
        aria-label="Close SOS alert"
      >
        <FaTimes className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
