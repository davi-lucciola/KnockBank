import React, { useContext } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountContext } from "@/modules/account/contexts/account-context";

type HiddlebleProps = { children: React.ReactNode; className?: string };

export function Hiddleble({ children, className }: HiddlebleProps) {
  const { isBalanceVisible } = useContext(AccountContext);
  return (
    <>
      {isBalanceVisible ? children : <Skeleton className={className ?? ""} />}
    </>
  );
}
