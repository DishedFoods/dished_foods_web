"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const isConfigured =
  !!CLIENT_ID && CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE";

/**
 * Wraps the app with GoogleOAuthProvider only when a real client ID is set.
 * When unconfigured, renders children bare — GoogleSSOButton handles that
 * case by rendering a disabled button that never calls useGoogleLogin.
 */
export function GoogleProvider({ children }: { children: ReactNode }) {
  if (!isConfigured) {
    return <>{children}</>;
  }
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
