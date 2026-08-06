import type { Metadata } from "next";

import { FeatureShell } from "@/components/layout/feature-shell";
import { SwapCard } from "@/features/swap/swap-card";

export const metadata: Metadata = {
  title: "Swap · ArcFlow",
  description: "Swap stablecoins on Arc with USDC-native gas.",
};

export default function SwapPage() {
  return (
    <FeatureShell
      title="Swap"
      description="Trade stablecoins on Arc Testnet with slippage control and live quotes. Powered by Circle App Kit; gas is paid in USDC."
    >
      <SwapCard />
    </FeatureShell>
  );
}
