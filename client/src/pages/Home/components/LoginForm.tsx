import { useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { useForm } from "react-hook-form"
import { BaseModalProps, Modal } from "../../../components/Modal"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserLoginSchema, UserLogin } from "../../../data/schemas/User"
import { FormItem } from "../../../components/FormItem"
import { Input } from "../../../components/Input"
import { IAuthService } from "../../../data/services/AuthService"
import { toast } from "react-toastify"
import { ApiErrorType } from "../../../data/Api"
import { useNavigate } from "react-router-dom"


type LoginFormModalProps = BaseModalProps
export function LoginForm({ isOpen, closeModal }: LoginFormModalProps) {
  const navigate = useNavigate();
  const { getAuthService, setToken } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }} = useForm<UserLogin>({
    resolver: zodResolver(UserLoginSchema)
  });
  
  const authService: IAuthService = getAuthService();
  async function login(user_login: UserLogin) {
    try {
      let token: string = await authService.login(user_login);
      setToken(token)
      toast.success('Conta logada com sucesso.');
      setTimeout(() => {  
        navigate('/dashboard')
      }, 1000);
    } catch (e: any) {
      console.log(e)
      if (e.type == ApiErrorType.WARNING) {
        toast.warn(e.message);
        return;
      }

      toast.error(e.message);
    }
  }

  return (
    <Modal title="Entrar" isOpen={isOpen} closeModal={closeModal}>
      <form 
        onSubmit={handleSubmit(login)}
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