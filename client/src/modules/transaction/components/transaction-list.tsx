"use client";

import { Transaction } from "@/modules/transaction/schemas/transaction";
import { TransactionItem } from "./transaction-item";
import { Skeleton } from "@/components/ui/skeleton";

export function TransactionList({
  transactions,
}: {
  transactions?: Transaction[];
}) {
  return (
    <ul className="flex flex-col gap-4">
      {transactions &&
        transactions.map((transaction, index) => (
          <TransactionItem key={index} transaction={transaction} />
        ))}
      {!transactions && <Skeleton className="w-full h-full" />}
    </ul>
  );
}
