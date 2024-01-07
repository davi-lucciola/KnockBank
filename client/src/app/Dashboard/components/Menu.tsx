import { toast } from "react-toastify";
import { SignOut, SquaresFour, User } from "@phosphor-icons/react";
import { KnockBankLogo } from "../../../components/KnockBankLogo";
import { useAuth } from "../../../hooks/useAuth";
import { ApiErrorType } from "../../../data/Api";

export function Menu() {
  const { logout, redirect } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch(e: any) {
      if (e.type == ApiErrorType.WARNING) {
        toast.warn(e.message);
      } else {
        toast.error(e.message);
      }
    }

    redirect('/')
  }

  return (
    <aside className="w-24 bg-gray-200 h-screen flex flex-col justify-around items-center py-4">
      <KnockBankLogo size={64} />
      <nav className="flex-1 mt-16">
        <ul className="flex flex-col gap-8">
          <li><SquaresFour size={32} className="fill-blue"/></li>
          <li><User size={32} className="fill-white"/></li>
        </ul>
      </nav>
      <button>
        <SignOut onClick={handleLogout} size={32} className="fill-red"/>
      </button>
    </aside>
  )
}