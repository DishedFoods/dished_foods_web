"use client";

import { useEffect } from "react";
import { useTheme, ROLE_TO_THEME, type Theme } from "@/context/ThemeContext";

/**
 * Client-side helper that applies a role theme when the containing
 * server-rendered page mounts. Drop into any server component that
 * should force a specific theme context (e.g. /how-it-works/[role]).
 *
 * Restores the previously-persisted theme on unmount so users who arrived
 * with an explicit preference aren't silently overridden after leaving.
 */
export function RoleThemeSetter({ role }: { role: string }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    const next: Theme = ROLE_TO_THEME[role] ?? "customer";
    setTheme(next);
  }, [role, setTheme]);

  return null;
}
