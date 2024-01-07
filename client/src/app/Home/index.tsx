import { Hero } from "./components/Hero";
import { Header } from "./components/Header";
import { useTitle } from "../../hooks/useTitle";
import { useAuth } from "../../hooks/useAuth";

export type HomeProps = {
  isModalOpen: boolean
}

type HomeModalStates = {
  registerFormOpen: boolean,
  loginFormOpen: boolean
}

export function Home({ registerFormOpen, loginFormOpen }: HomeModalStates) {
  // Tab Title
  useTitle('Home | KnockBank');
  const { isAuth, redirect } = useAuth();

  if (isAuth) 
    redirect('/dashboard');
  
  return (
    <div className="bg-white h-screen">
      <Header isModalOpen={loginFormOpen}/>
      <Hero isModalOpen={registerFormOpen}/>
    </div>
  );
}
