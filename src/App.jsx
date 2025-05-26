import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { addAuthInterceptor } from './api/';
import { AuthProvider } from './contexts/AuthContext';
import { AppSettingsProvider } from './contexts/AppSettingsProvider';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    addAuthInterceptor(navigate);
  }, [navigate]);
  
  return (
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
  );
}

export default App
