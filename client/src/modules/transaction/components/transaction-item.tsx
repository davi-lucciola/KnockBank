"use client";

import { Hiddleble } from "@/components/hiddeble";
import { toBrasilianReal } from "@/lib/utils";
import {
  Transaction,
  TransactionType,
} from "@/modules/transaction/schemas/transaction";

type TransactionProps = {
  label: string;
  color: string;
};

function getTransactionProps(
  transactionType: number
): TransactionProps | undefined {
  switch (transactionType) {
    case TransactionType.DEPOSIT:
      return {
        label: "Entrada",
        color: "green",
      };

    case TransactionType.WITHDRAW:
      return {
        label: "Saída",
        color: "destructive",
      };
  }
}

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { label, color } = getTransactionProps(transaction.transactionType)!;

  return (
    <>
      <hr />
      <li className="flex flex-row justify-between items-center h-fit">
        <div className="flex gap-2">
          <div className={`w-2 bg-${color} rounded-md`}></div>
          <div>
            <p className="text-lg font-bold"> {label} </p>
            <p>
              <span className="text-gray-100 font-normal">
                {new Date(transaction.dateTime).toLocaleDateString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="font-semibold">
                {transaction.originAccount &&
                  ` - ${transaction.originAccount.name}`}
              </span>
            </p>
          </div>
        </div>
        <span className={`text-${color} text-lg font-semibold`}>
          <Hiddleble className="w-16 h-8 shadow-md">
            {transaction.money > 0 && "+"}
            {toBrasilianReal(transaction.money)}
          </Hiddleble>
        </span>
      </li>
    </>
  );
}
