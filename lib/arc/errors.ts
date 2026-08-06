/**
 * Normalize errors thrown by App Kit / viem / wallet providers into concise,
 * user-facing messages. App Kit surfaces structured errors; wallets throw
 * EIP-1193 rejections. We keep the message short and actionable.
 */
export function toUserMessage(error: unknown): string {
  if (!error) return "Something went wrong.";

  // EIP-1193 user rejection.
  const code = (error as { code?: number | string })?.code;
  if (code === 4001 || code === "ACTION_REJECTED") {
    return "Request rejected in wallet.";
  }

  const raw =
    (error as { shortMessage?: string })?.shortMessage ??
    (error as { message?: string })?.message ??
    (typeof error === "string" ? error : "");

  if (!raw) return "Unexpected error. Please try again.";

  // Common, noisy patterns → friendlier copy.
  if (/insufficient funds|exceeds balance/i.test(raw)) {
    return "Insufficient balance for this transfer (including gas in USDC).";
  }
  if (/user rejected|denied/i.test(raw)) {
    return "Request rejected in wallet.";
  }
  if (/chain mismatch|does not match|switch/i.test(raw)) {
    return "Wrong network — switch to Arc Testnet and try again.";
  }

  // Trim very long RPC dumps.
  return raw.length > 180 ? `${raw.slice(0, 177)}…` : raw;
}
