import { createConfig, http } from "wagmi";
import { arcTestnet } from "viem/chains";
import { injected, walletConnect } from "wagmi/connectors";

/**
 * Arc Testnet wallet configuration.
 *
 * Arc uses USDC as its native gas token (18 decimals on-chain). We rely on
 * viem's built-in `arcTestnet` chain definition as the source of truth for the
 * chain id (5042002), RPC list and explorer, but allow an operator to override
 * the primary RPC endpoint via env for stability / private endpoints.
 */
const rpcOverride = process.env.NEXT_PUBLIC_ARC_PRIMARY_RPC_URL;

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

const connectors = [
  injected({ shimDisconnect: true }),
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: true,
          metadata: {
            name: "ArcFlow",
            description:
              "Swap, bridge, send and spend USDC across chains on Arc.",
            url: "https://arcflow.app",
            icons: ["https://arcflow.app/icon.png"],
          },
        }),
      ]
    : []),
];

export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  connectors,
  ssr: true,
  transports: {
    [arcTestnet.id]: http(rpcOverride),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
