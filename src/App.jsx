import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { addAuthInterceptor } from './api/axiosInstance';
import { AuthProvider } from './contexts/AuthContext';
import { AppSettingsProvider } from './contexts/AppSettingsProvider';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../i189";
import AppRouter from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    addAuthInterceptor(navigate);
  }, [navigate]);
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppSettingsProvider>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </AppSettingsProvider>
      </AuthProvider>
      </ThemeProvider>
  );
}

export default App
