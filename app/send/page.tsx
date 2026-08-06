import type { Metadata } from "next";

import { FeatureShell } from "@/components/layout/feature-shell";
import { SendCard } from "@/features/send/send-card";

export const metadata: Metadata = {
  title: "Send · ArcFlow",
  description: "Send USDC, EURC, and USDT to any address on Arc.",
};

export default function SendPage() {
  return (
    <FeatureShell
      title="Send"
      description="Transfer USDC, EURC, or USDT to any address. Estimate the network fee before submitting; gas is paid in USDC on Arc."
    >
      <SendCard />
    </FeatureShell>
  );
}
