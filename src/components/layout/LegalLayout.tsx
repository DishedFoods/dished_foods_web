import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

interface Section { id: string; title: string }

interface Props {
  title: string;
  subtitle: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: Section[];
  children: ReactNode;
}

export function LegalLayout({ title, subtitle, effectiveDate, lastUpdated, sections, children }: Props) {
  return (
    <div className="min-h-screen bg-[#f0faf8]">

      {/* ── Top bar ── */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-40">
        <div className="max-w-[1100px] mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
              <Image src="/dished-icon.png" width={32} height={32} alt="Dished" className="w-full h-full object-cover" />
            </div>
            <span className="font-serif font-black text-lg text-gray-900">Dished</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 font-semibold hover:text-green-600 transition-colors">
            ← Back to site
          </Link>
        </div>
      </header>

      {/* ── Hero band ── */}
      <div className="bg-white border-b border-green-100 py-10 px-5">
        <div className="max-w-[760px] mx-auto">
          <div className="eyebrow mb-3">Legal</div>
          <h1 className="font-serif font-black text-[32px] md:text-[42px] text-gray-900 leading-tight mb-2">
            {title}
          </h1>
          <p className="text-gray-400 text-sm">{subtitle}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-[12px] text-gray-400">
            <span>Effective: <strong className="text-gray-600">{effectiveDate}</strong></span>
            <span>Last updated: <strong className="text-gray-600">{lastUpdated}</strong></span>
            <span>Jurisdiction: <strong className="text-gray-600">Ontario, Canada</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-5 py-10 flex gap-10 items-start">

        {/* ── Sidebar TOC (desktop) ── */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0 sticky top-[72px]">
          <div className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Contents</div>
            <nav className="flex flex-col gap-0.5">
              {sections.map(({ id, title: t }) => (
                <a key={id} href={`#${id}`}
                  className="text-[12.5px] text-gray-500 font-medium hover:text-green-700 hover:bg-green-50
                             px-2.5 py-1.5 rounded-lg transition-colors leading-snug">
                  {t}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Content ── */}
        <article className="flex-1 min-w-0 bg-white rounded-2xl border border-green-100 shadow-sm
                            px-7 md:px-10 py-8 legal-content">
          {children}
          <div className="mt-12 pt-6 border-t border-gray-100 text-[12.5px] text-gray-400 leading-relaxed">
            Questions about this document? Contact us at{" "}
            <a href="mailto:legal@dished.ca" className="text-green-600 font-semibold hover:underline">
              legal@dished.ca
            </a>
            {" "}· Dished Inc., Toronto, Ontario, Canada
          </div>
        </article>
      </div>
    </div>
  );
}
