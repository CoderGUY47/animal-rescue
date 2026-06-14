"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MdPets } from 'react-icons/md';
import { FaBell, FaPaw, FaExclamationTriangle, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    icon: <FaExclamationTriangle className="w-4 h-4 text-rose-500" />,
    bg: "bg-rose-100 dark:bg-rose-900/30",
    title: "New Emergency Report",
    desc: "Injured dog spotted near City Park",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: <FaCheckCircle className="w-4 h-4 text-green-500" />,
    bg: "bg-green-100 dark:bg-green-900/30",
    title: "Rescue Confirmed",
    desc: "Volunteer en route for case #1042",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 3,
    icon: <FaPaw className="w-4 h-4 text-amber-500" />,
    bg: "bg-amber-100 dark:bg-amber-900/30",
    title: "Nearby Animal Spotted",
    desc: "Stray cat reported 0.8 km away",
    time: "1 hr ago",
    unread: false,
  },
  {
    id: 4,
    icon: <FaCheckCircle className="w-4 h-4 text-blue-500" />,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    title: "Report Submitted",
    desc: "Your report #1043 was received",
    time: "3 hr ago",
    unread: false,
  },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const showBack = pathname !== '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 max-w-md mx-auto">
        <div className="flex items-center gap-1.5">
          {showBack && (
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className={`p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none`}
            >
              <FaArrowLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <MdPets className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">RescueConnect</span>
          </Link>
        </div>

        <Dialog>
          <DialogTrigger
            aria-label="Notifications"
            className={`relative p-2 ${buttonVariants({ variant: 'ghost', size: 'icon-sm' })}`}
          >
            <FaBell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            </span>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-sm gap-0 overflow-hidden">
            <DialogHeader className="px-4 pt-4 pb-3 border-b">
              <div className="flex items-center justify-between pr-6">
                <DialogTitle className="text-base font-semibold">Notifications</DialogTitle>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  2 unread
                </span>
              </div>
            </DialogHeader>
            <div className="flex flex-col divide-y max-h-[420px] overflow-y-auto">
              {MOCK_NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${n.unread ? "bg-primary/5" : "hover:bg-muted/50"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.bg}`}>
                    {n.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm truncate">{n.title}</span>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                    </div>
                    <span className="text-xs text-muted-foreground leading-snug">{n.desc}</span>
                    <span className="text-[10px] text-muted-foreground/70 mt-0.5">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t">
              <button className="w-full text-xs text-primary font-semibold text-center hover:underline">
                Mark all as read
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
