"use client";

import { Api, ApiResponse } from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";
import { Account } from "@/models/account";
import { AccountService } from "@/modules/account/services/account-service";
import { CreateAccountPayload } from "../schemas/create-account";
import { AuthContext } from "@/modules/auth/contexts/auth-context";

interface IAccountContext {
  isBalanceVisible: boolean;
  toggleIsBalanceVisible: () => void;
  getAccount: () => Account | null;
  createAccount: (account: CreateAccountPayload) => Promise<ApiResponse>;
}

export const AccountContext = createContext({} as IAccountContext);
export function AccountContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuth, getToken } = useContext(AuthContext);
  const [account, setAccount] = useState<Account | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const accountService = new AccountService(new Api(getToken() ?? undefined));

  useEffect(() => {
    const token = getToken();
    if (token) {
      const accountPromise = accountService.getCurrentAccount();
      accountPromise.then((data) => {
        setAccount(data);
      });
    } else {
      setAccount(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

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
        createAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
