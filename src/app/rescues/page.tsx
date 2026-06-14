"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

export default function RescuesListPage() {
 const reports = useAppSelector((state) => state.reports.items);

 return (
 <div className="flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-20">
 <div className="flex flex-col gap-2">
 <h1 className="text-2xl font-semibold flex items-center gap-2">
 Active Rescues
 </h1>
 <p className="text-muted-foreground text-sm">
 Animals nearby that need immediate help. Click on a rescue to view details.
 </p>
 </div>

 <div className="flex flex-col gap-4">
 {reports.length === 0 ? (
 <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed">
 <p className="text-muted-foreground text-sm">No active rescues found.</p>
 </div>
 ) : (
 reports.map((rescue) => (
 <Link key={rescue.id} href={`/rescues/${rescue.id}`}>
 <div className="flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform">
 <div className="relative h-40 w-full bg-muted">
 {rescue.images && rescue.images.length > 0 ? (
 <Image
 src={rescue.images[0]}
 alt="Rescue animal"
 fill
 className="object-cover"
 unoptimized
 />
 ) : (
 <div className="flex items-center justify-center h-full w-full bg-muted">
 <span className="text-muted-foreground text-sm">No Image</span>
 </div>
 )}
 <div className="absolute top-2 right-2">
 <Badge variant={rescue.severity === "critical" ? "destructive" : rescue.severity === "moderate" ? "default" : "secondary"} className="shadow-md text-[10px] uppercase tracking-wider">
 {rescue.severity}
 </Badge>
 </div>
 </div>
 
 <div className="p-3 flex flex-col gap-2">
 <div className="flex justify-between items-start">
 <h3 className="font-semibold truncate pr-2 capitalize">{rescue.animalType} in need</h3>
 <span className="text-[10px] text-muted-foreground flex items-center gap-1 whitespace-nowrap">
 <FaClock className="w-3 h-3" /> Just now
 </span>
 </div>
 
 <div className="flex items-center gap-1 text-xs text-muted-foreground">
 <FaMapMarkerAlt className="w-3.5 h-3.5 text-primary" />
 <span className="truncate">{rescue.locationInfo}</span>
 </div>
 
 <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
 {rescue.condition}
 </p>

 <div className="mt-2 pt-2 border-t flex justify-between items-center">
 <span className="text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
 <FaExclamationTriangle className="w-3 h-3" /> {rescue.status}
 </span>
 <span className="text-xs text-primary font-semibold">View Details &rarr;</span>
 </div>
 </div>
 </div>
 </Link>
 ))
 )}
 </div>
 </div>
 );
}
