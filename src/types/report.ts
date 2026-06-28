// domain types for rescue reports — shared across store and ui
export type Severity = "critical" | "moderate" | "low";

export type RescueReport = {
  id: string;
  animalType: string;
  severity: Severity;
  condition: string;
  locationInfo: string;
  lat?: number;
  lng?: number;
  reporterName: string;
  reporterPhone?: string;
  images: string[];
  status: "pending" | "in-progress" | "resolved";
  createdAt: string;
};
