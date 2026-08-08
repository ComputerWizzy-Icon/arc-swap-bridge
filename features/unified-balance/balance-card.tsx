"use client";

import { RefreshCw, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { chainLabel, formatToken } from "@/lib/arc";
import type { GetBalancesResult } from "@/features/unified-balance/use-unified-balance";

interface BalanceCardProps {
  balances?: GetBalancesResult;
  isLoading: boolean;
  onRefresh: () => void;
}

export function BalanceCard({
  balances,
  isLoading,
  onRefresh,
}: BalanceCardProps) {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            Unified Balance
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw
              className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
          </Button>
        </div>

        {balances ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="text-sm text-muted-foreground">
                Total confirmed
              </div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">
                {formatToken(balances.totalConfirmedBalance, "USDC")}
              </div>
            </div>

            {balances.breakdown.map((account) => (
              <div
                key={account.depositor}
                className="space-y-2 rounded-lg border border-border bg-card p-3"
              >
                <div className="text-xs text-muted-foreground">
                  Account {account.depositor.slice(0, 6)}…
                  {account.depositor.slice(-4)}
                </div>
                <div className="text-sm font-medium">
                  {formatToken(account.totalConfirmed, "USDC")}
                </div>
                <div className="space-y-1">
                  {account.breakdown.map((chain, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-muted-foreground">
                        {chainLabel(chain.chain)}
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatToken(chain.confirmedBalance, "USDC")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wallet className="h-6 w-6" />
            </div>
            <p className="font-medium">
              {isLoading ? "Loading balance…" : "No balance data"}
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              {isLoading
                ? "Fetching your unified balance across chains"
                : "Connect a wallet to view your unified balance"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
