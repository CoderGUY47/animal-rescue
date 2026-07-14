import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AppNotification = {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: "report" | "rescue" | "info";
};

type NotificationsState = {
  items: AppNotification[];
};

const loadNotifications = (): AppNotification[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("rescue_notifications");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const save = (items: AppNotification[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("rescue_notifications", JSON.stringify(items));
  }
};

const initialState: NotificationsState = {
  items: loadNotifications(),
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<AppNotification, "id" | "time" | "unread">>) {
      const item: AppNotification = {
        ...action.payload,
        id: crypto.randomUUID(),
        time: (() => {
          const d = new Date();
          const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
          const date = d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
          return `${time} · ${date}`;
        })(),
        unread: true,
      };
      state.items.unshift(item);
      save(state.items);
    },
    markAllRead(state) {
      state.items.forEach((n) => { n.unread = false; });
      save(state.items);
    },
    clearAll(state) {
      state.items = [];
      save(state.items);
    },
  },
});

export const { addNotification, markAllRead, clearAll } = notificationsSlice.actions;
export default notificationsSlice.reducer;
