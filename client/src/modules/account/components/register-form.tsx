"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  CreateAccountPayload,
  CreateAccountSchema,
} from "@/modules/account/schemas/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AccountContext } from "@/modules/account/contexts/account-context";
import { DatePicker } from "@/components/date-picker";
import { AccountType } from "@/modules/account/schemas/account";
import { formatCpf } from "@/lib/utils";

export function RegisterForm() {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const { createAccount } = useContext(AccountContext);
  const form = useForm<CreateAccountPayload>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      name: "",
      cpf: "",
      birthDate: "",
      password: "",
      accountType: 1,
    },
  });

  const onSubmit = async (payload: CreateAccountPayload) => {
    const toastDurationInMiliseconds = 3 * 1000; // 3 Seconds
    try {
      const response = await createAccount(payload);
      toast({
        title: response.message,
        variant: "success",
        duration: toastDurationInMiliseconds,
      });
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
        <Button className="text-xl py-8 px-10 rounded-2xl lg:max-w-60">
          Crie sua conta
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm rounded-lg lg:rounded-sm lg:max-w-xl">
        <DialogHeader>
          <DialogTitle> Crie sua conta </DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para realizar o seu cadastro.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Davi Lucciola" {...field} />
                  </FormControl>
                  <FormDescription>Insira seu nome completo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field: { onChange, ...props } }) => (
                <FormItem>
                  <FormLabel> Cpf </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-14"
                      onChange={(event) => {
                        const { value } = event.target;
                        event.target.value = formatCpf(value);
                        onChange(event);
                      }}
                      {...props}
                    />
                  </FormControl>
                  <FormDescription>
                    Seu cadastro de pessoa física (CPF)
                  </FormDescription>
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
                    <DatePicker date={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    Sua data de nascimento é utilizada para calcular sua idade
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>Informe uma senha forte</FormDescription>
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
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={`${field.value}`}
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
                  <FormDescription>
                    Tipo de conta que deseja abrir
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full max-w-52">
                Cadastrar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
