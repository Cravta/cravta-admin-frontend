import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";

export default function AppRouter() {
  return (
    <Routes>
      {AuthRoutes()}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
