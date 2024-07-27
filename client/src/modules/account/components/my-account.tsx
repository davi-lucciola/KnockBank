"use client";

import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Account,
  AccountType,
  UpdateAccountPayload,
  UpdateAccountSchema,
} from "@/modules/account/schemas/account";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";
import { MoneyInput } from "@/components/money-input";
import { ArrowLeft, Lock, Pencil, User } from "@phosphor-icons/react/dist/ssr";
import { AccountContext } from "@/modules/account/contexts/account-context";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { useUnauthorizedHandler } from "@/modules/auth/hooks/use-unauthorized-handler";

export function MyAccount({ account }: { account: Account | null }) {
  const { toast } = useToast();
  const { logout } = useContext(AuthContext);
  const { verifyToken } = useUnauthorizedHandler();
  const { fetchAccount, updateAccount, blockAccount } =
    useContext(AccountContext);
  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const onEditChange = (event: any) => {
    event.preventDefault();
    setEditMode(!editMode);
  };

  const form = useForm<UpdateAccountPayload>({
    resolver: zodResolver(UpdateAccountSchema),
  });

  useEffect(() => {
    if (account) {
      form.setValue("name", account.person.name);
      form.setValue("birthDate", account.person.birthDate!);
      form.setValue("accountType", account.accountType);
      form.setValue("dailyWithdrawLimit", account.dailyWithdrawLimit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const onSubmit = async (payload: UpdateAccountPayload) => {
    const toastDurationInMiliseconds = 3 * 1000; // 3 Seconds
    try {
      const response = await updateAccount(payload);
      toast({
        title: response.message,
        variant: "success",
        duration: toastDurationInMiliseconds,
      });
      fetchAccount();
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

  const onBlockAccount = async () => {
    const toastDurationInMiliseconds = 3 * 1000; // 3 Seconds
    try {
      const response = await blockAccount();
      toast({
        title: response.message,
        variant: "success",
        duration: toastDurationInMiliseconds,
      });
      await logout();
      verifyToken();
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
        setEditMode(false);
      }}
    >
      <DialogTrigger asChild>
        <User
          size={32}
          className="fill-white duration-300 hover:fill-primary hover:cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm rounded-lg lg:rounded-sm lg:max-w-xl">
        <DialogHeader>
          <DialogTitle> Minha Conta </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Davi Lucciola"
                      disabled={!editMode}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      disabled={!editMode}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Tipo de Conta </FormLabel>
                  <FormControl>
                    <Select
                      disabled={!editMode}
                      defaultValue={`${field.value}`}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de conta..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipos de Contas</SelectLabel>
                          <SelectItem value={`${AccountType.CURRENT_ACCOUNT}`}>
                            Conta Corrente
                          </SelectItem>
                          <SelectItem value={`${AccountType.PAYMENT_ACCOUNT}`}>
                            Conta Pagamento
                          </SelectItem>
                          <SelectItem value={`${AccountType.SAVING_ACCOUNT}`}>
                            Conta Poupança
                          </SelectItem>
                          <SelectItem value={`${AccountType.SALARY_ACCOUNT}`}>
                            Conta Salário
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dailyWithdrawLimit"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Limite de Saque Diário</FormLabel>
                  <FormControl>
                    <MoneyInput disabled={!editMode} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter
              className={
                "flex items-center mt-4 w-full " +
                (editMode ? "lg:justify-between" : "")
              }
            >
              {editMode ? (
                <>
                  <div className="p-1 rounded-full duration-300 hover:bg-secondary hover:cursor-pointer">
                    <ArrowLeft size={24} onClick={onEditChange} />
                  </div>
                  <Button type="submit" className="w-full max-w-52">
                    Salvar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex gap-2"
                    onClick={onBlockAccount}
                  >
                    Bloquear
                    <Lock size={24} className="fill-white" />
                  </Button>
                  <Button
                    type="button"
                    className="flex gap-2"
                    onClick={onEditChange}
                  >
                    Editar
                    <Pencil size={24} className="fill-white" />
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
