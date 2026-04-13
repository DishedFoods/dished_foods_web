import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LeadCaptureForm } from "@/components/sections/LeadCaptureForm";

export const metadata = {
  title: "Join the Wait List — Dished",
  description: "Be the first to know when Dished launches in your Canadian neighbourhood.",
};

export default function WaitlistPage() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen pt-32 pb-16 px-5 flex items-center justify-center bg-gradient-to-br from-green-50/40 to-white">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-green-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-8 md:p-12">
          <LeadCaptureForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
