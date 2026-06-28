"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema, type ReportFormValues } from "@/lib/schemas";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaExclamationTriangle, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { addReport } from "@/store/slices/reportsSlice";
import { incrementReports } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { reverseGeocode } from "@/lib/api";
import { useLanguage } from "@/components/providers/language-provider";

const ANIMAL_TYPES = [
 { value: "dog", emoji: "🐕" },
 { value: "cat", emoji: "🐈" },
 { value: "bird", emoji: "🐦" },
 { value: "rabbit", emoji: "🐇" },
 { value: "other", emoji: "🐾" },
] as const;

const SEVERITY_OPTIONS = [
 { value: "critical", color: "bg-destructive text-white" },
 { value: "moderate", color: "bg-amber-500 text-white" },
 { value: "low", color: "bg-green-500 text-white" },
] as const;

export function ReportForm() {
 const dispatch = useAppDispatch();
 const { t } = useLanguage();
 const [submitted, setSubmitted] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
 const [isLocating, setIsLocating] = useState(false);
 const [gpsCaptured, setGpsCaptured] = useState(false);

 const {
 register,
 handleSubmit,
 watch,
 setValue,
 formState: { errors },
 } = useForm<ReportFormValues>({
 resolver: zodResolver(reportSchema),
 defaultValues: {
 reporterPhone: "",
 animalTypeOther: "",
 },
 });

 const requestLocation = useCallback(() => {
   if (!navigator.geolocation) {
     toast.error("Geolocation is not supported by your browser.");
     return;
   }
   setIsLocating(true);
   navigator.geolocation.getCurrentPosition(
     async (pos) => {
       const { latitude, longitude } = pos.coords;
       setValue("lat", latitude);
       setValue("lng", longitude);
       setGpsCaptured(true);
       setIsLocating(false);
       try {
         const addr = await reverseGeocode(latitude, longitude);
         if (addr) {
           setValue("locationInfo", addr, { shouldValidate: true });
           toast.success("📍 Address detected at your current coordinates!");
         }
       } catch (err) {
         console.error("Reverse geocode failed:", err);
       }
     },
     (err) => {
       setIsLocating(false);
       console.warn("GPS lookup denied or timed out:", err);
     },
     { enableHighAccuracy: true, timeout: 8000 }
   );
 }, [setValue]);

 useEffect(() => {
   requestLocation();
 }, [requestLocation]);

 const selectedAnimalType = watch("animalType");
 const selectedSeverity = watch("severity");
 const conditionValue = watch("condition") ?? "";

 const onSubmit = async (data: ReportFormValues) => {
 setIsSubmitting(true);
 try {
  // simulate api delay
  await new Promise((r) => setTimeout(r, 1200));
  // dispatch to redux store
  dispatch(addReport({
    animalType: data.animalType === "other" ? (data.animalTypeOther ?? "other") : data.animalType,
    severity: data.severity,
    condition: data.condition,
    locationInfo: data.locationInfo,
    lat: data.lat,
    lng: data.lng,
    reporterName: data.reporterName,
    reporterPhone: data.reporterPhone,
    images: uploadedUrls,
  }));
  dispatch(incrementReports());
  toast.success("🐾 Report submitted! Nearby rescuers have been notified.");
  setSubmitted(true);
 } catch {
  toast.error("Failed to submit report. Please try again.");
 } finally {
  setIsSubmitting(false);
 }
 };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <FaCheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-semibold text-lg">{t("report.submittedTitle")}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {t("report.submittedDesc")}
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-2">
          {t("report.submitAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/*////////======= animal type start =======\\\\\\\\\*/}
      <div className="space-y-2">
        <Label className="font-semibold">{t("report.animalType")} <span className="text-destructive">*</span></Label>
        <div className="grid grid-cols-5 gap-2">
          {ANIMAL_TYPES.map(({ value, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("animalType", value, { shouldValidate: true })}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-xs transition-all active:scale-95",
                selectedAnimalType === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-muted hover:border-primary/50"
              )}
            >
              <span className="text-xl">{emoji}</span>
              <span>{t("report." + value)}</span>
            </button>
          ))}
        </div>
        {errors.animalType && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <FaExclamationTriangle className="w-3 h-3" /> {errors.animalType.message}
          </p>
        )}
        {selectedAnimalType === "other" && (
          <Input
            {...register("animalTypeOther")}
            placeholder="Please specify animal type..."
            className="mt-2"
          />
        )}
      </div>
      {/*\\\\\\\\======= animal type end =======/////////*/}

      {/*////////======= severity start =======\\\\\\\\\*/}
      <div className="space-y-2">
        <Label className="font-semibold">{t("report.severity")} <span className="text-destructive">*</span></Label>
        <div className="flex gap-2">
          {SEVERITY_OPTIONS.map(({ value, color }) => {
            const severityLabel = value === "critical" ? t("report.severityCritical") : value === "moderate" ? t("report.severityModerate") : t("report.severityLow");
            const severityDesc = value === "critical" ? t("report.criticalSub") : value === "moderate" ? t("report.moderateSub") : t("report.lowSub");
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue("severity", value, { shouldValidate: true })}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-xl border-2 transition-all active:scale-95",
                  selectedSeverity === value
                    ? "border-foreground shadow-md"
                    : "border-muted hover:border-muted-foreground"
                )}
              >
                <Badge className={`${color} text-[10px] px-2 py-0.5`}>{severityLabel}</Badge>
                <span className="text-[10px] text-muted-foreground mt-1">{severityDesc}</span>
              </button>
            );
          })}
        </div>
        {errors.severity && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <FaExclamationTriangle className="w-3 h-3" /> {errors.severity.message}
          </p>
        )}
      </div>
      {/*\\\\\\\\======= severity end =======/////////*/}

      {/*////////======= condition start =======\\\\\\\\\*/}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="condition" className="font-semibold">
            {t("report.condition")} <span className="text-destructive">*</span>
          </Label>
          
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 text-xs px-2 cursor-pointer")} type="button">
              {t("report.quickFill")}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setValue("condition", "Leg Fractured. The animal cannot put weight on its leg.", { shouldValidate: true })}>
                Leg Fractured
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setValue("condition", "Severe Bleeding. There is an open wound bleeding heavily.", { shouldValidate: true })}>
                Severe Bleeding
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setValue("condition", "Allergic Reaction. Swelling and difficulty breathing.", { shouldValidate: true })}>
                Allergic Reaction
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setValue("condition", "Shivering / Hypothermia. The animal is very cold and shivering.", { shouldValidate: true })}>
                Shivering / Hypothermia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setValue("condition", "Heat Stroke. Panting heavily and disoriented.", { shouldValidate: true })}>
                Heat Stroke
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setValue("condition", "Skin Infection. Loss of hair and scabs visible on skin.", { shouldValidate: true })}>
                Skin Infection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setValue("condition", "", { shouldValidate: true });
                document.getElementById("condition")?.focus();
              }}>
                Others (Type manually)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Textarea
          id="condition"
          placeholder={t("report.descPlaceholder")}
          className="min-h-28 resize-none"
          {...register("condition")}
        />
        <div className="flex justify-between items-center">
          {errors.condition ? (
            <p className="text-xs text-destructive flex items-center gap-1">
              <FaExclamationTriangle className="w-3 h-3" /> {errors.condition.message}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">{conditionValue.length}/500</span>
        </div>
      </div>
      {/*\\\\\\\\======= condition end =======/////////*/}

      {/*////////======= location start =======\\\\\\\\\*/}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="locationInfo" className="font-semibold">
            {t("report.locationDetails")} <span className="text-destructive">*</span>
          </Label>
          <button
            type="button"
            onClick={requestLocation}
            disabled={isLocating}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50 animate-in fade-in"
          >
            {isLocating ? (
              <>📍 {t("report.locating")}</>
            ) : gpsCaptured ? (
              <span className="text-green-600 flex items-center gap-1 font-semibold">📍 {t("report.gpsCaptured")}</span>
            ) : (
              <>📍 {t("report.detectGps")}</>
            )}
          </button>
        </div>
        <Input
          id="locationInfo"
          placeholder="Street name, building, nearby landmark..."
          {...register("locationInfo")}
        />
        {errors.locationInfo && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <FaExclamationTriangle className="w-3 h-3" /> {errors.locationInfo.message}
          </p>
        )}
      </div>
      {/*\\\\\\\\======= location end =======/////////*/}

      {/*////////======= photo upload start =======\\\\\\\\\*/}
      <div className="space-y-2">
        <Label className="font-semibold">
          {t("report.uploadPhotos")}
          <span className="text-xs text-muted-foreground font-normal ml-1">{t("report.maxPhotos")}</span>
        </Label>
        <ImageUpload
          onUpload={(imgs) => setUploadedUrls(imgs.map((i) => i.secure_url))}
          maxImages={3}
        />
      </div>
      {/*\\\\\\\\======= photo upload end =======/////////*/}

      {/*////////======= reporter info start =======\\\\\\\\\*/}
      <div className="space-y-3 pt-1 border-t">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-1">
          {t("report.yourInfo")}
        </p>
        <div className="space-y-2">
          <Label htmlFor="reporterName" className="font-semibold">
            {t("report.yourName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="reporterName"
            placeholder={t("report.fullNamePlaceholder")}
            {...register("reporterName")}
          />
          {errors.reporterName && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <FaExclamationTriangle className="w-3 h-3" /> {errors.reporterName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="reporterPhone" className="font-semibold">
            {t("report.phone")} <span className="text-xs text-muted-foreground font-normal">{t("report.optional")}</span>
          </Label>
          <Input
            id="reporterPhone"
            type="tel"
            placeholder="+1 234 567 8900"
            {...register("reporterPhone")}
          />
          {errors.reporterPhone && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <FaExclamationTriangle className="w-3 h-3" /> {errors.reporterPhone.message}
            </p>
          )}
        </div>
      </div>
      {/*\\\\\\\\======= reporter info end =======/////////*/}

      {/*////////======= submit start =======\\\\\\\\\*/}
      <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <FaSpinner className="w-4 h-4 mr-2 animate-spin" /> {t("report.submitting")}
          </>
        ) : (
          `🚨 ${t("report.submit")}`
        )}
      </Button>
      {/*\\\\\\\\======= submit end =======/////////*/}
    </form>
 );
}
