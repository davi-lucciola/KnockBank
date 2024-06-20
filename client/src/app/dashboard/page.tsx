import { Metadata } from "next";
import { KnockBankLogo } from "@/components/knock-bank-logo";
import { LogoutButton } from "@/modules/auth/components/logout-button";
import { SquaresFour, User } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Dashboard | KnockBank",
  description: "Dashboard page managing your account, transactions and limits",
};

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

export default function DashboardPage() {
  return (
    <div className="flex flex-row w-screen h-screen">
      <Menu />
      <section className="bg-light-gray flex flex-col w-full">
        <header className="bg-white h-20 w-full p-3">
          <h1> Dashboard </h1>
        </header>
        <main></main>
      </section>
    </div>
  );
}
