"use client";

import { cn } from "@/lib/utils";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Symbol shown as a suffix (e.g. "USDC"). */
  symbol?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Optional max handler; renders a MAX button when provided. */
  onMax?: () => void;
  ariaLabel?: string;
}

/**
 * Numeric amount field with light client-side sanitization (digits + single
 * decimal point). App Kit consumes human-readable decimal strings.
 */
export function AmountInput({
  value,
  onChange,
  symbol,
  placeholder = "0.00",
  disabled,
  className,
  onMax,
  ariaLabel = "Amount",
}: AmountInputProps) {
  const handle = (raw: string) => {
    // Allow empty, digits and a single decimal separator.
    const cleaned = raw.replace(/,/g, ".");
    if (cleaned === "" || /^\d*\.?\d*$/.test(cleaned)) {
      onChange(cleaned);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring",
        disabled && "opacity-60",
        className,
      )}
    >
      <input
        inputMode="decimal"
        aria-label={ariaLabel}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => handle(e.target.value)}
        className="h-12 w-full bg-transparent text-lg font-medium tabular-nums outline-none placeholder:text-muted-foreground/60"
      />
      {onMax && (
        <button
          type="button"
          onClick={onMax}
          disabled={disabled}
          className="rounded-md px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          MAX
        </button>
      )}
      {symbol && (
        <span className="shrink-0 text-sm font-medium text-muted-foreground">
          {symbol}
        </span>
      )}
    </div>
  );
}
