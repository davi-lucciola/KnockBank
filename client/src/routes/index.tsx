import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Home } from "../app/Home";
import { Dashboard } from "../app/Dashboard";
import { NotFound } from "../app/NotFound";


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
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}