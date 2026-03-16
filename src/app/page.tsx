import { Navbar }               from "@/components/layout/Navbar";
import { HeroSection }          from "@/components/sections/HeroSection";
import { ChefShowcaseBanner }   from "@/components/sections/ChefShowcaseBanner";
import { ChefGrid }             from "@/components/sections/ChefGrid";
import { HowItWorks }           from "@/components/sections/HowItWorks";
import { AboutSection }         from "@/components/sections/AboutSection";
import { BecomeChefCTA }        from "@/components/sections/BecomeChefCTA";
import { Footer }               from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0faf8] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ChefShowcaseBanner />
      <ChefGrid />
      <HowItWorks />
      <AboutSection />
      <BecomeChefCTA />
      <Footer />
    </main>
  );
}
