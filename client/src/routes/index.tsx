import { Home } from "../pages/Home";
import { Dashboard } from "../pages/Dashboard";
import { Route, Routes, BrowserRouter } from "react-router-dom";


export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} index/>
        <Route path="/dashboard" element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}