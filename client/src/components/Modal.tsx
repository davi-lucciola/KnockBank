import { ReactNode } from "react";
import { XCircle } from "@phosphor-icons/react";

type ModalProps = {
  title: string
  children: ReactNode
  closeModal: () => void,
  isOpen?: boolean
}

export function Modal({ title, children, closeModal, isOpen = false }: ModalProps) {
  return (
    <>
      {isOpen && (
      <div className="
          fixed inset-0 bg-gray-200 bg-opacity-30
          backdrop-blur-sm s flex justify-center items-center
      ">
        <div className="bg-white w-1/3 h-2/3 shadow-xl rounded-3xl">
          <header className="rounded-t-3xl flex justify-between items-center w-full px-12 pt-8">
            <h1 className="text-4xl self-center cursor-default duration-300 hover:text-blue">
              {title}
            </h1>
            <XCircle
              size={40} 
              onClick={closeModal} 
              className="
                fill-gray-100 hover:fill-blue 
                rounded-full cursor-pointer duration-300"
            />
          </header>
          {children}
        </div>
      </div>)}
    </>
  );
}
