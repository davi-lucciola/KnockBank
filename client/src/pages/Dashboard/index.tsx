import { useContext } from "react"
import { useTitle } from "../../hooks/useTitle"
import { AuthContext } from "../../context/AuthContext"


export function Dashboard() {
  // Tab Title
  useTitle('Dashboard | KnockBank')
  const { isAuth } = useContext(AuthContext);

  return (
    <>
      <h1 className="">
        Dashboard
      </h1>
      <p>Autenticado: {isAuth() ? 'Sim' : 'Não'}</p>
    </>
  ) 
}