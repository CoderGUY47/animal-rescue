import { VolunteerForm } from "@/components/forms/volunteer-form";
import { FaHandsHelping } from "react-icons/fa";

export const metadata = {
 title: "Volunteer Registration - Rescue Connect",
};

export default function VolunteerPage() {
 return (
 <div className="flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-20">
 <div className="flex flex-col gap-2">
 <h1 className="text-2xl font-semibold flex items-center gap-2">
 <FaHandsHelping className="w-6 h-6 text-primary" />
 Become a Volunteer
 </h1>
 <p className="text-muted-foreground text-sm">
 Join our community of animal lovers. Offer your skills to help animals in need around your area.
 </p>
 </div>

 <div className="bg-card border rounded-xl p-4 shadow-sm">
 <VolunteerForm />
 </div>
 </div>
 );
}
