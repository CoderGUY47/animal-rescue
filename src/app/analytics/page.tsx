"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { FaChartLine, FaArrowUp, FaUsers, FaShieldAlt } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks";


// mock data
const monthlyRescues = [
 { month: "Jan", rescues: 45, adopted: 30 },
 { month: "Feb", rescues: 52, adopted: 35 },
 { month: "Mar", rescues: 48, adopted: 40 },
 { month: "Apr", rescues: 61, adopted: 42 },
 { month: "May", rescues: 75, adopted: 50 },
 { month: "Jun", rescues: 80, adopted: 55 },
];

const responseTimeData = [
 { day: "Mon", avgMinutes: 25 },
 { day: "Tue", avgMinutes: 20 },
 { day: "Wed", avgMinutes: 22 },
 { day: "Thu", avgMinutes: 18 },
 { day: "Fri", avgMinutes: 30 },
 { day: "Sat", avgMinutes: 35 },
 { day: "Sun", avgMinutes: 40 },
];

export default function AnalyticsPage() {
 const reports = useAppSelector((state) => state.reports.items);
 const volunteers = useAppSelector((state) => state.volunteers.items);

 const totalRescues = 359 + reports.length;
 const activeVolunteers = 139 + volunteers.length;
 
 const resolvedCount = reports.filter(r => r.status === "resolved").length;
 const avgResponseTime = Math.max(10, 25 - resolvedCount * 2);
 
 const activeCases = reports.filter(r => r.status !== "resolved").length;

 return (
  <div className="flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-20">
  <div className="flex flex-col gap-2">
  <h1 className="text-2xl font-semibold flex items-center gap-2">
  <FaChartLine className="w-6 h-6 text-primary" />
  Community Analytics
  </h1>
  <p className="text-muted-foreground text-sm">
  Tracking our impact and response metrics across the city.
  </p>
  </div>

  {/*////////======= kpi cards start =======\\\\\\\\\*/}
  <div className="grid grid-cols-2 gap-3">
  <Card>
  <CardContent className="p-4 flex flex-col gap-1">
  <FaArrowUp className="w-5 h-5 text-green-500 mb-1" />
  <span className="text-2xl font-semibold">{totalRescues}</span>
  <span className="text-xs text-muted-foreground">Total Rescues (YTD)</span>
  </CardContent>
  </Card>
  <Card>
  <CardContent className="p-4 flex flex-col gap-1">
  <FaUsers className="w-5 h-5 text-blue-500 mb-1" />
  <span className="text-2xl font-semibold">{activeVolunteers}</span>
  <span className="text-xs text-muted-foreground">Active Volunteers</span>
  </CardContent>
  </Card>
  <Card>
  <CardContent className="p-4 flex flex-col gap-1">
  <FaShieldAlt className="w-5 h-5 text-amber-500 mb-1" />
  <span className="text-2xl font-semibold">{avgResponseTime}m</span>
  <span className="text-xs text-muted-foreground">Avg Response Time</span>
  </CardContent>
  </Card>
  <Card>
  <CardContent className="p-4 flex flex-col gap-1">
  <FaChartLine className="w-5 h-5 text-red-500 mb-1" />
  <span className="text-2xl font-semibold">{activeCases}</span>
  <span className="text-xs text-muted-foreground">Active Cases</span>
  </CardContent>
  </Card>
  </div>

 {/*////////======= charts start =======\\\\\\\\\*/}
 <div className="flex flex-col gap-5">
 
 {/* monthly rescues chart */}
 <Card className="overflow-hidden">
 <CardHeader className="p-4 pb-2">
 <CardTitle className="text-sm text-muted-foreground font-semibold">Monthly Rescues & Adoptions</CardTitle>
 </CardHeader>
 <CardContent className="p-0 h-64 mt-2">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={monthlyRescues} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
 <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
 <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
 <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
 <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
 <Bar dataKey="rescues" name="Total Rescues" fill="#3b82f6" radius={[4, 4, 0, 0]} />
 <Bar dataKey="adopted" name="Adopted" fill="#10b981" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </CardContent>
 </Card>

 {/* response time chart */}
 <Card className="overflow-hidden">
 <CardHeader className="p-4 pb-2">
 <CardTitle className="text-sm text-muted-foreground font-semibold">Avg Response Time (Minutes)</CardTitle>
 </CardHeader>
 <CardContent className="p-0 h-64 mt-2">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={responseTimeData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
 <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
 <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
 <Line type="monotone" dataKey="avgMinutes" name="Minutes" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
 </LineChart>
 </ResponsiveContainer>
 </CardContent>
 </Card>
 
 </div>
 { /*\\\\\\\\======= charts end =======/////////*/}
 </div>
 );
}
