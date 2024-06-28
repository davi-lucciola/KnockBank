"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowsLeftRight } from "@phosphor-icons/react/dist/ssr";

export function TransferForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-16 text-xl flex gap-4">
          Transferir
          <ArrowsLeftRight size={32} />
        </Button>
      </DialogTrigger>
      <DialogContent></DialogContent>
    </Dialog>
  );
}
