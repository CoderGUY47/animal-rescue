"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FaArrowLeft, FaMapMarkerAlt, FaEye, FaTrash, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function PrivacyPage() {
  const [locationSharing, setLocationSharing] = useState(true);
  const [anonymousReports, setAnonymousReports] = useState(false);
  const [dataAnalytics, setDataAnalytics] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  return (
    <div className="flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="w-8 h-8 flex items-center justify-center rounded-full border hover:bg-muted transition-colors"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Privacy & Security</h1>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FaMapMarkerAlt className="w-3.5 h-3.5" /> Location
        </h3>
        <Card>
          <CardContent className="p-0">
            {[
              {
                id: "location-sharing",
                label: "Share My Location",
                desc: "Allow the app to use your GPS for reports",
                value: locationSharing,
                set: setLocationSharing,
              },
              {
                id: "anonymous-reports",
                label: "Anonymous Reporting",
                desc: "Submit reports without revealing your name",
                value: anonymousReports,
                set: setAnonymousReports,
              },
            ].map((item, i, arr) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 ${i < arr.length - 1 ? "border-b" : ""}`}
              >
                <Label htmlFor={item.id} className="flex flex-col cursor-pointer">
                  <span className="font-semibold text-sm">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </Label>
                <Switch id={item.id} checked={item.value} onCheckedChange={item.set} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Data & Visibility */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FaEye className="w-3.5 h-3.5" /> Data & Visibility
        </h3>
        <Card>
          <CardContent className="p-0">
            {[
              {
                id: "data-analytics",
                label: "Usage Analytics",
                desc: "Help improve the app with anonymous data",
                value: dataAnalytics,
                set: setDataAnalytics,
              },
              {
                id: "public-profile",
                label: "Public Rescue Profile",
                desc: "Let other rescuers see your activity",
                value: publicProfile,
                set: setPublicProfile,
              },
            ].map((item, i, arr) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 ${i < arr.length - 1 ? "border-b" : ""}`}
              >
                <Label htmlFor={item.id} className="flex flex-col cursor-pointer">
                  <span className="font-semibold text-sm">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </Label>
                <Switch id={item.id} checked={item.value} onCheckedChange={item.set} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FaShieldAlt className="w-3.5 h-3.5" /> Security
        </h3>
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Animal Rescue Connect stores only the data necessary for rescue coordination. Your location data is never sold or shared with third parties. Reports submitted are visible only to verified rescue volunteers.
              </p>
            </div>
            <button className="w-full flex items-center gap-3 p-4 text-destructive hover:bg-destructive/5 transition-colors">
              <FaTrash className="w-4 h-4" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">Delete All My Data</span>
                <span className="text-xs opacity-70">Permanently removes your reports and history</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
