"use client";

import { useContext, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TransactionList } from "@/modules/transaction/components/transaction-list";
import { TransactionContext } from "../contexts/transaction-context";
import { useUnauthorizedHandler } from "@/modules/auth/hooks/use-unauthorized-handler";

export function BankStatmentCard({ className }: { className: string }) {
  const { verifyToken, unauthorizedHandler } = useUnauthorizedHandler();
  const { transactions, fetchTransactions } = useContext(TransactionContext);

  useEffect(() => {
    verifyToken();
    fetchTransactions().catch(unauthorizedHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
