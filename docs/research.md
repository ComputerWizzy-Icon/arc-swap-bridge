# ArcFlow — Arc Ecosystem Research

> Source of truth: [Arc docs](https://docs.arc.io/llms.txt) and the installed
> package type definitions (`@circle-fin/app-kit@1.11.0`,
> `@circle-fin/adapter-viem-v2`). Where the docs and the shipped `.d.ts` files
> disagreed, the type definitions won — they are what we actually compile
> against.

## 1. Arc architecture findings

- **Arc** is an open, EVM-compatible Layer-1 built for programmable money.
  USDC is the **native gas token** — there is no ETH on Arc, and fees are quoted
  and paid in USDC.
- Sub-second **deterministic finality**: no multi-confirmation waiting is
  required. UI can treat a mined tx as final.
- Integrates directly with Circle's platform (CCTP, Gateway) — Arc is the
  settlement hub that Circle's cross-chain primitives plug into.
- Roadmap notes: opt-in privacy, post-quantum security, ERC-8004 agent
  identity and ERC-8183 jobs.
- Behaves slightly differently from vanilla EVM (see Arc's "EVM differences"
  reference). Contract addresses must be read from the live reference, never
  hardcoded.

### Arc Testnet connection (verified against `viem/chains` `arcTestnet`)

| Field | Value |
| --- | --- |
| Chain ID | `5042002` |
| Native currency | `USDC` (symbol `USDC`, 18 decimals on-chain) |
| Primary RPC | `https://rpc.testnet.arc.network` |
| Alt RPC | `rpc.quicknode.testnet.arc.network`, `rpc.blockdaemon.testnet.arc.network` |
| WebSocket | `wss://rpc.testnet.arc.network` |
| Explorer | `https://testnet.arcscan.app` (ArcScan) |
| Faucet | `https://faucet.circle.com` |
| Multicall3 | `0xcA11bde05977b3631167028862bE2a173976CA11` |

> Note: the project brief listed `rpc.testnet.arc.io` / `docs.arc.io`. The `.io`
> host is the docs site; the canonical **RPC** domain shipped in viem's chain
> definition is `arc.network`. We use viem's built-in `arcTestnet` chain as the
> source of truth and allow an env override for private endpoints.

## 2. Available SDKs

Circle App Kit is a single, type-safe façade over several underlying kits and
protocols (CCTP v2 for bridging, Gateway v1 for unified balance, a stablecoin
swap service). Installed packages:

| Package | Role |
| --- | --- |
| `@circle-fin/app-kit` | Unified `AppKit` class: swap, bridge, send, unified balance, earn |
| `@circle-fin/adapter-viem-v2` | viem/EIP-1193 signing adapter |
| `@circle-fin/bridge-kit` | Underlying bridge (CCTP) — used via App Kit |
| `@circle-fin/swap-kit` | Underlying swap service — used via App Kit |
| `@circle-fin/unified-balance-kit` | Gateway-backed unified balance |
| `@circle-fin/provider-*` | CCTP v2 / Gateway v1 / stablecoin-swap providers |

Adapters exist for viem, ethers, Solana and Circle Wallets. ArcFlow is a
browser dApp, so we use **`createViemAdapterFromProvider`** built from the
wallet's EIP-1193 provider (via wagmi's connector).

## 3. Installation requirements

```bash
npm install @circle-fin/app-kit @circle-fin/adapter-viem-v2 viem
```

- Node.js ≥ 20.9 (brief targets 20.9; Circle docs suggest 22+ — both work).
- React 19 / Next.js 15. **connectkit was removed** — it peer-locks to React
  17/18 and conflicts with React 19. We use a wagmi-native connect flow instead.
- App Kit is browser-safe when constructed with `new AppKit()` and driven with a
  provider-based adapter. Private-key adapters are server-only and never shipped
  to the client.

## 4. Kit instantiation & adapter

```typescript
import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";

const kit = new AppKit();                       // optional AppKitConfig
const provider = await connector.getProvider(); // wagmi connector
const adapter = await createViemAdapterFromProvider({ provider });
```

`AppKitConfig` is fully optional: `developerFee`, `unifiedBalance`,
`disableAnalytics`, `disableErrorReporting`. A `kitKey` (Circle Console) is
passed per-call in `SwapConfig.kitKey`; it is optional for swaps but recommended
for production/monetization.

## 5. API surface (what ArcFlow calls)

| Feature | Estimate | Execute | Result key fields |
| --- | --- | --- | --- |
| Swap | `estimateSwap(SwapParams)` | `swap(SwapParams)` | `txHash`, `explorerUrl`, `amountOut`, `fees`, `progress.status` |
| Bridge | `estimateBridge(BridgeParams)` | `bridge(BridgeParams)` | `state`, `steps[].txHash/explorerUrl` |
| Send | `estimateSend(SendParams)` | `send(SendParams)` → `BridgeStep` | `txHash`, `explorerUrl`, `state` |
| Unified Balance | `unifiedBalance.estimateSpend` / `getBalances` | `unifiedBalance.deposit` / `spend` | `txHash`, `explorerUrl`, `totalConfirmedBalance`, `breakdown` |

Shared context shape:

```typescript
from: { adapter, chain: "Arc_Testnet", address? }
// bridge/spend destinations add: recipientAddress, useForwarder
```

- **Swap** `config`: `slippageBps` (default 300 = 3%), `allowanceStrategy`
  (`permit` default), `customFee`, `kitKey`. Same-chain swaps populate
  `amountOut`; crosschain swaps settle asynchronously (`progress.status` →
  `getSwapStatus`/`waitForSwap`).
- **Bridge** `config`: `transferSpeed` (`FAST`/`SLOW`), `maxFee`,
  `batchTransactions`. Token is `USDC` only. `retryBridge` handles recovery.
- **Send** `token`: `USDC | USDT | NATIVE | EURC` or a token address; `to` is an
  address or adapter.
- **Unified balance** token is `USDC` only; `deposit` default allowance strategy
  is `authorize`; `getBalances` needs `networkType: "testnet"` for Arc Testnet.

## 6. Supported chains (from shipped enums)

- **Bridge**: 23 mainnets + 24 testnets incl. `Arc_Testnet`, `Ethereum_Sepolia`,
  `Base_Sepolia`, `Arbitrum_Sepolia`, `Optimism_Sepolia`, `Avalanche_Fuji`,
  `Polygon_Amoy_Testnet`, `Linea_Sepolia`, `Unichain_Sepolia`, `Sei_Testnet`,
  `Solana_Devnet`, … (EVM + Solana).
- **Swap**: 18 chains incl. `Arc_Testnet`, Ethereum, Base, Polygon, Arbitrum,
  Optimism, Avalanche, Linea, Solana, Unichain, Sei, Sonic, XDC, HyperEVM, Monad.
- **Unified Balance** (Gateway v1): Arc_Testnet + major EVM testnets/mainnets +
  Solana.

ArcFlow scopes its UI to **testnet** chains, always anchored on `Arc_Testnet`.

## 7. Supported assets

- **Bridge**: `USDC` only.
- **Swap**: `USDC`, `USDT`, `EURC`, `USDe`, `DAI`, `PYUSD`, `WBTC`, `WETH`,
  `WSOL`, `WAVAX`, `WPOL`, `NATIVE`. ArcFlow surfaces the stablecoin set
  (USDC/EURC/USDT) on Arc for reliability.
- **Send**: `USDC`, `USDT`, `EURC`, `NATIVE`.
- **Unified Balance**: `USDC` only.

## 8. Wallet requirements

- EVM wallet exposing an EIP-1193 provider (MetaMask, Rabby, etc.) or
  WalletConnect. Wallet must have Arc Testnet added (chain `5042002`) — ArcFlow
  offers a one-click "add/switch network" via wagmi.
- Testnet USDC from `https://faucet.circle.com` to cover gas + transfers.

## 9. Limitations & constraints

- Arc is **testnet only** today; ArcFlow targets Arc Testnet end-to-end.
- Bridge/unified-balance are `USDC`-only.
- Crosschain swap and bridge settle asynchronously — UI must poll status, not
  assume instant completion.
- Public RPCs are shared/rate-limited; production should set a private endpoint
  (`NEXT_PUBLIC_ARC_PRIMARY_RPC_URL`).
- Never render ETH. Gas is USDC everywhere.

## 10. Implementation decisions

1. **wagmi-native wallet layer** (dropped connectkit for React 19 support). A
   custom shadcn connect dialog + `useArcAdapter` hook bridges wagmi ⇄ App Kit.
2. **Single `AppKit` instance** memoized in a hook; the viem adapter is derived
   from the active wagmi connector's EIP-1193 provider.
3. **TanStack Query** for reads (balances, estimates) and **mutations** for
   execute actions, giving retry/status/caching for free.
4. **Testnet-scoped chain/token registries** in `lib/arc` drive every selector
   so the UI can only express supported combinations — no invalid calls.
5. **Estimate-before-execute** everywhere: quotes, fees and min-received are
   shown before the user signs.
6. **Explorer links** built from `testnet.arcscan.app`; results always surface
   `txHash` + `explorerUrl`.
7. **Developer Playground** reuses the exact same lib calls the product uses and
   echoes the SDK method, params, response and a copy-pasteable TS snippet — so
   what a developer sees is literally what ArcFlow runs.

