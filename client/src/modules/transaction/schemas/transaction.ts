import { PartialAccount } from "../../account/schemas/account";

export enum TransactionType {
  DEPOSIT = 1,
  WITHDRAW = 2,
}

export type Transaction = {
  id: number;
  money: number;
  dateTime: string;
  transactionType: TransactionType;
  account: PartialAccount;
  originAccount?: PartialAccount;
};
