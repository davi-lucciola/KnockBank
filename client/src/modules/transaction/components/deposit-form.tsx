"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowBendRightUp } from "@phosphor-icons/react/dist/ssr";

export function DepositForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-16 text-xl flex gap-4" variant="success">
          Depositar
          <ArrowBendRightUp size={32} />
        </Button>
      </DialogTrigger>
      <DialogContent></DialogContent>
    </Dialog>
  );
}
