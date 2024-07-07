"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { AccountContext } from "@/modules/account/contexts/account-context";
import { TransactionContext } from "@/modules/transaction/contexts/transaction-context";

export function LogoutButton() {
  const router = useRouter();
  const { toast } = useToast();
  const { logout } = useContext(AuthContext);
  const { setAccount } = useContext(AccountContext);
  const { setTransactions } = useContext(TransactionContext);

  async function handleLogout() {
    const toastDurationInMiliseconds = 3 * 1000; // 3 Seconds
    try {
      await logout();
      toast({
        title: "Usuário desconectado com sucesso.",
        variant: "success",
        duration: toastDurationInMiliseconds,
      });
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message,
          variant: "destructive",
          duration: toastDurationInMiliseconds,
        });
      }
    }
  }

  return (
    <button>
      <SignOut
        onClick={handleLogout}
        size={32}
        className="fill-destructive rotate-180"
      />
    </button>
  );
}
