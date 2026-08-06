"use client";

import { useState } from "react";

import { AmountInput } from "@/components/arc/amount-input";
import { Input } from "@/components/ui/input";
import { isEvmAddress } from "@/lib/arc";
import { useSend } from "@/features/send/use-send";
import { RecipeShell } from "@/features/playground/recipe-shell";

const CODE = `import { getAppKit } from "@/lib/arc";

const estimate = await getAppKit().estimateSend({
  from: { adapter, chain: "Arc_Testnet" },
  to: "0xRecipient…",
  amount: "10",
  token: "USDC",
});`;

export function SendRecipe() {
  const { estimate } = useSend();
  const [amount, setAmount] = useState("10");
  const [recipient, setRecipient] = useState("");

  const recipientValid = isEvmAddress(recipient);

  return (
    <RecipeShell
      title="Estimate a send"
      method="estimateSend"
      description="Prepare a transfer and return the network fee without broadcasting. Enter a recipient to resolve the destination."
      code={CODE}
      inputs={
        <>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Amount</label>
            <AmountInput
              value={amount}
              onChange={setAmount}
              symbol="USDC"
              ariaLabel="Send amount"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Recipient</label>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x…"
            />
          </div>
        </>
      }
      onRun={() =>
        estimate.mutate({
          chain: "Arc_Testnet",
          token: "USDC",
          amount,
          recipient,
        })
      }
      isPending={estimate.isPending}
      error={estimate.error}
      result={estimate.data}
      disabled={Number(amount) <= 0 || !recipientValid}
    />
  );
}
