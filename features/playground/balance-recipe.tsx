"use client";

import { useUnifiedBalance } from "@/features/unified-balance/use-unified-balance";
import { RecipeShell } from "@/features/playground/recipe-shell";

const CODE = `import { getAppKit } from "@/lib/arc";

const balances = await getAppKit().unifiedBalance.getBalances({
  token: "USDC",
  sources: { adapter },
});
// → { token, totalConfirmedBalance, breakdown: [...] }`;

export function BalanceRecipe() {
  const { balances } = useUnifiedBalance();

  return (
    <RecipeShell
      title="Read unified balance"
      method="unifiedBalance.getBalances"
      description="Fetch the aggregated and per-chain USDC balance for the connected wallet across all Gateway-supported chains."
      code={CODE}
      onRun={() => balances.refetch()}
      isPending={balances.isFetching}
      error={balances.error}
      result={balances.data}
    />
  );
}
