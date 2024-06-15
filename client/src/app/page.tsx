import { KnockBankLogo } from "@/components/knock-bank-logo";
import { LoginForm } from "@/modules/auth/components/login-form";
import { RegisterForm } from "@/modules/auth/components/register-form";

function Header() {
  return (
    <header className="container m-auto flex justify-between items-center px-4">
      <div id="logo" className="flex items-center text-2xl font-bold">
        <KnockBankLogo size={64} />
        <span> KnockBank</span>
      </div>
      <LoginForm />
    </header>
  );
}

function Hero() {
  return (
    <main className="container px-40 py-72 m-auto flex flex-col gap-6">
      <h1 className="text-5xl font-extrabold w-2/5">
        Sempre dando um <strong>Knock Out</strong> nas suas dívidas
      </h1>
      <p className="text-justify text-2xl w-1/2">
        Venha com o banco que traz a maior facilidade para trânsferências.
        Quando você vê, o dinheiro já está batendo na sua porta.
      </p>
      <RegisterForm />
    </main>
  );
}

export default function HomePage() {
  return (
    <div className="bg-white h-screen">
      <Header />
      <Hero />
    </div>
  );
}
