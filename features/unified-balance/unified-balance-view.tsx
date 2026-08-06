"use client";

import { useToast } from "@/components/ui/toast";
import { formatToken, toUserMessage } from "@/lib/arc";
import { BalanceCard } from "@/features/unified-balance/balance-card";
import { DepositCard } from "@/features/unified-balance/deposit-card";
import { SpendCard } from "@/features/unified-balance/spend-card";
import { useUnifiedBalance } from "@/features/unified-balance/use-unified-balance";

export function UnifiedBalanceView() {
  const { balances, deposit, spend } = useUnifiedBalance();
  const { toast } = useToast();

  const handleDeposit = (form: Parameters<typeof deposit.mutate>[0]) => {
    deposit.mutate(form, {
      onSuccess: (result) =>
        toast({
          variant: "success",
          title: "Deposit complete",
          description: `${formatToken(result.amount, "USDC")} deposited`,
        }),
      onError: (e) =>
        toast({
          variant: "error",
          title: "Deposit failed",
          description: toUserMessage(e),
        }),
    });
  };

  const handleSpend = (form: Parameters<typeof spend.mutate>[0]) => {
    spend.mutate(form, {
      onSuccess: (result) =>
        toast({
          variant: "success",
          title: "Spend complete",
          description: `${formatToken(form.amount, "USDC")} minted on ${result.destinationChain}`,
        }),
      onError: (e) =>
        toast({
          variant: "error",
          title: "Spend failed",
          description: toUserMessage(e),
        }),
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <BalanceCard
        balances={balances.data}
        isLoading={balances.isLoading}
        onRefresh={() => balances.refetch()}
      />
      <div className="space-y-6">
        <DepositCard onDeposit={handleDeposit} isPending={deposit.isPending} />
        <SpendCard onSpend={handleSpend} isPending={spend.isPending} />
      </div>
    </div>
  );
}
