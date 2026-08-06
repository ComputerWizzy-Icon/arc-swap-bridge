"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
  glyph?: string;
  disabled?: boolean;
}

interface SelectorProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  /** Optional render override for the closed button content. */
  renderValue?: (option: SelectOption<T>) => ReactNode;
  ariaLabel?: string;
}

/**
 * Lightweight, dependency-free dropdown used by the token and chain selectors.
 * Closes on outside-click and Escape; fully keyboard focusable.
 */
export function Selector<T extends string>({
  value,
  options,
  onChange,
  className,
  renderValue,
  ariaLabel,
}: SelectorProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {selected &&
          (renderValue ? (
            renderValue(selected)
          ) : (
            <span className="flex items-center gap-2 truncate">
              {selected.glyph && (
                <span className="text-muted-foreground">{selected.glyph}</span>
              )}
              {selected.label}
            </span>
          ))}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full min-w-[12rem] overflow-auto rounded-lg border border-border bg-card p-1 shadow-xl"
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                disabled={option.disabled}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                  active ? "bg-accent" : "hover:bg-accent/60",
                  option.disabled && "cursor-not-allowed opacity-40",
                )}
              >
                {option.glyph && (
                  <span className="w-4 text-center text-muted-foreground">
                    {option.glyph}
                  </span>
                )}
                <span className="flex-1 truncate">{option.label}</span>
                {option.hint && (
                  <span className="text-xs text-muted-foreground">
                    {option.hint}
                  </span>
                )}
                {active && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
