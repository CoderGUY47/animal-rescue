"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FaBell, FaPaw, FaExclamationTriangle, FaCheckCircle, FaArrowLeft, FaSun, FaMoon, FaTimes } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';
import { useLanguage } from '@/components/providers/language-provider';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { markAllRead, clearAll } from '@/store/slices/notificationsSlice';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((s) => s.notifications.items);
  // only show back arrow on sub-pages (e.g. /settings/notifications, /rescues/[id])
  // not on top-level tabs like /map, /settings, /rescues, /report, /analytics
  const segments = pathname.split('/').filter(Boolean);
  const showBack = segments.length >= 2;

  const unreadCount = notifications.filter((n) => n.unread).length;
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const triggerSos = () => {
    window.dispatchEvent(new CustomEvent('sos-trigger', { detail: true }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 max-w-md mx-auto">
        <div className="flex items-center gap-1.5">
          {showBack && (
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className={`p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none`}
            >
              <FaArrowLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="RescueConnect Logo" width={24} height={24} />
            <span className="font-semibold text-lg">{t("app.title")}</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={triggerSos}
            className="px-2.5 py-1 mr-1 text-[11px] font-bold text-red-500 bg-white/10 dark:bg-white/10 border border-white/20 backdrop-blur-md rounded-full shadow-inner hover:bg-white/20 active:scale-95 transition-all"
          >
            SOS
          </button>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 relative ${buttonVariants({ variant: 'ghost', size: 'icon-sm' })}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FaSun className="h-5 w-5 text-muted-foreground" /> : <FaMoon className="h-5 w-5 text-muted-foreground" />}
            </button>
          )}

          <Dialog>
            <DialogTrigger
              aria-label="Notifications"
              className={`relative p-2 ${buttonVariants({ variant: 'ghost', size: 'icon-sm' })}`}
            >
              <FaBell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                </span>
              )}
            </DialogTrigger>
            <DialogContent className="p-0 max-w-sm gap-0 overflow-hidden">
            <DialogHeader className="px-4 pt-4 pb-3 border-b">
              <div className="flex items-center justify-between pr-6">
                <DialogTitle className="text-base font-semibold">Notifications</DialogTitle>
                {unreadCount > 0 && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </div>
            </DialogHeader>
            <div className="flex flex-col divide-y max-h-[420px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
                    <FaBell className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">No notifications yet</span>
                  <span className="text-xs text-muted-foreground mt-1 px-4 leading-relaxed">
                    When you get updates about rescues or reports, they&apos;ll show up here.
                  </span>
                </div>
              ) : (
                notifications.map((n) => {
                  const icon = n.type === 'report'
                    ? <FaExclamationTriangle className="w-4 h-4 text-amber-500" />
                    : n.type === 'rescue'
                    ? <FaCheckCircle className="w-4 h-4 text-green-500" />
                    : <FaPaw className="w-4 h-4 text-primary" />;
                  const bg = n.type === 'report' ? 'bg-amber-50 dark:bg-amber-950' : n.type === 'rescue' ? 'bg-green-50 dark:bg-green-950' : 'bg-primary/10';
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 transition-colors ${n.unread ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${bg}`}>
                        {icon}
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm truncate">{n.title}</span>
                          {n.unread && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                        </div>
                        <span className="text-xs text-muted-foreground leading-snug">{n.desc}</span>
                        <span className="text-[10px] text-muted-foreground/70 mt-0.5">{n.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t flex gap-2">
                <button
                  onClick={() => dispatch(markAllRead())}
                  className="flex-1 text-xs text-primary font-semibold text-center hover:underline"
                >
                  Mark all as read
                </button>
                <button
                  onClick={() => dispatch(clearAll())}
                  className="flex-1 text-xs text-muted-foreground text-center hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </header>
  );
}
