"use client";

import { useEffect } from "react";

/**
 * Eagerly requests location permission as soon as the app mounts.
 * This pre-warms the browser prompt so the map page doesn't stall.
 */
export function useEagerLocation() {
  useEffect(() => {
    if (!navigator.geolocation) return;

    // Silently probe — just triggers the permission dialog early
    navigator.geolocation.getCurrentPosition(
      () => {}, // success: already handled in map-view
      () => {}, // error: no-op, map has its own fallback
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);
}
