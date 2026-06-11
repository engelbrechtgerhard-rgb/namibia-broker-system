import { useAuth } from "react-oidc-context";

export default function OidcCallback() {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading…</div>;

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    window.location.replace("/");
    return null;
  }

  return <div>Processing login…</div>;
}
