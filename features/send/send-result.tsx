"use client";

import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Send,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatToken, shortenHash, type TokenSymbol } from "@/lib/arc";
import type { SendExecution } from "@/features/send/use-send";

interface SendResultCardProps {
  execution?: SendExecution;
  isPending: boolean;
  token: TokenSymbol;
  amount: string;
  recipient: string;
}

export function SendResultCard({
  execution,
  isPending,
  token,
  amount,
  recipient,
}: SendResultCardProps) {
  const failed = execution?.state === "error";

  return (
    <Card className="h-fit border-dashed bg-card/40">
      <CardContent className="p-5 sm:p-6">
        {execution ? (
          <div className="space-y-4">
            <div
              className={
                failed
                  ? "flex items-center gap-2 text-destructive"
                  : "flex items-center gap-2 text-emerald-500"
              }
            >
              {failed ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
              <span className="font-medium">
                {failed ? "Transfer failed" : "Transfer submitted"}
              </span>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium tabular-nums text-primary">
                  {formatToken(amount, token)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">To</span>
                <span className="font-medium tabular-nums">
                  {shortenHash(recipient)}
                </span>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Step</dt>
                <dd className="font-medium capitalize">{execution.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium capitalize">{execution.state}</dd>
              </div>
              {execution.txHash && (
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
              )}
            </dl>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              {isPending ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </div>
            <p className="font-medium">
              {isPending ? "Sending…" : "Transfer summary"}
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Estimate the network fee, then send USDC, EURC, or USDT to any
              address. Gas is paid in USDC on Arc.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
