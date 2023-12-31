import { Hero } from "./components/Hero";
import { Header } from "./components/Header";
import { useTitle } from "../../hooks/useTitle";


export type HomeProps = {
  isModalOpen: boolean
}

type HomeModalStates = {
  registerFormOpen: boolean,
  loginFormOpen: boolean
}

export function Home({ registerFormOpen, loginFormOpen }: HomeModalStates) {
  // Tab Title
  useTitle('Home | KnockBank')

  return (
    <div className="bg-white h-screen">
      <Header isModalOpen={loginFormOpen}/>
      <Hero isModalOpen={registerFormOpen}/>
    </div>
  );
}
