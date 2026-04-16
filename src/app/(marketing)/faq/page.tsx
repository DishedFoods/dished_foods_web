import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import Link from "next/link";

export const metadata = {
  title: "FAQ — Dished",
  description:
    "Common questions about Dished: food safety, payments, delivery, role-switching, and more.",
};

export default function FAQPage() {
  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <Navbar />

      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-5 md:px-10">
        <div className="max-w-[760px] mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="eyebrow justify-center mb-5">Support</div>
            <h1
              className="font-serif mb-4"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                fontWeight: 800,
              }}
            >
              Frequently asked questions
            </h1>
            <p
              className="text-[15px] md:text-[16px] leading-relaxed max-w-[520px] mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Everything you need to know about cooking, ordering, and delivering
              with Dished.
            </p>
          </div>

          {/* Accordion */}
          <FAQAccordion />

          {/* Contact fallback */}
          <div
            className="mt-14 text-center rounded-2xl px-8 py-10"
            style={{
              background: "var(--surface-2, rgba(251,248,241,0.6))",
              border: "1px solid var(--hairline)",
            }}
          >
            <p
              className="font-serif text-[18px] font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Still have questions?
            </p>
            <p
              className="text-[14px] mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              We&rsquo;d love to hear from you. Reach out and we&rsquo;ll
              get back within 24 hours.
            </p>
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                         text-[13px] font-semibold tracking-wide
                         transition-all duration-200 hover:-translate-y-0.5"
              style={{
                color: "var(--bg, #fff)",
                background: "var(--brand, #D4AF37)",
              }}
            >
              Get in touch
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
