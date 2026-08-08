"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { UnifiedBalanceChain } from "@circle-fin/app-kit";

import { useArcAdapter } from "@/hooks/use-arc-adapter";
import { getAppKit } from "@/lib/arc";
import type { ChainId } from "@/lib/arc";

// chainsFor("unifiedBalance") has already filtered the UI to chains that
// support Gateway v1, so these identifiers are valid at runtime. The SDK's
// UnifiedBalanceChain union is narrower than our ChainId, so we cast at the
// boundary where the UI already enforces validity.
const asGatewayChain = (chain: ChainId) =>
  chain as unknown as UnifiedBalanceChain;

export interface BalanceBreakdown {
  depositor: string;
  totalConfirmed: string;
  breakdown: Array<{
    chain: string;
    confirmedBalance: string;
  }>;
}

export interface GetBalancesResult {
  token: string;
  totalConfirmedBalance: string;
  breakdown: BalanceBreakdown[];
}

export interface DepositFormState {
  chain: ChainId;
  amount: string;
}

export interface DepositResult {
  amount: string;
  token: string;
  chain: string;
  txHash: string;
  explorerUrl?: string;
}

export interface SpendAllocation {
  amount: string;
  chain: ChainId;
}

export interface SpendFormState {
  allocations: SpendAllocation[];
  toChain: ChainId;
  amount: string;
  recipient?: string;
}

export interface SpendResult {
  recipientAddress: string;
  destinationChain: string;
  txHash: string;
  explorerUrl?: string;
}

export function useUnifiedBalance() {
  const { getAdapter, isReady, address } = useArcAdapter();

  const balances = useQuery<GetBalancesResult, Error>({
    queryKey: ["unifiedBalance", "balances", address],
    queryFn: async () => {
      const adapter = await getAdapter();
      const result = await getAppKit().unifiedBalance.getBalances({
        token: "USDC",
        sources: { adapter },
        // Arc is a testnet-only deployment; without this the SDK defaults to
        // "mainnet" and queries the wrong Gateway for a testnet wallet.
        networkType: "testnet",
      });
      return {
        token: result.token,
        totalConfirmedBalance: result.totalConfirmedBalance,
        breakdown: result.breakdown.map((b) => ({
          depositor: b.depositor,
          totalConfirmed: b.totalConfirmed,
          breakdown: b.breakdown.map((c) => ({
            chain: c.chain,
            confirmedBalance: c.confirmedBalance,
          })),
        })),
      };
    },
    enabled: isReady,
  });

  const deposit = useMutation<DepositResult, Error, DepositFormState>({
    mutationFn: async (form) => {
      const adapter = await getAdapter();
      const result = await getAppKit().unifiedBalance.deposit({
        from: { adapter, chain: asGatewayChain(form.chain) },
        amount: form.amount,
        token: "USDC",
      });
      return {
        amount: result.amount,
        token: result.token,
        chain: result.chain,
        txHash: result.txHash,
        explorerUrl: result.explorerUrl,
      };
    },
    onSuccess: () => {
      balances.refetch();
    },
  });

  const spend = useMutation<SpendResult, Error, SpendFormState>({
    mutationFn: async (form) => {
      const adapter = await getAdapter();
      const allocations = form.allocations.map((a) => ({
        amount: a.amount,
        chain: asGatewayChain(a.chain),
      }));
      const to = form.recipient
        ? {
            adapter,
            chain: asGatewayChain(form.toChain),
            recipientAddress: form.recipient,
          }
        : { adapter, chain: asGatewayChain(form.toChain) };
      const result = await getAppKit().unifiedBalance.spend({
        from: { adapter, allocations },
        to,
        amount: form.amount,
        token: "USDC",
      });
      return {
        recipientAddress: result.recipientAddress,
        destinationChain: result.destinationChain,
        txHash: result.txHash,
        explorerUrl: result.explorerUrl,
      };
    },
    onSuccess: () => {
      balances.refetch();
    },
  });

  return { balances, deposit, spend, isReady, address };
}
