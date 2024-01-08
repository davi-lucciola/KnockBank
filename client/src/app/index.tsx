import '../index.css'
import 'react-toastify/ReactToastify.css'
import { Router } from '../routes'
import { AuthContextProvider } from '../context/AuthContext'
import { ContaContextProvider } from '../context/ContaContext'


export default function App() {
  return (
    <AuthContextProvider>
      <ContaContextProvider>
        <Router />
      </ContaContextProvider>
    </AuthContextProvider>
  )
}