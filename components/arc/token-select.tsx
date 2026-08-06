"use client";

import { Selector } from "@/components/arc/selector";
import type { TokenMeta, TokenSymbol } from "@/lib/arc";

interface TokenSelectProps {
  value: TokenSymbol;
  tokens: TokenMeta[];
  onChange: (value: TokenSymbol) => void;
  className?: string;
  ariaLabel?: string;
}

export function TokenSelect({
  value,
  tokens,
  onChange,
  className,
  ariaLabel = "Select token",
}: TokenSelectProps) {
  return (
    <Selector<TokenSymbol>
      value={value}
      ariaLabel={ariaLabel}
      className={className}
      onChange={onChange}
      options={tokens.map((t) => ({
        value: t.symbol,
        label: t.symbol,
        hint: t.label,
        glyph: t.glyph,
      }))}
    />
  );
}
