"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { AmountInput } from "@/components/arc/amount-input";
import { ChainSelect } from "@/components/arc/chain-select";
import { TokenSelect } from "@/components/arc/token-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  ARC_CHAIN_ID,
  chainsFor,
  formatToken,
  isEvmAddress,
  tokensFor,
  toUserMessage,
  type ChainId,
  type TokenSymbol,
} from "@/lib/arc";
import { cn } from "@/lib/utils";
import { useSend, type SendFormState } from "@/features/send/use-send";
import { SendResultCard } from "@/features/send/send-result";

export function SendCard() {
  const sendChains = useMemo(() => chainsFor("swap"), []);
  const sendTokens = useMemo(() => tokensFor("send"), []);
  const { estimate, execute } = useSend();
  const { toast } = useToast();

  const [chain, setChain] = useState<ChainId>(ARC_CHAIN_ID);
  const [token, setToken] = useState<TokenSymbol>("USDC");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const recipientValid = isEvmAddress(recipient);
  const canSubmit = Number(amount) > 0 && recipientValid;

  const form: SendFormState = { chain, token, amount, recipient };

  const resetQuote = () => {
    estimate.reset();
    execute.reset();
  };

  const onEstimate = () => {
    execute.reset();
    estimate.mutate(form, {
      onError: (e) =>
        toast({
          variant: "error",
          title: "Estimate failed",
          description: toUserMessage(e),
        }),
    });
  };

  const onSend = () =>
    execute.mutate(form, {
      onSuccess: () =>
        toast({
          variant: "success",
          title: "Transfer submitted",
          description: `${formatToken(amount, token)} → ${recipient.slice(0, 6)}…`,
        }),
      onError: (e) =>
        toast({
          variant: "error",
          title: "Transfer failed",
          description: toUserMessage(e),
        }),
    });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <Card className="h-fit">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <h2 className="text-sm font-medium text-muted-foreground">
            Send tokens
          </h2>

          {/* Chain + token */}
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs text-muted-foreground">Chain</label>
              <ChainSelect
                value={chain}
                chains={sendChains}
                onChange={(v) => {
                  setChain(v);
                  resetQuote();
                }}
                className="w-full"
              />
            </div>
            <div className="w-32 space-y-1.5">
              <label className="text-xs text-muted-foreground">Token</label>
              <TokenSelect
                value={token}
                tokens={sendTokens}
                onChange={(v) => {
                  setToken(v);
                  resetQuote();
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Amount</label>
            <AmountInput
              value={amount}
              onChange={(v) => {
                setAmount(v);
                resetQuote();
              }}
              symbol={token}
              ariaLabel="Amount to send"
            />
          </div>

          {/* Recipient */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Recipient</label>
            <Input
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                resetQuote();
              }}
              placeholder="0x…"
              className={cn(
                recipient !== "" && !recipientValid && "border-destructive",
              )}
            />
            {recipient !== "" && !recipientValid && (
              <p className="text-xs text-destructive">
                Enter a valid 0x address.
              </p>
            )}
          </div>

          {/* Quote */}
          {estimate.data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3 text-xs"
            >
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated gas</span>
                <span className="font-medium tabular-nums">
                  {estimate.data.gas}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network fee</span>
                <span className="font-medium tabular-nums">
                  {estimate.data.fee}
                </span>
              </div>
            </motion.div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={!canSubmit || estimate.isPending}
              onClick={onEstimate}
            >
              {estimate.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Estimate
            </Button>
            <Button
              className="flex-1"
              disabled={!canSubmit || execute.isPending}
              onClick={onSend}
            >
              {execute.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      <SendResultCard
        execution={execute.data}
        isPending={execute.isPending}
        token={token}
        amount={amount}
        recipient={recipient}
      />
    </div>
  );
}
