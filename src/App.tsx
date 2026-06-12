import { useAuth } from "react-oidc-context";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div>
              <h2>Hello {auth.user?.profile?.email}</h2>
              <button onClick={() => auth.removeUser()}>Sign out</button>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
