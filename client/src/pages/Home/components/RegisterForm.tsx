import { useContext } from "react";
import { ContaContext } from "../../../context/ContaContext";
import { Input } from "../../../components/Input";
import { FormItem } from "../../../components/FormItem";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseModalProps, Modal } from "../../../components/Modal";
import { ToastContainer, toast } from "react-toastify";
import { TipoConta } from "../../../data/models/Conta";
import { ApiErrorType } from "../../../data/Api";
import { ContaInSchema, ContaIn } from "../../../data/schemas/Conta";
import { IContaService } from "../../../data/services/ContaService";


type RegisterFormModalProps = BaseModalProps;
export function RegisterForm({
  isOpen,
  closeModal
}: RegisterFormModalProps) {
  const { getContaService } = useContext(ContaContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContaIn>({
    resolver: zodResolver(ContaInSchema),
  });

  const contaService: IContaService = getContaService();
  async function createAccount(nova_conta: ContaIn) {
    try {
      let response = await contaService.cadastrarConta(nova_conta);
      toast.success(response.message);
      setTimeout(() => closeModal(), 500);
    } catch (e: any) {
      if (e.type == ApiErrorType.WARNING) {
        toast.warn(e.message);
        return;
      }

      toast.error(e.message);
    }
  }

  return (
    <>
      <Modal title="Cadastre-se" isOpen={isOpen} closeModal={closeModal}>
        <form
          onSubmit={handleSubmit(createAccount)}
          className="flex flex-col gap-4 px-16 pb-12"
        >
          <FormItem errorMessage={errors.nome?.message}>
            <Input
              label="Nome"
              type="text"
              placeholder="Davi Lucciola"
              {...register("nome")}
            />
          </FormItem>
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
          <FormItem errorMessage={errors.data_nascimento?.message}>
            <Input
              label="Data de Nascimento"
              type="date"
              placeholder="14/01/2004"
              {...register("data_nascimento")}
            />
          </FormItem>
          <FormItem errorMessage={errors.tipo_conta?.message}>
            <Input label="Tipo da Conta" {...register("tipo_conta")}>
              <option value={TipoConta.CONTA_CORRENTE}> Conta Corrente </option>
              <option value={TipoConta.CONTA_POUPANCA}> Conta Poupança </option>
              <option value={TipoConta.CONTA_SALARIO}> Conta Salário </option>
              <option value={TipoConta.CONTA_PAGAMENTO}> Conta Pagamento </option>
            </Input>
          </FormItem>
          <button
            type="submit"
            className="text-white bg-blue rounded-lg py-3 mt-8"
          >
            Criar Conta
          </button>
        </form>
      </Modal>
      <ToastContainer position="bottom-right" pauseOnHover={false} />
    </>
  );
}
