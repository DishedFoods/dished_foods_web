"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How does Dished verify food safety and kitchen hygiene?",
    answer:
      "Every cook on Dished undergoes a verification process that includes a virtual kitchen walkthrough, proof of local food-handling certification (where required by province), and agreement to our hygiene standards. We also monitor customer reviews for safety-related flags and conduct periodic re-checks. Our goal is to hold home kitchens to the same trust standard you'd expect from a restaurant — without the overhead.",
  },
  {
    question: "How do payments work on Dished?",
    answer:
      "Payments are processed securely through Stripe. When you place an order, your card is authorized immediately and charged once the cook confirms. Cooks receive payouts weekly, minus a small platform fee. Refunds for cancelled or disputed orders are handled within 3–5 business days. We never store your full card details — Stripe handles all PCI-compliant data.",
  },
  {
    question: "Can I be both a cook and a diner on Dished?",
    answer:
      "Absolutely. Many of our users wear both hats. You can register as a cook to list your dishes and earn, then switch to diner mode to browse and order from other home kitchens in your neighbourhood. Your single account supports both roles — no need to sign up twice. Just toggle your active role from your dashboard.",
  },
  {
    question: "How does delivery work? Can I pick up instead?",
    answer:
      "Dished offers both delivery and pickup. For delivery, orders are matched with local courier partners who handle the last mile. You'll see real-time tracking once your order is dispatched. If you prefer to pick up directly from the cook, select 'Pickup' at checkout and you'll receive the cook's address and a ready-time window. Cooks can also choose to offer only one option.",
  },
  {
    question: "What happens if I need to cancel an order?",
    answer:
      "You can cancel free of charge within 5 minutes of placing your order. After that window, cancellation is subject to the cook's policy — most cooks allow cancellation up to 1 hour before the scheduled prep time with a partial refund. If a cook cancels on their end, you'll receive a full refund automatically. Check the order details page for the specific cancellation terms.",
  },
  {
    question: "Is Dished available in my city?",
    answer:
      "We're currently rolling out across Canadian cities, starting with major metro areas. Join our waitlist with your city and we'll notify you the moment we launch in your neighbourhood. If enough people from your area sign up, it helps us prioritize your city — so spread the word!",
  },
  {
    question: "How do I earn as a delivery partner?",
    answer:
      "Delivery partners set their own schedules and earn per delivery. You'll see available orders in your zone, along with the estimated distance, payout, and delivery window. Accept what works for you. Payouts are calculated based on distance and demand, with bonuses during peak hours. All you need is a reliable vehicle (bike, car, or scooter) and a smartphone.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {FAQ_DATA.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              background: isOpen
                ? "var(--surface, #ffffff)"
                : "var(--surface-2, rgba(251,248,241,0.6))",
              border: `1px solid ${isOpen ? "var(--accent, #D4AF37)" : "var(--hairline, rgba(0,0,0,0.06))"}`,
              boxShadow: isOpen
                ? "0 12px 36px -12px rgba(0,0,0,0.10)"
                : "none",
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left
                         cursor-pointer group"
              aria-expanded={isOpen}
            >
              <span
                className="font-serif text-[16px] md:text-[17px] font-semibold leading-snug
                           transition-colors duration-200"
                style={{
                  color: isOpen
                    ? "var(--text-primary)"
                    : "var(--text-secondary, #555)",
                }}
              >
                {item.question}
              </span>
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                           transition-all duration-300"
                style={{
                  background: isOpen
                    ? "var(--accent, #D4AF37)"
                    : "var(--surface, rgba(0,0,0,0.04))",
                  color: isOpen
                    ? "var(--bg, #fff)"
                    : "var(--text-muted, #999)",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>

            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: isOpen ? 300 : 0,
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="px-6 pb-6">
                <div
                  className="h-px mb-4"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--accent, #D4AF37) 0%, transparent 100%)",
                  }}
                />
                <p
                  className="text-[14.5px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
