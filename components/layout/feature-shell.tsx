"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { ConnectButton } from "@/components/wallet/connect-button";
import { useAccount } from "wagmi";
import { Wallet } from "lucide-react";

interface FeatureShellProps {
  title: string;
  description: string;
  /** When true, children render only after a wallet is connected. */
  requireWallet?: boolean;
  children: ReactNode;
}

/**
 * Consistent frame for each feature route: heading, description, and an
 * optional connect gate so feature code can assume a connected wallet.
 */
export function FeatureShell({
  title,
  description,
  requireWallet = true,
  children,
}: FeatureShellProps) {
  const { isConnected } = useAccount();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      </motion.div>

      {requireWallet && !isConnected ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wallet className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-medium">Connect your wallet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Connect a wallet on Arc Testnet to continue. Gas is paid in USDC.
          </p>
          <div className="mt-6">
            <ConnectButton />
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
