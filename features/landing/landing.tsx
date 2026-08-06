"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  Coins,
  Fuel,
  Layers,
  Route,
  Send,
  Sparkles,
  Terminal,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ALL_CHAINS } from "@/lib/arc";

const FEATURES = [
  {
    href: "/swap",
    icon: ArrowLeftRight,
    title: "Swap",
    description:
      "Trade USDC, EURC, and USDT on Arc with live quotes and slippage control.",
  },
  {
    href: "/bridge",
    icon: Route,
    title: "Bridge",
    description:
      "Move native USDC across chains via Circle CCTP with fast or standard finality.",
  },
  {
    href: "/send",
    icon: Send,
    title: "Send",
    description:
      "Transfer stablecoins to any address with a network-fee estimate before you sign.",
  },
  {
    href: "/balance",
    icon: Layers,
    title: "Unified Balance",
    description:
      "Pool USDC across chains with Circle Gateway, then spend from any source.",
  },
] as const;

const PILLARS = [
  {
    icon: Fuel,
    title: "USDC-native gas",
    description:
      "Arc settles gas in USDC — no separate native token to acquire or manage. Users pay fees in the same asset they hold.",
  },
  {
    icon: Coins,
    title: "Stablecoin-first",
    description:
      "First-class support for USDC, EURC, and USDT across swap and send, with Circle's issuance and liquidity behind them.",
  },
  {
    icon: Route,
    title: "Cross-chain by default",
    description:
      "CCTP bridging and Gateway unified balances make multi-chain USDC feel like a single account.",
  },
] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built on Arc with Circle App Kit
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            USDC-native swaps, bridges &amp; payments on{" "}
            <span className="text-primary">Arc</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            ArcFlow is a production-grade reference app for Circle App Kit. Swap
            stablecoins, bridge native USDC across chains, send payments, and
            manage a unified balance — all with gas paid in USDC.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/swap">
                Launch app
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/playground">
                <Terminal className="mr-2 h-4 w-4" />
                Developer playground
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.href} variants={item}>
              <Link href={feature.href} className="group block h-full">
                <Card className="h-full transition-colors group-hover:border-primary/50">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    <div className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Open
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* What is Arc */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              What is Arc?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Arc is a stablecoin-native blockchain from Circle where USDC is the
              gas token. It&apos;s designed for payments and on-chain finance,
              pairing predictable USDC-denominated fees with Circle&apos;s
              cross-chain infrastructure — CCTP for native bridging and Gateway
              for unified balances.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.title}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium">{pillar.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported chains */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          Supported testnet chains
        </h2>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {ALL_CHAINS.map((chain) => (
            <div
              key={chain.id}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-sm"
            >
              <span className="text-base">{chain.glyph}</span>
              <span className="font-medium">{chain.label}</span>
              {chain.isArc && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  Native
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Developer CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="max-w-xl">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                See the SDK in action
              </h2>
              <p className="mt-2 text-muted-foreground">
                Every feature here is powered by <code>@circle-fin/app-kit</code>.
                The developer playground shows the exact calls — estimate, swap,
                bridge, send, and unified balance — with live inputs and results.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href="/playground">
                Explore the playground
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
