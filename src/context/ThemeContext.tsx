"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Role-based theme switcher.
 *
 * Themes are the same Emerald / Gold / Cream palette, re-shifted per role.
 * Each theme maps to a `data-theme` attribute on <html>, which rebinds the
 * CSS variables defined in globals.css (see `[data-theme="..."]` blocks).
 *
 *  • customer — Light / clean (default)
 *  • cook     — Dark / professional kitchen
 *  • delivery — Light / emerald-focus courier
 *  • hotline  — High-contrast / urgent surplus mode
 */
export type Theme = "customer" | "cook" | "delivery" | "hotline";

export const ALL_THEMES: Theme[] = ["customer", "cook", "delivery", "hotline"];
export const DEFAULT_THEME: Theme = "customer";

/** Map role slugs used elsewhere in the app to a theme. */
export const ROLE_TO_THEME: Record<string, Theme> = {
  cook: "cook",
  foodie: "customer",
  customer: "customer",
  delivery: "delivery",
  hotline: "hotline",
};

const STORAGE_KEY = "dished_theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  /** Momentarily apply a theme without persisting (e.g. tile hover preview). */
  previewTheme: (t: Theme | null) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState]   = useState<Theme>(DEFAULT_THEME);
  const [preview, setPreview]    = useState<Theme | null>(null);

  /* Hydrate from localStorage on mount. The anti-flicker inline script in
     layout.tsx has already set data-theme on <html>, so this just syncs
     React state to it — no visual flash. */
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved && ALL_THEMES.includes(saved)) {
        setThemeState(saved);
      } else {
        const attr = document.documentElement.getAttribute("data-theme") as Theme | null;
        if (attr && ALL_THEMES.includes(attr)) setThemeState(attr);
      }
    } catch { /* localStorage may be unavailable (private mode) */ }
  }, []);

  /* Apply (preview overrides persisted theme for live feel). */
  useEffect(() => {
    const active = preview ?? theme;
    document.documentElement.setAttribute("data-theme", active);
  }, [theme, preview]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try { window.localStorage.setItem(STORAGE_KEY, t); } catch { /* ignore */ }
  }, []);

  const previewTheme = useCallback((t: Theme | null) => {
    setPreview(t);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: preview ?? theme, setTheme, previewTheme }),
    [theme, preview, setTheme, previewTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback so components can be rendered outside of the provider
    // (e.g. in tests) without crashing.
    return {
      theme: DEFAULT_THEME,
      setTheme: () => undefined,
      previewTheme: () => undefined,
    };
  }
  return ctx;
}

/**
 * Inline script (string) to run in <head> before hydration — prevents FOUC /
 * flash-of-default-theme by reading localStorage and setting the data-theme
 * attribute synchronously. Render via:
 *
 *   <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
 */
export const themeInitScript = `
(function(){try{
  var t = localStorage.getItem("${STORAGE_KEY}");
  var allow = ${JSON.stringify(ALL_THEMES)};
  if (t && allow.indexOf(t) !== -1) {
    document.documentElement.setAttribute("data-theme", t);
  } else {
    document.documentElement.setAttribute("data-theme", "${DEFAULT_THEME}");
  }
}catch(e){
  document.documentElement.setAttribute("data-theme", "${DEFAULT_THEME}");
}})();
`;
