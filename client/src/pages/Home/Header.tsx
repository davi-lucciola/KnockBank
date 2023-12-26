import { useState } from "react";
import { CurrencyCircleDollar } from "@phosphor-icons/react";
import { Modal } from "../../components/Modal";


export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const handleOpenLoginModal = () => { setIsLoginModalOpen(true) };
  const handleCloseLoginModal = () => { setIsLoginModalOpen(false) };

  return (
    <>
      <header className="container m-auto flex justify-between items-center px-4">
        <div id="logo" className="flex items-center text-2xl font-bold">
          <CurrencyCircleDollar size={64} className="fill-blue" />
          <span> KnockBank</span>
        </div>
        <button
          onClick={handleOpenLoginModal} 
          className="
            px-4 py-2 h-fit 
            border-gray-100 border rounded-2xl
            text-xl font-bold
            duration-300
            hover:bg-gray-100 hover:text-white
          "
        >
          Fazer Login
        </button>
      </header>
      <Modal title="Entrar" isOpen={isLoginModalOpen} closeModal={handleCloseLoginModal}>
        <form action=""></form>
      </Modal>
    </>
  );
}