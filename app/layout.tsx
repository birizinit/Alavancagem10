import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "ALAVANCAGEM 10X APP",
  description: "Opere automaticamente com a ALAVANCAGEM 10X AI",
  generator: "Gabriel Hernandes",
  manifest: "/manifest.json",
  keywords: ["trading", "wall street", "finance", "investment", "stocks"],
  authors: [{ name: "Gabriel Hernandes" }],
  creator: "Gabriel Hernandes",
  publisher: "Gabriel Hernandes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/noxlogo.png",
    shortcut: "/noxlogo.png",
    apple: "/noxlogo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ALAVANCAGEM 10X APP",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#000000ff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ALAVANCAGEM 10X APP" />
        <link rel="apple-touch-icon" href="/noxlogo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/noxlogo.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/noxlogo.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
