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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { addReport } from "@/store/slices/reportsSlice";
import { incrementReports } from "@/store/slices/userSlice";
import { toast } from "react-toastify";

const ANIMAL_TYPES = [
 { value: "dog", emoji: "🐕", label: "Dog" },
 { value: "cat", emoji: "🐈", label: "Cat" },
 { value: "bird", emoji: "🐦", label: "Bird" },
 { value: "rabbit", emoji: "🐇", label: "Rabbit" },
 { value: "other", emoji: "🐾", label: "Other" },
] as const;

const SEVERITY_OPTIONS = [
 { value: "critical", label: "Critical", color: "bg-destructive text-white", desc: "Life-threatening" },
 { value: "moderate", label: "Moderate", color: "bg-amber-500 text-white", desc: "Needs attention" },
 { value: "low", label: "Low", color: "bg-green-500 text-white", desc: "Stable condition" },
] as const;

export function ReportForm() {
 const dispatch = useAppDispatch();
 const [submitted, setSubmitted] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

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

 const selectedAnimalType = watch("animalType");
 const selectedSeverity = watch("severity");
 const conditionValue = watch("condition") ?? "";

 const onSubmit = async (data: ReportFormValues) => {
 setIsSubmitting(true);
 try {
 // simulate api delay — swap with real axios post when backend is ready
 await new Promise((r) => setTimeout(r, 1200));
 // dispatch to redux store
 dispatch(addReport({
 animalType: data.animalType === "other" ? (data.animalTypeOther ?? "other") : data.animalType,
 severity: data.severity,
 condition: data.condition,
 locationInfo: data.locationInfo,
 reporterName: data.reporterName,
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
 <h3 className="font-semibold text-lg">Report Submitted!</h3>
 <p className="text-sm text-muted-foreground max-w-xs">
 Your rescue request has been submitted. Nearby volunteers and shelters
 have been notified.
 </p>
 <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-2">
 Submit Another Report
 </Button>
 </div>
 );
 }

 return (
 <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

 {/*////////======= animal type start =======\\\\\\\\\*/}
 <div className="space-y-2">
 <Label className="font-semibold">Animal Type <span className="text-destructive">*</span></Label>
 <div className="grid grid-cols-5 gap-2">
 {ANIMAL_TYPES.map(({ value, emoji, label }) => (
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
 <span>{label}</span>
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
 <Label className="font-semibold">Severity <span className="text-destructive">*</span></Label>
 <div className="flex gap-2">
 {SEVERITY_OPTIONS.map(({ value, label, color, desc }) => (
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
 <Badge className={`${color} text-[10px] px-2 py-0.5`}>{label}</Badge>
 <span className="text-[10px] text-muted-foreground mt-1">{desc}</span>
 </button>
 ))}
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
            Animal Condition <span className="text-destructive">*</span>
          </Label>
          
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 text-xs px-2 cursor-pointer")} type="button">
              Quick Fill
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
 placeholder="Describe injuries, behavior, or situation in detail..."
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
 <Label htmlFor="locationInfo" className="font-semibold">
 Location Details <span className="text-destructive">*</span>
 </Label>
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
 Upload Photos
 <span className="text-xs text-muted-foreground font-normal ml-1">(up to 3)</span>
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
 Your Information
 </p>
 <div className="space-y-2">
 <Label htmlFor="reporterName" className="font-semibold">
 Your Name <span className="text-destructive">*</span>
 </Label>
 <Input
 id="reporterName"
 placeholder="Full name"
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
 Phone Number <span className="text-xs text-muted-foreground font-normal">(optional)</span>
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
 <FaSpinner className="w-4 h-4 mr-2 animate-spin" /> Submitting Report...
 </>
 ) : (
 "🚨 Submit Emergency Report"
 )}
 </Button>
 {/*\\\\\\\\======= submit end =======/////////*/}
 </form>
 );
}
