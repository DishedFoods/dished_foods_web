"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthUser, UserRole } from "@/types";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isAdmin: boolean;
  isCook: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "dished_chef";

/**
 * Write a lightweight presence cookie so middleware can guard routes server-side.
 * The cookie carries NO sensitive data — it is only a boolean presence signal.
 */
function setPresenceCookie(name: string, value: boolean) {
  if (value) {
    document.cookie = `${name}=1; path=/; SameSite=Strict; Max-Age=86400`;
  } else {
    document.cookie = `${name}=; path=/; SameSite=Strict; Max-Age=0`;
  }
}

/**
 * Admin identities are sourced from an environment variable, NOT hardcoded in
 * the bundle. Set NEXT_PUBLIC_ADMIN_USERNAMES as a comma-separated list of
 * lowercase usernames/emails in .env.local (never committed to source control).
 *
 * IMPORTANT: This is a client-side convenience check only. All privileged API
 * routes MUST enforce admin authorization server-side — never rely on this alone.
 */
function buildAdminSet(): Set<string> {
  const raw = process.env.NEXT_PUBLIC_ADMIN_USERNAMES ?? "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

function resolveRole(username: string, email: string): UserRole {
  const adminIdentities = buildAdminSet();
  if (adminIdentities.size === 0) return "cook";
  const u = username.toLowerCase();
  const e = email.toLowerCase();
  if (adminIdentities.has(u) || adminIdentities.has(e)) return "admin";
  return "cook";
}

/**
 * Validate the shape of a stored auth object before trusting it.
 * Prevents prototype pollution or unexpected types from localStorage tampering.
 */
function isValidStoredUser(obj: unknown): obj is AuthUser {
  if (!obj || typeof obj !== "object") return false;
  const u = obj as Record<string, unknown>;
  return (
    typeof u.id === "number" &&
    typeof u.username === "string" &&
    u.username.length > 0 &&
    typeof u.email === "string" &&
    (u.role === "cook" || u.role === "admin")
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as unknown;
        if (!isValidStoredUser(stored)) {
          // Corrupt or tampered entry — clear it
          localStorage.removeItem(STORAGE_KEY);
          setState({ user: null, loading: false });
          return;
        }
        // Re-resolve role on every hydration so env-var changes take effect
        const role = resolveRole(stored.username, stored.email);
        const user: AuthUser = { ...stored, role };
        // Re-sync presence cookies in case they were cleared (e.g. browser restart)
        setPresenceCookie("dished_session", true);
        setPresenceCookie("dished_admin_session", role === "admin");
        setState({ user, loading: false });
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setState({ user: null, loading: false });
    }
  }, []);

  const setUser = useCallback((user: AuthUser | null) => {
    if (user) {
      const role = resolveRole(user.username, user.email);
      const enriched: AuthUser = { ...user, role };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
      // Presence cookies let middleware guard routes server-side
      setPresenceCookie("dished_session", true);
      setPresenceCookie("dished_admin_session", role === "admin");
      setState({ user: enriched, loading: false });
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setPresenceCookie("dished_session", false);
      setPresenceCookie("dished_admin_session", false);
      setState({ user: null, loading: false });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPresenceCookie("dished_session", false);
    setPresenceCookie("dished_admin_session", false);
    setState({ user: null, loading: false });
  }, []);

  const isAdmin = state.user?.role === "admin";
  const isCook = state.user?.role === "cook" || isAdmin;

  return (
    <AuthContext.Provider value={{ ...state, setUser, logout, isAdmin, isCook }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
