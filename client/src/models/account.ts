import { Person } from "./person";

export enum AccountType {
  CONTA_CORRENTE = 1,
  CONTA_POUPANCA = 2,
  CONTA_SALARIO = 3,
  CONTA_PAGAMENTO = 4,
}

export class Account {
  id: number;
  balance: number;
  flActive: boolean;
  dailyWithdrawLimit: number;
  todayWithdraw: number;
  person: Person;
  accountType: AccountType;

  public constructor(
    id: number,
    balance: number,
    flActive: boolean,
    dailyWithdrawLimit: number,
    todayWithdraw: number,
    person: Person,
    accountType: AccountType
  ) {
    this.id = id;
    this.balance = balance;
    this.flActive = flActive;
    this.dailyWithdrawLimit = dailyWithdrawLimit;
    this.todayWithdraw = todayWithdraw;
    this.person = person;
    this.accountType = accountType;
  }
}
