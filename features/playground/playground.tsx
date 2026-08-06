"use client";

import { SwapRecipe } from "@/features/playground/swap-recipe";
import { BridgeRecipe } from "@/features/playground/bridge-recipe";
import { SendRecipe } from "@/features/playground/send-recipe";
import { BalanceRecipe } from "@/features/playground/balance-recipe";

export function Playground() {
  return (
    <div className="space-y-6">
      <SwapRecipe />
      <BridgeRecipe />
      <SendRecipe />
      <BalanceRecipe />
    </div>
  );
}
