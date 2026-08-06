import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import { Providers } from "@/providers";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: {
    default: "ArcFlow — USDC-native swaps, bridges & payments on Arc",
    template: "%s · ArcFlow",
  },
  description:
    "ArcFlow is a production-grade consumer and developer app on Arc Network. Swap, bridge, send and spend USDC across chains with Circle App Kit — gas paid in USDC.",
  applicationName: "ArcFlow",
  keywords: [
    "Arc",
    "Arc Network",
    "Circle",
    "App Kit",
    "USDC",
    "EURC",
    "CCTP",
    "cross-chain",
    "stablecoin",
  ],
  authors: [{ name: "ArcFlow" }],
  openGraph: {
    title: "ArcFlow — USDC-native finance on Arc",
    description:
      "Swap, bridge, send and spend USDC across chains with Circle App Kit on Arc.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
