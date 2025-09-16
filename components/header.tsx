import { Button } from "@/components/ui/button"
import Image from "next/image"
import { NavButton } from "./nav-button"
import { PrimaryButton } from "./primary-button"

export function Header() {
  return (
    <div className="pt-[30px] px-[6px]">
      <header
        className="w-full max-w-[1000px] mx-auto rounded-full border backdrop-blur-[5px]"
        style={{
          backgroundColor: "#0A141F",
          opacity: 0.8,
          borderColor: "#0E282E",
        }}
      >
        <div className="flex items-center justify-between px-3 py-2">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/LogoOzeanLichtKomprimiert.png"
              alt="Ozean Licht Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <h1 className="text-white text-xl tracking-wide font-cinzel">
              Ozean Licht<span className="text-sm align-super">™</span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-0">
            <NavButton active>Home</NavButton>
            <NavButton>Über Lia</NavButton>
            <NavButton>Kontakt</NavButton>
          </nav>

          <div className="flex items-center gap-1">
            <Button
              className="text-white px-8 py-2 rounded-full font-medium font-montserrat hover:opacity-90 text-base bg-transparent border-none"
              size="lg"
            >
              Registrieren
            </Button>

            <PrimaryButton>Anmelden</PrimaryButton>
          </div>
        </div>
      </header>
    </div>
  )
}
