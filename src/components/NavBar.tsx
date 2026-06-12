import { useAuth } from "react-oidc-context";
import { clientId, postLogoutRedirectUri, cognitoDomain } from "@/config/authEnv";

export default function NavBar() {
  const auth = useAuth();

  const signOutRedirect = async () => {
    // Mark that logout is in progress
    localStorage.setItem("logging_out", "true");

    // Remove local user session
    await auth.removeUser();

    // Build Cognito logout URL
    const url =
      `${cognitoDomain}/logout?client_id=${clientId}` +
      `&logout_uri=${encodeURIComponent(postLogoutRedirectUri)}`;

    // Redirect to Cognito logout
    window.location.replace(url);
  };

  return (
    <nav>
      <span>Namibia Broker System</span>
      <span>{auth.user?.profile.email}</span>
      <button onClick={signOutRedirect}>Logout</button>
    </nav>
  );
}
