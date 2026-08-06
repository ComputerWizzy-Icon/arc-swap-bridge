"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { AmountInput } from "@/components/arc/amount-input";
import { ChainSelect } from "@/components/arc/chain-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { chainsFor, type ChainId } from "@/lib/arc";
import type { DepositFormState } from "@/features/unified-balance/use-unified-balance";

interface DepositCardProps {
  onDeposit: (form: DepositFormState) => void;
  isPending: boolean;
}

export function DepositCard({ onDeposit, isPending }: DepositCardProps) {
  const depositChains = useMemo(() => chainsFor("unifiedBalance"), []);
  const { toast } = useToast();

  const [chain, setChain] = useState<ChainId>(depositChains[0]?.id ?? "Arc_Testnet");
  const [amount, setAmount] = useState("");

  const canSubmit = Number(amount) > 0;

  const handleDeposit = () => {
    if (!canSubmit) return;
    onDeposit({ chain, amount });
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <h2 className="text-sm font-medium text-muted-foreground">
          Deposit USDC
        </h2>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Chain</label>
          <ChainSelect
            value={chain}
            chains={depositChains}
            onChange={setChain}
            className="w-full"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Amount</label>
          <AmountInput
            value={amount}
            onChange={setAmount}
            symbol="USDC"
            ariaLabel="Deposit amount"
          />
        </div>

        <Button
          className="w-full"
          disabled={!canSubmit || isPending}
          onClick={handleDeposit}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Deposit
        </Button>

        <p className="text-xs text-muted-foreground">
          Deposit USDC into your unified balance account. Funds are pooled
          across chains and can be spent on any supported destination.
        </p>
      </CardContent>
    </Card>
  );
}
