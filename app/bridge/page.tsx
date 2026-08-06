import type { Metadata } from "next";

import { FeatureShell } from "@/components/layout/feature-shell";
import { BridgeCard } from "@/features/bridge/bridge-card";

export const metadata: Metadata = {
  title: "Bridge · ArcFlow",
  description: "Move native USDC across chains via Circle CCTP.",
};

export default function BridgePage() {
  return (
    <FeatureShell
      title="Bridge"
      description="Transfer native USDC across chains using Circle CCTP. Choose fast or standard finality, preview fees, and track each step of the cross-chain transfer."
    >
      <BridgeCard />
    </FeatureShell>
  );
}
