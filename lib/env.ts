import { z } from "zod";

const url = z.string().url();

const publicEnvSchema = z.object({
  NEXT_PUBLIC_ARC_CHAIN_ID: z.coerce.number().int().refine((value) => value === 5042002, {
    message: "NEXT_PUBLIC_ARC_CHAIN_ID must be 5042002.",
  }),
  NEXT_PUBLIC_ARC_EXPLORER_URL: url,
  // Optional: falls back to viem's built-in Arc Testnet RPC list when unset.
  NEXT_PUBLIC_ARC_PRIMARY_RPC_URL: url.optional(),
  // Optional: only injected wallets are offered when unset.
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
  // Optional: Circle App Kit key; recommended for production.
  NEXT_PUBLIC_CIRCLE_KIT_KEY: z.string().optional(),
});

const serverEnvSchema = publicEnvSchema.extend({
  ARC_RPC_PRIMARY_URL: url,
  ARC_RPC_BLOCKDAEMON_URL: url.optional(),
  ARC_RPC_DRPC_URL: url.optional(),
  ARC_RPC_QUICKNODE_URL: url.optional(),
  ARC_RPC_TIMEOUT_MS: z.coerce.number().int().positive().default(8000),
  ARC_RPC_MAX_RETRIES: z.coerce.number().int().min(0).max(3).default(1),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getPublicEnv(): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_ARC_CHAIN_ID: process.env.NEXT_PUBLIC_ARC_CHAIN_ID,
    NEXT_PUBLIC_ARC_EXPLORER_URL: process.env.NEXT_PUBLIC_ARC_EXPLORER_URL,
    NEXT_PUBLIC_ARC_PRIMARY_RPC_URL: process.env.NEXT_PUBLIC_ARC_PRIMARY_RPC_URL,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_CIRCLE_KIT_KEY: process.env.NEXT_PUBLIC_CIRCLE_KIT_KEY,
  });
}

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    ...process.env,
    NEXT_PUBLIC_ARC_CHAIN_ID: process.env.NEXT_PUBLIC_ARC_CHAIN_ID,
    NEXT_PUBLIC_ARC_EXPLORER_URL: process.env.NEXT_PUBLIC_ARC_EXPLORER_URL,
    NEXT_PUBLIC_ARC_PRIMARY_RPC_URL: process.env.NEXT_PUBLIC_ARC_PRIMARY_RPC_URL,
  });
}
