import { getChain, type ChainId } from "@/lib/arc/chains";

export const ARC_EXPLORER_URL =
  process.env.NEXT_PUBLIC_ARC_EXPLORER_URL ?? "https://testnet.arcscan.app";

/** Build an ArcScan link for a transaction hash. */
export function txExplorerUrl(hash: string): string {
  return `${ARC_EXPLORER_URL}/tx/${hash}`;
}

/** Build an ArcScan link for an address. */
export function addressExplorerUrl(address: string): string {
  return `${ARC_EXPLORER_URL}/address/${address}`;
}

/** Truncate a 0x address / hash for compact display. */
export function shortenHash(value: string, lead = 6, tail = 4): string {
  if (value.length <= lead + tail + 2) return value;
  return `${value.slice(0, lead)}…${value.slice(-tail)}`;
}

/**
 * Format a human-readable token amount string for display. App Kit works in
 * decimal strings (e.g. "1.00"), so we parse defensively and never show more
 * precision than the token carries.
 */
export function formatAmount(
  amount: string | number | undefined | null,
  maxDecimals = 6,
): string {
  if (amount === undefined || amount === null || amount === "") return "0";
  const num = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(num)) return String(amount);

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}

/** Format a token amount with its symbol, e.g. "1.25 USDC". */
export function formatToken(
  amount: string | number | undefined | null,
  symbol: string,
  maxDecimals = 6,
): string {
  return `${formatAmount(amount, maxDecimals)} ${symbol}`;
}

/**
 * Human label for a chain id. Falls back to a humanized identifier for chains
 * outside the curated registry — a unified-balance breakdown can name any
 * Gateway-supported chain, not just the ones ArcFlow lists, so this must never
 * throw on an unknown id.
 */
export function chainLabel(id: ChainId | string): string {
  const meta = getChain(id as ChainId);
  if (meta) return meta.label;
  return String(id).replace(/_/g, " ");
}

/**
 * Validate an EVM address without pulling extra deps. Mirrors viem's shape
 * check (0x + 40 hex chars). Full checksum validation happens in viem when the
 * value reaches the SDK.
 */
export function isEvmAddress(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

/** Basis points → percent string, e.g. 300 → "3%". */
export function bpsToPercent(bps: number): string {
  return `${(bps / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
}
