"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaExclamationTriangle, FaPhone, FaCheckCircle, FaShareAlt, FaCommentAlt, FaPaperPlane } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mock data for the example
const MOCK_RESCUE = {
 id: "1",
 animalType: "cat",
 title: "Injured Stray Cat",
 severity: "critical",
 condition: "Injured stray cat with visible wounds near Downtown Alley. Seems very scared and needs immediate medical attention.",
 locationInfo: "Downtown Alley, near 5th Ave",
 distance: "0.5m",
 reporterName: "John D.",
 phone: "+1 555-0199",
 images: ["https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=600"],
 status: "pending",
 createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
};

export default function RescueDetailPage({ params }: { params: Promise<{ id: string }> }) {
 const rescue = MOCK_RESCUE;
 const [isMessageOpen, setIsMessageOpen] = useState(false);

 const handleShare = async () => {
 if (navigator.share) {
 try {
 await navigator.share({
 title: 'Emergency Animal Rescue Request',
 text: rescue.condition,
 url: window.location.href,
 });
 } catch (err) {
 console.error('Error sharing:', err);
 }
 } else {
 alert("Sharing is not supported on this browser.");
 }
 };

 return (
 <div className="flex flex-col flex-1 bg-muted/10 pb-20 animate-in fade-in duration-500">
 {/* Header Image */}
 <div className="relative h-64 w-full bg-muted">
 <Image
 src={rescue.images[0]}
 alt={rescue.title}
 fill
 className="object-cover"
 unoptimized
 />
 <div className="absolute top-4 left-4 z-10">
 <Link href="/rescues">
 <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-background/80 backdrop-blur">
 <FaArrowLeft className="w-5 h-5" />
 </Button>
 </Link>
 </div>
 <div className="absolute top-4 right-4 z-10 flex gap-2">
 <Badge variant="destructive" className="shadow-md text-xs px-2 py-1 uppercase tracking-wider">
 {rescue.severity}
 </Badge>
 </div>
 </div>

 <div className="flex flex-col p-5 gap-6 -mt-6 bg-background rounded-t-3xl relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
 
 {/* Title & Status */}
 <div className="flex justify-between items-start gap-4">
 <div>
 <h1 className="text-2xl font-semibold leading-tight">{rescue.title}</h1>
 <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1.5 ">
 <FaClock className="w-4 h-4" /> 30 mins ago
 </p>
 </div>
 <div className="flex flex-col items-end">
 <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Status</span>
 <span className="flex items-center gap-1 text-sm font-semibold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">
 <FaExclamationTriangle className="w-4 h-4" /> Pending
 </span>
 </div>
 </div>

 {/* Location */}
 <div className="flex items-start gap-3 p-3.5 bg-muted/30 rounded-xl border border-muted/50">
 <div className="bg-primary/10 p-2 rounded-full">
 <FaMapMarkerAlt className="w-5 h-5 text-primary" />
 </div>
 <div className="flex flex-col">
 <span className="text-sm font-semibold">{rescue.locationInfo}</span>
 <span className="text-xs text-muted-foreground">{rescue.distance} away</span>
 </div>
 </div>

 {/* Condition details */}
 <div className="space-y-2.5">
 <h3 className="font-semibold text-lg border-b pb-1">Condition</h3>
 <p className="text-sm leading-relaxed text-muted-foreground">
 {rescue.condition}
 </p>
 </div>

 {/* Reporter Info */}
 <div className="space-y-2.5">
 <h3 className="font-semibold text-lg border-b pb-1">Reported By</h3>
 <div className="flex justify-between items-center bg-card border rounded-xl p-3 shadow-sm">
 <div className="flex flex-col">
 <span className="font-semibold text-sm">{rescue.reporterName}</span>
 </div>
 <div className="flex gap-2">
 <Button variant="outline" size="sm" onClick={() => setIsMessageOpen(true)} className="h-8 gap-1.5 rounded-full border-blue-500/20 text-blue-500 hover:bg-blue-50">
 <FaCommentAlt className="w-3.5 h-3.5" /> Message
 </Button>
 {rescue.phone && (
 <a href={`tel:${rescue.phone}`}>
 <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full border-primary/20 text-primary hover:bg-primary/5">
 <FaPhone className="w-3.5 h-3.5" /> Call
 </Button>
 </a>
 )}
 </div>
 </div>
 </div>

 {/* Actions */}
 <div className="pt-4 flex flex-col gap-3">
 <Button size="lg" className="w-full text-base font-semibold shadow-md h-14 rounded-xl">
 <FaCheckCircle className="w-5 h-5 mr-2" /> Respond to Rescue
 </Button>
 <div className="flex gap-3">
 <Button variant="outline" size="lg" className="flex-1 text-base h-12 rounded-xl">
 View on Map
 </Button>
 <Button variant="outline" size="lg" onClick={handleShare} className="flex-1 text-base h-12 rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-50">
 <FaShareAlt className="w-4 h-4 mr-2" /> Share
 </Button>
 </div>
 </div>
 </div>

 {/* Message Dialog */}
 <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
 <DialogContent className="sm:max-w-md w-[90vw] rounded-2xl">
 <DialogHeader>
 <DialogTitle>Message {rescue.reporterName}</DialogTitle>
 </DialogHeader>
 <div className="flex flex-col gap-4 mt-2">
 <div className="bg-muted/30 border rounded-xl p-3 h-40 flex flex-col justify-end text-sm text-muted-foreground italic text-center pb-8">
 No messages yet.
 </div>
 <div className="flex gap-2">
 <input type="text" placeholder="Type your message..." className="flex-1 border rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
 <Button size="icon" className="rounded-full shrink-0">
 <FaPaperPlane className="w-4 h-4" />
 </Button>
 </div>
 </div>
 </DialogContent>
 </Dialog>
 </div>
 );
}
