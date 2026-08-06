"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Loader2, Settings2 } from "lucide-react";

import { AmountInput } from "@/components/arc/amount-input";
import { TokenSelect } from "@/components/arc/token-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  bpsToPercent,
  formatAmount,
  formatToken,
  tokensFor,
  toUserMessage,
  type TokenSymbol,
} from "@/lib/arc";
import { cn } from "@/lib/utils";
import { useSwap, type SwapFormState } from "@/features/swap/use-swap";
import { SwapResultCard } from "@/features/swap/swap-result";

const SLIPPAGE_OPTIONS = [50, 100, 300] as const;

export function SwapCard() {
  const swapTokens = useMemo(() => tokensFor("swap"), []);
  const { estimate, execute } = useSwap();
  const { toast } = useToast();

  const [tokenIn, setTokenIn] = useState<TokenSymbol>("USDC");
  const [tokenOut, setTokenOut] = useState<TokenSymbol>("EURC");
  const [amountIn, setAmountIn] = useState("");
  const [slippageBps, setSlippageBps] = useState<number>(300);
  const [showSettings, setShowSettings] = useState(false);

  const quote = estimate.data;
  const canQuote =
    Number(amountIn) > 0 && tokenIn !== tokenOut && !estimate.isPending;

  const form: SwapFormState = { tokenIn, tokenOut, amountIn, slippageBps };

  const flip = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    estimate.reset();
    execute.reset();
  };

  const onQuote = () => {
    execute.reset();
    estimate.mutate(form, {
      onError: (e) =>
        toast({
          variant: "error",
          title: "Quote failed",
          description: toUserMessage(e),
        }),
    });
  };

  const onSwap = () => {
    execute.mutate(form, {
      onSuccess: (r) =>
        toast({
          variant: "success",
          title: "Swap submitted",
          description: `${formatToken(amountIn, tokenIn)} → ${formatToken(
            r.amountOut,
            tokenOut,
          )}`,
        }),
      onError: (e) =>
        toast({
          variant: "error",
          title: "Swap failed",
          description: toUserMessage(e),
        }),
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <Card className="h-fit">
        <CardContent className="space-y-1 p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Swap on Arc
            </h2>
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Swap settings"
            >
              <Settings2 className="h-4 w-4" />
            </button>
          </div>

          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-3 rounded-lg border border-border bg-muted/30 p-3"
            >
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Slippage tolerance
              </p>
              <div className="flex gap-2">
                {SLIPPAGE_OPTIONS.map((bps) => (
                  <button
                    key={bps}
                    onClick={() => setSlippageBps(bps)}
                    className={cn(
                      "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                      slippageBps === bps
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {bpsToPercent(bps)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sell */}
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>You pay</span>
            </div>
            <div className="flex items-center gap-3">
              <AmountInput
                value={amountIn}
                onChange={(v) => {
                  setAmountIn(v);
                  estimate.reset();
                }}
                ariaLabel="Amount to swap"
                className="flex-1 border-0 bg-transparent px-0 focus-within:ring-0"
              />
              <TokenSelect
                value={tokenIn}
                tokens={swapTokens}
                onChange={(v) => {
                  setTokenIn(v);
                  if (v === tokenOut) setTokenOut(tokenIn);
                  estimate.reset();
                }}
                className="w-32"
              />
            </div>
          </div>

          {/* Flip */}
          <div className="relative flex h-2 justify-center">
            <button
              onClick={flip}
              className="absolute -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-primary"
              aria-label="Flip tokens"
            >
              <ArrowDownUp className="h-4 w-4" />
            </button>
          </div>

          {/* Buy */}
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>You receive (estimated)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 truncate text-lg font-medium tabular-nums">
                {quote ? formatAmount(quote.estimatedOutput) : "0.00"}
              </div>
              <TokenSelect
                value={tokenOut}
                tokens={swapTokens}
                onChange={(v) => {
                  setTokenOut(v);
                  if (v === tokenIn) setTokenIn(tokenOut);
                  estimate.reset();
                }}
                className="w-32"
              />
            </div>
          </div>

          {/* Quote details */}
          {quote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 space-y-1.5 rounded-lg border border-border bg-muted/20 p-3 text-xs"
            >
              <Row label="Rate">
                1 {tokenIn} ≈{" "}
                {formatAmount(
                  Number(quote.estimatedOutput) / (Number(amountIn) || 1),
                  4,
                )}{" "}
                {tokenOut}
              </Row>
              <Row label={`Min. received (${bpsToPercent(slippageBps)} slip)`}>
                {formatToken(quote.minReceived, quote.outputToken)}
              </Row>
              {quote.fees.map((fee, i) => (
                <Row key={i} label={`Fee · ${fee.label}`}>
                  {formatToken(fee.amount, fee.token)}
                </Row>
              ))}
            </motion.div>
          )}

          <div className="pt-3">
            {!quote ? (
              <Button
                className="h-11 w-full"
                disabled={!canQuote}
                onClick={onQuote}
              >
                {estimate.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {tokenIn === tokenOut ? "Select different tokens" : "Preview swap"}
              </Button>
            ) : (
              <Button
                className="h-11 w-full"
                disabled={execute.isPending}
                onClick={onSwap}
              >
                {execute.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {execute.isPending ? "Confirm in wallet…" : "Swap"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <SwapResultCard
        execution={execute.data}
        isPending={execute.isPending}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
      />
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{children}</span>
    </div>
  );
}
