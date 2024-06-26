"use client";

import { KnockBankLogo } from "@/components/knock-bank-logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Account } from "@/models/account";
import { AccountContext } from "@/modules/account/contexts/account-context";
import { LogoutButton } from "@/modules/auth/components/logout-button";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { SquaresFour, User } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

function Menu() {
  return (
    <aside className="w-24 bg-gray-200 h-screen flex flex-col justify-around items-center py-4">
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
  return (
    <main className="flex w-full h-full gap-8 p-8">
      <div className="w-2/3 flex flex-col gap-8">
        <Card className="h-full">
          <CardHeader className="text-2xl font-semibold">Saldo</CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader className="text-2xl font-semibold">Resumo</CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
      <Card className="w-1/3">
        <CardHeader className="text-2xl font-semibold">Transações</CardHeader>
        <CardContent></CardContent>
      </Card>
    </main>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuth } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuth) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <div className="flex flex-row w-screen h-screen">
      <Menu />
      <section className="bg-light-gray flex flex-col w-full">
        <Header />
        <Content />
      </section>
    </div>
  );
}
