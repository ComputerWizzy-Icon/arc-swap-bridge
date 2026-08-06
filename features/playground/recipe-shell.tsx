"use client";

import type { ReactNode } from "react";
import { Loader2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toUserMessage } from "@/lib/arc";
import { CodeBlock } from "@/features/playground/code-block";

interface RecipeShellProps {
  title: string;
  method: string;
  description: string;
  code: string;
  /** Editable inputs for the call. */
  inputs?: ReactNode;
  onRun: () => void;
  isPending: boolean;
  error?: Error | null;
  result?: unknown;
  disabled?: boolean;
}

export function RecipeShell({
  title,
  method,
  description,
  code,
  inputs,
  onRun,
  isPending,
  error,
  result,
  disabled,
}: RecipeShellProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-0 p-0 lg:grid-cols-2">
        {/* Left: docs + code */}
        <div className="border-b border-border p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] text-primary">
              {method}
            </code>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{description}</p>
          <CodeBlock code={code} />
        </div>

        {/* Right: run + result */}
        <div className="flex flex-col p-5 sm:p-6">
          {inputs && <div className="mb-4 space-y-3">{inputs}</div>}

          <Button onClick={onRun} disabled={isPending || disabled}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Run
          </Button>

          <div className="mt-4 flex-1">
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">
              Result
            </div>
            {error ? (
              <pre className="overflow-x-auto rounded-lg border border-destructive/40 bg-destructive/5 p-3 font-mono text-xs text-destructive">
                {toUserMessage(error)}
              </pre>
            ) : result !== undefined ? (
              <pre className="max-h-72 overflow-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-xs text-muted-foreground">
                Run the call to see the response.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
