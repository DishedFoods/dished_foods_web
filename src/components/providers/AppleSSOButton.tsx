"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

/**
 * Apple Sign In JS SDK types.
 * Apple only includes `user` (name/email) on the VERY FIRST sign-in.
 */
interface AppleIDAuthConfig {
  clientId: string;
  scope: string;
  redirectURI: string;
  usePopup: boolean;
}

interface AppleIDSignInResponse {
  authorization: {
    code: string;
    id_token: string;
    state?: string;
  };
  user?: {
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: AppleIDAuthConfig) => void;
        signIn: () => Promise<AppleIDSignInResponse>;
      };
    };
  }
}

interface AppleSSOButtonProps {
  disabled: boolean;
  onSuccess: (idToken: string, user: AppleIDSignInResponse["user"]) => void;
  onError: (msg: string) => void;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI ?? "";

const isConfigured =
  !!CLIENT_ID &&
  CLIENT_ID !== "YOUR_APPLE_SERVICES_ID_HERE" &&
  !!REDIRECT_URI;

export function AppleSSOButton({ disabled, onSuccess, onError }: AppleSSOButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);

  // Initialize Apple auth once the SDK script is loaded
  function initApple() {
    if (initialized.current || !window.AppleID) return;
    try {
      window.AppleID.auth.init({
        clientId: CLIENT_ID,
        scope: "name email",
        redirectURI: REDIRECT_URI,
        usePopup: true,
      });
      initialized.current = true;
      setSdkReady(true);
    } catch {
      // init can throw if credentials are invalid — surfaced on click
    }
  }

  // Re-check on mount in case the script already loaded (e.g. hot reload)
  useEffect(() => {
    if (window.AppleID) initApple();
  });

  async function handleClick() {
    if (!window.AppleID) {
      onError("Apple sign-in failed to load. Please refresh and try again.");
      return;
    }
    setLoading(true);
    try {
      const response = await window.AppleID.auth.signIn();
      onSuccess(response.authorization.id_token, response.user);
    } catch (err: unknown) {
      // Apple throws a plain object { error: "popup_closed_by_user" } when
      // the user dismisses the popup — treat as a no-op.
      const appleErr = err as { error?: string } | null;
      if (appleErr?.error === "popup_closed_by_user") return;
      onError("Apple sign-in was cancelled or failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Unconfigured state ─────────────────────────────────────────────────
  if (!isConfigured) {
    return (
      <button
        type="button"
        disabled
        title="Apple sign-in is not configured yet."
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                   bg-black text-white font-semibold text-sm
                   opacity-40 cursor-not-allowed min-h-[44px]"
      >
        <AppleLogoSVG />
        Continue with Apple (coming soon)
      </button>
    );
  }

  // ── Configured state ───────────────────────────────────────────────────
  return (
    <>
      {/* Apple's official JS SDK — loaded only when client ID is configured */}
      <Script
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        strategy="lazyOnload"
        onLoad={initApple}
      />

      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading || !sdkReady}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                   bg-black text-white font-semibold text-sm
                   hover:bg-gray-900 hover:shadow-md
                   active:scale-[0.98] transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   cursor-pointer min-h-[44px]"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <AppleLogoSVG />
        )}
        {loading ? "Signing in…" : "Continue with Apple"}
      </button>
    </>
  );
}

function AppleLogoSVG() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="white" aria-hidden="true">
      <path d="M15.4 11.3c0-2.7 2.2-4 2.3-4.1-1.3-1.9-3.2-2.1-3.9-2.2-1.7-.2-3.2 1-4.1 1s-2.2-1-3.6-1c-1.9 0-3.6 1.1-4.6 2.8-2 3.4-.5 8.5 1.4 11.3 1 1.4 2.1 2.9 3.5 2.9 1.4-.1 2-.9 3.7-.9 1.7 0 2.2.9 3.7.8 1.5 0 2.5-1.4 3.4-2.8.7-1 1.2-2 1.5-3.1-3.3-1.3-3.3-6.7.7-6.7zM12.8 3.4C13.7 2.3 14.2.8 14 0c-1.3.1-2.9.9-3.8 2C9.4 2.9 8.8 4.4 9 5.7c1.4.1 2.9-.7 3.8-2.3z" />
    </svg>
  );
}
