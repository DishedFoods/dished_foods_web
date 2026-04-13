"use client";

import { useState, type FormEvent, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { validatePassword } from "@/lib/validation";
import { AlertTriangleIcon, CheckIcon, LockIcon } from "@/components/ui/Icons";

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

type PageState = "form" | "success" | "invalid-token";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [pwError, setPwError]           = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [state, setState]               = useState<PageState>(token ? "form" : "invalid-token");

  const pwStrength = getPasswordStrength(password);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPwError(null);
    setConfirmError(null);

    const pwErr = validatePassword(password);
    const cfErr = password !== confirm ? "Passwords do not match" : null;
    if (pwErr || cfErr) {
      setPwError(pwErr);
      setConfirmError(cfErr);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json() as { message?: string; error?: string };

      if (!res.ok) {
        // Expired / tampered token → show the invalid-token screen
        if (res.status === 400) {
          setState("invalid-token");
          return;
        }
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setState("success");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Navbar */}
      <nav className="h-16 border-b border-green-200 glass-nav flex items-center px-5 md:px-7">
        <Link href="/" className="group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(77,158,138,0.28)]
                          group-hover:scale-105 transition-transform">
            <Image src="/dished_logo1.png" width={40} height={40} alt="Dished" className="w-full h-full object-contain p-1" />
          </div>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">

          {/* ── Invalid / missing token ─────────────────────────────── */}
          {state === "invalid-token" && (
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangleIcon size={28} />
              </div>
              <h1 className="font-serif font-black text-xl text-gray-900 mb-2">Link expired or invalid</h1>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                This password-reset link is invalid or has expired (links are valid for 1&nbsp;hour).
                Please request a new one.
              </p>
              <Link
                href="/become-a-chef?view=forgot-password"
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Request new link
              </Link>
            </div>
          )}

          {/* ── Success ────────────────────────────────────────────── */}
          {state === "success" && (
            <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4
                              text-green-600">
                <CheckIcon size={28} />
              </div>
              <h1 className="font-serif font-black text-xl text-gray-900 mb-2">Password updated!</h1>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Your password has been changed. You can now sign in with your new password.
              </p>
              <Link
                href="/become-a-chef?view=login"
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Sign in
              </Link>
            </div>
          )}

          {/* ── Form ───────────────────────────────────────────────── */}
          {state === "form" && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200
                                flex items-center justify-center mx-auto mb-4 text-green-600">
                  <LockIcon size={24} />
                </div>
                <h1 className="font-serif font-black text-2xl text-gray-900 mb-2">Choose a new password</h1>
                <p className="text-sm text-gray-500">Must be at least 8 characters with a number and special character.</p>
              </div>

              <div className="bg-white rounded-2xl border border-green-200 shadow-[0_8px_32px_rgba(77,158,138,0.08)] p-6 md:p-8">
                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700
                                  text-sm font-medium flex items-center gap-2 animate-slide-up">
                    <AlertTriangleIcon size={16} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* New password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setPwError(null); }}
                        autoComplete="new-password"
                        disabled={loading}
                        placeholder="Min 8 chars, 1 number, 1 special"
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white
                                   outline-none transition-all placeholder:text-gray-400
                                   disabled:bg-gray-50 disabled:text-gray-500
                                   ${pwError
                                     ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                     : "border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                   }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                                   hover:text-gray-600 transition-colors text-xs font-semibold"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {password && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${pwStrength.color}`}
                            style={{ width: `${(pwStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-500">{pwStrength.label}</span>
                      </div>
                    )}

                    {pwError && (
                      <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
                        <AlertTriangleIcon size={12} /> {pwError}
                      </p>
                    )}
                  </div>

                  {/* Confirm */}
                  <div>
                    <label htmlFor="confirm" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Confirm new password
                    </label>
                    <input
                      id="confirm"
                      type={showPassword ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setConfirmError(null); }}
                      autoComplete="new-password"
                      disabled={loading}
                      placeholder="Re-enter your new password"
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white
                                 outline-none transition-all placeholder:text-gray-400
                                 disabled:bg-gray-50 disabled:text-gray-500
                                 ${confirmError
                                   ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                   : "border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                 }`}
                    />
                    {confirmError && (
                      <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
                        <AlertTriangleIcon size={12} /> {confirmError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-sm mt-1
                               disabled:opacity-60 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating password…
                      </>
                    ) : (
                      "Set new password"
                    )}
                  </button>
                </form>
              </div>

              <p className="mt-6 text-center text-xs text-gray-400">
                Remembered it?{" "}
                <Link href="/become-a-chef?view=login" className="text-green-700 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetPasswordContent /></Suspense>;
}
