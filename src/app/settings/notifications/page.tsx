"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FaArrowLeft, FaBell, FaMapMarkerAlt, FaEnvelope, FaMobileAlt } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function NotificationsPage() {
  const [rescueAlerts, setRescueAlerts] = useState(true);
  const [nearbyReports, setNearbyReports] = useState(true);
  const [volunteerUpdates, setVolunteerUpdates] = useState(false);
  const [emailDigest, setEmailDigest] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [appSounds, setAppSounds] = useState(true);

  return (
    <div className="flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
      </div>

      {/* Push Notifications */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FaBell className="w-3.5 h-3.5" /> Push Notifications
        </h3>
        <Card>
          <CardContent className="p-0">
            {[
              {
                id: "rescue-alerts",
                label: "Rescue Alerts",
                desc: "Notify when a rescue is confirmed nearby",
                value: rescueAlerts,
                set: setRescueAlerts,
              },
              {
                id: "nearby-reports",
                label: "Nearby Reports",
                desc: "New animal reports within 5 km",
                value: nearbyReports,
                set: setNearbyReports,
              },
              {
                id: "volunteer-updates",
                label: "Volunteer Updates",
                desc: "Status updates on cases you joined",
                value: volunteerUpdates,
                set: setVolunteerUpdates,
              },
            ].map((item, i, arr) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 ${i < arr.length - 1 ? "border-b" : ""}`}
              >
                <Label htmlFor={item.id} className="flex flex-col items-start cursor-pointer text-left">
                  <span className="font-semibold text-sm">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </Label>
                <Switch
                  id={item.id}
                  checked={item.value}
                  onCheckedChange={item.set}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Other Channels */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FaEnvelope className="w-3.5 h-3.5" /> Other Channels
        </h3>
        <Card>
          <CardContent className="p-0">
            {[
              {
                id: "email-digest",
                icon: <FaEnvelope className="w-4 h-4 text-blue-500" />,
                label: "Email Digest",
                desc: "Weekly summary of rescue activity",
                value: emailDigest,
                set: setEmailDigest,
              },
              {
                id: "sms-alerts",
                icon: <FaMobileAlt className="w-4 h-4 text-green-500" />,
                label: "SMS Alerts",
                desc: "Critical emergencies via text message",
                value: smsAlerts,
                set: setSmsAlerts,
              },
              {
                id: "app-sounds",
                icon: <FaMapMarkerAlt className="w-4 h-4 text-amber-500" />,
                label: "Sound & Vibration",
                desc: "Play sound for incoming alerts",
                value: appSounds,
                set: setAppSounds,
              },
            ].map((item, i, arr) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 ${i < arr.length - 1 ? "border-b" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {item.icon}
                  </div>
                  <Label htmlFor={item.id} className="flex flex-col items-start cursor-pointer text-left">
                    <span className="font-semibold text-sm">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </Label>
                </div>
                <Switch
                  id={item.id}
                  checked={item.value}
                  onCheckedChange={item.set}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
