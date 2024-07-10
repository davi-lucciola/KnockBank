import { PaginationQuery } from "@/lib/pagination";
import { Person } from "@/modules/account/schemas/person";

export enum TransactionType {
  DEPOSIT = 1,
  WITHDRAW = 2,
}

export type Transaction = {
  id: number;
  money: number;
  dateTime: string;
  transactionType: TransactionType;
  account: Person;
  originAccount?: Person;
};

export type TransactionMonthResume = {
  month: string;
  label: string;
  amount: number;
};

export type TransactionQuery = PaginationQuery & {
  transactionDate: Date
  transactionType: TransactionType
}