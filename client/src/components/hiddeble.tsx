import { AccountContext } from "@/modules/account/contexts/account-context";
import React, { useContext } from "react";
import { Skeleton } from "./ui/skeleton";

type HiddlebleProps = { children: React.ReactNode; className?: string };

export function Hiddleble({ children, className }: HiddlebleProps) {
  const { isBalanceVisible } = useContext(AccountContext);
  return (
    <>
      {isBalanceVisible ? children : <Skeleton className={className ?? ""} />}
    </>
  );
}
