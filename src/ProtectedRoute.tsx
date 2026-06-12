import { ReactNode } from "react";
import { useAuth } from "react-oidc-context";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();

  // 1. Still loading → don't redirect
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  // 2. Callback in progress → don't redirect
  if (window.location.search.includes("code=")) {
    return <div>Completing login...</div>;
  }

  // 3. Not authenticated → redirect to Cognito
  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return null;
  }

  // 4. Authenticated → render protected content
  return <>{children}</>;
}
