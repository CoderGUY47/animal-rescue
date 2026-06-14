"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { volunteerSchema, type VolunteerFormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FaExclamationTriangle, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SKILLS = [
 { value: "transport", emoji: "🚗", label: "Transport" },
 { value: "foster", emoji: "🏠", label: "Foster" },
 { value: "medical", emoji: "💉", label: "Medical" },
 { value: "rescue", emoji: "🦺", label: "Rescue" },
 { value: "feeding", emoji: "🍖", label: "Feeding" },
] as const;

const AVAILABILITY = [
 { value: "weekdays", label: "Weekdays" },
 { value: "weekends", label: "Weekends" },
 { value: "both", label: "Both" },
 { value: "on-call", label: "On-Call" },
] as const;

export function VolunteerForm() {
 const [submitted, setSubmitted] = useState(false);
 const [isSubmitting, setSubmitting] = useState(false);

 const {
 register,
 handleSubmit,
 watch,
 setValue,
 formState: { errors },
 } = useForm<VolunteerFormValues>({
 resolver: zodResolver(volunteerSchema),
 defaultValues: { skills: [] },
 });

 const selectedSkills = watch("skills") ?? [];
 const selectedAvailability = watch("availability");

 const toggleSkill = (skill: VolunteerFormValues["skills"][number]) => {
 const current = selectedSkills;
 const next = current.includes(skill)
 ? current.filter((s) => s !== skill)
 : [...current, skill];
 setValue("skills", next, { shouldValidate: true });
 };

 const onSubmit = async (data: VolunteerFormValues) => {
 setSubmitting(true);
 await new Promise((r) => setTimeout(r, 1200));
 console.log("Volunteer registered:", data);
 setSubmitting(false);
 setSubmitted(true);
 };

 if (submitted) {
 return (
 <div className="flex flex-col items-center gap-4 py-10 text-center">
 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
 <FaCheckCircle className="w-8 h-8 text-green-600" />
 </div>
 <h3 className="font-semibold text-lg">Welcome, Volunteer! 🐾</h3>
 <p className="text-sm text-muted-foreground max-w-xs">
 You're now registered as a volunteer. We'll notify you when there's a nearby rescue that needs your skills.
 </p>
 <Button onClick={() => setSubmitted(false)} variant="outline">
 Back
 </Button>
 </div>
 );
 }

 return (
 <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

 {/* Name & Email */}
 <div className="grid grid-cols-1 gap-4">
 <div className="space-y-2">
 <Label htmlFor="v-name" className="font-semibold">Full Name <span className="text-destructive">*</span></Label>
 <Input id="v-name" placeholder="Your full name" {...register("name")} />
 {errors.name && (
 <p className="text-xs text-destructive flex items-center gap-1">
 <FaExclamationTriangle className="w-3 h-3" /> {errors.name.message}
 </p>
 )}
 </div>
 <div className="space-y-2">
 <Label htmlFor="v-email" className="font-semibold">Email <span className="text-destructive">*</span></Label>
 <Input id="v-email" type="email" placeholder="you@example.com" {...register("email")} />
 {errors.email && (
 <p className="text-xs text-destructive flex items-center gap-1">
 <FaExclamationTriangle className="w-3 h-3" /> {errors.email.message}
 </p>
 )}
 </div>
 <div className="space-y-2">
 <Label htmlFor="v-phone" className="font-semibold">Phone <span className="text-destructive">*</span></Label>
 <Input id="v-phone" type="tel" placeholder="+1 234 567 8900" {...register("phone")} />
 {errors.phone && (
 <p className="text-xs text-destructive flex items-center gap-1">
 <FaExclamationTriangle className="w-3 h-3" /> {errors.phone.message}
 </p>
 )}
 </div>
 </div>

 {/* Skills */}
 <div className="space-y-2">
 <Label className="font-semibold">Your Skills <span className="text-destructive">*</span></Label>
 <div className="grid grid-cols-5 gap-2">
 {SKILLS.map(({ value, emoji, label }) => (
 <button
 key={value}
 type="button"
 onClick={() => toggleSkill(value)}
 className={cn(
 "flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-xs transition-all active:scale-95",
 selectedSkills.includes(value)
 ? "border-primary bg-primary/10 text-primary"
 : "border-muted hover:border-primary/50"
 )}
 >
 <span className="text-xl">{emoji}</span>
 <span>{label}</span>
 </button>
 ))}
 </div>
 {errors.skills && (
 <p className="text-xs text-destructive flex items-center gap-1">
 <FaExclamationTriangle className="w-3 h-3" /> {errors.skills.message}
 </p>
 )}
 </div>

 {/* Availability */}
 <div className="space-y-2">
 <Label className="font-semibold">Availability <span className="text-destructive">*</span></Label>
 <div className="grid grid-cols-2 gap-2">
 {AVAILABILITY.map(({ value, label }) => (
 <button
 key={value}
 type="button"
 onClick={() => setValue("availability", value, { shouldValidate: true })}
 className={cn(
 "py-2.5 rounded-xl border-2 text-sm transition-all active:scale-95",
 selectedAvailability === value
 ? "border-primary bg-primary/10 text-primary"
 : "border-muted hover:border-primary/50"
 )}
 >
 {label}
 </button>
 ))}
 </div>
 {errors.availability && (
 <p className="text-xs text-destructive flex items-center gap-1">
 <FaExclamationTriangle className="w-3 h-3" /> {errors.availability.message}
 </p>
 )}
 </div>

 {/* Message */}
 <div className="space-y-2">
 <Label htmlFor="v-message" className="font-semibold">
 Message <span className="text-xs text-muted-foreground font-normal">(optional)</span>
 </Label>
 <Textarea
 id="v-message"
 placeholder="Tell us about your experience or anything else..."
 className="min-h-20 resize-none"
 {...register("message")}
 />
 {errors.message && (
 <p className="text-xs text-destructive flex items-center gap-1">
 <FaExclamationTriangle className="w-3 h-3" /> {errors.message.message}
 </p>
 )}
 </div>

 <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
 {isSubmitting ? (
 <><FaSpinner className="w-4 h-4 mr-2 animate-spin" /> Registering...</>
 ) : (
 "🐾 Register as Volunteer"
 )}
 </Button>
 </form>
 );
}
