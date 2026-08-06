import { AppKit } from "@circle-fin/app-kit";

/**
 * A single shared AppKit instance for the browser session.
 *
 * `AppKit` is stateless with respect to wallets — the signing adapter is passed
 * per-call — so one instance is safe to reuse across features. We lazily create
 * it so it is only constructed on the client.
 */
let kitSingleton: AppKit | null = null;

export function getAppKit(): AppKit {
  if (!kitSingleton) {
    kitSingleton = new AppKit({
      // Analytics/telemetry left at defaults; can be disabled via config here.
    });
  }
  return kitSingleton;
}

/**
 * Optional Circle Console kit key, surfaced to swap calls. Optional for swaps,
 * recommended for production monetization.
 */
export const KIT_KEY = process.env.NEXT_PUBLIC_CIRCLE_KIT_KEY || undefined;
