"use client";

import { useState, useCallback, useEffect, type FormEvent, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { registerChef, loginChef, createChefProfile, type ApiError } from "@/lib/api";
import {
  validatePassword,
  validateEmail,
  validateUsername,
  validateRequired,
} from "@/lib/validation";
import {
  MapleLeafIcon,
  CheckIcon,
  ShieldIcon,
  LockIcon,
  AlertTriangleIcon,
} from "@/components/ui/Icons";
import type { AuthView } from "@/types";

/* ── Password strength meter ───────────────────────────── */
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if ((pw.match(/[a-zA-Z]/g) || []).length >= 6) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;
  if (pw.length >= 12) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-400" };
  if (score <= 3) return { score, label: "Good", color: "bg-green-400" };
  return { score, label: "Strong", color: "bg-green-600" };
}

/* ── Google SSO button ─────────────────────────────────── */

const GOOGLE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE";

/**
 * Inner component — only rendered when GoogleOAuthProvider is in the tree.
 * Keeps useGoogleLogin away from unconfigured renders where the provider
 * context doesn't exist (which would throw the "must be within provider" error).
 */
function GoogleLoginButton({
  disabled,
  onSuccess,
  onError,
}: {
  disabled: boolean;
  onSuccess: (accessToken: string) => void;
  onError: (msg: string) => void;
}) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => onSuccess(tokenResponse.access_token),
    onError: () => onError("Google sign-in was cancelled or failed. Please try again."),
    flow: "implicit",
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                 bg-white border border-gray-200 text-gray-700 font-semibold text-sm
                 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md
                 active:scale-[0.98] transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-sm cursor-pointer min-h-[44px]"
    >
      <GoogleLogoSVG />
      Continue with Google
    </button>
  );
}

/** Outer shell — safe to render anywhere regardless of provider presence. */
function GoogleSSOButton({
  disabled,
  onSuccess,
  onError,
}: {
  disabled: boolean;
  onSuccess: (accessToken: string) => void;
  onError: (msg: string) => void;
}) {
  if (!GOOGLE_CONFIGURED) {
    return (
      <button
        type="button"
        disabled
        title="Google sign-in is not configured yet."
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                   bg-white border border-gray-200 text-gray-400 font-semibold text-sm
                   cursor-not-allowed opacity-50 shadow-sm min-h-[44px]"
      >
        <GoogleLogoSVG />
        Continue with Google
      </button>
    );
  }

  // Only reach here when GoogleOAuthProvider is active in the tree
  return <GoogleLoginButton disabled={disabled} onSuccess={onSuccess} onError={onError} />;
}

function GoogleLogoSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ── Divider ───────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        or
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

/* ── Input field ───────────────────────────────────────── */
function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  disabled,
  children,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium
                     bg-white transition-all duration-200 outline-none
                     placeholder:text-gray-400
                     ${error
                       ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                       : "border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                     }
                     disabled:bg-gray-50 disabled:text-gray-500`}
        />
        {children}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
          <AlertTriangleIcon size={12} /> {error}
        </p>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
function BecomeAChefContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [view, setView] = useState<AuthView>("register");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot-password fields
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState<string | null>(null);

  // Honour ?view= query param (e.g. from reset-password page "sign in" links
  // and from the "forgot password?" link on this page)
  useEffect(() => {
    const v = searchParams.get("view") as AuthView | null;
    if (v === "login" || v === "register" || v === "forgot-password") {
      setView(v);
    }
  }, [searchParams]);

  // Register fields
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPw, setRegConfirmPw] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Login fields
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Per-field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  const clearState = useCallback(() => {
    setApiError(null);
    setSuccess(null);
    setFieldErrors({});
    setForgotEmailError(null);
  }, []);

  /* ── Google SSO handler ────────────────────────────────── */
  const handleGoogleSSO = useCallback(async (accessToken: string) => {
    clearState();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      const data = await res.json() as {
        id?: number; username?: string; email?: string;
        status?: string; error?: string;
      };

      if (!res.ok) {
        setApiError(data.error || "Google sign-in failed. Please try again.");
        return;
      }

      setUser({
        id: data.id!,
        username: data.username!,
        email: data.email!,
        status: data.status ?? "active",
        role: "cook",
      });

      setSuccess("Signed in with Google! Redirecting...");
      setTimeout(() => router.push("/chef/dashboard"), 1200);
    } catch {
      setApiError("Google sign-in failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [clearState, router, setUser]);

  const switchView = (v: AuthView) => {
    setView(v);
    clearState();
  };

  /* ── Forgot-password handler ───────────────────────── */
  const handleForgotPassword = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    clearState();

    const emailErr = validateEmail(forgotEmail);
    if (emailErr) { setForgotEmailError(emailErr); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });

      const data = await res.json() as { message?: string; error?: string; _devResetUrl?: string };

      if (!res.ok) {
        setApiError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(data.message ?? "Check your email for a reset link.");

      // Dev convenience: surface the reset URL directly in the UI
      if (data._devResetUrl) {
        setApiError(`DEV — reset URL: ${data._devResetUrl}`);
      }
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [clearState, forgotEmail]);

  /* ── Register handler ──────────────────────────────── */
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    clearState();

    // Validate all fields
    const errors: Record<string, string | null> = {
      regFirstName: validateRequired(regFirstName, "First name"),
      regLastName: validateRequired(regLastName, "Last name"),
      regUsername: validateUsername(regUsername),
      regEmail: validateEmail(regEmail),
      regPassword: validatePassword(regPassword),
      regConfirmPw:
        regPassword !== regConfirmPw ? "Passwords do not match" : null,
    };

    if (!agreeTerms) {
      errors.agreeTerms = "You must agree to the terms";
    }

    setFieldErrors(errors);

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;

    setLoading(true);
    try {
      const cook = await registerChef({
        username: regUsername.trim(),
        password: regPassword,
        email: regEmail.trim().toLowerCase(),
      });

      // Auto-create cook profile with first/last name from registration
      try {
        await createChefProfile({
          firstName: regFirstName.trim(),
          lastName: regLastName.trim(),
        });
      } catch {
        // Profile creation is best-effort; cook account was already created
      }

      const user = {
        id: cook.id,
        username: cook.username,
        email: cook.email,
        status: cook.status,
        role: "cook" as const,
      };
      setUser(user);

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => router.push("/chef/dashboard"), 1500);
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.message?.toLowerCase().includes("username")) {
        setFieldErrors((prev) => ({ ...prev, regUsername: apiErr.message }));
      } else if (apiErr.message?.toLowerCase().includes("email")) {
        setFieldErrors((prev) => ({ ...prev, regEmail: apiErr.message }));
      } else {
        setApiError(apiErr.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Login handler ─────────────────────────────────── */
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    clearState();

    const errors: Record<string, string | null> = {
      loginUsername: validateRequired(loginUsername, "Username"),
      loginPassword: validateRequired(loginPassword, "Password"),
    };

    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setLoading(true);
    try {
      const cook = await loginChef({
        username: loginUsername.trim(),
        password: loginPassword,
      });

      const user = {
        id: cook.id,
        username: cook.username,
        email: cook.email,
        status: cook.status,
        role: "cook" as const,
      };
      setUser(user);

      setSuccess("Welcome back! Redirecting...");
      setTimeout(() => router.push("/chef/dashboard"), 1200);
    } catch (err) {
      const apiErr = err as ApiError;
      setApiError(apiErr.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = getPasswordStrength(regPassword);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Top bar */}
      <nav className="h-16 border-b border-green-200 glass-nav flex items-center px-5 md:px-7">
        <Link href="/" className="group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(77,158,138,0.28)]
                          group-hover:scale-105 transition-transform">
            <Image src="/dished_logo1.png" width={40} height={40} alt="Dished" className="w-full h-full object-contain p-1" />
          </div>
        </Link>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 md:py-16">
        <div className="w-full max-w-[460px]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold
                            px-4 py-1.5 rounded-full mb-4 border border-green-200
                            tracking-widest uppercase">
              <MapleLeafIcon size={11} /> Chef Registration
            </div>
            <h1 className="font-serif font-black text-[28px] md:text-[34px] text-gray-900 leading-tight mb-2">
              {view === "register" ? "Start Your Chef Journey"
                : view === "login" ? "Welcome Back, Chef"
                : "Forgot Password"}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[360px] mx-auto">
              {view === "register"
                ? "Join thousands of home chefs across Canada earning on their own schedule."
                : view === "login"
                ? "Sign in to manage your kitchen and orders."
                : "No worries — enter your email and we'll send you a reset link."}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-green-200 shadow-[0_8px_32px_rgba(77,158,138,0.08)] p-6 md:p-8">
            {/* Tab switch — hidden on forgot-password view */}
            {view !== "forgot-password" && (
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => switchView("register")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                    ${view === "register"
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => switchView("login")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                    ${view === "login"
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Sign In
                </button>
              </div>
            )}

            {/* SSO — hidden on forgot-password view */}
            {view !== "forgot-password" && (
              <>
                <div className="flex flex-col gap-3">
                  <GoogleSSOButton
                    disabled={loading}
                    onSuccess={handleGoogleSSO}
                    onError={setApiError}
                  />
                </div>
                <Divider />
              </>
            )}

            {/* ── Forgot-password form ──────────────── */}
            {view === "forgot-password" && (
              <>
                <div className="text-center mb-6">
                  <h2 className="font-serif font-black text-xl text-gray-900 mb-1">Reset your password</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Enter your email and we'll send a reset link if an account exists.
                  </p>
                </div>

                {success ? (
                  <div className="px-4 py-4 rounded-xl bg-green-50 border border-green-200 text-green-700
                                  text-sm font-medium flex items-start gap-2 animate-slide-up mb-4">
                    <CheckIcon size={16} />
                    <span>{success}</span>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} noValidate className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="forgotEmail" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email address
                      </label>
                      <input
                        id="forgotEmail"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => { setForgotEmail(e.target.value); setForgotEmailError(null); }}
                        placeholder="alex@example.com"
                        autoComplete="email"
                        disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium
                                   bg-white transition-all duration-200 outline-none
                                   placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500
                                   ${forgotEmailError
                                     ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                     : "border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                   }`}
                      />
                      {forgotEmailError && (
                        <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
                          <AlertTriangleIcon size={12} /> {forgotEmailError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3.5 text-sm
                                 disabled:opacity-60 disabled:cursor-not-allowed
                                 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending link…
                        </>
                      ) : (
                        "Send reset link"
                      )}
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={() => switchView("login")}
                  className="mt-4 w-full text-center text-sm text-gray-500 hover:text-green-700
                             font-semibold transition-colors cursor-pointer"
                >
                  ← Back to sign in
                </button>
              </>
            )}

            {/* API error banner — always visible (forgot-password reuses it for dev URL) */}
            {apiError && view !== "forgot-password" && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700
                              text-sm font-medium flex items-center gap-2 animate-slide-up">
                <AlertTriangleIcon size={16} />
                {apiError}
              </div>
            )}

            {/* Success banner — login/register only (forgot-password has its own) */}
            {success && view !== "forgot-password" && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700
                              text-sm font-medium flex items-center gap-2 animate-slide-up">
                <CheckIcon size={16} />
                {success}
              </div>
            )}

            {/* ── Register Form ─────────────────────── */}
            {view === "register" && (
              <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    id="regFirstName"
                    label="First Name"
                    value={regFirstName}
                    onChange={setRegFirstName}
                    error={fieldErrors.regFirstName}
                    placeholder="Alex"
                    autoComplete="given-name"
                    disabled={loading}
                  />
                  <FormField
                    id="regLastName"
                    label="Last Name"
                    value={regLastName}
                    onChange={setRegLastName}
                    error={fieldErrors.regLastName}
                    placeholder="Tremblay"
                    autoComplete="family-name"
                    disabled={loading}
                  />
                </div>

                <FormField
                  id="regUsername"
                  label="Username"
                  value={regUsername}
                  onChange={setRegUsername}
                  error={fieldErrors.regUsername}
                  placeholder="chef_alex"
                  autoComplete="username"
                  disabled={loading}
                />

                <FormField
                  id="regEmail"
                  label="Email"
                  type="email"
                  value={regEmail}
                  onChange={setRegEmail}
                  error={fieldErrors.regEmail}
                  placeholder="alex@example.com"
                  autoComplete="email"
                  disabled={loading}
                />

                <div>
                  <FormField
                    id="regPassword"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={setRegPassword}
                    error={fieldErrors.regPassword}
                    placeholder="Min 8 chars, 1 number, 1 special"
                    autoComplete="new-password"
                    disabled={loading}
                  >
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                                 hover:text-gray-600 transition-colors text-xs font-semibold"
                      tabIndex={-1}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </FormField>

                  {/* Strength bar */}
                  {regPassword && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${pwStrength.color}`}
                          style={{ width: `${(pwStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500">
                        {pwStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                <FormField
                  id="regConfirmPw"
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  value={regConfirmPw}
                  onChange={setRegConfirmPw}
                  error={fieldErrors.regConfirmPw}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  disabled={loading}
                />

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group mt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-green-600
                               focus:ring-green-500 accent-green-600 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-green-700 font-semibold underline underline-offset-2 hover:text-green-600">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-green-700 font-semibold underline underline-offset-2 hover:text-green-600">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {fieldErrors.agreeTerms && (
                  <p className="-mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
                    <AlertTriangleIcon size={12} /> {fieldErrors.agreeTerms}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-sm mt-2
                             shadow-[0_4px_16px_rgba(77,158,138,0.3)]
                             disabled:opacity-60 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Chef Account"
                  )}
                </button>
              </form>
            )}

            {/* ── Login Form ────────────────────────── */}
            {view === "login" && (
              <form onSubmit={handleLogin} noValidate className="flex flex-col gap-4">
                <FormField
                  id="loginUsername"
                  label="Username"
                  value={loginUsername}
                  onChange={setLoginUsername}
                  error={fieldErrors.loginUsername}
                  placeholder="chef_alex"
                  autoComplete="username"
                  disabled={loading}
                />

                <FormField
                  id="loginPassword"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={setLoginPassword}
                  error={fieldErrors.loginPassword}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                               hover:text-gray-600 transition-colors text-xs font-semibold"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </FormField>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-sm mt-2
                             shadow-[0_4px_16px_rgba(77,158,138,0.3)]
                             disabled:opacity-60 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => switchView("forgot-password")}
                  className="w-full text-center text-xs text-gray-400 hover:text-green-700
                             font-semibold transition-colors cursor-pointer mt-1"
                >
                  Forgot your password?
                </button>
              </form>
            )}
          </div>

          {/* Security footer */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <LockIcon size={13} /> Encrypted
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5">
              <ShieldIcon /> PIPEDA Compliant
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5">
              <MapleLeafIcon size={11} /> Canadian
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BecomeAChefPage() {
  return <Suspense><BecomeAChefContent /></Suspense>;
}
