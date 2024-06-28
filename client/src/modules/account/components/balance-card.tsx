"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useContext } from "react";
import { AccountContext } from "@/modules/account/contexts/account-context";
import { BalanceVisibilityToggle } from "@/modules/account/components/balance-visibility-toggle";
import { toBrasilianReal } from "@/lib/utils";
import { DailyWithdrawProgress } from "./daily-withdraw-progress";
import { DepositForm } from "@/modules/transaction/components/deposit-form";
import { WithdrawForm } from "@/modules/transaction/components/withdraw-form";
import { TransferForm } from "@/modules/transaction/components/transfer-form";
import { Hiddleble } from "@/components/hiddeble";

export function BalanceCard() {
  const { getAccount } = useContext(AccountContext);
  const account = getAccount();

  // console.log(account);
  return (
    <Card className="h-full flex flex-col justify-between">
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
          dailyWithdrawLimit={account?.dailyWithdrawLimit}
          todayWithdraw={account?.todayWithdraw}
        />
      </CardContent>
      <CardFooter className="flex gap-8">
        <DepositForm />
        <WithdrawForm />
        <TransferForm />
      </CardFooter>
    </Card>
  );
}
