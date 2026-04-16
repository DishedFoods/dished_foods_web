"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAllChefs, getAllProfiles, updateChefProfile, type ChefResponse, type ChefProfileResponse } from "@/lib/api";
import { Toast } from "@/components/ui/Toast";

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={`rounded-2xl p-5 border ${color}`}>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-semibold mt-1 opacity-70">{label}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [chefs, setChefs] = useState<ChefResponse[]>([]);
  const [profiles, setProfiles] = useState<ChefProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [tab, setTab] = useState<"cooks" | "profiles">("cooks");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.replace("/admin/login");
    }
  }, [authLoading, user, isAdmin, router]);

  useEffect(() => {
    async function load() {
      try {
        const [chefData, profileData] = await Promise.all([
          getAllChefs(),
          getAllProfiles(),
        ]);
        setChefs(chefData);
        setProfiles(profileData);
      } catch {
        setToast("Failed to load data from backend.");
      } finally {
        setLoading(false);
      }
    }
    if (user && isAdmin) load();
  }, [user, isAdmin]);

  if (!user || !isAdmin) return null;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-600 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top nav */}
      <nav className="h-16 border-b border-gray-800 flex items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
              <Image src="/dished_logo1.png" width={40} height={40} alt="Dished" className="w-full h-full object-contain p-1" />
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-green-400 bg-green-900/40 px-3 py-1 rounded-full border border-green-800">
            {user.username}
          </span>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Chefs"
            value={chefs.length}
            color="bg-blue-900/30 border-blue-800 text-blue-300"
          />
          <StatCard
            label="Active Chefs"
            value={chefs.filter((c) => c.status === "active").length}
            color="bg-green-900/30 border-green-800 text-green-300"
          />
          <StatCard
            label="Chef Profiles"
            value={profiles.length}
            color="bg-purple-900/30 border-purple-800 text-purple-300"
          />
          <StatCard
            label="Verified Profiles"
            value={profiles.filter((p) => p.verified).length}
            color="bg-amber-900/30 border-amber-800 text-amber-300"
          />
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("cooks")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${tab === "cooks" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            Registered Chefs ({chefs.length})
          </button>
          <button
            onClick={() => setTab("profiles")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${tab === "profiles" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            Chef Profiles ({profiles.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-600 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : tab === "cooks" ? (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[60px_1fr_1fr_100px_140px] gap-4 px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700">
              <span>ID</span>
              <span>Username</span>
              <span>Email</span>
              <span>Status</span>
              <span>Joined</span>
            </div>

            {chefs.length === 0 ? (
              <div className="px-5 py-12 text-center text-gray-500 text-sm">No chefs registered yet.</div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {chefs.map((chef) => (
                  <div key={chef.id} className="grid grid-cols-[60px_1fr_1fr_100px_140px] gap-4 px-5 py-3.5 text-sm items-center hover:bg-gray-750 transition-colors">
                    <span className="text-gray-500 font-mono text-xs">#{chef.id}</span>
                    <span className="font-semibold text-white truncate">{chef.username}</span>
                    <span className="text-gray-400 truncate">{chef.email}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-center capitalize
                      ${chef.status === "active" ? "bg-green-900/40 text-green-400 border border-green-800" : "bg-red-900/40 text-red-400 border border-red-800"}`}>
                      {chef.status}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(chef.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="grid grid-cols-[50px_1fr_1fr_1fr_100px] gap-4 px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700">
              <span>ID</span>
              <span>Name</span>
              <span>Address</span>
              <span>Created</span>
              <span>Verified</span>
            </div>

            {profiles.length === 0 ? (
              <div className="px-5 py-12 text-center text-gray-500 text-sm">No profiles created yet.</div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {profiles.map((prof) => {
                  let displayAddr = prof.address || "—";
                  try {
                    const a = JSON.parse(prof.address);
                    if (a && typeof a === "object" && a.city) {
                      displayAddr = [a.streetAddress, a.unit, a.city, a.province, a.postalCode]
                        .filter(Boolean).join(", ");
                    }
                  } catch { /* not JSON, show raw */ }

                  return (
                    <div key={prof.id} className="grid grid-cols-[50px_1fr_1fr_1fr_100px] gap-4 px-5 py-3.5 text-sm items-center hover:bg-gray-700/30 transition-colors">
                      <span className="text-gray-500 font-mono text-xs">#{prof.id}</span>
                      <span className="font-semibold text-white truncate">
                        {prof.firstName} {prof.lastName}
                        {prof.preferredName && <span className="text-gray-500 font-normal"> ({prof.preferredName})</span>}
                      </span>
                      <span className="text-gray-400 truncate text-xs">{displayAddr}</span>
                      <span className="text-xs text-gray-500">{new Date(prof.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={async () => {
                          try {
                            const updated = await updateChefProfile(prof.id, { verified: !prof.verified });
                            setProfiles((prev) => prev.map((p) => p.id === prof.id ? updated : p));
                            setToast(`Profile ${updated.verified ? "verified" : "unverified"} successfully`);
                          } catch {
                            setToast("Failed to update verification status.");
                          }
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full text-center cursor-pointer transition-all
                          ${prof.verified
                            ? "bg-green-900/40 text-green-400 border border-green-800 hover:bg-green-900/60"
                            : "bg-amber-900/30 text-amber-400 border border-amber-800 hover:bg-amber-900/50"
                          }`}
                      >
                        {prof.verified ? "Verified" : "Verify"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
