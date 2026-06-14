"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaMoon, FaSun, FaDesktop, FaBell, FaInfoCircle, FaShieldAlt, FaChevronRight } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </div>

      {/* Appearance Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Appearance</h3>
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Theme Mode</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-95 text-xs font-semibold",
                  theme === 'light' ? "border-primary bg-primary/10 text-primary" : "border-muted hover:border-primary/50 text-muted-foreground"
                )}
              >
                <FaSun className="w-5 h-5" />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-95 text-xs font-semibold",
                  theme === 'dark' ? "border-primary bg-primary/10 text-primary" : "border-muted hover:border-primary/50 text-muted-foreground"
                )}
              >
                <FaMoon className="w-5 h-5" />
                Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-95 text-xs font-semibold",
                  theme === 'system' ? "border-primary bg-primary/10 text-primary" : "border-muted hover:border-primary/50 text-muted-foreground"
                )}
              >
                <FaDesktop className="w-5 h-5" />
                System
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Preferences */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Preferences</h3>
        <Card>
          <CardContent className="p-0">
            <Link href="/settings/notifications" className="w-full flex items-center justify-between p-4 border-b hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FaBell className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">Notifications</span>
                  <span className="text-xs text-muted-foreground">Manage alerts and sounds</span>
                </div>
              </div>
              <FaChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link href="/settings/privacy" className="w-full flex items-center justify-between p-4 border-b hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <FaShieldAlt className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">Privacy & Security</span>
                  <span className="text-xs text-muted-foreground">Location permissions</span>
                </div>
              </div>
              <FaChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <div className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <FaInfoCircle className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">About</span>
                  <span className="text-xs text-muted-foreground">App version 0.1.0</span>
                </div>
              </div>
              <FaChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
