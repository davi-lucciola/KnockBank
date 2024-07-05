"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBendLeftDown } from "@phosphor-icons/react/dist/ssr";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BasicTransferencePayload,
  BasicTransferenceSchema,
} from "../schemas/transference";
import { TransactionContext } from "../contexts/transaction-context";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AccountContext } from "@/modules/account/contexts/account-context";
import { formatBrasilianReal, toBrasilianReal } from "@/lib/utils";

export function WithdrawForm() {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const { fetchAccount } = useContext(AccountContext);
  const { withdraw, fetchTransactions } = useContext(TransactionContext);
  const form = useForm<BasicTransferencePayload>({
    resolver: zodResolver(BasicTransferenceSchema),
    defaultValues: {
      money: 0,
    },
  });

  const onSubmit = async (data: BasicTransferencePayload) => {
    const toastDurationInMiliseconds = 3 * 1000; // 3 Seconds
    try {
      const response = await withdraw(data);
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
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
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
              render={({ field: { onChange, value, ...props } }) => (
                <FormItem>
                  <FormLabel> Valor </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 10,00"
                      value={formatBrasilianReal(toBrasilianReal(value)!)}
                      onChange={(event) => {
                        const { value } = event.target;
                        event.target.value = formatBrasilianReal(value);
                        onChange(event);
                      }}
                      {...props}
                    />
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
