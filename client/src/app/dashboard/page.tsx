"use client";

import { KnockBankLogo } from "@/components/knock-bank-logo";
import { useToast } from "@/components/ui/use-toast";
import { ApiUnauthorizedError } from "@/lib/api";
import { AccountResumeCard } from "@/modules/account/components/account-resume-card";
import { BalanceCard } from "@/modules/account/components/balance-card";
import { AccountContext } from "@/modules/account/contexts/account-context";
import { LogoutButton } from "@/modules/auth/components/logout-button";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { useUnauthorizedHandler } from "@/modules/auth/hooks/use-unauthorized-handler";
import { BankStatmentCard } from "@/modules/transaction/components/bank-statment-card";
import { SquaresFour, User } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

function Menu() {
  return (
    <aside className="w-24 bg-gray-200 h-screen flex flex-col justify-around items-center py-4 fixed left-0">
      <KnockBankLogo size={64} />
      <nav className="flex-1 mt-16">
        <ul className="flex flex-col gap-8">
          <li>
            <SquaresFour size={32} className="fill-primary" />
          </li>
          <li>
            <User size={32} className="fill-white" />
          </li>
        </ul>
      </nav>
      <LogoutButton />
    </aside>
  );
}

function Header() {
  const { getAccount } = useContext(AccountContext);
  const account = getAccount();

  return (
    <header className="bg-white h-20 w-full py-3 px-8">
      <small className="text-sm"> Seja bem vindo </small>
      <p className="text-sm">
        <span className="text-lg font-bold"> {account?.person.name} </span>
        (Nº {account?.id})
      </p>
    </header>
  );
}

function Content() {
  const { getAccount } = useContext(AccountContext);
  const account = getAccount();

  return (
    <main className="w-full h-full grid p-8 gap-8 grid-cols-1 grid-rows-3 lg:grid-cols-3 lg:grid-rows-2">
      <BalanceCard
        className="h-full flex flex-col justify-between lg:col-span-2"
        account={account}
      />
      <AccountResumeCard className="w-full flex flex-col row-start-3 lg:row-start-2 lg:col-span-2" />
      <BankStatmentCard className="h-full lg:row-span-2 lg:col-start-3" />
    </main>
  );
}

export default function DashboardPage() {
  const { fetchAccount, setAccount } = useContext(AccountContext);
  const { verifyToken, unauthorizedHandler } = useUnauthorizedHandler();

  useEffect(() => {
    verifyToken();
    const accountPromise = fetchAccount();
    accountPromise.then((data) => setAccount(data)).catch(unauthorizedHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-row w-screen min-h-screen">
      <Menu />
      <section className="bg-light-gray flex flex-col w-full ps-24">
        <Header />
        <Content />
      </section>
    </div>
  );
}
