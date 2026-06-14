import { io, type Socket } from "socket.io-client";

// ─── Singleton socket instance ────────────────────────────────────────────────
// This ensures we only create one connection across the entire app.
let socket: Socket | null = null;

export function getSocket(): Socket {
 if (!socket) {
 socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000", {
 autoConnect: false, // we connect manually when needed
 reconnectionAttempts: 5,
 reconnectionDelay: 2000,
 transports: ["websocket"],
 });
 }
 return socket;
}

export function connectSocket() {
 const s = getSocket();
 if (!s.connected) s.connect();
 return s;
}

export function disconnectSocket() {
 if (socket?.connected) {
 socket.disconnect();
 }
}

// event name constants
export const SOCKET_EVENTS = {
 NEW_REPORT: "new_report", // server broadcasts when new rescue submitted
 STATUS_UPDATE: "status_update", // server broadcasts when rescue status changes
 JOIN_ROOM: "join_room", // client joins a rescue-specific room
 LEAVE_ROOM: "leave_room",
} as const;
