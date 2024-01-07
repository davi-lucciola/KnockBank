import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeProps } from "..";
import { RegisterForm } from "./RegisterForm";


export function Hero({ isModalOpen }: HomeProps) {
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(isModalOpen);
  const handleOpenRegisterModal = () => {
    navigate('/cadastrar')
    setIsRegisterModalOpen(true);
  };
  const handleCloseRegisterModal = () => {
    navigate('/')
    setIsRegisterModalOpen(false);
  };

  return (
    <>
      <main className="container px-40 py-72 m-auto flex flex-col gap-6">
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
      <RegisterForm
        isOpen={isRegisterModalOpen}
        closeModal={handleCloseRegisterModal}
      />
    </>
  );
}
