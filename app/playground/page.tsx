import type { Metadata } from "next";

import { FeatureShell } from "@/components/layout/feature-shell";
import { Playground } from "@/features/playground/playground";

export const metadata: Metadata = {
  title: "Playground · ArcFlow",
  description: "Run live Circle App Kit calls and inspect the responses.",
};

export default function PlaygroundPage() {
  return (
    <FeatureShell
      title="Developer Playground"
      description="Run real Circle App Kit calls against Arc Testnet with your connected wallet. Each recipe shows the exact code and the live response."
    >
      <Playground />
    </FeatureShell>
  );
}
