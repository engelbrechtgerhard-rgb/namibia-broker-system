import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();

  // 1. Still loading OIDC state → do nothing
  if (auth.isLoading) {
    return null;
  }

  // 2. If we are on the callback URL, let OIDC finish processing
  if (window.location.search.includes("code=")) {
    return null;
  }

  // 3. Not authenticated → redirect to login
  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return null;
  }

  // 4. Authenticated → render the page
  return children;
}
