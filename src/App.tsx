import { useAuth } from "react-oidc-context";

export default function App() {
  const auth = useAuth();

  console.log("AUTH STATE:", {
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    error: auth.error,
    activeNavigator: auth.activeNavigator,
    user: auth.user,
  });

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <h2>Hello {auth.user?.profile.email}</h2>
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
}
