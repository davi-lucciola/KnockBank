import React from "react";
import { XCircle } from "@phosphor-icons/react";


export type BaseModalProps = {
  isOpen?: boolean
  closeModal: () => void,
}

type ModalProps = BaseModalProps & {
  title: string
  children: React.ReactNode
} 

export const Modal: React.FC<ModalProps> = ({ title, children, closeModal, isOpen = false }) => {
  return (
    <>
      {isOpen && (
      <div className="
          fixed inset-0 bg-gray-200 bg-opacity-30
          backdrop-blur-sm s flex justify-center items-center
      ">
        <div className="bg-white min-w-96 w-1/3 shadow-xl rounded-3xl">
          <header className="rounded-t-3xl flex justify-between items-center w-full px-16 py-12">
            <h1 className="text-4xl self-center cursor-default duration-300 hover:text-blue">
              {title}
            </h1>
            <XCircle
              size={48} 
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
