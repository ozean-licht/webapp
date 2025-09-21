"use client"

import { SpanDesign } from "./span-design"
import { PrimaryButton } from "./primary-button"
import { InfoCard } from "./info-card"

export function CTA2() {
  const peopleImages = [
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/People%20Illustration/People_1.png",
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/People%20Illustration/People_2.png",
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/People%20Illustration/People_3.png",
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/People%20Illustration/People_4.png",
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/People%20Illustration/People_5.png",
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/People%20Illustration/People_6.png",
  ]

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Header with decorative elements */}
        <div className="mb-8">
          <SpanDesign>Entfalte dein Potential</SpanDesign>
        </div>

        {/* Main heading with animated people tickers on sides */}
        <div className="relative mb-8">
          {/* Animated people ticker - left side */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 hidden lg:block">
            <div className="bg-[#001212]/80 border-t border-b border-l border-[#0E282E] rounded-l-full py-2 px-3 overflow-hidden">
              <div className="flex animate-scroll-right gap-2">
                {[...peopleImages, ...peopleImages, ...peopleImages].map((src, index) => (
                  <div key={`left-${index}`} className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/20 bg-[#00151A] p-0.5">
                      <img
                        src={src || "/placeholder.svg"}
                        alt="Person illustration"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated people ticker - right side */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 hidden lg:block">
            <div className="bg-[#001212]/80 border-t border-b border-r border-[#0E282E] rounded-r-full py-2 px-3 overflow-hidden">
              <div className="flex animate-scroll-left gap-2">
                {[...peopleImages, ...peopleImages, ...peopleImages].map((src, index) => (
                  <div key={`right-${index}`} className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/20 bg-[#00151A] p-0.5">
                      <img
                        src={src || "/placeholder.svg"}
                        alt="Person illustration"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide">Komm in deine Kraft</h2>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-300 mb-16 max-w-2xl mx-auto leading-relaxed">
          In dir steckt bereits unendliches Wissen und tiefe Weisheit aus unzähligen Inkarnationen, bist du bereit all
          dieses Wissen in zu reaktivieren und in deine Meisterschaft zu bringen und zu verkörpern?
        </p>

        {/* Central logo */}
        <div className="flex justify-center mb-16">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <img
              src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/LogoOzeanLichtKomprimiert.png"
              alt="Ozean Licht Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-16 max-w-5xl mx-auto">
          <InfoCard
            heading="Mentale Evolution"
            paragraph="Bringe dein Bewusstsein in dein Herz und aktiviere die Kraft deines Herzportals"
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            }
          />
          <InfoCard
            heading="Herz Bewusstsein"
            paragraph="Aktiviere dein Herzportal und trete in tiefe Verbindung mit der Essenz deiner Seele"
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            }
          />
          <InfoCard
            heading="Verkörperung"
            paragraph="Verkörpere deine Weisheit und teile sie mit der Welt durch dein Menschsein."
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
          />
        </div>

        {/* CTA Button */}
        <PrimaryButton>Zu den Events</PrimaryButton>
      </div>

      <style jsx>{`
        @keyframes scroll-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }

        @keyframes scroll-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }

        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>

    </section>
  )
}
