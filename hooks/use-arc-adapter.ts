"use client";

import { useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http, type Chain, type EIP1193Provider } from "viem";
import { arcTestnet } from "viem/chains";
import {
  createViemAdapterFromProvider,
  type ViemAdapter,
} from "@circle-fin/adapter-viem-v2";

const rpcOverride = process.env.NEXT_PUBLIC_ARC_PRIMARY_RPC_URL;

/**
 * Provide App Kit with a public client per chain. For Arc Testnet we inject the
 * configured RPC (private endpoint in production); other chains fall back to
 * their viem default RPC. This keeps reads on our endpoint without having to
 * enumerate every partner chain.
 */
function getPublicClient({ chain }: { chain: Chain }) {
  const transport =
    chain.id === arcTestnet.id && rpcOverride ? http(rpcOverride) : http();
  return createPublicClient({ chain, transport });
}

export interface ArcAdapterState {
  /** Connected EVM address, if any. */
  address?: `0x${string}`;
  /** True when a wallet is connected and an adapter can be built. */
  isReady: boolean;
  /**
   * Lazily build (and cache) the App Kit viem adapter from the active wallet's
   * EIP-1193 provider. Throws a friendly error when no wallet is connected.
   */
  getAdapter: () => Promise<ViemAdapter>;
}

/**
 * Bridges wagmi ⇄ Circle App Kit. The adapter is derived from the connected
 * wallet's EIP-1193 provider and memoized per address so repeated actions reuse
 * the same instance.
 */
export function useArcAdapter(): ArcAdapterState {
  const { address, connector, isConnected } = useAccount();

  const cache = useRef<{ address?: string; adapter?: Promise<ViemAdapter> }>({});

  const getAdapter = useCallback(async () => {
    if (!isConnected || !connector) {
      throw new Error("Connect a wallet to continue.");
    }

    // Reuse the cached adapter promise for the same address.
    if (cache.current.adapter && cache.current.address === address) {
      return cache.current.adapter;
    }

    const provider = (await connector.getProvider()) as EIP1193Provider;
    const adapterPromise = createViemAdapterFromProvider({
      provider,
      getPublicClient,
    });

    cache.current = { address, adapter: adapterPromise };
    return adapterPromise;
  }, [address, connector, isConnected]);

  return {
    address,
    isReady: isConnected && Boolean(connector),
    getAdapter,
  };
}
