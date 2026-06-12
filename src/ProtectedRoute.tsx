import { ReactNode, useEffect } from "react";
import { useAuth } from "react-oidc-context";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();
  const isLoggingOut = localStorage.getItem("logging_out") === "true";

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated && !isLoggingOut) {
      auth.signinRedirect();
    }
  }, [auth.isLoading, auth.isAuthenticated, isLoggingOut, auth]);

  if (auth.activeNavigator === "signinRedirect") {
    return <div>Completing login…</div>;
  }

  if (auth.isLoading) {
    return <div>Loading authentication…</div>;
  }

  if (isLoggingOut) {
    return <div>Signing out…</div>;
  }

  if (!auth.isAuthenticated) {
    return <div>Redirecting to login…</div>;
  }

  return <>{children}</>;
}
