"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export interface TxStep {
  name: string;
  state: "pending" | "success" | "error" | "noop";
  explorerUrl?: string;
  txHash?: string;
  errorMessage?: string;
}

interface TxResultProps {
  steps: TxStep[];
  className?: string;
}

const STATE_ICON = {
  pending: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  error: <XCircle className="h-4 w-4 text-red-500" />,
  noop: <span className="h-4 w-4 rounded-full border border-border" />,
} as const;

/**
 * Renders the step list returned by App Kit bridge/send/swap results,
 * with explorer links per step.
 */
export function TxResult({ steps, className }: TxResultProps) {
  if (steps.length === 0) return null;

  return (
    <motion.ol
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "space-y-2 rounded-xl border border-border bg-card/60 p-4",
        className,
      )}
    >
      {steps.map((step, i) => (
        <li key={`${step.name}-${i}`} className="flex items-center gap-3 text-sm">
          <span className="shrink-0">{STATE_ICON[step.state]}</span>
          <span className="flex-1 truncate capitalize">
            {step.name.replace(/[-_]/g, " ")}
            {step.errorMessage && (
              <span className="block text-xs text-red-500">
                {step.errorMessage}
              </span>
            )}
          </span>
          {step.explorerUrl && (
            <a
              href={step.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </li>
      ))}
    </motion.ol>
  );
}
