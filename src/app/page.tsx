"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaExclamationCircle,
  FaArrowRight,
  FaHeart,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaPaw,
  FaHome,
  FaHandHoldingHeart,
  FaTimes,
  FaDonate,
  FaDotCircle,
  FaBell,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useSound } from "@/hooks/use-sound";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";

export default function HomePage() {
  const { t } = useLanguage();
  const [donateOpen, setDonateOpen] = useState(false);
  const [donateAmount, setDonateAmount] = useState<string>("25");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const { playTap, playSiren } = useSound();
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const stopSirenRef = useRef<(() => void) | null>(null);

  const toggleSiren = () => {
    if (isSirenPlaying) {
      stopSirenRef.current?.();
      setIsSirenPlaying(false);
    } else {
      stopSirenRef.current = playSiren();
      setIsSirenPlaying(true);
    }
  };

  // Pointer dragging refs for categories swiper (matches map filter scroll exactly)
  const categoriesRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    dragged: false,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragInfo.current.isDragging = true;
    dragInfo.current.startX =
      e.pageX - (categoriesRef.current?.offsetLeft || 0);
    dragInfo.current.scrollLeft = categoriesRef.current?.scrollLeft || 0;
    dragInfo.current.dragged = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragInfo.current.isDragging || !categoriesRef.current) return;
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = (x - dragInfo.current.startX) * 1.5;
    categoriesRef.current.scrollLeft = dragInfo.current.scrollLeft - walk;
    if (Math.abs(walk) > 4) {
      dragInfo.current.dragged = true;
    }
  };

  const handlePointerUp = () => {
    dragInfo.current.isDragging = false;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    playTap();
    if (dragInfo.current.dragged) {
      e.preventDefault();
    }
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = donateAmount === "custom" ? customAmount : donateAmount;
    if (
      !finalAmount ||
      isNaN(Number(finalAmount)) ||
      Number(finalAmount) <= 0
    ) {
      toast.error("Please enter a valid donation amount.");
      return;
    }
    toast.success(
      `Thank you! A donation of $${finalAmount} has been processed successfully.`,
    );
    setDonateOpen(false);
    setCustomAmount("");
  };

  return (
    <div className="flex flex-col flex-1 p-4 gap-6 pb-8">
      {/* Hero Text */}
      <section className="w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              {t("home.welcome")}
            </h1>
            <button
              onClick={() => { playTap(); toggleSiren(); }}
              className={`flex items-center justify-center p-3 rounded-full shadow-md border ${
                isSirenPlaying 
                  ? "bg-rose-600 text-white border-rose-600 animate-pulse" 
                  : "bg-white text-rose-500 border-rose-100 dark:bg-slate-800 dark:border-slate-700"
              }`}
              title="Sound Siren"
            >
              <FaBell className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            {t("home.sub")}
          </p>
        </div>
      </section>

      {/* Hero Banner Image */}
      <section className="w-full -mt-2">
        <Link
          href="/report"
          onClick={playTap}
          className="block w-full overflow-hidden shadow-md relative"
        >
          <div className="relative w-full aspect-16/7">
            <Image
              src="/assets/emergency.png"
              alt="Emergency Alert Banner"
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
          </div>
        </Link>
      </section>


      {/* Quick Actions Grid */}
      <section>
        <div className="grid grid-cols-3 gap-3">
          {/* Card 1: Adopt */}
          <Link href="/rescues" onClick={playTap} className="block">
            <Card className="h-[160px] border border-slate-100 dark:border-slate-800 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f43f5e] text-white flex items-center justify-center shadow-md shadow-[#f43f5e]/30">
                  <FaHome className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-extrabold text-[12px] text-slate-800 dark:text-slate-200 leading-tight">
                    {t("home.adopt")}
                  </span>
                  <span className="text-[9px] text-muted-foreground leading-tight">
                    {t("home.adoptSub")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 2: Volunteer */}
          <Link href="/volunteer" onClick={playTap} className="block">
            <Card className="h-[160px] border border-slate-100 dark:border-slate-800 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shadow-md shadow-[#f59e0b]/30">
                  <FaHandHoldingHeart className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-extrabold text-[12px] text-slate-800 dark:text-slate-200 leading-tight">
                    {t("home.volunteer")}
                  </span>
                  <span className="text-[9px] text-muted-foreground leading-tight">
                    {t("home.volunteerSub")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 3: Donate */}
          <button
            onClick={() => { playTap(); setDonateOpen(true); }}
            className="block w-full focus:outline-none"
          >
            <Card className="h-[160px] border border-slate-100 dark:border-slate-800 bg-card rounded-2xl shadow-sm pointer-events-none w-full">
              <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full gap-3">
                <div className="w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-md shadow-[#3b82f6]/30">
                  <FaHeart className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-extrabold text-[12px] text-slate-800 dark:text-slate-200 leading-tight">
                    {t("home.donate")}
                  </span>
                  <span className="text-[9px] text-muted-foreground leading-tight">
                    {t("home.donateSub")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </button>
        </div>
      </section>

      {/* Urgent Rescues */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FaExclamationCircle className="w-5 h-5 text-orange-500" />
            {t("home.urgentRescues")}
          </h3>
          <Link
            href="/rescues"
            onClick={playTap}
            className="text-sm text-primary flex items-center"
          >
            {t("home.seeAll")} <FaArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {/* mock item 1 */}
          <Link href="/rescues/1" onClick={playTap} className="block">
            <Card className="overflow-hidden">
              <div className="flex h-28">
                <div className="w-2/5 bg-muted relative">
                  <Image
                    src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=400&auto=format&fit=crop"
                    alt="Injured cat"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 left-2 bg-destructive text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {t("report.severityCritical")}
                  </div>
                </div>
                <div className="w-3/5 p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-sm leading-tight line-clamp-1">
                      Injured Stray Cat
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 line-clamp-1">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      Downtown Alley, 0.5m
                    </p>
                  </div>
                  <div className="text-xs text-orange-600">
                    Needs transportation
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          {/* mock item 2 */}
          <Link href="/rescues/2" onClick={playTap} className="block">
            <Card className="overflow-hidden">
              <div className="flex h-28">
                <div className="w-2/5 bg-muted relative">
                  <Image
                    src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=400&auto=format&fit=crop"
                    alt="Abandoned puppy"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    {t("report.severityModerate")}
                  </div>
                </div>
                <div className="w-3/5 p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm leading-tight line-clamp-1 font-semibold">
                      Abandoned Puppy
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 line-clamp-1">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      City Park, 1.2m
                    </p>
                  </div>
                  <div className="text-xs text-blue-600 font-semibold">
                    Needs foster home
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* How to Use Guide */}
      <section className="flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg flex items-center gap-2 font-semibold">
            {t("home.howItWorks")}
          </h3>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-semibold text-sm">
                  1
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {t("home.step1Title")}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {t("home.step1Desc")}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-semibold text-sm">
                  2
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {t("home.step2Title")}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {t("home.step2Desc")}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-semibold text-sm">
                  3
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{t("home.step3Title")}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {t("home.step3Desc")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Donation Dialog */}
      <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
        <DialogContent className="max-w-xs p-5 rounded-3xl overflow-hidden bg-card border shadow-2xl relative">
          <button
            onClick={() => { playTap(); setDonateOpen(false); }}
            className="absolute top-4 right-4 text-muted-foreground p-1"
          >
            <FaTimes className="w-3.5 h-3.5" />
          </button>

          <DialogHeader className="mb-4">
            <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center mb-2 mx-auto">
              <FaDonate className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center text-lg font-bold font-fredoka text-slate-800 dark:text-slate-100">
              Support Stray Animals
            </DialogTitle>
            <p className="text-center text-xs text-muted-foreground px-2">
              Your donation directly funds veterinary care, shelter meals, and
              rescue logistics.
            </p>
          </DialogHeader>

          <form onSubmit={handleDonateSubmit} className="flex flex-col gap-4">
            {/* Amount Selection */}
            <div className="grid grid-cols-4 gap-2">
              {["10", "25", "50", "100"].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    playTap();
                    setDonateAmount(amt);
                    setCustomAmount("");
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center border ${
                    donateAmount === amt
                      ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                      : "bg-muted/30 border-muted-foreground/10 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Custom Amount Button */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { playTap(); setDonateAmount("custom"); }}
                className={`py-2 px-3 rounded-xl text-xs font-bold text-center border ${
                  donateAmount === "custom"
                    ? "bg-teal-600 border-teal-600 text-white"
                    : "bg-muted/30 border-muted-foreground/10 text-slate-800 dark:text-slate-200"
                }`}
              >
                Custom Amount
              </button>

              {donateAmount === "custom" && (
                <div className="relative mt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full bg-muted/50 border border-muted-foreground/10 rounded-xl py-2 pl-7 pr-3 text-xs font-semibold focus:outline-none focus:border-teal-500 transition-colors"
                    required
                  />
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Payment Method
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "card", label: "Card" },
                  { id: "paypal", label: "PayPal" },
                  { id: "gpay", label: "G-Pay" },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => { playTap(); setPaymentMethod(method.id); }}
                    className={`py-1.5 rounded-lg text-[10px] font-extrabold border text-center ${
                      paymentMethod === method.id
                        ? "bg-slate-800 dark:bg-slate-200 dark:text-slate-900 text-white border-transparent"
                        : "bg-muted/10 border-muted-foreground/10 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={playTap}
              className="w-full bg-teal-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-md shadow-teal-600/10 mt-2 flex items-center justify-center gap-1.5"
            >
              <FaHeart className="w-3.5 h-3.5" />
              Complete Donation
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
