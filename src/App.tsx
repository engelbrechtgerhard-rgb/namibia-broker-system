import { useAuth } from "react-oidc-context";
import { Routes, Route } from "react-router-dom";

export default function App() {
  const auth = useAuth();

  console.log("AUTH STATE:", {
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    error: auth.error,
    activeNavigator: auth.activeNavigator,
    user: auth.user,
  });

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          auth.isAuthenticated ? (
            <div>
              <h2>Hello {auth.user?.profile?.email}</h2>
              <button onClick={() => auth.removeUser()}>Sign out</button>
            </div>
          ) : (
            <button onClick={() => auth.signinRedirect()}>Sign in</button>
          )
        }
      />
    </Routes>
  );
}
