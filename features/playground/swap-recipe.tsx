"use client";

import { useState } from "react";

import { AmountInput } from "@/components/arc/amount-input";
import { useSwap } from "@/features/swap/use-swap";
import { RecipeShell } from "@/features/playground/recipe-shell";

const CODE = `import { getAppKit } from "@/lib/arc";

const quote = await getAppKit().estimateSwap({
  from: { adapter, chain: "Arc_Testnet" },
  tokenIn: "USDC",
  tokenOut: "EURC",
  amountIn: "10",
  config: { slippageBps: 300 },
});`;

export function SwapRecipe() {
  const { estimate } = useSwap();
  const [amountIn, setAmountIn] = useState("10");

  return (
    <RecipeShell
      title="Estimate a swap"
      method="estimateSwap"
      description="Quote a same-chain swap on Arc: estimated output, minimum received after slippage, and fees."
      code={CODE}
      inputs={
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">
            Amount in (USDC → EURC)
          </label>
          <AmountInput
            value={amountIn}
            onChange={setAmountIn}
            symbol="USDC"
            ariaLabel="Swap amount"
          />
        </div>
      }
      onRun={() =>
        estimate.mutate({
          tokenIn: "USDC",
          tokenOut: "EURC",
          amountIn,
          slippageBps: 300,
        })
      }
      isPending={estimate.isPending}
      error={estimate.error}
      result={estimate.data}
      disabled={Number(amountIn) <= 0}
    />
  );
}
