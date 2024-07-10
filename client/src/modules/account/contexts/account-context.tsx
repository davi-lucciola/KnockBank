"use client";

import { Api, ApiResponse } from "@/lib/api";
import { createContext, useContext, useState } from "react";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { BaseAccount, Account, AccountQuery } from "@/modules/account/schemas/account";
import { AccountService } from "@/modules/account/services/account-service";
import { CreateAccountPayload } from "@/modules/account/schemas/create-account";

interface IAccountContext {
  isBalanceVisible: boolean;
  toggleIsBalanceVisible: () => void;
  getAccount: () => Account | null;
  setAccount: (account: Account | null) => void;
  fetchAccount: () => Promise<void>;
  getAccounts: (query: AccountQuery) => Promise<BaseAccount[]>;
  createAccount: (account: CreateAccountPayload) => Promise<ApiResponse>;
}

export const AccountContext = createContext({} as IAccountContext);
export function AccountContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useContext(AuthContext);
  const [account, setAccount] = useState<Account | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const accountService = new AccountService(new Api(getToken() ?? undefined));

  async function fetchAccount() {
    const myAccount = await accountService.getCurrentAccount();
    setAccount(myAccount);
  }

  async function getAccounts(query: AccountQuery) {
    const accounts = await accountService.getAccounts(query);
    return accounts.data;
  }

  function toggleIsBalanceVisible() {
    setIsBalanceVisible(!isBalanceVisible);
  }

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
    <AccountContext.Provider
      value={{
        isBalanceVisible,
        toggleIsBalanceVisible,
        getAccount,
        setAccount,
        fetchAccount,
        getAccounts,
        createAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
