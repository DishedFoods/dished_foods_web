"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getChef,
  createChefProfile,
  updateChefProfile,
  type ChefProfileResponse,
} from "@/lib/api";
import { Toast } from "@/components/ui/Toast";
import { loadProfileExtras, saveProfileExtras, isProfileComplete } from "@/lib/profileExtras";
import type { ProfileExtras } from "@/lib/profileExtras";

const CUISINE_OPTIONS = [
  "Canadian", "Québécois", "Indigenous", "East Coast", "Prairie",
  "Italian", "French", "Mexican", "Thai", "Japanese",
  "Korean", "Ethiopian", "Caribbean", "Middle Eastern", "Mediterranean",
  "West African", "Latin American", "Vegetarian", "Vegan", "Gluten-Free",
];

const EXPERIENCE_OPTIONS = [
  "Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years",
];

const PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
];

interface ProfileFormData {
  firstName: string;
  lastName: string;
  preferredName: string;
  streetAddress: string;
  unit: string;
  city: string;
  province: string;
  postalCode: string;
  description: string;
  experience: string;
  cuisines: string[];
}


/** Simulate sending OTP — in a real app this would hit an API */
function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function parseAddress(address: string): { streetAddress: string; unit: string; city: string; province: string; postalCode: string } {
  // Try to parse stored address like "123 Main St, Unit 4, Toronto, ON, M5V 1A1"
  const defaults = { streetAddress: "", unit: "", city: "", province: "", postalCode: "" };
  if (!address) return defaults;

  // Check if it was stored in structured JSON format
  try {
    const parsed = JSON.parse(address);
    if (parsed && typeof parsed === "object" && parsed.streetAddress !== undefined) {
      return {
        streetAddress: parsed.streetAddress || "",
        unit: parsed.unit || "",
        city: parsed.city || "",
        province: parsed.province || "",
        postalCode: parsed.postalCode || "",
      };
    }
  } catch {
    // Not JSON, try comma-separated parsing
  }

  // Fallback: put entire string in streetAddress
  return { ...defaults, streetAddress: address };
}

function formatPostalCode(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  if (clean.length > 3) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  return clean;
}

/* ── Reusable input ───────────────────────────────── */
function Input({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium
                   bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none
                   transition-all disabled:bg-gray-50 disabled:text-gray-500 placeholder:text-gray-400"
        placeholder={placeholder}
      />
    </div>
  );
}

export default function ChefProfilePage() {
  const { user, isAdmin } = useAuth();
  const [profile, setProfile] = useState<ChefProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState<string | null>(null);

  // Verification state
  const [extras, setExtras]               = useState<ProfileExtras>({ experience: "", cuisines: [], phone: "", phoneVerified: false, emailVerified: false, defaultExpiryHours: 10 });
  const [emailOtp,     setEmailOtp]       = useState("");
  const [emailCode,    setEmailCode]      = useState<string | null>(null);
  const [emailSent,    setEmailSent]      = useState(false);
  const [phoneOtp,     setPhoneOtp]       = useState("");
  const [phoneCode,    setPhoneCode]      = useState<string | null>(null);
  const [phoneSent,    setPhoneSent]      = useState(false);
  const [phoneInput,   setPhoneInput]     = useState("");

  const [form, setForm] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    preferredName: "",
    streetAddress: "",
    unit: "",
    city: "",
    province: "",
    postalCode: "",
    description: "",
    experience: "",
    cuisines: [],
  });

  // ── Load profile from API + local storage extras ────
  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const chef = await getChef(user.id);
        if (chef.chefProfile) {
          setProfile(chef.chefProfile);
          const addr = parseAddress(chef.chefProfile.address || "");
          const ex = loadProfileExtras(user.id);
          setExtras(ex);
          setPhoneInput(ex.phone);
          setForm({
            firstName: chef.chefProfile.firstName || "",
            lastName: chef.chefProfile.lastName || "",
            preferredName: chef.chefProfile.preferredName || "",
            streetAddress: addr.streetAddress,
            unit: addr.unit,
            city: addr.city,
            province: addr.province,
            postalCode: addr.postalCode,
            description: chef.chefProfile.description || "",
            experience: ex.experience,
            cuisines: ex.cuisines,
          });
        } else {
          const ex = loadProfileExtras(user.id);
          setForm((f) => ({ ...f, experience: ex.experience, cuisines: ex.cuisines }));
          setExtras(ex);
          setPhoneInput(ex.phone);
        }
      } catch {
        // Profile not created yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const updateField = (field: keyof ProfileFormData, value: string | string[]) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleCuisine = (cuisine: string) => {
    setForm((f) => ({
      ...f,
      cuisines: f.cuisines.includes(cuisine)
        ? f.cuisines.filter((c) => c !== cuisine)
        : [...f.cuisines, cuisine],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setToast("First name and last name are required.");
      return;
    }

    setSaving(true);
    try {
      // Pack address fields into a structured JSON string for the single address API field
      const addressPayload = JSON.stringify({
        streetAddress: form.streetAddress.trim(),
        unit: form.unit.trim(),
        city: form.city.trim(),
        province: form.province,
        postalCode: form.postalCode.trim(),
      });

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        preferredName: form.preferredName.trim(),
        address: addressPayload,
        description: form.description.trim(),
      };

      if (profile) {
        const updated = await updateChefProfile(profile.id, payload);
        setProfile(updated);
      } else {
        const created = await createChefProfile(payload);
        setProfile(created);
      }

      saveProfileExtras(user.id, { experience: form.experience, cuisines: form.cuisines });

      setToast("Profile saved successfully!");
    } catch {
      setToast("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── OTP helpers ──────────────────────────────────────── */
  const sendEmailOtp = useCallback(() => {
    const code = generateOtp();
    setEmailCode(code);
    setEmailSent(true);
    setEmailOtp("");
    // In production this would call an API. For demo: alert shows the "sent" code.
    setTimeout(() => alert(`[Demo] Your email verification code is: ${code}\n(In production this would be sent to ${user?.email})`), 100);
  }, [user]);

  const verifyEmail = useCallback(() => {
    if (!user || emailOtp.trim() !== emailCode) { setToast("Incorrect code. Try again."); return; }
    const updated = { ...extras, emailVerified: true };
    setExtras(updated);
    saveProfileExtras(user.id, updated);
    setEmailSent(false);
    setEmailCode(null);
    setToast("Email verified!");
  }, [user, emailOtp, emailCode, extras]);

  const sendPhoneOtp = useCallback(() => {
    if (!phoneInput.trim()) { setToast("Enter a phone number first."); return; }
    const code = generateOtp();
    setPhoneCode(code);
    setPhoneSent(true);
    setPhoneOtp("");
    setTimeout(() => alert(`[Demo] Your phone verification code is: ${code}\n(In production this would be sent via SMS to ${phoneInput})`), 100);
  }, [phoneInput]);

  const verifyPhone = useCallback(() => {
    if (!user || phoneOtp.trim() !== phoneCode) { setToast("Incorrect code. Try again."); return; }
    const updated = { ...extras, phone: phoneInput, phoneVerified: true };
    setExtras(updated);
    saveProfileExtras(user.id, updated);
    setPhoneSent(false);
    setPhoneCode(null);
    setToast("Phone verified!");
  }, [user, phoneOtp, phoneCode, phoneInput, extras]);

  const saveExpiryDefault = useCallback((hours: number) => {
    if (!user) return;
    const updated = { ...extras, defaultExpiryHours: hours };
    setExtras(updated);
    saveProfileExtras(user.id, updated);
  }, [user, extras]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif font-black text-2xl text-gray-900">Chef Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal details, address, experience, and cuisines.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Verification Status Banner ─────────────── */}
        <section className={`rounded-2xl border p-4 flex items-center gap-4
          ${profile?.verified
            ? "bg-green-50 border-green-200"
            : "bg-amber-50 border-amber-200"
          }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
            ${profile?.verified
              ? "bg-green-100 text-green-600"
              : "bg-amber-100 text-amber-600"
            }`}>
            {profile?.verified ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className={`text-sm font-bold ${profile?.verified ? "text-green-800" : "text-amber-800"}`}>
              {profile?.verified ? "Profile Verified" : "Verification Pending"}
            </div>
            <div className={`text-xs mt-0.5 ${profile?.verified ? "text-green-600" : "text-amber-600"}`}>
              {profile?.verified
                ? "Your profile has been verified by an admin. You can accept orders."
                : "Your profile is awaiting admin verification. Complete all details to speed up the process."
              }
            </div>
          </div>
          {/* Verified badge */}
          <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border flex-shrink-0
            ${profile?.verified
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-amber-100 text-amber-700 border-amber-300"
            }`}>
            {profile?.verified ? "Verified" : "Pending"}
          </span>
        </section>

        {/* ── Personal Details ───────────────────────── */}
        <section className="bg-white rounded-2xl border border-green-200 p-5 md:p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Personal Details
          </h2>

          {/* Account info (read-only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Username</label>
              <div className="text-sm font-semibold text-gray-700">{user?.username}</div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
              <div className="text-sm font-semibold text-gray-700">{user?.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(v) => updateField("firstName", v)}
              placeholder="Alex"
              required
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(v) => updateField("lastName", v)}
              placeholder="Nair"
              required
            />
            <Input
              label="Preferred / Display Name"
              value={form.preferredName}
              onChange={(v) => updateField("preferredName", v)}
              placeholder="Chef Alex"
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bio / Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium
                         bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none
                         transition-all resize-none placeholder:text-gray-400"
              placeholder="Tell customers about yourself and your cooking style..."
            />
          </div>
        </section>

        {/* ── Full Address Section ────────────────────── */}
        <section className="bg-white rounded-2xl border border-green-200 p-5 md:p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Address
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Street Address"
                value={form.streetAddress}
                onChange={(v) => updateField("streetAddress", v)}
                placeholder="123 Main Street"
                className="sm:col-span-2"
              />
              <Input
                label="Unit / Apt"
                value={form.unit}
                onChange={(v) => updateField("unit", v)}
                placeholder="Unit 4B"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City"
                value={form.city}
                onChange={(v) => updateField("city", v)}
                placeholder="Toronto"
              />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Province</label>
                <select
                  value={form.province}
                  onChange={(e) => updateField("province", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium
                             bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none
                             transition-all cursor-pointer"
                >
                  <option value="">Select...</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Postal Code</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => updateField("postalCode", formatPostalCode(e.target.value))}
                  maxLength={7}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium
                             bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none
                             transition-all uppercase placeholder:text-gray-400"
                  placeholder="M5V 1A1"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Experience ──────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-green-200 p-5 md:p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            Cooking Experience
          </h2>

          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_OPTIONS.map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => updateField("experience", form.experience === exp ? "" : exp)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer
                  ${form.experience === exp
                    ? "bg-green-50 text-green-700 border-green-300 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-green-200 hover:text-green-600"
                  }`}
              >
                {form.experience === exp && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="inline mr-1 -mt-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {exp}
              </button>
            ))}
          </div>
        </section>

        {/* ── Cuisines ────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-green-200 p-5 md:p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
            Cuisines You Offer
          </h2>
          <p className="text-xs text-gray-400 mb-4">Select all cuisines you specialize in.</p>

          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((cuisine) => {
              const selected = form.cuisines.includes(cuisine);
              return (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => toggleCuisine(cuisine)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer
                    ${selected
                      ? "bg-green-50 text-green-700 border-green-300 shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-green-200 hover:text-green-600"
                    }`}
                >
                  {selected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="inline mr-1 -mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {cuisine}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Verification & Settings ────────────────── */}
        <section className="bg-white rounded-2xl border border-green-200 p-5 md:p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
            </svg>
            Verification &amp; Settings
          </h2>

          {/* Posting readiness indicator */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-semibold
            ${extras.emailVerified && extras.phoneVerified
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-amber-50 border-amber-200 text-amber-800"}`}>
            {extras.emailVerified && extras.phoneVerified ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            )}
            {extras.emailVerified && extras.phoneVerified
              ? "Profile complete — you can create posts."
              : "Verify your email and phone to unlock posting."}
          </div>

          {/* Email verification */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Email</label>
              {extras.emailVerified
                ? <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">Verified</span>
                : <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Not verified</span>}
            </div>
            <div className="flex gap-2">
              <input readOnly value={user?.email ?? ""} className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500" />
              {!extras.emailVerified && (
                <button type="button" onClick={sendEmailOtp}
                  className="px-4 py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                  {emailSent ? "Resend" : "Verify"}
                </button>
              )}
            </div>
            {emailSent && !extras.emailVerified && (
              <div className="flex gap-2 mt-2">
                <input value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100" />
                <button type="button" onClick={verifyEmail}
                  className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-700 transition-colors cursor-pointer">
                  Confirm
                </button>
              </div>
            )}
          </div>

          {/* Phone verification */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Phone</label>
              {extras.phoneVerified
                ? <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">Verified</span>
                : <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Not verified</span>}
            </div>
            <div className="flex gap-2">
              <input value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+1 416 555 0100" disabled={extras.phoneVerified}
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50 disabled:text-gray-500" />
              {!extras.phoneVerified && (
                <button type="button" onClick={sendPhoneOtp}
                  className="px-4 py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                  {phoneSent ? "Resend" : "Verify"}
                </button>
              )}
            </div>
            {phoneSent && !extras.phoneVerified && (
              <div className="flex gap-2 mt-2">
                <input value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100" />
                <button type="button" onClick={verifyPhone}
                  className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-700 transition-colors cursor-pointer">
                  Confirm
                </button>
              </div>
            )}
          </div>

          {/* Default order expiry */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
              Default Order Expiry
            </label>
            <p className="text-xs text-gray-400 mb-3">Posts will expire after this many hours by default. You can override per post.</p>
            <div className="flex flex-wrap gap-2">
              {[2, 4, 6, 8, 10, 12, 24, 48, 72].map((h) => (
                <button key={h} type="button" onClick={() => saveExpiryDefault(h)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer
                    ${extras.defaultExpiryHours === h
                      ? "bg-green-600 text-white border-green-600 shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"}`}>
                  {h}h
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              Current default: <span className="font-bold text-gray-700">{extras.defaultExpiryHours} hours</span>
            </p>
          </div>
        </section>

        {/* ── Save button ─────────────────────────────── */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-gray-400">
            {profile
              ? `Last updated: ${new Date(profile.updatedAt).toLocaleDateString()}`
              : "Profile not yet saved"
            }
          </p>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-8 py-3 text-sm flex items-center gap-2
                       disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
