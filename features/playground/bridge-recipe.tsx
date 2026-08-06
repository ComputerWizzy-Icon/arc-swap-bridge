"use client";

import { useState } from "react";

import { AmountInput } from "@/components/arc/amount-input";
import { useBridge } from "@/features/bridge/use-bridge";
import { RecipeShell } from "@/features/playground/recipe-shell";

const CODE = `import { getAppKit } from "@/lib/arc";

const quote = await getAppKit().estimateBridge({
  from: { adapter, chain: "Arc_Testnet" },
  to: { adapter, chain: "Base_Sepolia" },
  amount: "10",
  token: "USDC",
  config: { transferSpeed: "FAST" },
});`;

export function BridgeRecipe() {
  const { estimate } = useBridge();
  const [amount, setAmount] = useState("10");

  return (
    <RecipeShell
      title="Estimate a bridge"
      method="estimateBridge"
      description="Quote a cross-chain USDC transfer via CCTP from Arc to Base Sepolia, including service and gas fees."
      code={CODE}
      inputs={
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">
            Amount (Arc → Base Sepolia)
          </label>
          <AmountInput
            value={amount}
            onChange={setAmount}
            symbol="USDC"
            ariaLabel="Bridge amount"
          />
        </div>
      }
      onRun={() =>
        estimate.mutate({
          fromChain: "Arc_Testnet",
          toChain: "Base_Sepolia",
          amount,
          speed: "FAST",
        })
      }
      isPending={estimate.isPending}
      error={estimate.error}
      result={estimate.data}
      disabled={Number(amount) <= 0}
    />
  );
}
