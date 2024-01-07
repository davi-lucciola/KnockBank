import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../../../components/Input"
import { FormItem } from "../../../components/FormItem"
import { BaseModalProps, Modal } from "../../../components/Modal"
import { useAuth } from "../../../hooks/useAuth"
import { ApiErrorType } from "../../../data/Api"
import { UserLoginSchema, UserLogin } from "../../../data/schemas/User"


type LoginFormModalProps = BaseModalProps
export function LoginForm({ isOpen, closeModal }: LoginFormModalProps) {
  const { login, redirect } = useAuth();
  const { register, handleSubmit, formState: { errors }} = useForm<UserLogin>({
    resolver: zodResolver(UserLoginSchema)
  });
  
  async function handleLogin(userLogin: UserLogin) {
    try {
      await login(userLogin)
      toast.success('Conta logada com sucesso.');
      setTimeout(() => {  
        redirect('/dashboard')
      }, 1000);
    } catch (e: any) {
      if (e.type == ApiErrorType.WARNING) {
        toast.warn(e.message);
      } else {
        toast.error(e.message);
      }
    }
  }

  return (
    <Modal title="Entrar" isOpen={isOpen} closeModal={closeModal}>
      <form 
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col gap-4 px-16 pb-12"
      >
        <FormItem errorMessage={errors.cpf?.message}>
            <Input
              label="Cpf"
              type="text"
              placeholder="000.000.000-00"
              {...register("cpf")}
            />
          </FormItem>
          <FormItem errorMessage={errors.senha?.message}>
            <Input
              label="Senha"
              type="password"
              placeholder="********"
              {...register("senha")}
            />
          </FormItem>
          <button
            type="submit"
            className="text-white bg-blue rounded-lg py-3 mt-8"
          >
            Acessar Conta
          </button>
      </form>
    </Modal>
  )
}