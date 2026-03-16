import Image from "next/image";
import { MapleLeafIcon, HomeIcon, ShieldIcon, GlobeIcon } from "@/components/ui/Icons";
import { GALLERY_PHOTOS } from "@/lib/data";

const VALUES = [
  { icon: <HomeIcon size={20} />,   t: "Community First",  d: "We serve every Canadian province, from Victoria to St. John's." },
  { icon: <ShieldIcon />,           t: "Safety & Trust",   d: "Every chef is verified. Every kitchen inspected. Every order protected." },
  { icon: <GlobeIcon size={20} />,  t: "Cultural Pride",   d: "140+ cuisines represented across our growing chef community." },
];

export function AboutSection() {
  return (
    <section id="about-section" className="bg-[#f0faf8] py-14 px-5 md:py-20 md:px-12">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

        {/* Left — story */}
        <div>
          <div className="eyebrow mb-3.5">
            Our Story
          </div>
          <h2 className="font-serif font-black text-[36px] text-gray-900 leading-[1.2] mb-5">
            Food that carries a story, a culture, a home.
          </h2>
          <p className="text-gray-500 leading-[1.85] text-[15.5px] mb-4">
            Dished was born from a simple belief: the best meals in Canada aren&apos;t in
            restaurants. They&apos;re in the kitchens of a Punjabi auntie in Brampton, a
            Jamaican grandma in Scarborough, a Vietnamese family in Richmond.
          </p>
          <p className="text-gray-500 leading-[1.85] text-[15.5px] mb-7">
            We built a platform that lets culinary artisans share their heritage — legally,
            safely, and profitably — while connecting neighbours through the universal
            language of food.
          </p>

          <div className="flex flex-col gap-3.5">
            {VALUES.map(({ icon, t, d }) => (
              <div key={t} className="flex gap-3.5 items-start">
                <div className="w-[42px] h-[42px] rounded-xl flex-shrink-0
                                bg-gradient-to-br from-green-50 to-green-100
                                flex items-center justify-center text-green-700
                                border border-green-200">
                  {icon}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900 mb-0.5">{t}</div>
                  <div className="text-[13.5px] text-gray-400 leading-relaxed">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — gallery */}
        <div className="grid grid-cols-2 gap-2.5">
          {GALLERY_PHOTOS.map((src, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden shadow-lg transition-transform duration-300
                         hover:scale-[1.04] hover:rotate-[-1deg]"
              style={{ height: i % 2 === 0 ? 192 : 152, alignSelf: i % 2 === 0 ? "flex-start" : "flex-end" }}
            >
              <Image
                src={src}
                alt="chef kitchen"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          <div className="col-span-2 flex items-center justify-center gap-2 mt-1.5
                          text-sm text-green-600 font-bold">
            <MapleLeafIcon />
            Proudly Canadian · 10 Provinces · 140+ Cuisines
            <MapleLeafIcon />
          </div>
        </div>
      </div>
    </section>
  );
}
