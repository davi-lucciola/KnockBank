import { PaginationQuery } from "@/lib/pagination";
import { Person } from "@/modules/account/schemas/person";

export enum AccountType {
  CURRENT_ACCOUNT = 1,
  SAVING_ACCOUNT = 2,
  SALARY_ACCOUNT = 3,
  PAYMENT_ACCOUNT = 4,
}

export type BaseAccount = {
  id: number;
  flActive: boolean;
  person: Person;
};

export type Account = BaseAccount & {
  balance: number;
  dailyWithdrawLimit: number;
  todayWithdraw: number;
  accountType: AccountType;
};

export type AccountQuery = PaginationQuery & {
  search: string;
};
