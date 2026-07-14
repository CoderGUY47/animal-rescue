"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FaMoon, FaSun, FaDesktop, FaBell, FaInfoCircle, FaShieldAlt,
  FaChevronRight, FaTrophy, FaStar, FaUsers, FaLanguage,
  FaUserCircle, FaEdit, FaCheck, FaTrash,
} from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateProfile, clearProfile, type UserProfile } from '@/store/slices/userSlice';
import { useLanguage } from '@/components/providers/language-provider';

const AVATARS = [
  '/avatars/avatar1.svg',
  '/avatars/avatar2.svg',
  '/avatars/avatar3.svg',
  '/avatars/avatar4.svg',
  '/avatars/avatar5.svg',
  '/avatars/avatar6.svg',
  '/avatars/avatar7.svg',
  '/avatars/avatar8.svg',
  '/avatars/avatar9.svg',
  '/avatars/avatar10.svg',
  '/avatars/avatar11.svg',
  '/avatars/avatar12.svg',
  '/avatars/avatar13.svg',
  '/avatars/avatar14.svg',
  '/avatars/avatar15.svg',
];

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
  { name: 'Urdu', label: 'اردو' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.user.profile);
  const volunteers = useAppSelector((state) => state.volunteers.items);

  // local draft for editing
  const [draft, setDraft] = useState<UserProfile>(profile);

  useEffect(() => {
    setMounted(true);
  }, []);

  // sync draft when profile loads from localStorage
  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleSave = () => {
    dispatch(updateProfile(draft));
    setIsEditing(false);
  };

  const handleClear = () => {
    dispatch(clearProfile());
    setIsEditing(false);
  };

  const topContributors = [...volunteers]
    .sort((a, b) => b.rescues - a.rescues)
    .slice(0, 3);

  if (!mounted) return null;

  const hasProfile = profile.name.trim() !== '';

  return (
    <div className="flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{t("settings.title")}</h1>
      </div>

      {/* ── Profile Section ── */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FaUserCircle className="w-4 h-4 text-primary" /> My Profile
        </h3>
        <Card className="overflow-hidden">
          <CardContent className="p-4 flex flex-col gap-4">

            {/* Avatar row — always visible */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 bg-muted shadow-md">
                  <Image
                    src={isEditing ? draft.avatar : profile.avatar}
                    alt="Profile avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                    aria-label="Edit profile"
                  >
                    <FaEdit className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Display name & info when NOT editing */}
              {!isEditing && (
                <div className="text-center">
                  {hasProfile ? (
                    <>
                      <p className="font-semibold text-base">{profile.name}</p>
                      {profile.gender && (
                        <p className="text-xs text-muted-foreground capitalize">{profile.gender}</p>
                      )}
                      {profile.address && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[240px]">📍 {profile.address}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Tap ✏️ to set up your profile</p>
                  )}
                </div>
              )}
            </div>

            {/* Edit form */}
            {isEditing && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                {/* Avatar picker */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Choose Avatar</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATARS.map((src) => (
                      <button
                        key={src}
                        onClick={() => setDraft((d) => ({ ...d, avatar: src }))}
                        className={cn(
                          "w-full aspect-square rounded-full overflow-hidden border-2 transition-all active:scale-95",
                          draft.avatar === src
                            ? "border-primary ring-2 ring-primary/30 scale-105"
                            : "border-muted hover:border-primary/40"
                        )}
                        aria-label={`Select ${src}`}
                      >
                        <Image src={src} alt="avatar" width={48} height={48} className="w-full h-full" unoptimized />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="profile-name" className="text-xs text-muted-foreground">Full Name</Label>
                  <Input
                    id="profile-name"
                    placeholder="Enter your name"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <Select
                    value={draft.gender}
                    onValueChange={(v) => setDraft((d) => ({ ...d, gender: v as UserProfile["gender"] }))}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="profile-address" className="text-xs text-muted-foreground">Address</Label>
                  <Input
                    id="profile-address"
                    placeholder="e.g. Mirpur, Dhaka"
                    value={draft.address}
                    onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 h-9 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all"
                  >
                    <FaCheck className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={() => { setDraft(profile); setIsEditing(false); }}
                    className="flex-1 flex items-center justify-center gap-2 h-9 border text-sm font-semibold rounded-lg hover:bg-muted/50 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>

                {/* Clear / delete profile */}
                {hasProfile && (
                  <button
                    onClick={handleClear}
                    className="flex items-center justify-center gap-2 text-xs text-destructive hover:underline pt-1"
                  >
                    <FaTrash className="w-3 h-3" /> Clear profile
                  </button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
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
          <div className={cn("grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out", isAccordionOpen && "grid-rows-[1fr]")}>
            <div className="overflow-hidden bg-muted/20 border-t border-border/10">
              <div className="p-4 grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {LANGUAGE_LIST.map((lang) => (
                  <button
                    key={lang.name}
                    onClick={() => { handleLanguageChange(lang.name); setIsAccordionOpen(false); }}
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
