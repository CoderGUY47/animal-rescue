import { ReportForm } from '@/components/forms/report-form';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
 title: 'Report Emergency - Rescue Connect',
};

export default function ReportPage() {
 return (
 <div className="flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-20">
 <div className="flex flex-col gap-2">
 <h1 className="text-2xl font-semibold flex items-center gap-2">
 <ShieldAlert className="w-6 h-6 text-destructive" />
 Report Emergency
 </h1>
 <p className="text-muted-foreground text-sm">
 Please provide details about the animal in distress. Your location will be attached.
 </p>
 </div>

 <div className="bg-card border rounded-xl p-4 shadow-sm">
 <ReportForm />
 </div>
 </div>
 );
}
