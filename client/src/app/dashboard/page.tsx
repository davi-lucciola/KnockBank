"use client";

import { KnockBankLogo } from "@/components/knock-bank-logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ApiUnauthorizedError } from "@/lib/api";
import { BalanceCard } from "@/modules/account/components/balance-card";
import { AccountContext } from "@/modules/account/contexts/account-context";
import { LogoutButton } from "@/modules/auth/components/logout-button";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
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
      <Card className="w-full row-start-3 lg:row-start-2 lg:col-span-2">
        <CardHeader className="text-2xl font-semibold">Resumo</CardHeader>
        <CardContent></CardContent>
      </Card>
      <BankStatmentCard className="h-full lg:row-span-2 lg:col-start-3" />
    </main>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuth, getToken, logout } = useContext(AuthContext);
  const { fetchAccount, setAccount } = useContext(AccountContext);

  useEffect(() => {
    const token = getToken();
    if (!token || !isAuth) {
      setAccount(null);
      router.push("/");
      return;
    }

    const toastDurationInMiliseconds = 3 * 1000; // 3 Seconds
    try {
      const accountPromise = fetchAccount();
      accountPromise.then((data) => setAccount(data));
    } catch (error) {
      if (error instanceof ApiUnauthorizedError) {
        const logoutPromise = logout();
        logoutPromise.then(() => {
          toast({
            title: error.message,
            variant: "destructive",
            duration: toastDurationInMiliseconds,
          });
        });
      } else {
        toast({
          title: "Houve um erro inesperado, tente novamente.",
          variant: "destructive",
          duration: toastDurationInMiliseconds,
        });
      }
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

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
