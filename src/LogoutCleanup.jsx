import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutCleanup() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove logout flag
    localStorage.removeItem("logging_out");

    // Redirect to dashboard (ProtectedRoute will trigger login)
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return <div>Signing out…</div>;
}
