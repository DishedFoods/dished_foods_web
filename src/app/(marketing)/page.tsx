import { Navbar }               from "@/components/layout/Navbar";
import { RoleTilesHero }        from "@/components/sections/RoleTilesHero";
import { ChefShowcaseBanner }   from "@/components/sections/ChefShowcaseBanner";
import { ChefGrid }             from "@/components/sections/ChefGrid";
import { AboutSection }         from "@/components/sections/AboutSection";
import { BecomeChefCTA }        from "@/components/sections/BecomeChefCTA";
import { FAQAccordion }         from "@/components/sections/FAQAccordion";
import { Footer }               from "@/components/layout/Footer";
import { RoleThemeSetter }      from "@/components/providers/RoleThemeSetter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] overflow-x-hidden">
      {/* Reset to default "Classic Dished" theme when landing on / */}
      <RoleThemeSetter role="customer" />
      <Navbar />
      <RoleTilesHero />
      {/* Hidden for now — bring back if we want chef discovery on the landing page
      <ChefShowcaseBanner />
      <ChefGrid />
      */}
      <AboutSection />

      {/* FAQ — inline on homepage + full page at /faq */}
      <section id="faq-section" className="py-20 md:py-28 px-5 md:px-10">
        <div className="max-w-[760px] mx-auto">
          <div className="text-center mb-12">
            <div className="eyebrow justify-center mb-5">FAQ</div>
            <h2
              className="font-serif mb-3"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                fontWeight: 800,
              }}
            >
              Common questions
            </h2>
          </div>
          <FAQAccordion />
        </div>
      </section>

      <BecomeChefCTA />
      <Footer />
    </main>
  );
}
