"use client";

import { ArrowRight, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatToken, shortenHash, type TokenSymbol } from "@/lib/arc";
import type { SwapExecution } from "@/features/swap/use-swap";

interface SwapResultCardProps {
  execution?: SwapExecution;
  isPending: boolean;
  tokenIn: TokenSymbol;
  tokenOut: TokenSymbol;
  amountIn: string;
}

export function SwapResultCard({
  execution,
  isPending,
  tokenIn,
  tokenOut,
  amountIn,
}: SwapResultCardProps) {
  return (
    <Card className="h-fit border-dashed bg-card/40">
      <CardContent className="p-5 sm:p-6">
        {execution ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Swap complete</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-4 text-sm">
              <span className="font-medium tabular-nums">
                {formatToken(amountIn, tokenIn)}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium tabular-nums text-primary">
                {formatToken(execution.amountOut, tokenOut)}
              </span>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium">{execution.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Transaction</dt>
                <dd>
                  {execution.explorerUrl ? (
                    <a
                      href={execution.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      {shortenHash(execution.txHash)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="font-medium">
                      {shortenHash(execution.txHash)}
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="font-medium">
              {isPending ? "Processing swap…" : "Your swap summary"}
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Preview a swap to see the estimated output, rate, and fees. Gas is
              paid in USDC on Arc.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
