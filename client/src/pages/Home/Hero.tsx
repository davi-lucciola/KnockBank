import { useState } from "react";
import { Modal } from "../../components/Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contaInSchema = z.object({
  nome: z.string().trim().min(4, 'Seu nome deve conter pelo menos 4 caracteres'),
  cpf: z.string().trim().length(11, 'Seu CPF deve conter 11 numeros.'),
  data_nascimento: z.date(),
  tipo_conta: z.number()
})

function RegisterFormModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(contaInSchema)
  });

  function createAccount(data: any) {
    console.log(data)
  }

  return (
    <Modal title="Cadastre-se" isOpen={isOpen} closeModal={closeModal}>
      <form onSubmit={handleSubmit(createAccount)} className="flex flex-col gap-3 px-16 py-12">
        <div className="flex flex-col gap-1">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            placeholder="Davi Lucciola"
            className="border border-gray-100 rounded-lg py-2 px-1"
            {...register('nome')}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="cpf">Cpf</label>
          <input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            className="border border-gray-100 rounded-lg py-2 px-1"
            {...register('cpf')}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="dataNascimento">Data de Nascimento</label>
          <input
            id="dataNascimento"
            type="date"
            placeholder="14/01/2004"
            className="border border-gray-100 rounded-lg py-2 px-1"
            {...register('data_nascimento')}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="tipoConta">Tipo Conta</label>
          <select
            id="tipoConta"
            className="border border-gray-100 rounded-lg py-2 px-1"
            {...register('tipo_conta')}
          >
            <option value="1"> Conta Corrente </option>
            <option value="2"> Conta Poupança </option>
            <option value="3"> Conta Salário </option>
            <option value="4"> Conta Pagamento </option>
          </select>
        </div>
        <button className="text-white bg-blue rounded-lg py-3 mt-8">
          Criar Conta
        </button>
      </form>
    </Modal>
  );
}

export function Hero() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };
  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <>
      <main className="h-full container px-40 py-72 m-auto flex flex-col gap-6">
        <h1 className="text-5xl font-extrabold w-2/5">
          Sempre dando um <strong>Knock Out</strong> nas suas dívidas
        </h1>
        <p className="text-justify text-2xl w-1/2">
          Venha com o banco que traz a maior facilidade para trânsferências.
          Quando você vê, o dinheiro já está batendo na sua porta.
        </p>
        <button
          onClick={handleOpenRegisterModal}
          className="bg-blue text-white text-xl w-60 py-5 px-10 rounded-2xl"
        >
          Crie sua conta
        </button>
      </main>
      <RegisterFormModal
        isOpen={isRegisterModalOpen}
        closeModal={handleCloseRegisterModal}
      />
    </>
  );
}
