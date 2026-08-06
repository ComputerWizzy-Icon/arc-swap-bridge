"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Loader2, LogOut, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addressExplorerUrl, shortenHash } from "@/lib/arc";
import { cn } from "@/lib/utils";

/**
 * Wallet connect entrypoint. Lists wagmi connectors in a dialog; once connected
 * shows the truncated address with a disconnect affordance. Wallet-native flow
 * (no ConnectKit) keeps us on React 19 without version locks.
 */
export function ConnectButton({ className }: { className?: string }) {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, variables } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <a
          href={addressExplorerUrl(address)}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm transition-colors hover:border-primary/50"
        >
          {shortenHash(address)}
        </a>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => disconnect()}
          aria-label="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Connect a wallet</DialogTitle>
          <DialogDescription>
            Connect to Arc Testnet to swap, bridge, send and spend USDC.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {connectors.length === 0 && (
            <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              No wallet detected. Install a browser wallet (e.g. MetaMask) to
              continue.
            </p>
          )}
          {connectors.map((connector) => {
            const pendingThis =
              isPending && variables?.connector === connector;
            return (
              <Button
                key={connector.uid}
                variant="outline"
                className="h-12 justify-start"
                disabled={isPending}
                onClick={() =>
                  connect(
                    { connector },
                    { onSuccess: () => setOpen(false) },
                  )
                }
              >
                {pendingThis ? (
                  <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="mr-3 h-4 w-4" />
                )}
                {connector.name}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
