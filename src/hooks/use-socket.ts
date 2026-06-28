"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "@/store/hooks";
import { addReport, updateStatus } from "@/store/slices/reportsSlice";
import { registerVolunteer } from "@/store/slices/volunteersSlice";
import { toast } from "react-toastify";

export function useSocket() {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    
    // Connect to Socket.io server
    const socket = io(socketUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WebSocket connected to:", socketUrl);
    });

    socket.on("connect_error", (err) => {
      console.warn("WebSocket connection failed (server offline). Using offline simulation.", err);
    });

    // Listen for new rescues reported by other users
    socket.on("caseCreated", (newCase: any) => {
      dispatch(addReport(newCase));
      toast.info(`🚨 New Emergency: ${newCase.animalType} reported nearby!`);
    });

    // Listen for status updates
    socket.on("caseUpdated", ({ id, status }: { id: string; status: any }) => {
      dispatch(updateStatus({ id, status }));
      toast.info(`🐾 Case status updated to: ${status}`);
    });

    // Listen for volunteer registrations
    socket.on("volunteerJoined", (newVol: any) => {
      dispatch(registerVolunteer(newVol));
      toast.success(`🤝 New Volunteer registered: ${newVol.name}!`);
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const emitNewCase = (newCase: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("createCase", newCase);
    }
  };

  const emitCaseUpdate = (id: string, status: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("updateCase", { id, status });
    }
  };

  return {
    emitNewCase,
    emitCaseUpdate,
  };
}
