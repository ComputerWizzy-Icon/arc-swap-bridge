"use client";

import { useMutation } from "@tanstack/react-query";

import { useArcAdapter } from "@/hooks/use-arc-adapter";
import { getAppKit } from "@/lib/arc";
import type { ChainId, TokenSymbol } from "@/lib/arc";

export interface SendFormState {
  chain: ChainId;
  token: TokenSymbol;
  amount: string;
  recipient: string;
}

export interface SendQuote {
  /** Total network fee, formatted in the chain's native units (wei for EVM). */
  fee: string;
  gas: string;
}

export interface SendExecution {
  name: string;
  state: string;
  txHash?: string;
  explorerUrl?: string;
}

export function useSend() {
  const { getAdapter, isReady, address } = useArcAdapter();

  const buildParams = async (form: SendFormState) => {
    const adapter = await getAdapter();
    return {
      from: { adapter, chain: form.chain },
      to: form.recipient,
      amount: form.amount,
      token: form.token,
    };
  };

  const estimate = useMutation<SendQuote, Error, SendFormState>({
    mutationFn: async (form) => {
      const params = await buildParams(form);
      const result = await getAppKit().estimateSend(params);
      return { fee: result.fee, gas: result.gas.toString() };
    },
  });

  const execute = useMutation<SendExecution, Error, SendFormState>({
    mutationFn: async (form) => {
      const params = await buildParams(form);
      const step = await getAppKit().send(params);
      return {
        name: step.name,
        state: step.state,
        txHash: step.txHash,
        explorerUrl: step.explorerUrl,
      };
    },
  });

  return { estimate, execute, isReady, address };
}
