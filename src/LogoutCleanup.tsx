import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

export default function LogoutCleanup() {
  const auth = useAuth();

  useEffect(() => {
    auth.removeUser();
  }, []);

  return <Navigate to="/" replace />;
}
