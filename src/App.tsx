import { useAuth } from "react-oidc-context";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LogoutCleanup from "./LogoutCleanup";

export default function App() {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return (
    <Routes>
      {/* Logout callback route */}
      <Route path="/clear" element={<LogoutCleanup />} />

      {/* Protected home route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div>
              <h2>Hello {auth.user?.profile?.email}</h2>
              <button onClick={() => auth.signoutRedirect()}>Sign out</button>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
