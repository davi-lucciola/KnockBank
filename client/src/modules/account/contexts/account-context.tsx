import { Account } from "@/models/account";
import { createContext, useState } from "react";

interface IAccountContext {
  getAccount: () => Account | null;
  createAccount: (account: Account) => Promise<void>;
}

export const AccountContext = createContext({} as IAccountContext);
export function AccountContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [account, setAccount] = useState<Account | null>(null);

  function getAccount(): Account | null {
    return account;
  }

  async function createAccount(account: Account) {}

  return (
    <AccountContext.Provider value={{ getAccount, createAccount }}>
      {children}
    </AccountContext.Provider>
  );
}
