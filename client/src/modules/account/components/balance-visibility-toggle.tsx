"use client";

import { useContext } from "react";
import { AccountContext } from "../contexts/account-context";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "@phosphor-icons/react/dist/ssr";

export function BalanceVisibilityToggle() {
  const { isBalanceVisible, toggleIsBalanceVisible } =
    useContext(AccountContext);

  return (
    <Button
      variant="secondary"
      className="w-12 h-12"
      onClick={() => toggleIsBalanceVisible()}
    >
      {isBalanceVisible ? (
        <Eye size={32} className="scale-150" />
      ) : (
        <EyeClosed size={32} className="scale-150" />
      )}
    </Button>
  );
}
