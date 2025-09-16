"use client"

import { PrimaryButton } from "@/components/primary-button"
import { SpanDesign } from "@/components/span-design"

export function CTA1() {
  return (
    <section className="relative h-auto flex items-center justify-center overflow-hidden max-w-[1000px] mx-auto rounded-[40px] border border-[#0E282E]">
      {/* Background Videos */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 hidden lg:block rounded-[40px]"
      >
        <source
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/background_videos/WaterLightsStrong_Desktop.mp4"
          type="video/mp4"
        />
      </video>

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block lg:hidden rounded-[40px]"
      >
        <source
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/background_videos/WaterLightsStrong_Tablet.mp4"
          type="video/mp4"
        />
      </video>

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 block md:hidden rounded-[40px]"
      >
        <source
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/background_videos/WaterLightsStrong_Mobile.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-[#001212] opacity-81 z-10 rounded-[40px]"></div>

      <div className="relative z-20 w-full">
        <div className="py-20 px-0 text-center">
          {/* Header with SpanDesign */}
          <div className="mb-8">
            <SpanDesign>Meine Mission</SpanDesign>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-cinzel text-white mb-12 text-balance xl:text-6xl">
            Dein Weg mit Mir
          </h2>

          {/* Service Tags */}
          <div className="mb-12 space-y-6">
            {/* First Row */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="bg-black/30 backdrop-blur-sm border border-[#0E282E] rounded-full px-6 py-3">
                <span className="text-white font-montserrat-alt text-sm md:text-base">
                  DNA & Bewusstseins Aktivierung
                </span>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-[#0E282E] rounded-full px-6 py-3">
                <span className="text-white font-montserrat-alt text-sm md:text-base">Metaphysik</span>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-[#0E282E] rounded-full px-6 py-3">
                <span className="text-white font-montserrat-alt text-sm md:text-base">
                  Aktivierung kosmischer Codes
                </span>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-[#0E282E] rounded-full px-6 py-3">
                <span className="text-white font-montserrat-alt text-sm md:text-base">Decoding</span>
              </div>
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="bg-black/30 backdrop-blur-sm border border-[#0E282E] rounded-full px-6 py-3">
                <span className="text-white font-montserrat-alt text-sm md:text-base">
                  LCQ® / Light Code Quantum Transformation
                </span>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-[#0E282E] rounded-full px-6 py-3">
                <span className="text-white font-montserrat-alt text-sm md:text-base">Authentisches Channeling</span>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-[#0E282E] rounded-full px-6 py-3">
                <span className="text-white font-montserrat-alt text-sm md:text-base">Herzkohärenz Arbeiten</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-16">
            <PrimaryButton className="text-xl px-12 py-6">Bereit für deinen Weg?</PrimaryButton>
          </div>

          <div className="relative w-full overflow-visible flex flex-col items-center space-y-6">
            <p className="text-white/80 font-montserrat-alt text-lg">Du findest uns auch auf</p>

            {/* Social Media Links with LongAccents */}
            <div className="flex items-center justify-center w-full max-w-6xl h-8">
              {/* Left LongAccent */}
              <img
                src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/LongAccent.png"
                alt=""
                className="hidden md:block w-[500px] h-[42px] object-cover opacity-100 items-stretch"
              />

              {/* Social Media Icons */}
              <div className="flex items-center space-x-8 px-6 flex-shrink-0 mt-0 mb-5">
                <a
                  href="https://www.youtube.com/@Ozean-Licht"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <span className="font-montserrat-alt">YouTube</span>
                </a>

                <a
                  href="https://www.instagram.com/ozean_licht/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645-.069-4.849-.069zm0-2.163c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <span className="font-montserrat-alt">Instagram</span>
                </a>

                <a
                  href="https://t.me/lialohmann"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <span className="font-montserrat-alt">Telegram</span>
                </a>
              </div>

              {/* Right LongAccent */}
              <img
                src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/LongAccent.png"
                alt=""
                className="hidden md:block w-[500px] h-[42px] object-cover scale-x-[-1] opacity-100"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
