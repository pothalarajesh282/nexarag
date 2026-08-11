import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppLoader from "../AppLoader/AppLoader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
