"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BalanceVisibilityToggle } from "@/modules/account/components/balance-visibility-toggle";
import { toBrasilianReal } from "@/lib/utils";
import { DailyWithdrawProgress } from "./daily-withdraw-progress";
import { DepositForm } from "@/modules/transaction/components/deposit-form";
import { WithdrawForm } from "@/modules/transaction/components/withdraw-form";
import { TransferForm } from "@/modules/transaction/components/transfer-form";
import { Hiddleble } from "@/components/hiddeble";
import { Account } from "../schemas/account";

type BalanceCardProps = {
  account: Account | null;
  className: string;
};

export function BalanceCard({ account, className }: BalanceCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="w-full flex flex-row justify-between">
        <h2 className="text-2xl font-semibold">Saldo</h2>
        <BalanceVisibilityToggle />
      </CardHeader>
      <CardContent className="w-full flex flex-col items-center gap-12">
        <Hiddleble className="w-48 h-12 shadow-lg">
          <span className="text-5xl font-bold">
            {toBrasilianReal(account?.balance!)}
          </span>
        </Hiddleble>
        <DailyWithdrawProgress
          todayWithdraw={account?.todayWithdraw}
          dailyWithdrawLimit={account?.dailyWithdrawLimit}
        />
      </CardContent>
      <CardFooter className="w-full flex flex-col lg:flex-row gap-8">
        <DepositForm />
        <WithdrawForm />
        <TransferForm />
      </CardFooter>
    </Card>
  );
}
