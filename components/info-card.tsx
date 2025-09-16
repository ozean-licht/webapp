import type { ReactNode } from "react"
import { PrimaryButton } from "./primary-button"

interface InfoCardProps {
  heading: string
  paragraph: string
  icon?: ReactNode
}

interface InfoCardWithButtonProps extends InfoCardProps {
  buttonText: string
  buttonHref?: string
}

export function InfoCard({ heading, paragraph, icon }: InfoCardProps) {
  return (
    <div
      className="relative border border-[#0E282E] bg-[#001212] rounded-lg overflow-hidden w-full h-auto"
      style={{ maxWidth: "450px", minWidth: "350px" }}
    >
      {/* Background Frame */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-0"
        style={{ width: "223px", height: "100px" }}
      >
        <img
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/TopLight.png"
          alt="Top Light Effect"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative flex justify-center z-10">
        <div className="relative flex items-end justify-center pb-2" style={{ width: "306px", height: "96px" }}>
          <img
            src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/CardFocus.png"
            alt="Card Focus Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute bottom-[19px] left-1/2 transform -translate-x-1/2 z-20">
            {icon || (
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>

          <div className="relative z-10">
            <div
              className="relative"
              style={{
                width: "46px",
                height: "46px",
                animation: "spin 3s linear infinite",
              }}
            >
              <img
                src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/CardMovingStroke.png"
                alt="Moving Stroke"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text Container */}
      <div className="px-6 pb-6 pt-4 text-center space-y-3 relative z-10">
        <h3 className="text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-montserrat-alternates)" }}>
          {heading}
        </h3>
        <p
          className="text-sm text-muted-foreground font-light leading-relaxed"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {paragraph}
        </p>
      </div>
    </div>
  )
}

export function InfoCardWithButton({ heading, paragraph, icon, buttonText, buttonHref }: InfoCardWithButtonProps) {
  return (
    <div
      className="relative border border-[#0E282E] bg-[#001212] rounded-lg overflow-hidden w-full h-auto"
      style={{ maxWidth: "450px", minWidth: "350px" }}
    >
      {/* Background Frame */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-0"
        style={{ width: "223px", height: "100px" }}
      >
        <img
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/TopLight.png"
          alt="Top Light Effect"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative flex justify-center z-10">
        <div className="relative flex items-end justify-center pb-2" style={{ width: "306px", height: "96px" }}>
          <img
            src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/CardFocus.png"
            alt="Card Focus Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute bottom-[19px] left-1/2 transform -translate-x-1/2 z-20">
            {icon || (
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>

          <div className="relative z-10">
            <div
              className="relative"
              style={{
                width: "46px",
                height: "46px",
                animation: "spin 3s linear infinite",
              }}
            >
              <img
                src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/CardMovingStroke.png"
                alt="Moving Stroke"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text Container */}
      <div className="px-6 pb-6 pt-4 text-center space-y-3 relative z-10">
        <p
          className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
        >
          {paragraph}
        </p>

        {/* Button */}
        <div className="pt-4">
          {buttonHref ? (
            <a href={buttonHref} className="block w-full">
              <PrimaryButton className="w-full">
                {buttonText}
              </PrimaryButton>
            </a>
          ) : (
            <PrimaryButton className="w-full">
              {buttonText}
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  )
}
