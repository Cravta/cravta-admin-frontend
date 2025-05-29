import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import ProtectedRoute from "../middleware/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {AuthRoutes()}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/" element={<ProtectedRoute/>} />
    </Routes>
  );
}
