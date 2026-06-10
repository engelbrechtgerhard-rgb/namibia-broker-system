import { useAuth } from "react-oidc-context";
import {
  clientId,
  postLogoutRedirectUri,
  cognitoDomain,
} from "@/config/authEnv";
import Button from "@/components/Button";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const auth = useAuth();

  const login = () => {
    auth.signinRedirect();
  };

  const logout = async () => {
    localStorage.setItem("logging_out", "true");
    await auth.removeUser();

    const url =
      `${cognitoDomain}/logout?client_id=${clientId}` +
      `&logout_uri=${encodeURIComponent(postLogoutRedirectUri)}` +
      `&post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;

    window.location.replace(url);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <span className={styles.logo}>Namibia Broker System</span>
      </div>

      <div className={styles.right}>
        {auth.isAuthenticated && (
          <>
            <span className={styles.email}>{auth.user?.profile.email}</span>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </>
        )}

        {!auth.isAuthenticated && (
          <Button variant="secondary" onClick={login}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
