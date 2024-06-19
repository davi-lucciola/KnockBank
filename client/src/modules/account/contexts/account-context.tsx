"use client";

import { createContext, useState } from "react";
import { Account } from "@/models/account";
import { AccountService } from "@/modules/account/services/account-service";
import { CreateAccountPayload } from "../schemas/create-account";
import { ApiResponse } from "@/api";

interface IAccountContext {
  getAccount: () => Account | null;
  createAccount: (account: CreateAccountPayload) => Promise<ApiResponse>;
}

export const AccountContext = createContext({} as IAccountContext);
export function AccountContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const accountService = new AccountService();
  const [account, setAccount] = useState<Account | null>(null);

  function getAccount(): Account | null {
    return account;
  }

  async function createAccount(
    payload: CreateAccountPayload
  ): Promise<ApiResponse> {
    const data = accountService.createAccount(payload);
    return data;
  }

  return (
    <AccountContext.Provider value={{ getAccount, createAccount }}>
      {children}
    </AccountContext.Provider>
  );
}
