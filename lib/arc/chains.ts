/**
 * Arc + partner chain registry (testnet-scoped).
 *
 * App Kit accepts chain identifiers as strings (e.g. "Arc_Testnet"). We keep a
 * curated, testnet-only list here so the UI can only ever express supported
 * routes. Arc Testnet is always the anchor of ArcFlow.
 */

export type ChainId =
  | "Arc_Testnet"
  | "Ethereum_Sepolia"
  | "Base_Sepolia"
  | "Arbitrum_Sepolia"
  | "Optimism_Sepolia"
  | "Avalanche_Fuji"
  | "Polygon_Amoy_Testnet"
  | "Linea_Sepolia"
  | "Unichain_Sepolia";

export interface ChainMeta {
  id: ChainId;
  /** Human-facing label. */
  label: string;
  /** Short ticker-style tag for compact UI. */
  short: string;
  /** Emoji/icon token used as a lightweight logo stand-in. */
  glyph: string;
  /** Whether this is the Arc network itself. */
  isArc: boolean;
  /** Feature availability for this chain in ArcFlow. */
  features: {
    swap: boolean;
    bridge: boolean;
    unifiedBalance: boolean;
  };
}

export const CHAINS: Record<ChainId, ChainMeta> = {
  Arc_Testnet: {
    id: "Arc_Testnet",
    label: "Arc Testnet",
    short: "ARC",
    glyph: "◆",
    isArc: true,
    features: { swap: true, bridge: true, unifiedBalance: true },
  },
  Ethereum_Sepolia: {
    id: "Ethereum_Sepolia",
    label: "Ethereum Sepolia",
    short: "ETH",
    glyph: "⬢",
    isArc: false,
    features: { swap: true, bridge: true, unifiedBalance: true },
  },
  Base_Sepolia: {
    id: "Base_Sepolia",
    label: "Base Sepolia",
    short: "BASE",
    glyph: "○",
    isArc: false,
    features: { swap: true, bridge: true, unifiedBalance: true },
  },
  Arbitrum_Sepolia: {
    id: "Arbitrum_Sepolia",
    label: "Arbitrum Sepolia",
    short: "ARB",
    glyph: "◈",
    isArc: false,
    features: { swap: true, bridge: true, unifiedBalance: true },
  },
  Optimism_Sepolia: {
    id: "Optimism_Sepolia",
    label: "Optimism Sepolia",
    short: "OP",
    glyph: "⬤",
    isArc: false,
    features: { swap: true, bridge: true, unifiedBalance: true },
  },
  Avalanche_Fuji: {
    id: "Avalanche_Fuji",
    label: "Avalanche Fuji",
    short: "AVAX",
    glyph: "▲",
    isArc: false,
    features: { swap: true, bridge: true, unifiedBalance: true },
  },
  Polygon_Amoy_Testnet: {
    id: "Polygon_Amoy_Testnet",
    label: "Polygon Amoy",
    short: "POL",
    glyph: "⬟",
    isArc: false,
    features: { swap: true, bridge: true, unifiedBalance: true },
  },
  Linea_Sepolia: {
    id: "Linea_Sepolia",
    label: "Linea Sepolia",
    short: "LINEA",
    glyph: "▧",
    isArc: false,
    features: { swap: true, bridge: true, unifiedBalance: false },
  },
  Unichain_Sepolia: {
    id: "Unichain_Sepolia",
    label: "Unichain Sepolia",
    short: "UNI",
    glyph: "🦄",
    isArc: false,
    features: { swap: true, bridge: true, unifiedBalance: true },
  },
};

export const ARC_CHAIN_ID: ChainId = "Arc_Testnet";

export const ALL_CHAINS: ChainMeta[] = Object.values(CHAINS);

export const chainsFor = (
  feature: keyof ChainMeta["features"],
): ChainMeta[] => ALL_CHAINS.filter((chain) => chain.features[feature]);

export const getChain = (id: ChainId): ChainMeta | undefined => CHAINS[id];
