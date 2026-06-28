"use client";

import { useEffect } from "react";
import { useEagerLocation } from "@/hooks/use-eager-location";
import { useSocket } from "@/hooks/use-socket";

// this component runs on mount to request location permission early
// and also applies site-wide security protections
export function PermissionBootstrap() {
  useEagerLocation();
  useSocket();

  useEffect(() => {
    /*////////======= disable right-click context menu start =======\\\\\\\\\*/
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    /*\\\\\\\\======= disable right-click context menu end =======/////////*/

    /*////////======= disable common inspect keyboard shortcuts start =======\\\\\\\\\*/
    const handleKeyDown = (e: KeyboardEvent) => {
      // block F12 (devtools)
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }
      // block Ctrl+Shift+I / Cmd+Option+I (devtools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return;
      }
      // block Ctrl+Shift+J / Cmd+Option+J (console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "J") {
        e.preventDefault();
        return;
      }
      // block Ctrl+Shift+C (element inspector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        return;
      }
      // block Ctrl+U (view source)
      if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
        return;
      }
      // block Ctrl+S (save/download page)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        return;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    /*\\\\\\\\======= disable common inspect keyboard shortcuts end =======/////////*/

    /*////////======= disable image drag start =======\\\\\\\\\*/
    const handleDragStart = (e: DragEvent) => e.preventDefault();
    document.addEventListener("dragstart", handleDragStart);
    /*\\\\\\\\======= disable image drag end =======/////////*/

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return null;
}
