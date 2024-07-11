"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { ArrowsLeftRight } from "@phosphor-icons/react/dist/ssr";
import {
  TransferencePayload,
  TransferenceSchema,
} from "@/modules/transaction/schemas/transference";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoneyInput } from "@/components/money-input";
import { AccountCombobox } from "@/modules/account/components/account-combobox";
import { AccountContext } from "@/modules/account/contexts/account-context";
import { TransactionContext } from "../contexts/transaction-context";

export function TransferenceForm() {
  const { toast } = useToast();
  const { fetchAccount } = useContext(AccountContext);
  const { transfer, fetchTransactions } = useContext(TransactionContext);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<TransferencePayload>({
    resolver: zodResolver(TransferenceSchema),
  });

  const onSubmit = async (payload: TransferencePayload) => {
    const toastDurationInMiliseconds = 3 * 1000; // 3 Seconds
    try {
      const response = await transfer(payload);
      toast({
        title: response.message,
        variant: "success",
        duration: toastDurationInMiliseconds,
      });
      fetchAccount();
      fetchTransactions();
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message,
          variant: "destructive",
          duration: toastDurationInMiliseconds,
        });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.setValue("money", 0);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full h-16 text-xl flex gap-4">
          Transferir
          <ArrowsLeftRight size={32} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="money"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Valor </FormLabel>
                  <FormControl>
                    <MoneyInput {...field} />
                  </FormControl>
                  <FormDescription>
                    Valor que deseja transferir.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Conta Destino </FormLabel>
                  <FormControl>
                    <AccountCombobox
                      value={field.value}
                      setAccountId={(accountId: number) =>
                        form.setValue("accountId", accountId)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Pesquise pelo nome ou começo do cpf da conta.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full max-w-52">
                Transferir
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
