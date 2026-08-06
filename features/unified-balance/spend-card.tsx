"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";

import { AmountInput } from "@/components/arc/amount-input";
import { ChainSelect } from "@/components/arc/chain-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  chainsFor,
  isEvmAddress,
  type ChainId,
} from "@/lib/arc";
import { cn } from "@/lib/utils";
import type {
  SpendAllocation,
  SpendFormState,
} from "@/features/unified-balance/use-unified-balance";

interface SpendCardProps {
  onSpend: (form: SpendFormState) => void;
  isPending: boolean;
}

export function SpendCard({ onSpend, isPending }: SpendCardProps) {
  const spendChains = useMemo(() => chainsFor("unifiedBalance"), []);

  const [allocations, setAllocations] = useState<SpendAllocation[]>([
    { amount: "", chain: spendChains[0]?.id ?? "Arc_Testnet" },
  ]);
  const [toChain, setToChain] = useState<ChainId>(
    spendChains[0]?.id ?? "Arc_Testnet",
  );
  const [recipient, setRecipient] = useState("");

  const totalAmount = allocations
    .reduce((sum, a) => sum + Number(a.amount || 0), 0)
    .toString();

  const recipientValid = recipient === "" || isEvmAddress(recipient);
  const canSubmit =
    allocations.every((a) => Number(a.amount) > 0) &&
    Number(totalAmount) > 0 &&
    recipientValid;

  const addAllocation = () => {
    setAllocations([
      ...allocations,
      { amount: "", chain: spendChains[0]?.id ?? "Arc_Testnet" },
    ]);
  };

  const removeAllocation = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const updateAllocation = (
    index: number,
    field: keyof SpendAllocation,
    value: string,
  ) => {
    const updated = [...allocations];
    updated[index] = { ...updated[index], [field]: value };
    setAllocations(updated);
  };

  const handleSpend = () => {
    if (!canSubmit) return;
    onSpend({
      allocations: allocations.filter((a) => Number(a.amount) > 0),
      toChain,
      amount: totalAmount,
      recipient: recipient || undefined,
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <h2 className="text-sm font-medium text-muted-foreground">
          Spend (Withdraw)
        </h2>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">
            Source allocations
          </label>
          {allocations.map((allocation, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-32">
                <ChainSelect
                  value={allocation.chain}
                  chains={spendChains}
                  onChange={(v) => updateAllocation(i, "chain", v)}
                  className="w-full"
                />
              </div>
              <AmountInput
                value={allocation.amount}
                onChange={(v) => updateAllocation(i, "amount", v)}
                symbol="USDC"
                ariaLabel={`Allocation ${i + 1} amount`}
                className="flex-1"
              />
              {allocations.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAllocation(i)}
                  className="h-9 w-9 shrink-0 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addAllocation}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add source
          </Button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">
            Destination chain
          </label>
          <ChainSelect
            value={toChain}
            chains={spendChains}
            onChange={setToChain}
            className="w-full"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">
            Recipient (optional)
          </label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x… defaults to your address"
            className={cn(
              recipient !== "" && !recipientValid && "border-destructive",
            )}
          />
          {recipient !== "" && !recipientValid && (
            <p className="text-xs text-destructive">
              Enter a valid 0x address.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total to spend</span>
            <span className="font-medium tabular-nums">{totalAmount} USDC</span>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={!canSubmit || isPending}
          onClick={handleSpend}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Spend
        </Button>

        <p className="text-xs text-muted-foreground">
          Pull funds from one or more source chains in your unified balance and
          mint them on the destination. Funds are allocated automatically if you
          use one source.
        </p>
      </CardContent>
    </Card>
  );
}
