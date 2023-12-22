import { useState } from "react";
import { Modal } from "../components/Modal";

export function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  }

  const handleCloseModal = () => {
    setModalIsOpen(false);
  }

  return (
    <>
      <header className="bg-white">
        <div id="logo">
          <img src="" alt="" />
          <span> KnockBank</span>
        </div>
      </header>
      <main className="bg-white">
        <h1> O Banco para dar um <strong>Knock Out</strong> nas suas dividas </h1>
        <p> 
          Venha com a maior facilidade para trânsferência. 
          Quando você vê, o dinheiro já bate na sua porta 
        </p>
        <button onClick={handleOpenModal} className="bg-blue text-white">
          Crie sua conta
        </button>
      </main>
      <Modal isOpen={modalIsOpen} closeModal={handleCloseModal}>
        <form action="">

        </form>
      </Modal>
    </>
  ) 
}