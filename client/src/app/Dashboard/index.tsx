import { useTitle } from "../../hooks/useTitle"
import { useAuth } from "../../hooks/useAuth";
import { Menu } from "./components/Menu";
import { useNavigate } from "react-router-dom";


export function Dashboard() {
  // Tab Title
  useTitle('Dashboard | KnockBank');
  
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  if (!isAuth) {
    navigate('/login');
  }
  
  return (
    <div className="flex flex-row w-screen h-screen">
      <Menu />
      <section className="bg-light-gray flex flex-col w-full">
        <header className="bg-white h-20 w-full"></header>
        <main></main>
      </section>
    </div>
  ) 
}