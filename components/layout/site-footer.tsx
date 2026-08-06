import Link from "next/link";

import { ARC_EXPLORER_URL } from "@/lib/arc";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p className="flex items-center gap-2">
          <span className="text-primary">◆</span>
          ArcFlow — USDC-native finance on Arc
        </p>
        <nav className="flex items-center gap-4">
          <Link href="/playground" className="transition-colors hover:text-foreground">
            Developer Playground
          </Link>
          <a
            href={ARC_EXPLORER_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            ArcScan
          </a>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs">
            Testnet
          </span>
        </nav>
      </div>
    </footer>
  );
}
