import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Dashboard } from "../pages/Dashboard";


export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Routes */}
        <>
          <Route element={<Home loginFormOpen={false} registerFormOpen={false}/>} index/>
          <Route path="/login" element={<Home loginFormOpen={true} registerFormOpen={false}/>} />
          <Route path="/cadastrar" element={<Home loginFormOpen={false} registerFormOpen={true}/>} />
        </>
        {/* Dashboard Routes */}
        <>
          <Route path="/dashboard" element={<Dashboard />}/>
        </>
      </Routes>
    </BrowserRouter>
  )
}