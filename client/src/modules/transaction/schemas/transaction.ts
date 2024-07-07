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
