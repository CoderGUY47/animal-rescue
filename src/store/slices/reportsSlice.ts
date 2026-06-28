import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Severity, RescueReport } from "@/types";

type ReportsState = {
 items: RescueReport[];
 loading: boolean;
 error: string | null;
};

const DEFAULT_REPORTS: RescueReport[] = [
 {
 id: "1",
 animalType: "cat",
 severity: "critical",
 condition: "Injured stray cat with visible wounds near Downtown Alley.",
 locationInfo: "Downtown Alley, near 5th Ave",
 lat: 40.7128,
 lng: -74.006,
 reporterName: "John D.",
 reporterPhone: "+1 555-0199",
 images: ["https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=400"],
 status: "pending",
 createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
 },
 {
 id: "2",
 animalType: "dog",
 severity: "moderate",
 condition: "Abandoned puppy found near City Park, appears healthy but malnourished.",
 locationInfo: "City Park, North Gate",
 lat: 40.7228,
 lng: -73.996,
 reporterName: "Sara M.",
 reporterPhone: "+1 555-0211",
 images: ["https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=400"],
 status: "in-progress",
 createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 min ago
 },
];

const loadReports = (): RescueReport[] => {
 if (typeof window === "undefined") return DEFAULT_REPORTS;
 try {
 const saved = localStorage.getItem("rescue_reports");
 return saved ? JSON.parse(saved) : DEFAULT_REPORTS;
 } catch {
 return DEFAULT_REPORTS;
 }
};

const initialState: ReportsState = {
 items: loadReports(),
 loading: false,
 error: null,
};

const reportsSlice = createSlice({
 name: "reports",
 initialState,
 reducers: {
 addReport(state, action: PayloadAction<Omit<RescueReport, "id" | "createdAt" | "status">>) {
 state.items.unshift({
 ...action.payload,
 id: crypto.randomUUID(),
 status: "pending",
 createdAt: new Date().toISOString(),
 });
 if (typeof window !== "undefined") {
 localStorage.setItem("rescue_reports", JSON.stringify(state.items));
 }
 },
 updateStatus(state, action: PayloadAction<{ id: string; status: RescueReport["status"] }>) {
 const report = state.items.find((r) => r.id === action.payload.id);
 if (report) {
 report.status = action.payload.status;
 if (typeof window !== "undefined") {
 localStorage.setItem("rescue_reports", JSON.stringify(state.items));
 }
 }
 },
 setLoading(state, action: PayloadAction<boolean>) {
 state.loading = action.payload;
 },
 setError(state, action: PayloadAction<string | null>) {
 state.error = action.payload;
 },
 },
});

export const { addReport, updateStatus, setLoading, setError } = reportsSlice.actions;
export default reportsSlice.reducer;
