"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LoginUserPayload,
  LoginUserSchema,
} from "@/modules/auth/schemas/login-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useContext(AuthContext);
  const form = useForm<LoginUserPayload>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  const onSubmit = async (payload: LoginUserPayload) => {
    const toastDurationInMiliseconds = 3 * 1000; // 3 Seconds
    try {
      await login(payload);
      toast({
        title: "Usuário conectado com sucesso.",
        variant: "success",
        duration: toastDurationInMiliseconds,
      });
      router.push("/dashboard");
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
      <DialogContent className="w-full max-w-sm rounded-lg lg:rounded-sm lg:max-w-xl gap-8">
        <DialogHeader>
          <DialogTitle className="text-2xl"> Login </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cpf</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-14" {...field} />
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
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>Insira sua senha.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full max-w-52">
                {" "}
                Entrar{" "}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
