import Home from "../pages/Home";
import { DashboardPage } from "../pages/Dashboard";
import { Route, Routes, BrowserRouter } from "react-router-dom";


export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} index/>
        <Route path="/dashboard" element={<DashboardPage />}/>
      </Routes>
    </BrowserRouter>
  )
}