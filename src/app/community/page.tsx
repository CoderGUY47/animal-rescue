import { FaHeart, FaHandsHelping, FaTrophy, FaStar } from "react-icons/fa";

export const metadata = {
  title: "Community Dashboard - Rescue Connect",
};

export default function CommunityPage() {
  return (
    <div className="flex flex-col flex-1 p-4 pb-20 animate-in fade-in duration-500 gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Community Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          See how our local community is making a difference today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-primary/20">
          <FaHeart className="w-6 h-6 text-primary mb-2" />
          <span className="text-2xl font-bold text-primary">1,204</span>
          <span className="text-xs font-semibold uppercase text-primary/80 tracking-wider">Animals Rescued</span>
        </div>
        <div className="bg-amber-500/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-amber-500/20">
          <FaHandsHelping className="w-6 h-6 text-amber-500 mb-2" />
          <span className="text-2xl font-bold text-amber-500">342</span>
          <span className="text-xs font-semibold uppercase text-amber-500/80 tracking-wider">Active Volunteers</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaTrophy className="text-amber-500" /> Top Contributors
        </h2>
        <div className="flex flex-col gap-2">
          {[
            { name: "Sarah Jenkins", rescues: 45, role: "Senior Volunteer" },
            { name: "Michael Chen", rescues: 38, role: "Transport Specialist" },
            { name: "Emma Woods", rescues: 29, role: "Foster Parent" },
          ].map((user, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-card border rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {i + 1}
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-sm">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.role}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold flex items-center gap-1">
                  {user.rescues} <FaStar className="w-3 h-3 text-amber-500" />
                </span>
                <span className="text-[10px] uppercase text-muted-foreground">Rescues</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Nearby Activity</h2>
        <div className="bg-card border rounded-xl p-4 flex flex-col gap-4 shadow-sm">
          <div className="flex items-start gap-3 relative">
            <div className="w-2 h-full absolute left-[11px] top-6 border-l-2 border-dashed border-muted" />
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 z-10">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Dog safely transported to shelter</span>
              <span className="text-xs text-muted-foreground">10 mins ago • Downtown Clinic</span>
            </div>
          </div>
          <div className="flex items-start gap-3 relative">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 z-10">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">New volunteer joined the area!</span>
              <span className="text-xs text-muted-foreground">45 mins ago • Westside</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
