import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ScreenLoader from "../components/Loader/ScreenLoader";
import {useSelector} from "react-redux";

const ProtectedRoute = ({ children  }) => {
  const { authenticated, loading, tokenCheckComplete } = useAuth();

  const {isAuthenticated , user} = useSelector((state) => state.auth);

    console.log(user, "PROTECTED ROUTE PERMISSION");
  // Only show loading when we haven't completed the token check
  if (!tokenCheckComplete) {
    return <ScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children??<Navigate to={`/admin/${user?.Role?.Rights[0]??""}`} replace />;
};

export default ProtectedRoute;