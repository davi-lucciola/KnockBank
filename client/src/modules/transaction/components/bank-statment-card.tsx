"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Transaction } from "@/modules/transaction/schemas/transaction";
import { TransactionList } from "@/modules/transaction/components/transaction-list";
import { useContext, useEffect, useState } from "react";
import { TransactionService } from "../services/transaction-service";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { Api } from "@/lib/api";

export function BankStatmentCard({ className }: { className: string}) {
  const { isAuth, getToken } = useContext(AuthContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!isAuth || !token) {
      return;
    }

    const transactionService = new TransactionService(
      new Api(getToken() ?? undefined)
    );

    const transactionsPromise = transactionService.getMyTransactions();
    transactionsPromise.then((data) => setTransactions(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className={className}>
      <CardHeader className="text-2xl font-semibold">Extrato</CardHeader>
      <CardContent className="overflow-auto max-h-191">
        {transactions.length != 0 ? (
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
