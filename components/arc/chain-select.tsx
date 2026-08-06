"use client";

import { Selector } from "@/components/arc/selector";
import type { ChainId, ChainMeta } from "@/lib/arc";

interface ChainSelectProps {
  value: ChainId;
  chains: ChainMeta[];
  onChange: (value: ChainId) => void;
  className?: string;
  ariaLabel?: string;
  /** Disable a specific chain (e.g. the one selected on the other side). */
  disabledValue?: ChainId;
}

export function ChainSelect({
  value,
  chains,
  onChange,
  className,
  ariaLabel = "Select chain",
  disabledValue,
}: ChainSelectProps) {
  return (
    <Selector<ChainId>
      value={value}
      ariaLabel={ariaLabel}
      className={className}
      onChange={onChange}
      options={chains.map((c) => ({
        value: c.id,
        label: c.label,
        glyph: c.glyph,
        hint: c.isArc ? "Arc" : undefined,
        disabled: c.id === disabledValue,
      }))}
    />
  );
}
