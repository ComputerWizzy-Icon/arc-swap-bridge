"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";

import { ThemeProvider } from "@/providers/theme-provider";
import { wagmiConfig } from "@/providers/wagmi";
import { ToastProvider } from "@/components/ui/toast";

const shouldRetry = (failureCount: number, error: unknown) => {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? Number(error.status)
      : undefined;

  return status !== undefined && status >= 400 && status < 500 ? false : failureCount < 2;
};

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10_000,
            gcTime: 5 * 60_000,
            retry: shouldRetry,
            retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 8_000),
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>{children}</ToastProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
