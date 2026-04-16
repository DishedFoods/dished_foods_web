"use client";

import { useState, useCallback, useEffect, type FormEvent, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, useParams } from "next/navigation";
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
  CheckCircleIcon,
  ShieldIcon,
  LockIcon,
  AlertTriangleIcon,
} from "@/components/ui/Icons";
import type { AuthView } from "@/types";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Role config                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */

type Role = "cook" | "foodie" | "delivery";

const ROLE_CONFIG: Record<Role, {
  badge: string;
  headline: string;
  subtext: string;
  benefits: string[];
  panelBg: string;       // Tailwind gradient classes for the right panel
  accentText: string;    // text-* for headings inside the panel
  image: string;
  imageName: string;
  testimonial: { quote: string; name: string; role: string };
  registerLabel: string;
  formTitle: (view: AuthView) => string;
  formSubtext: (view: AuthView) => string;
}> = {
  cook: {
    badge: "For Cooks",
    headline: "Turn Your Kitchen Into Income",
    subtext: "Join thousands of home chefs across Canada earning on their own schedule.",
    benefits: [
      "Set your own menu & prices",
      "Choose your hours and availability",
      "Keep 85% of every order",
      "Free tools to manage your kitchen",
    ],
    panelBg: "from-green-700 via-teal-600 to-green-800",
    accentText: "text-green-200",
    image: "/images/chef-woman.jpg",
    imageName: "Chef Sarah",
    testimonial: {
      quote: "I went from cooking for family to running a full home kitchen business. Dished made it simple.",
      name: "Sarah M.",
      role: "Home Chef, Toronto",
    },
    registerLabel: "Create Chef Account",
    formTitle: (v) => v === "register" ? "Start Your Chef Journey" : v === "login" ? "Welcome Back, Chef" : "Forgot Password",
    formSubtext: (v) => v === "register"
      ? "Join thousands of home chefs across Canada earning on their own schedule."
      : v === "login"
      ? "Sign in to manage your kitchen and orders."
      : "No worries — enter your email and we'll send you a reset link.",
  },
  foodie: {
    badge: "For Foodies",
    headline: "Discover Authentic Home Cooking",
    subtext: "Order freshly prepared home meals from talented local chefs in your neighbourhood.",
    benefits: [
      "Real home recipes, not restaurant reheats",
      "Fresh ingredients, made to order",
      "Support local home chefs directly",
      "Diverse cuisines from every culture",
    ],
    panelBg: "from-orange-600 via-amber-500 to-orange-700",
    accentText: "text-orange-200",
    image: "/images/chef-man.jpg",
    imageName: "Chef David",
    testimonial: {
      quote: "The food feels like it was made by a family member. I order from Dished every week now.",
      name: "Emma L.",
      role: "Foodie, Vancouver",
    },
    registerLabel: "Create Foodie Account",
    formTitle: (v) => v === "register" ? "Join as a Foodie" : v === "login" ? "Welcome Back" : "Forgot Password",
    formSubtext: (v) => v === "register"
      ? "Discover home-cooked meals from talented chefs in your neighbourhood."
      : v === "login"
      ? "Sign in to browse and order from local home chefs."
      : "Enter your email and we'll send you a reset link.",
  },
  delivery: {
    badge: "For Drivers",
    headline: "Earn Delivering Joy",
    subtext: "Flexible hours, competitive pay, and the satisfaction of connecting people with great food.",
    benefits: [
      "Flexible schedule — work when you want",
      "Competitive pay + tips",
      "Weekly payouts directly to your bank",
      "Be part of a growing community",
    ],
    panelBg: "from-blue-700 via-teal-600 to-blue-800",
    accentText: "text-blue-200",
    image: "/images/chef-man.jpg",
    imageName: "Driver Marcus",
    testimonial: {
      quote: "I deliver on weekends and make more than my part-time job. Best side hustle I've found.",
      name: "Marcus T.",
      role: "Delivery Partner, Calgary",
    },
    registerLabel: "Become a Delivery Partner",
    formTitle: (v) => v === "register" ? "Become a Delivery Partner" : v === "login" ? "Welcome Back" : "Forgot Password",
    formSubtext: (v) => v === "register"
      ? "Join our growing network of delivery partners and earn on your own schedule."
      : v === "login"
      ? "Sign in to manage your deliveries."
      : "Enter your email and we'll send you a reset link.",
  },
};

function isValidRole(r: unknown): r is Role {
  return r === "cook" || r === "foodie" || r === "delivery";
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Password strength                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if ((pw.match(/[a-zA-Z]/g) || []).length >= 6) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (score <= 1) return { score, label: "Weak",   color: "bg-red-400" };
  if (score <= 2) return { score, label: "Fair",   color: "bg-amber-400" };
  if (score <= 3) return { score, label: "Good",   color: "bg-green-400" };
  return            { score, label: "Strong", color: "bg-green-600" };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Google SSO                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

const GOOGLE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE";

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
    onSuccess: (r) => onSuccess(r.access_token),
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
                 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer min-h-[44px]"
    >
      <GoogleLogoSVG />
      Continue with Google
    </button>
  );
}

function GoogleSSOButton({ disabled, onSuccess, onError }: {
  disabled: boolean;
  onSuccess: (accessToken: string) => void;
  onError: (msg: string) => void;
}) {
  if (!GOOGLE_CONFIGURED) {
    return (
      <button type="button" disabled
        title="Google sign-in is not configured yet."
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                   bg-white border border-gray-200 text-gray-400 font-semibold text-sm
                   cursor-not-allowed opacity-50 shadow-sm min-h-[44px]">
        <GoogleLogoSVG />
        Continue with Google
      </button>
    );
  }
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

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Shared sub-components                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

function Divider() {
  return (
    <div className="flex items-center gap-4 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">or</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function FormField({
  id, label, type = "text", value, onChange, error,
  placeholder, autoComplete, disabled, children,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; error?: string | null;
  placeholder?: string; autoComplete?: string; disabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id} name={id} type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} autoComplete={autoComplete} disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white
                     transition-all duration-200 outline-none placeholder:text-gray-400
                     disabled:bg-gray-50 disabled:text-gray-500
                     ${error
                       ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                       : "border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                     }`}
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

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Right panel — role-specific marketing content                              */
/* ─────────────────────────────────────────────────────────────────────────── */

function RightPanel({ role, config }: { role: Role; config: typeof ROLE_CONFIG[Role] }) {
  return (
    <div className={`hidden lg:flex flex-col justify-between bg-gradient-to-br ${config.panelBg}
                     text-white px-10 py-12 relative overflow-hidden`}>
      {/* Background decorations */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute top-1/2 right-4 w-32 h-32 rounded-full bg-white/5" />

      {/* Top: badge + headline */}
      <div className="relative z-10">
        <div className={`inline-flex items-center gap-2 ${config.accentText} bg-white/10
                         text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 tracking-widest uppercase
                         border border-white/20`}>
          <MapleLeafIcon size={11} />
          {config.badge}
        </div>

        <h2 className="font-serif font-black text-[2rem] leading-tight mb-4">
          {config.headline}
        </h2>
        <p className="text-white/80 text-[15px] leading-relaxed mb-8">
          {config.subtext}
        </p>

        {/* Benefits list */}
        <ul className="flex flex-col gap-3">
          {config.benefits.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckIcon size={11} />
              </span>
              <span className="text-[14px] text-white/90 leading-snug">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Middle: hero image */}
      <div className="relative z-10 my-8">
        <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] aspect-[4/3]">
          <Image
            src={config.image}
            alt={config.imageName}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 0px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>

      {/* Bottom: testimonial */}
      <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
                 className="text-yellow-300" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <p className="text-[13.5px] text-white/90 leading-relaxed italic mb-3">
          &ldquo;{config.testimonial.quote}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            {config.testimonial.name.charAt(0)}
          </div>
          <div>
            <div className="text-[13px] font-semibold">{config.testimonial.name}</div>
            <div className={`text-[11px] ${config.accentText}`}>{config.testimonial.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main page                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

function AuthRoleContent() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { setUser }  = useAuth();

  const rawRole = params?.role;
  const role: Role = isValidRole(rawRole) ? rawRole : "cook";
  const config = ROLE_CONFIG[role];

  const [view,        setView]        = useState<AuthView>("register");
  const [loading,     setLoading]     = useState(false);
  const [apiError,    setApiError]    = useState<string | null>(null);
  const [success,     setSuccess]     = useState<string | null>(null);
  const [showPw,      setShowPw]      = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  // Forgot-password fields
  const [forgotEmail,      setForgotEmail]      = useState("");
  const [forgotEmailError, setForgotEmailError] = useState<string | null>(null);

  // Register fields
  const [regFirstName,  setRegFirstName]  = useState("");
  const [regLastName,   setRegLastName]   = useState("");
  const [regUsername,   setRegUsername]   = useState("");
  const [regEmail,      setRegEmail]      = useState("");
  const [regPassword,   setRegPassword]   = useState("");
  const [regConfirmPw,  setRegConfirmPw]  = useState("");
  const [agreeTerms,    setAgreeTerms]    = useState(false);

  // Login fields
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sync ?view= param
  useEffect(() => {
    const v = searchParams.get("view") as AuthView | null;
    if (v === "login" || v === "register" || v === "forgot-password") setView(v);
  }, [searchParams]);

  const clearState = useCallback(() => {
    setApiError(null);
    setSuccess(null);
    setFieldErrors({});
    setForgotEmailError(null);
  }, []);

  const switchView = (v: AuthView) => { setView(v); clearState(); };

  const redirectAfterAuth = () => {
    if (role === "cook") router.push("/chef/dashboard");
    else router.push("/");
  };

  /* ── Google SSO ──────────────────────────────────────────────── */
  const handleGoogleSSO = useCallback(async (accessToken: string) => {
    clearState();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      const data = await res.json() as { id?: number; username?: string; email?: string; status?: string; error?: string };
      if (!res.ok) { setApiError(data.error || "Google sign-in failed."); return; }
      setUser({ id: data.id!, username: data.username!, email: data.email!, status: data.status ?? "active", role: "cook" });
      setSuccess("Signed in with Google! Redirecting...");
      setTimeout(redirectAfterAuth, 1200);
    } catch {
      setApiError("Google sign-in failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearState, setUser]);

  /* ── Forgot password ─────────────────────────────────────────── */
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
      if (!res.ok) { setApiError(data.error ?? "Something went wrong."); return; }
      setSuccess(data.message ?? "Check your email for a reset link.");
      if (data._devResetUrl) setApiError(`DEV — reset URL: ${data._devResetUrl}`);
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [clearState, forgotEmail]);

  /* ── Register ────────────────────────────────────────────────── */
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    clearState();
    const errors: Record<string, string | null> = {
      regFirstName: validateRequired(regFirstName, "First name"),
      regLastName:  validateRequired(regLastName,  "Last name"),
      regUsername:  validateUsername(regUsername),
      regEmail:     validateEmail(regEmail),
      regPassword:  validatePassword(regPassword),
      regConfirmPw: regPassword !== regConfirmPw ? "Passwords do not match" : null,
    };
    if (!agreeTerms) errors.agreeTerms = "You must agree to the terms";
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    setLoading(true);
    try {
      const cook = await registerChef({
        username: regUsername.trim(),
        password: regPassword,
        email: regEmail.trim().toLowerCase(),
      });
      try { await createChefProfile({ firstName: regFirstName.trim(), lastName: regLastName.trim() }); } catch { /* best-effort */ }
      setUser({ id: cook.id, username: cook.username, email: cook.email, status: cook.status, role: "cook" });
      setSuccess("Account created! Redirecting...");
      setTimeout(redirectAfterAuth, 1500);
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.message?.toLowerCase().includes("username")) {
        setFieldErrors((p) => ({ ...p, regUsername: apiErr.message }));
      } else if (apiErr.message?.toLowerCase().includes("email")) {
        setFieldErrors((p) => ({ ...p, regEmail: apiErr.message }));
      } else {
        setApiError(apiErr.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Login ───────────────────────────────────────────────────── */
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    clearState();
    const errors = {
      loginUsername: validateRequired(loginUsername, "Username"),
      loginPassword: validateRequired(loginPassword, "Password"),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    setLoading(true);
    try {
      const cook = await loginChef({ username: loginUsername.trim(), password: loginPassword });
      setUser({ id: cook.id, username: cook.username, email: cook.email, status: cook.status, role: "cook" });
      setSuccess("Welcome back! Redirecting...");
      setTimeout(redirectAfterAuth, 1200);
    } catch (err) {
      const apiErr = err as ApiError;
      setApiError(apiErr.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = getPasswordStrength(regPassword);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <nav className="h-14 border-b border-gray-100 bg-white flex items-center px-5 md:px-8 flex-shrink-0 z-10">
        <Link href="/" className="group flex-shrink-0">
          <div className="w-15 h-12 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(77,158,138,0.28)]
                          group-hover:scale-105 transition-transform">
            <Image src="/dished_logosvg.svg" width={40} height={40} alt="Dished" className="w-full h-full object-contain p-1" />
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-3 text-sm">
          {view !== "login" && (
            <span className="text-gray-400 hidden sm:inline">Already have an account?</span>
          )}
          {view !== "login" && (
            <button
              onClick={() => switchView("login")}
              className="font-semibold text-green-700 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          )}
          {view !== "register" && (
            <button
              onClick={() => switchView("register")}
              className="font-semibold text-green-700 hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* Split layout */}
      <div className="flex-1 flex">

        {/* ── Left: form panel ──────────────────────────────────── */}
        <div className="flex-1 lg:w-1/2 lg:max-w-[50%] bg-[var(--bg)]
                        flex items-start justify-center px-4 py-10">
          <div className="w-full max-w-[440px]">

            {/* Header */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold
                              px-3.5 py-1.5 rounded-full mb-4 border border-green-200 tracking-widest uppercase">
                <MapleLeafIcon size={11} /> {config.badge}
              </div>
              <h1 className="font-serif font-black text-[26px] md:text-[30px] text-gray-900 leading-tight mb-2">
                {config.formTitle(view)}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                {config.formSubtext(view)}
              </p>
            </div>

            {/* Card */}
            <div className="relative bg-white rounded-2xl border border-green-200
                            shadow-[0_8px_32px_rgba(77,158,138,0.08)] p-6 md:p-8">

              {/* Full-card overlay while any auth operation is in flight */}
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-2xl z-20
                                flex flex-col items-center justify-center gap-3">
                  <span className="w-9 h-9 border-[3px] border-green-200 border-t-green-600 rounded-full animate-spin" />
                  <span className="text-sm font-semibold text-gray-600">Please wait…</span>
                </div>
              )}

              {/* Tabs — hidden on forgot-password */}
              {view !== "forgot-password" && (
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                  {(["register", "login"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => switchView(v)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
                        ${view === v ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      {v === "register" ? "Register" : "Sign In"}
                    </button>
                  ))}
                </div>
              )}

              {/* SSO — hidden on forgot-password */}
              {view !== "forgot-password" && (
                <>
                  <div className="flex flex-col gap-3">
                    <GoogleSSOButton disabled={loading} onSuccess={handleGoogleSSO} onError={setApiError} />
                  </div>
                  <Divider />
                </>
              )}

              {/* Error banner */}
              {apiError && view !== "forgot-password" && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700
                                text-sm font-medium flex items-center gap-2 animate-slide-up">
                  <AlertTriangleIcon size={16} /> {apiError}
                </div>
              )}

              {/* Success banner */}
              {success && view !== "forgot-password" && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700
                                text-sm font-medium flex items-center gap-2 animate-slide-up">
                  <CheckCircleIcon size={16} /> {success}
                </div>
              )}

              {/* ── Forgot-password form ───────────────────── */}
              {view === "forgot-password" && (
                <>
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
                          id="forgotEmail" type="email" value={forgotEmail}
                          onChange={(e) => { setForgotEmail(e.target.value); setForgotEmailError(null); }}
                          placeholder="you@example.com" autoComplete="email" disabled={loading}
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white
                                     transition-all duration-200 outline-none placeholder:text-gray-400
                                     disabled:bg-gray-50 disabled:text-gray-500
                                     ${forgotEmailError
                                       ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                       : "border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"}`}
                        />
                        {forgotEmailError && (
                          <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
                            <AlertTriangleIcon size={12} /> {forgotEmailError}
                          </p>
                        )}
                      </div>
                      <button
                        type="submit" disabled={loading}
                        className="btn-primary w-full py-3.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed
                                   flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending link…</>
                        ) : "Send reset link"}
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

              {/* ── Register form ──────────────────────────── */}
              {view === "register" && (
                <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField id="regFirstName" label="First Name" value={regFirstName} onChange={setRegFirstName}
                      error={fieldErrors.regFirstName} placeholder="Alex" autoComplete="given-name" disabled={loading} />
                    <FormField id="regLastName" label="Last Name" value={regLastName} onChange={setRegLastName}
                      error={fieldErrors.regLastName} placeholder="Tremblay" autoComplete="family-name" disabled={loading} />
                  </div>
                  <FormField id="regUsername" label="Username" value={regUsername} onChange={setRegUsername}
                    error={fieldErrors.regUsername} placeholder="chef_alex" autoComplete="username" disabled={loading} />
                  <FormField id="regEmail" label="Email" type="email" value={regEmail} onChange={setRegEmail}
                    error={fieldErrors.regEmail} placeholder="alex@example.com" autoComplete="email" disabled={loading} />
                  <div>
                    <FormField id="regPassword" label="Password" type={showPw ? "text" : "password"}
                      value={regPassword} onChange={setRegPassword} error={fieldErrors.regPassword}
                      placeholder="Min 8 chars, 1 number, 1 special" autoComplete="new-password" disabled={loading}>
                      <button type="button" onClick={() => setShowPw((s) => !s)} tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                                   hover:text-gray-600 transition-colors text-xs font-semibold cursor-pointer">
                        {showPw ? "Hide" : "Show"}
                      </button>
                    </FormField>
                    {regPassword && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${pwStrength.color}`}
                               style={{ width: `${(pwStrength.score / 5) * 100}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-500">{pwStrength.label}</span>
                      </div>
                    )}
                  </div>
                  <FormField id="regConfirmPw" label="Confirm Password" type={showPw ? "text" : "password"}
                    value={regConfirmPw} onChange={setRegConfirmPw} error={fieldErrors.regConfirmPw}
                    placeholder="Re-enter your password" autoComplete="new-password" disabled={loading} />
                  <label className="flex items-start gap-3 cursor-pointer mt-1">
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer" />
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
                  <button type="submit" disabled={loading}
                    className="btn-primary w-full py-3.5 text-sm mt-2
                               shadow-[0_4px_16px_rgba(77,158,138,0.3)]
                               disabled:opacity-60 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2">
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
                    ) : config.registerLabel}
                  </button>
                </form>
              )}

              {/* ── Login form ─────────────────────────────── */}
              {view === "login" && (
                <form onSubmit={handleLogin} noValidate className="flex flex-col gap-4">
                  <FormField id="loginUsername" label="Username" value={loginUsername} onChange={setLoginUsername}
                    error={fieldErrors.loginUsername} placeholder="chef_alex" autoComplete="username" disabled={loading} />
                  <FormField id="loginPassword" label="Password" type={showPw ? "text" : "password"}
                    value={loginPassword} onChange={setLoginPassword} error={fieldErrors.loginPassword}
                    placeholder="Enter your password" autoComplete="current-password" disabled={loading}>
                    <button type="button" onClick={() => setShowPw((s) => !s)} tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                                 hover:text-gray-600 transition-colors text-xs font-semibold cursor-pointer">
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </FormField>
                  <button type="submit" disabled={loading}
                    className="btn-primary w-full py-3.5 text-sm mt-2
                               shadow-[0_4px_16px_rgba(77,158,138,0.3)]
                               disabled:opacity-60 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2">
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing In...</>
                    ) : "Sign In"}
                  </button>
                  <button type="button" onClick={() => switchView("forgot-password")}
                    className="w-full text-center text-xs text-gray-400 hover:text-green-700
                               font-semibold transition-colors cursor-pointer mt-1">
                    Forgot your password?
                  </button>
                </form>
              )}
            </div>

            {/* Security footer */}
            <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><LockIcon size={12} /> Encrypted</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5"><ShieldIcon /> PIPEDA Compliant</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5"><MapleLeafIcon size={11} /> Canadian</span>
            </div>
          </div>
        </div>

        {/* ── Right: marketing panel (sticky so it stays in viewport while form scrolls) */}
        <div className="hidden lg:block lg:w-1/2 lg:max-w-[50%] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <RightPanel role={role} config={config} />
        </div>
      </div>
    </div>
  );
}

export default function AuthRolePage() {
  return <Suspense><AuthRoleContent /></Suspense>;
}
