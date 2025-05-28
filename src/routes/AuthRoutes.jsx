import { Route, Routes } from 'react-router-dom';
// import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from "../contexts/AuthContext";
import Login from '../pages/Auth/Login';
const LoginPageWrapper = () => {
  const { login } = useAuth();

  // Pass the login function to the original LoginPage component
  return <Login onLoginSuccess={login} />;
};
export default function AuthRoutes() {
  return (
    <>
      <Route path="/login" element={<LoginPageWrapper />} />
    </>
  );
}