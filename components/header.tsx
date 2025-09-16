"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavButton } from "./nav-button"
import { PrimaryButton } from "./primary-button"

export function Header() {
  const pathname = usePathname()
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-[30px] px-[6px]">
      <header
        className="w-full max-w-[1000px] mx-auto rounded-full border backdrop-blur-lg"
        style={{
          backgroundColor: "rgba(10, 20, 31, 0.6)",
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
            <Link href="/">
              <NavButton active={pathname === "/"}>Home</NavButton>
            </Link>
            <Link href="/about-lia">
              <NavButton active={pathname === "/about-lia"}>Über Lia</NavButton>
            </Link>
            <Link href="/contact">
              <NavButton active={pathname === "/contact"}>Kontakt</NavButton>
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/register">
              <Button
                className="text-white px-8 py-2 rounded-full font-medium font-montserrat hover:opacity-90 text-base bg-transparent border-none"
                size="lg"
              >
                Registrieren
              </Button>
            </Link>

            <Link href="/login">
              <PrimaryButton>Anmelden</PrimaryButton>
            </Link>
          </div>
        </div>
      </header>
    </div>
  )
}
