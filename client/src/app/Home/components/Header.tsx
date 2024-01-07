import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeProps } from "..";
import { LoginForm } from "./LoginForm";
import { KnockBankLogo } from "../../../components/KnockBankLogo";


export function Header({ isModalOpen }: HomeProps) {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(isModalOpen);
  const handleOpenLoginModal = () => {
    navigate('/login');
    setIsLoginModalOpen(true);
  };
  const handleCloseLoginModal = () => {
    navigate('/');
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <header className="container m-auto flex justify-between items-center px-4">
        <div id="logo" className="flex items-center text-2xl font-bold">
          <KnockBankLogo size={64} />
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
      <LoginForm
        isOpen={isLoginModalOpen}
        closeModal={handleCloseLoginModal}
      />
    </>
  );
}
