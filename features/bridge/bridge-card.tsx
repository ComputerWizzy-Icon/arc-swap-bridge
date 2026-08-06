"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Zap } from "lucide-react";

import { AmountInput } from "@/components/arc/amount-input";
import { ChainSelect } from "@/components/arc/chain-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  ARC_CHAIN_ID,
  chainsFor,
  formatToken,
  isEvmAddress,
  toUserMessage,
  type ChainId,
} from "@/lib/arc";
import { cn } from "@/lib/utils";
import {
  useBridge,
  type BridgeFormState,
  type TransferSpeed,
} from "@/features/bridge/use-bridge";
import { BridgeProgress } from "@/features/bridge/bridge-progress";

const SPEEDS: { value: TransferSpeed; label: string; hint: string }[] = [
  { value: "FAST", label: "Fast", hint: "Seconds · CCTP fast transfer" },
  { value: "SLOW", label: "Standard", hint: "Lower fee · standard finality" },
];

export function BridgeCard() {
  const bridgeChains = useMemo(() => chainsFor("bridge"), []);
  const { estimate, execute } = useBridge();
  const { toast } = useToast();

  const [fromChain, setFromChain] = useState<ChainId>(ARC_CHAIN_ID);
  const [toChain, setToChain] = useState<ChainId>(
    bridgeChains.find((c) => c.id !== ARC_CHAIN_ID)?.id ?? ARC_CHAIN_ID,
  );
  const [amount, setAmount] = useState("");
  const [speed, setSpeed] = useState<TransferSpeed>("FAST");
  const [recipient, setRecipient] = useState("");

  const recipientValid = recipient === "" || isEvmAddress(recipient);
  const canSubmit =
    Number(amount) > 0 && fromChain !== toChain && recipientValid;

  const form: BridgeFormState = {
    fromChain,
    toChain,
    amount,
    speed,
    recipient: recipient || undefined,
  };

  const swapChains = () => {
    setFromChain(toChain);
    setToChain(fromChain);
    estimate.reset();
    execute.reset();
  };

  const onEstimate = () =>
    estimate.mutate(form, {
      onError: (e) =>
        toast({
          variant: "error",
          title: "Estimate failed",
          description: toUserMessage(e),
        }),
    });

  const onBridge = () =>
    execute.mutate(form, {
      onSuccess: () =>
        toast({
          variant: "success",
          title: "Bridge initiated",
          description: `${formatToken(amount, "USDC")} · ${fromChain} → ${toChain}`,
        }),
      onError: (e) =>
        toast({
          variant: "error",
          title: "Bridge failed",
          description: toUserMessage(e),
        }),
    });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
      <Card className="h-fit">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <h2 className="text-sm font-medium text-muted-foreground">
            Bridge USDC
          </h2>

          {/* Route */}
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs text-muted-foreground">From</label>
              <ChainSelect
                value={fromChain}
                chains={bridgeChains}
                onChange={(v) => {
                  setFromChain(v);
                  estimate.reset();
                }}
                disabledValue={toChain}
                className="w-full"
              />
            </div>
            <button
              onClick={swapChains}
              className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-primary"
              aria-label="Swap direction"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs text-muted-foreground">To</label>
              <ChainSelect
                value={toChain}
                chains={bridgeChains}
                onChange={(v) => {
                  setToChain(v);
                  estimate.reset();
                }}
                disabledValue={fromChain}
                className="w-full"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Amount</label>
            <AmountInput
              value={amount}
              onChange={(v) => {
                setAmount(v);
                estimate.reset();
              }}
              symbol="USDC"
              ariaLabel="Bridge amount"
            />
          </div>

          {/* Speed */}
          <div className="grid grid-cols-2 gap-2">
            {SPEEDS.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  setSpeed(s.value);
                  estimate.reset();
                }}
                className={cn(
                  "rounded-lg border p-3 text-left transition-colors",
                  speed === s.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/40",
                )}
              >
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  {s.value === "FAST" && (
                    <Zap className="h-3.5 w-3.5 text-primary" />
                  )}
                  {s.label}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {s.hint}
                </div>
              </button>
            ))}
          </div>

          {/* Recipient */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Recipient (optional)
            </label>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x… defaults to your address"
              className={cn(!recipientValid && "border-destructive")}
            />
            {!recipientValid && (
              <p className="text-xs text-destructive">
                Enter a valid 0x address.
              </p>
            )}
          </div>

          {/* Quote */}
          {estimate.data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3 text-xs"
            >
              {estimate.data.serviceFees.map((f, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-muted-foreground">Fee · {f.type}</span>
                  <span className="font-medium tabular-nums">
                    {formatToken(f.amount, f.token)}
                  </span>
                </div>
              ))}
              {estimate.data.gasFees.map((g, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-muted-foreground">Gas · {g.chain}</span>
                  <span className="font-medium tabular-nums">
                    {formatToken(g.fee, g.token)}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={!canSubmit || estimate.isPending}
              onClick={onEstimate}
            >
              {estimate.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Estimate
            </Button>
            <Button
              className="flex-1"
              disabled={!canSubmit || execute.isPending}
              onClick={onBridge}
            >
              {execute.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Bridge
            </Button>
          </div>
        </CardContent>
      </Card>

      <BridgeProgress
        execution={execute.data}
        isPending={execute.isPending}
        fromChain={fromChain}
        toChain={toChain}
        amount={amount}
      />
    </div>
  );
}
