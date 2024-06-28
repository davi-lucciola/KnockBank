import { Person } from "./person";

export enum AccountType {
  CURRENT_ACCOUNT = 1,
  SAVING_ACCOUNT = 2,
  SALARY_ACCOUNT = 3,
  PAYMENT_ACCOUNT = 4,
}

export type PartialAccount = {
  id: number;
  name: string;
};

export type Account = {
  id: number;
  balance: number;
  flActive: boolean;
  dailyWithdrawLimit: number;
  todayWithdraw: number;
  person: Person;
  accountType: AccountType;
}
