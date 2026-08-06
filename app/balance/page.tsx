import type { Metadata } from "next";

import { FeatureShell } from "@/components/layout/feature-shell";
import { UnifiedBalanceView } from "@/features/unified-balance/unified-balance-view";

export const metadata: Metadata = {
  title: "Unified Balance · ArcFlow",
  description: "Manage your pooled USDC balance across chains with Circle Gateway.",
};

export default function UnifiedBalancePage() {
  return (
    <FeatureShell
      title="Unified Balance"
      description="Deposit USDC into a pooled account across chains, then spend from any source to any destination. Powered by Circle Gateway."
    >
      <UnifiedBalanceView />
    </FeatureShell>
  );
}
