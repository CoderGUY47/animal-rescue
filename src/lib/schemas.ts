import * as z from "zod";

// ─── Emergency Report Schema ─────────────────────────────────────────────────
export const reportSchema = z.object({
 animalType: z.enum(["dog", "cat", "bird", "rabbit", "other"], {
 error: "Please select an animal type",
 }),
 animalTypeOther: z.string().optional(),
 severity: z.enum(["critical", "moderate", "low"], {
 error: "Please select a severity level",
 }),
 condition: z
 .string()
 .min(10, "Please describe the condition in at least 10 characters")
 .max(500, "Description is too long (max 500 characters)"),
 locationInfo: z
 .string()
 .min(5, "Please describe the location (street, landmarks, etc.)")
 .max(200, "Location description is too long"),
 reporterName: z
 .string()
 .min(2, "Please enter your name")
 .max(60, "Name is too long"),
 reporterPhone: z
 .string()
 .regex(/^[+]?[\d\s\-()]{7,15}$/, "Please enter a valid phone number")
 .optional()
 .or(z.literal("")),
});

export type ReportFormValues = z.infer<typeof reportSchema>;

// ─── Volunteer Registration Schema ───────────────────────────────────────────
export const volunteerSchema = z.object({
 name: z.string().min(2, "Name must be at least 2 characters"),
 email: z.string().email("Please enter a valid email address"),
 phone: z
 .string()
 .regex(/^[+]?[\d\s\-()]{7,15}$/, "Please enter a valid phone number"),
 skills: z
 .array(z.enum(["transport", "foster", "medical", "rescue", "feeding"]))
 .min(1, "Please select at least one skill"),
 availability: z.enum(["weekdays", "weekends", "both", "on-call"], {
 error: "Please select your availability",
 }),
 message: z.string().max(300, "Message is too long (max 300 characters)").optional(),
});

export type VolunteerFormValues = z.infer<typeof volunteerSchema>;
