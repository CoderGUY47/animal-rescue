"use client";

import { useEagerLocation } from "@/hooks/use-eager-location";

/**
 * Invisible client component that triggers eager permission requests.
 * Mounted in the root layout so permissions are requested immediately.
 */
export function PermissionBootstrap() {
  useEagerLocation();
  return null;
}
