import type React from "react"
import type { Metadata } from "next"
import { Cinzel_Decorative, Montserrat, Montserrat_Alternates } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cinzel-decorative",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-montserrat",
})

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat-alternates",
})

export const metadata: Metadata = {
  title: "Ozean Licht",
  description: "Ozean Licht - Your Ocean of Light",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${cinzelDecorative.variable} ${montserrat.variable} ${montserratAlternates.variable}`}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
