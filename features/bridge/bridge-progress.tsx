"use client";

import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Loader2,
  Route,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { chainLabel, formatToken, shortenHash, type ChainId } from "@/lib/arc";
import type { BridgeExecution } from "@/features/bridge/use-bridge";

interface BridgeProgressProps {
  execution?: BridgeExecution;
  isPending: boolean;
  fromChain: ChainId;
  toChain: ChainId;
  amount: string;
}

function stepIcon(state: string) {
  switch (state) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-destructive" />;
    case "pending":
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
}

export function BridgeProgress({
  execution,
  isPending,
  fromChain,
  toChain,
  amount,
}: BridgeProgressProps) {
  return (
    <Card className="h-fit border-dashed bg-card/40">
      <CardContent className="p-5 sm:p-6">
        {execution ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transfer progress</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {execution.state}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 p-3 text-sm">
              <span className="font-medium">{chainLabel(fromChain)}</span>
              <Route className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{chainLabel(toChain)}</span>
              <span className="ml-auto font-medium tabular-nums text-primary">
                {formatToken(amount, "USDC")}
              </span>
            </div>
            <ol className="space-y-3">
              {execution.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5">{stepIcon(step.state)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {step.name}
                      </span>
                      {step.explorerUrl && step.txHash && (
                        <a
                          href={step.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          {shortenHash(step.txHash)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <span className="text-xs capitalize text-muted-foreground">
                      {step.state}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Route className="h-6 w-6" />
            </div>
            <p className="font-medium">
              {isPending ? "Bridging…" : "Cross-chain transfer"}
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Move native USDC across chains via Circle CCTP. Estimate first to
              preview fees, then track each step here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
