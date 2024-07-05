"use client";

import { useContext } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TransactionList } from "@/modules/transaction/components/transaction-list";
import { TransactionContext } from "../contexts/transaction-context";

export function BankStatmentCard({ className }: { className: string }) {
  const { transactions } = useContext(TransactionContext);

  return (
    <Card className={className}>
      <CardHeader className="text-2xl font-semibold">Extrato</CardHeader>
      <CardContent className="overflow-auto max-h-191">
        {transactions?.length != 0 ? (
          <TransactionList transactions={transactions} />
        ) : (
          <p className="text-gray-100 font-light">
            Não há transações para visualizar.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
