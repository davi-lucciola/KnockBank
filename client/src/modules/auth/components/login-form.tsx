"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/shared/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/shared/components/ui/dialog";
import {
  LoginUserPayload,
  LoginUserSchema,
} from "@/modules/shared/schemas/login-user";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserUseCase } from "../usecases/login-user.use-case";

export function LoginForm() {
  const form = useForm<LoginUserPayload>({
    resolver: zodResolver(LoginUserSchema),
  });

  const onSubmit = async (data: LoginUserPayload) => {
    await loginUserUseCase(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="px-4 py-2 h-fit 
            border-gray-100 border rounded-2xl
            text-xl font-bold
            duration-300
            hover:bg-gray-100 hover:text-white"
        >
          Fazer Login
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Login </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cpf</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-33" {...field} />
                  </FormControl>
                  <FormDescription>
                    Digite o seu cpf onde sua conta está cadastrada.
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
                    <Input type="password" placeholder="*****" {...field} />
                  </FormControl>
                  <FormDescription>Insira sua senha.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit"> Entrar </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
