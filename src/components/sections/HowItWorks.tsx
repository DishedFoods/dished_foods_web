import { ShieldIcon, CalendarIcon, TruckIcon } from "@/components/ui/Icons";

const STEPS = [
  {
    step: "1",
    icon: <ShieldIcon />,
    title: "Vetted Chefs",
    desc: "Every chef undergoes identity verification, food handling certification, and provincial health compliance review before their first order.",
  },
  {
    step: "2",
    icon: <CalendarIcon />,
    title: "Order in Advance",
    desc: "Browse chef availability, select your cuisine, and schedule pickup or delivery. Fresh, made-to-order — never mass produced.",
  },
  {
    step: "3",
    icon: <TruckIcon />,
    title: "Fresh Delivery",
    desc: "Your meal is prepared same-day with love. Track your order in real-time and enjoy authentic home cooking at your doorstep.",
  },
];

function HowCard({
  step, icon, title, desc,
}: {
  step: string; icon: React.ReactNode; title: string; desc: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-8 text-center relative border border-green-100
                 overflow-hidden card-hover"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
    >
      {/* Watermark step number */}
      <div className="absolute -top-2 -right-1 font-serif font-black text-[96px]
                      text-green-100 select-none pointer-events-none leading-none">
        {step}
      </div>

      {/* Icon */}
      <div className="w-[56px] h-[56px] rounded-xl bg-green-50 border border-green-200
                      flex items-center justify-center mx-auto mb-5 text-green-600 relative">
        {icon}
      </div>

      <h3 className="font-serif font-bold text-[19px] text-gray-900 mb-2.5 relative">{title}</h3>
      <p className="text-gray-600 leading-[1.75] text-[13.5px] relative">{desc}</p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-section" className="bg-white py-14 px-5 md:py-20 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-14">
          <div className="eyebrow justify-center mb-3">
            Simple &amp; Transparent
          </div>
          <h2 className="font-serif font-black text-[38px] text-gray-900 mb-2.5">
            How Dished Works
          </h2>
          <p className="text-gray-500 text-base max-w-[440px] mx-auto">
            From discovery to delivery — effortless for chefs and food lovers alike.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-7">
          {STEPS.map((s) => <HowCard key={s.step} {...s} />)}
        </div>
      </div>
    </section>
  );
}
