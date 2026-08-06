/**
 * Token registry for ArcFlow.
 *
 * Each App Kit feature supports a different token set (see docs/research.md).
 * We model the superset here and expose per-feature filters so selectors only
 * offer valid tokens.
 */

export type TokenSymbol = "USDC" | "EURC" | "USDT";

export interface TokenMeta {
  symbol: TokenSymbol;
  label: string;
  glyph: string;
  /** Display decimals for formatting human-readable amounts. */
  decimals: number;
  /** Features where this token is selectable. */
  features: {
    swap: boolean;
    send: boolean;
    /** Bridge + Unified Balance are USDC-only per Circle. */
    bridge: boolean;
    unifiedBalance: boolean;
  };
}

export const TOKENS: Record<TokenSymbol, TokenMeta> = {
  USDC: {
    symbol: "USDC",
    label: "USD Coin",
    glyph: "$",
    decimals: 6,
    features: { swap: true, send: true, bridge: true, unifiedBalance: true },
  },
  EURC: {
    symbol: "EURC",
    label: "Euro Coin",
    glyph: "€",
    decimals: 6,
    features: { swap: true, send: true, bridge: false, unifiedBalance: false },
  },
  USDT: {
    symbol: "USDT",
    label: "Tether USD",
    glyph: "₮",
    decimals: 6,
    features: { swap: true, send: true, bridge: false, unifiedBalance: false },
  },
};

export const ALL_TOKENS: TokenMeta[] = Object.values(TOKENS);

export const tokensFor = (
  feature: keyof TokenMeta["features"],
): TokenMeta[] => ALL_TOKENS.filter((token) => token.features[feature]);

export const getToken = (symbol: TokenSymbol): TokenMeta => TOKENS[symbol];
