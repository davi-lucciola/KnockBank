"use client";

import { Api, ApiResponse } from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { useUnauthorizedHandler } from "@/modules/auth/hooks/use-unauthorized-handler";
import { Transaction } from "@/modules/transaction/schemas/transaction";
import { TransactionService } from "@/modules/transaction/services/transaction-service";
import { TransactionMonthResume } from "@/modules/transaction/schemas/transaction-month-resume";
import {
  BasicTransferencePayload,
  TransferencePayload,
} from "../schemas/transference";

interface ITransactionContext {
  transactions: Transaction[];
  transactionsResume: TransactionMonthResume[];
  fetchTransactions: () => void;
  deposit: (transference: BasicTransferencePayload) => Promise<ApiResponse>;
  withdraw: (transference: BasicTransferencePayload) => Promise<ApiResponse>;
}

export const TransactionContext = createContext({} as ITransactionContext);
export function TransactionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useContext(AuthContext);
  const { verifyToken, unauthorizedHandler } = useUnauthorizedHandler();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsResume, setTransactionsResume] = useState<
    TransactionMonthResume[]
  >([]);
  const transactionService = new TransactionService(
    new Api(getToken() ?? undefined)
  );

  async function fetchTransactions() {
    const myTransactions = await transactionService.getMyTransactions();
    setTransactions(myTransactions);
  }

  async function deposit(transference: BasicTransferencePayload) {
    const data = transactionService.deposit(transference);
    return data;
  }

  async function withdraw(transference: BasicTransferencePayload) {
    const data = transactionService.withdraw(transference);
    return data;
  }

  async function transfer(transference: TransferencePayload) {}

  useEffect(() => {
    verifyToken();
    fetchTransactions().catch(unauthorizedHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    verifyToken();
    const myTransactionsResume = transactionService.getAccountResume();
    myTransactionsResume
      .then((data) => setTransactionsResume(data))
      .catch(unauthorizedHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        transactionsResume,
        fetchTransactions,
        deposit,
        withdraw,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
