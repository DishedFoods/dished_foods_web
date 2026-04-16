"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginChef, type ApiError } from "@/lib/api";
import { AlertTriangleIcon, LockIcon, ShieldIcon } from "@/components/ui/Icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in as admin, redirect
  if (user?.role === "admin") {
    router.replace("/admin/dashboard");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    try {
      const cook = await loginChef({
        username: username.trim(),
        password,
      });

      const newUser = {
        id: cook.id,
        username: cook.username,
        email: cook.email,
        status: cook.status,
        role: "cook" as const, // will be resolved by AuthContext
      };

      // Resolve role from env-var allow-list synchronously — no setTimeout, no
      // localStorage read-back. Only allow the navigation if the resolved role
      // is "admin"; otherwise reject immediately and clear the stored session.
      const adminUsernames = (process.env.NEXT_PUBLIC_ADMIN_USERNAMES ?? "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const isAdminAccount =
        adminUsernames.includes(cook.username.toLowerCase()) ||
        adminUsernames.includes(cook.email.toLowerCase());

      if (!isAdminAccount) {
        setError("Access denied. This account does not have admin privileges.");
        return;
      }

      setUser(newUser);
      router.push("/admin/dashboard");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top bar */}
      <nav className="h-16 border-b border-gray-800 flex items-center px-5 md:px-7">
        <Link href="/" className="group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg
                          group-hover:scale-105 transition-transform">
            <Image src="/dished_logo1.png" width={40} height={40} alt="Dished" className="w-full h-full object-contain p-1" />
          </div>
        </Link>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 mb-4">
              <ShieldIcon />
            </div>
            <h1 className="font-serif font-black text-2xl text-white mb-2">Admin Access</h1>
            <p className="text-sm text-gray-400">Restricted to authorized personnel only.</p>
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 md:p-8">
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/30 border border-red-800 text-red-400
                              text-sm font-medium flex items-center gap-2 animate-slide-up">
                <AlertTriangleIcon size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 text-sm font-medium
                             bg-gray-900 text-white placeholder:text-gray-500
                             focus:border-green-500 focus:ring-2 focus:ring-green-900 outline-none transition-all"
                  placeholder="Admin username"
                  autoComplete="username"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-600 text-sm font-medium
                               bg-gray-900 text-white placeholder:text-gray-500
                               focus:border-green-500 focus:ring-2 focus:ring-green-900 outline-none transition-all"
                    placeholder="Enter password"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500
                               hover:text-gray-300 transition-colors text-xs font-semibold"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white
                           bg-green-600 hover:bg-green-700 transition-all
                           shadow-[0_4px_16px_rgba(77,158,138,0.3)]
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LockIcon size={14} />
                    Sign In to Admin
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
