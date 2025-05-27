import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";

export default function AppRouter() {
  return (
    <>
      {/* Public and auth routes */}
      <AuthRoutes />
      {/* Protected admin routes */}
      <AdminRoutes />
    </>
  );
}
