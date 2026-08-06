"use client";

import { useMutation } from "@tanstack/react-query";

import { useArcAdapter } from "@/hooks/use-arc-adapter";
import { getAppKit } from "@/lib/arc";
import type { ChainId } from "@/lib/arc";

/** Bridge moves USDC between chains via CCTP; USDC is the only token. */
export type TransferSpeed = "FAST" | "SLOW";

export interface BridgeFormState {
  fromChain: ChainId;
  toChain: ChainId;
  amount: string;
  speed: TransferSpeed;
  /** Optional recipient; defaults to the sender address on the destination. */
  recipient?: string;
}

export interface BridgeStepView {
  name: string;
  state: string;
  txHash?: string;
  explorerUrl?: string;
}

export interface BridgeQuote {
  amount: string;
  gasFees: { chain: string; fee: string; token: string }[];
  serviceFees: { type: string; amount: string; token: string }[];
}

export interface BridgeExecution {
  state: string;
  steps: BridgeStepView[];
}

export function useBridge() {
  const { getAdapter, isReady, address } = useArcAdapter();

  const buildParams = async (form: BridgeFormState) => {
    const adapter = await getAdapter();
    const to =
      form.recipient && form.recipient.length > 0
        ? { adapter, chain: form.toChain, recipientAddress: form.recipient }
        : { adapter, chain: form.toChain };
    return {
      from: { adapter, chain: form.fromChain },
      to,
      amount: form.amount,
      token: "USDC" as const,
      config: { transferSpeed: form.speed },
    };
  };

  const estimate = useMutation<BridgeQuote, Error, BridgeFormState>({
    mutationFn: async (form) => {
      const params = await buildParams(form);
      const result = await getAppKit().estimateBridge(params);
      return {
        amount: result.amount,
        gasFees: result.gasFees.map((g) => ({
          chain: g.blockchain,
          fee: g.fees?.fee ?? "0",
          token: g.token,
        })),
        serviceFees: result.fees.map((f) => ({
          type: f.type,
          amount: f.amount ?? "0",
          token: f.token,
        })),
      };
    },
  });

  const execute = useMutation<BridgeExecution, Error, BridgeFormState>({
    mutationFn: async (form) => {
      const params = await buildParams(form);
      const result = await getAppKit().bridge(params);
      return {
        state: result.state,
        steps: result.steps.map((s) => ({
          name: s.name,
          state: s.state,
          txHash: s.txHash,
          explorerUrl: s.explorerUrl,
        })),
      };
    },
  });

  return { estimate, execute, isReady, address };
}
