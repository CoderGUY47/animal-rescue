"use client";

import { Card, CardContent } from '@/components/ui/card';
import { FaMoon, FaSun, FaDesktop, FaBell, FaInfoCircle, FaShieldAlt, FaChevronRight, FaTrophy, FaStar, FaUsers, FaLanguage } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useLanguage } from '@/components/providers/language-provider';

const LANGUAGE_LIST = [
  { name: 'English', label: 'English' },
  { name: 'Chinese', label: '中文' },
  { name: 'Spanish', label: 'Español' },
  { name: 'Hindi', label: 'हिन्दी' },
  { name: 'Arabic', label: 'العربية' },
  { name: 'Bengali', label: 'বাংলা' },
  { name: 'Portuguese', label: 'Português' },
  { name: 'Russian', label: 'Русский' },
  { name: 'Japanese', label: '日本語' },
  { name: 'Punjabi', label: 'ਪੰਜਾਬੀ' },
  { name: 'German', label: 'Deutsch' },
  { name: 'French', label: 'Français' },
  { name: 'Telugu', label: 'తెలుగు' },
  { name: 'Turkish', label: 'Türkçe' },
  { name: 'Tamil', label: 'தமிழ்' },
  { name: 'Vietnamese', label: 'Tiếng Việt' },
  { name: 'Korean', label: '한국어' },
  { name: 'Italian', label: 'Italiano' },
  { name: 'Marathi', label: 'मराठी' },
  { name: 'Urdu', label: 'اردو' }
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const volunteers = useAppSelector((state) => state.volunteers.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const topContributors = [...volunteers]
    .sort((a, b) => b.rescues - a.rescues)
    .slice(0, 3);

  if (!mounted) return null;

  return (
    <div className="flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{t("settings.title")}</h1>
      </div>

      {/* Appearance Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{t("settings.appearance")}</h3>
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{t("settings.themeMode")}</span>
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
                {t("settings.light")}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-95 text-xs font-semibold",
                  theme === 'dark' ? "border-primary bg-primary/10 text-primary" : "border-muted hover:border-primary/50 text-muted-foreground"
                )}
              >
                <FaMoon className="w-5 h-5" />
                {t("settings.dark")}
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-95 text-xs font-semibold",
                  theme === 'system' ? "border-primary bg-primary/10 text-primary" : "border-muted hover:border-primary/50 text-muted-foreground"
                )}
              >
                <FaDesktop className="w-5 h-5" />
                {t("settings.system")}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Section (Accordion) */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FaLanguage className="w-5 h-5 text-primary" /> {t("settings.language")}
        </h3>
        <Card className="overflow-hidden">
          {/* Accordion Trigger Header */}
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-muted/50 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <FaLanguage className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">{t("settings.selectLang")}</span>
                <span className="text-xs text-muted-foreground">Active: {
                  LANGUAGE_LIST.find((l) => l.name === language)?.label || language
                }</span>
              </div>
            </div>
            <FaChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", isAccordionOpen && "rotate-90")} />
          </button>

          {/* Accordion Collapsible Content */}
          <div className={cn("grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out", isAccordionOpen && "grid-rows-[1fr]")}>
            <div className="overflow-hidden bg-muted/20 border-t border-border/10">
              <div className="p-4 grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {LANGUAGE_LIST.map((lang) => (
                  <button
                    key={lang.name}
                    onClick={() => {
                      handleLanguageChange(lang.name);
                      setIsAccordionOpen(false);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all active:scale-95 text-xs font-bold",
                      language === lang.name ? "border-primary bg-primary/10 text-primary" : "border-muted hover:border-primary/50 text-muted-foreground"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* App Preferences */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{t("settings.preferences")}</h3>
        <Card>
          <CardContent className="p-0">
            <Link href="/settings/notifications" className="w-full flex items-center justify-between p-4 border-b hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FaBell className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">{t("settings.notifications")}</span>
                  <span className="text-xs text-muted-foreground">{t("settings.notificationsSub")}</span>
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
                  <span className="font-semibold text-sm">{t("settings.privacy")}</span>
                  <span className="text-xs text-muted-foreground">{t("settings.privacySub")}</span>
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
                  <span className="font-semibold text-sm">{t("settings.about")}</span>
                  <span className="text-xs text-muted-foreground">{t("settings.aboutSub")}</span>
                </div>
              </div>
              <FaChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contributors Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FaTrophy className="text-amber-500" /> {t("settings.contributors")}
        </h3>
        <Card>
          <CardContent className="p-0">
            {topContributors.map((user, i) => (
              <div key={user.id} className={cn("flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors", i < 2 && "border-b")}>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-sm truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.role === "Senior Volunteer" 
                      ? t("settings.seniorVolunteer") 
                      : user.role === "Transport Specialist" 
                      ? t("settings.transportSpecialist") 
                      : user.role === "Foster Parent" 
                      ? t("settings.fosterParent") 
                      : user.role}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 shrink-0">
                  <FaStar className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{user.rescues}</span>
                </div>
              </div>
            ))}
            <Link href="/community" className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                  <FaUsers className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">{t("settings.viewCommunity")}</span>
                  <span className="text-xs text-muted-foreground">{t("settings.communitySub")}</span>
                </div>
              </div>
              <FaChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
