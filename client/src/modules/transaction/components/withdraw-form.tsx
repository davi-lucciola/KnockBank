"use client";

import { useContext, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { MoneyInput } from "@/components/money-input";
import { ArrowBendLeftDown } from "@phosphor-icons/react/dist/ssr";
import { useToast } from "@/components/ui/use-toast";
import {
  BasicTransferencePayload,
  BasicTransferenceSchema,
} from "@/modules/transaction/schemas/transference";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionContext } from "@/modules/transaction/contexts/transaction-context";
import { AccountContext } from "@/modules/account/contexts/account-context";

export function WithdrawForm() {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const { fetchAccount } = useContext(AccountContext);
  const { withdraw, fetchTransactions } = useContext(TransactionContext);
  const form = useForm<BasicTransferencePayload>({
    resolver: zodResolver(BasicTransferenceSchema),
  });

  const onSubmit = async (payload: BasicTransferencePayload) => {
    const toastDurationInMiliseconds = 3 * 1000; // 3 Seconds
    try {
      const response = await withdraw(payload);
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
        <Button
          className="w-full h-16 text-xl flex gap-4"
          variant="destructive"
        >
          Sacar
          <ArrowBendLeftDown size={32} />
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
                  <FormDescription>Valor que deseja sacar.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                className="w-full max-w-52"
              >
                Sacar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
