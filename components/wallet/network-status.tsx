"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { arcTestnet } from "viem/chains";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Compact network indicator. Green when on Arc Testnet; amber with a one-click
 * switch when the wallet is on the wrong chain. Hidden when disconnected.
 */
export function NetworkStatus({ className }: { className?: string }) {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return null;

  const onArc = chainId === arcTestnet.id;

  if (onArc) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500",
          className,
        )}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Arc Testnet
      </span>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "h-7 gap-1.5 border-amber-500/40 text-amber-500 hover:text-amber-400",
        className,
      )}
      disabled={isPending}
      onClick={() => switchChain({ chainId: arcTestnet.id })}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <AlertTriangle className="h-3.5 w-3.5" />
      )}
      Switch to Arc
    </Button>
  );
}
