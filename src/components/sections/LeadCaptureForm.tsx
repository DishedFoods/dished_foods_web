"use client";

import { useState } from "react";
import { CheckCircleIcon, AlertTriangleIcon } from "@/components/ui/Icons";

interface Props {
  compact?: boolean;
}

const ROLES = [
  { value: "foodie",   label: "I want to order home-cooked food" },
  { value: "cook",     label: "I want to cook & earn" },
  { value: "delivery", label: "I want to deliver meals" },
];

export function LeadCaptureForm({ compact = false }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [city, setCity]       = useState("");
  const [role, setRole]       = useState("foodie");
  const [excitement, setExcitement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !excitement.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^[+]?[\d\s()-]{7,}$/.test(phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone, city, role, excitement }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Submission failed. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-8">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <CheckCircleIcon size={32} />
        </div>
        <h3 className="font-serif font-black text-2xl text-gray-900">You&apos;re on the list!</h3>
        <p className="text-gray-500 max-w-sm">
          Thanks {firstName} — we&apos;ll reach out as soon as Dished launches
          {city ? ` in ${city}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${compact ? "" : "max-w-2xl mx-auto"}`}>
      <h2 className="font-serif font-black text-gray-900 mb-2" style={{ fontSize: "clamp(26px, 3vw, 38px)" }}>
        Join the Dished wait list
      </h2>
      <p className="text-gray-500 mb-6">
        Be the first to know when we launch in your neighbourhood. No spam — just one message at launch.
      </p>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name *"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500
                     outline-none transition-colors text-[15px]"
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name *"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500
                     outline-none transition-colors text-[15px]"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address *"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500
                     outline-none transition-colors text-[15px]"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number *"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500
                     outline-none transition-colors text-[15px]"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City / town (optional)"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500
                     outline-none transition-colors text-[15px]"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500
                     outline-none transition-colors bg-white text-[15px] sm:col-span-2"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <textarea
          value={excitement}
          onChange={(e) => setExcitement(e.target.value)}
          placeholder="What excites you most about registering with Dished? *"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500
                     outline-none transition-colors text-[15px] sm:col-span-2 resize-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium flex items-center gap-1.5 mt-3">
          <AlertTriangleIcon size={13} /> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full py-3.5 text-[15px] rounded-xl mt-4 disabled:opacity-60"
      >
        {submitting ? "Joining..." : "Join the Wait List"}
      </button>
    </form>
  );
}
