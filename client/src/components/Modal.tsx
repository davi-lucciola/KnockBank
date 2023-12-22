import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode
  closeModal: () => void,
  isOpen?: boolean
}

export function Modal({ children, closeModal, isOpen = false }: ModalProps) {
  return (
    <>
      {isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
        <div className="bg-white w-48 h-80">
          <header>
            <button onClick={closeModal}>
              Fechar
            </button>
          </header>
          {children}
        </div>
      </div>)}
    </>
  );
}
