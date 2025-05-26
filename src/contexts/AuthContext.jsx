import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../store/auth/userSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenCheckComplete, setTokenCheckComplete] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to check if token exists and is valid
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthenticated(false);
        setUser(null);
        setLoading(false);
        setTokenCheckComplete(true);
        return false;
      }
      const response = await dispatch(fetchUserData()).unwrap();
      // Validate token by making API request
      // const response = await axios.get("https://cravta.com/api/v1/user/", {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // });
      if (response) {
        setUser(response);
        setAuthenticated(true);
        setLoading(false);
        setTokenCheckComplete(true);
        return true;
      } else {
        // Invalid response
        localStorage.removeItem("token"); // Clear invalid token
        setAuthenticated(false);
        setUser(null);
        setLoading(false);
        setTokenCheckComplete(true);
        return false;
      }
    } catch (error) {
      console.error("Token verification failed:", error);

      // Handle token expiration or invalid token
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.removeItem("token"); // Clear expired token
      }

      setAuthenticated(false);
      setUser(null);
      setLoading(false);
      setTokenCheckComplete(true);
      return false;
    }
  };

  // Function to handle login
  const login = async (token) => {
    localStorage.setItem("token", token);
    const success = await verifyToken();
    if (success) {
      // Determine where to navigate based on user type
      if (user && user.user_type === "teacher") {
        navigate("/class");
      } else {
        navigate("/home");
      }
    }
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  // Check token on component mount and set up periodic validation
  useEffect(() => {
    const initialCheck = async () => {
      await verifyToken();
    };

    initialCheck();

    // Setup token refresh/validation every 5 minutes
    const intervalId = setInterval(async () => {
      if (authenticated) {
        const stillValid = await verifyToken();
        if (!stillValid) {
          // Token became invalid during the session
          navigate("/login");
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [navigate, authenticated]);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        loading,
        tokenCheckComplete,
        login,
        logout,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
