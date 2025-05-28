import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ScreenLoader from "../components/Loader/ScreenLoader";
import {useSelector} from "react-redux";

const ProtectedRoute = ({ children  }) => {
  const { authenticated, loading, tokenCheckComplete } = useAuth();

  const {isAuthenticated} = useSelector((state) => state.auth);

    console.log(isAuthenticated, "PROTECTED ROUTE PERMISSION");
  // Only show loading when we haven't completed the token check
  if (!tokenCheckComplete) {
    return <ScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children ;
};

export default ProtectedRoute;