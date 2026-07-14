"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBullhorn, FaMap, FaCog } from 'react-icons/fa';
import { MdPets } from 'react-icons/md';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const isTabActive = (path: string, exact = false) => {
    return exact ? pathname === path : pathname.startsWith(path);
  };

  const getTabClass = (path: string, exact = false) => {
    const active = isTabActive(path, exact);
    return cn(
      "flex items-center justify-center p-3 rounded-full transition-all duration-300 relative border border-transparent",
      active
        ? "bg-black/50 backdrop-blur-md border-white/15 text-white scale-110 shadow-md"
        : "text-white active:scale-95"
    );
  };

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[416px] bg-black/40 border border-white/10 backdrop-blur-lg rounded-full shadow-2xl">
      <div className="flex justify-between items-center h-16 px-4">
        <Link href="/" className={getTabClass("/", true)}>
          <FaHome className="h-5.5 w-5.5" />
        </Link>

        <Link href="/map" className={getTabClass("/map")}>
          <FaMap className="h-5.5 w-5.5" />
        </Link>

        <Link href="/report" className={getTabClass("/report")}>
          <FaBullhorn className="h-5.5 w-5.5" />
        </Link>

        <Link href="/rescues" className={getTabClass("/rescues")}>
          <MdPets className="h-5.5 w-5.5" />
        </Link>

        <Link href="/settings" className={getTabClass("/settings")}>
          <FaCog className="h-5.5 w-5.5" />
        </Link>
      </div>
    </nav>
  );
}
