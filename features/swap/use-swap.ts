"use client";

import { useMutation } from "@tanstack/react-query";

import { useArcAdapter } from "@/hooks/use-arc-adapter";
import { getAppKit, KIT_KEY } from "@/lib/arc";
import type { TokenSymbol } from "@/lib/arc";

/**
 * Same-chain swaps run on Arc Testnet — the only swap-capable chain on testnet
 * in App Kit's `SwapChain` set. Using the literal keeps us type-safe against the
 * SDK's chain union without casts.
 */
export const SWAP_CHAIN = "Arc_Testnet" as const;

export interface SwapFormState {
  tokenIn: TokenSymbol;
  tokenOut: TokenSymbol;
  amountIn: string;
  /** Slippage tolerance in basis points (300 = 3%). */
  slippageBps: number;
}

export interface SwapQuote {
  estimatedOutput: string;
  outputToken: string;
  minReceived: string;
  fees: { label: string; amount: string; token: string }[];
}

export interface SwapExecution {
  txHash: string;
  explorerUrl?: string;
  amountOut?: string;
  status: string;
}

/**
 * Swap feature hook. Wraps App Kit `estimateSwap` / `swap` in TanStack
 * mutations so the UI gets loading/error/data state for free. Same-chain swaps
 * on Arc populate `amountOut` synchronously.
 */
export function useSwap() {
  const { getAdapter, isReady, address } = useArcAdapter();

  const buildParams = async (form: SwapFormState) => {
    const adapter = await getAdapter();
    return {
      from: { adapter, chain: SWAP_CHAIN },
      tokenIn: form.tokenIn,
      tokenOut: form.tokenOut,
      amountIn: form.amountIn,
      config: {
        slippageBps: form.slippageBps,
        ...(KIT_KEY ? { kitKey: KIT_KEY } : {}),
      },
    };
  };

  const estimate = useMutation<SwapQuote, Error, SwapFormState>({
    mutationFn: async (form) => {
      const params = await buildParams(form);
      const result = await getAppKit().estimateSwap(params);
      return {
        estimatedOutput: result.estimatedOutput.amount,
        outputToken: result.estimatedOutput.token,
        minReceived: result.stopLimit.amount,
        fees: (result.fees ?? []).map((fee) => ({
          label: fee.type ?? "fee",
          amount: fee.amount ?? "0",
          token: fee.token,
        })),
      };
    },
  });

  const execute = useMutation<SwapExecution, Error, SwapFormState>({
    mutationFn: async (form) => {
      const params = await buildParams(form);
      const result = await getAppKit().swap(params);
      return {
        txHash: result.txHash,
        explorerUrl: result.explorerUrl,
        amountOut: result.amountOut,
        status: result.progress.status,
      };
    },
  });

  return { estimate, execute, isReady, address };
}
