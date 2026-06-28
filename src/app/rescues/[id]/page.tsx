"use client";

import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaClock, FaExclamationTriangle, FaPhone, FaCheckCircle, FaShareAlt, FaCommentAlt, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, use } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateStatus } from "@/store/slices/reportsSlice";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

export default function RescueDetailPage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = use(params);
 const dispatch = useAppDispatch();
 const reports = useAppSelector((state) => state.reports.items);
 const rescue = reports.find((r) => r.id === id);

 const [isMessageOpen, setIsMessageOpen] = useState(false);
 const [chatText, setChatText] = useState("");
 const [messages, setMessages] = useState<string[]>([]);

 if (!rescue) {
  return (
   <div className="flex flex-col items-center justify-center flex-1 p-8 text-center gap-4">
    <FaExclamationTriangle className="w-12 h-12 text-destructive" />
    <h2 className="text-xl font-bold">Rescue Case Not Found</h2>
    <p className="text-muted-foreground text-sm max-w-xs">
     The rescue request you are looking for does not exist or has been removed.
    </p>
    <Link href="/rescues">
     <Button>Back to Active Rescues</Button>
    </Link>
   </div>
  );
 }

 const handleUpdateStatus = (newStatus: "pending" | "in-progress" | "resolved") => {
  dispatch(updateStatus({ id: rescue.id, status: newStatus }));
  toast.success(`🐾 Status updated to "${newStatus}"`);
 };

 const handleSendMessage = (e: React.FormEvent) => {
  e.preventDefault();
  if (!chatText.trim()) return;
  setMessages((prev) => [...prev, chatText.trim()]);
  setChatText("");
  toast.success("Message simulated successfully!");
 };

 const handleShare = async () => {
  if (navigator.share) {
   try {
    await navigator.share({
     title: `Emergency Animal Rescue: ${rescue.animalType}`,
     text: rescue.condition,
     url: window.location.href,
    });
   } catch (err) {
    console.error('Error sharing:', err);
   }
  } else {
   // Fallback copy to clipboard
   try {
     await navigator.clipboard.writeText(window.location.href);
     toast.success("Link copied to clipboard!");
   } catch {
     toast.error("Sharing is not supported on this browser.");
   }
  }
 };

 return (
  <div className="flex flex-col flex-1 bg-muted/10 pb-20 animate-in fade-in duration-500">
   {/* header image */}
   <div className="relative h-64 w-full bg-muted">
    {rescue.images && rescue.images.length > 0 ? (
     <Image
      src={rescue.images[0]}
      alt={`${rescue.animalType} rescue`}
      fill
      className="object-cover"
      unoptimized
     />
    ) : (
     <div className="w-full h-full bg-muted flex items-center justify-center">
      <span className="text-muted-foreground font-semibold">No Image Provided</span>
     </div>
    )}
    <div className="absolute top-4 right-4 z-10 flex gap-2">
     <Badge variant={rescue.severity === "critical" ? "destructive" : rescue.severity === "moderate" ? "default" : "secondary"} className="shadow-md text-xs px-2 py-1 uppercase tracking-wider">
      {rescue.severity}
     </Badge>
    </div>
   </div>

   <div className="flex flex-col p-5 gap-6 -mt-6 bg-background rounded-t-3xl relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
    
    {/* title & status */}
    <div className="flex justify-between items-start gap-4">
     <div>
      <h1 className="text-2xl font-semibold leading-tight capitalize">{rescue.animalType} in distress</h1>
      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1.5 ">
       <FaClock className="w-4 h-4" /> {new Date(rescue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
     </div>
     <div className="flex flex-col items-end">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Status</span>
      <span className={cn(
       "flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full capitalize",
       rescue.status === "pending" && "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
       rescue.status === "in-progress" && "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
       rescue.status === "resolved" && "text-green-500 bg-green-50 dark:bg-green-500/10"
      )}>
       {rescue.status === "pending" && <FaExclamationTriangle className="w-3.5 h-3.5" />}
       {rescue.status === "in-progress" && <FaSpinner className="w-3.5 h-3.5 animate-spin" />}
       {rescue.status === "resolved" && <FaCheckCircle className="w-3.5 h-3.5" />}
       {rescue.status}
      </span>
     </div>
    </div>

    {/* location */}
    <div className="flex items-start gap-3 p-3.5 bg-muted/30 rounded-xl border border-muted/50">
     <div className="bg-primary/10 p-2 rounded-full">
      <FaMapMarkerAlt className="w-5 h-5 text-primary" />
     </div>
     <div className="flex flex-col">
      <span className="text-sm font-semibold">{rescue.locationInfo}</span>
      {rescue.lat && rescue.lng && (
        <span className="text-[10px] text-muted-foreground font-mono">GPS: {rescue.lat.toFixed(4)}, {rescue.lng.toFixed(4)}</span>
      )}
     </div>
    </div>

    {/* condition details */}
    <div className="space-y-2.5">
     <h3 className="font-semibold text-lg border-b pb-1">Condition</h3>
     <p className="text-sm leading-relaxed text-muted-foreground">
      {rescue.condition}
     </p>
    </div>

    {/* reporter info */}
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
       {rescue.reporterPhone && (
        <a href={`tel:${rescue.reporterPhone}`}>
         <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full border-primary/20 text-primary hover:bg-primary/5">
          <FaPhone className="w-3.5 h-3.5" /> Call
         </Button>
        </a>
       )}
      </div>
     </div>
    </div>

    {/* actions */}
    <div className="pt-4 flex flex-col gap-3">
     {rescue.status === "pending" && (
      <Button 
       size="lg" 
       onClick={() => handleUpdateStatus("in-progress")}
       className="w-full text-base font-semibold shadow-md h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
      >
       <FaSpinner className="w-4 h-4 mr-2 animate-spin" /> Respond to Rescue
      </Button>
     )}
     {rescue.status === "in-progress" && (
      <Button 
       size="lg" 
       onClick={() => handleUpdateStatus("resolved")}
       className="w-full text-base font-semibold shadow-md h-14 rounded-xl bg-green-600 hover:bg-green-700 text-white"
      >
       <FaCheckCircle className="w-5 h-5 mr-2" /> Mark as Resolved
      </Button>
     )}
     {rescue.status === "resolved" && (
      <div className="w-full bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 py-3.5 px-4 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
       <FaCheckCircle className="w-5 h-5" /> This rescue has been successfully resolved.
      </div>
     )}

     <div className="flex gap-3">
      {rescue.lat && rescue.lng ? (
       <Link href={`/map?lat=${rescue.lat}&lng=${rescue.lng}`} className="flex-1">
        <Button variant="outline" size="lg" className="w-full text-base h-12 rounded-xl">
         View on Map
        </Button>
       </Link>
      ) : (
       <Link href="/map" className="flex-1">
        <Button variant="outline" size="lg" className="w-full text-base h-12 rounded-xl">
         View on Map
        </Button>
       </Link>
      )}
      <Button variant="outline" size="lg" onClick={handleShare} className="flex-1 text-base h-12 rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-50">
       <FaShareAlt className="w-4 h-4 mr-2" /> Share
      </Button>
     </div>
    </div>
   </div>

   {/* message dialog */}
   <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
    <DialogContent className="sm:max-w-md w-[90vw] rounded-2xl">
     <DialogHeader>
      <DialogTitle>Message {rescue.reporterName}</DialogTitle>
     </DialogHeader>
     <div className="flex flex-col gap-4 mt-2">
      <div className="bg-muted/30 border rounded-xl p-3 h-40 flex flex-col gap-2 overflow-y-auto justify-end text-sm">
       {messages.length === 0 ? (
         <div className="text-muted-foreground italic text-center pb-8">No messages yet.</div>
       ) : (
         messages.map((msg, i) => (
           <div key={i} className="bg-primary text-primary-foreground self-end px-3 py-1.5 rounded-2xl rounded-tr-none max-w-[80%]">
             {msg}
           </div>
         ))
       )}
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
       <input 
        type="text" 
        value={chatText}
        onChange={(e) => setChatText(e.target.value)}
        placeholder="Type your message..." 
        className="flex-1 border rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
       />
       <Button size="icon" type="submit" className="rounded-full shrink-0">
        <FaPaperPlane className="w-4 h-4" />
       </Button>
      </form>
     </div>
    </DialogContent>
   </Dialog>
  </div>
 );
}

