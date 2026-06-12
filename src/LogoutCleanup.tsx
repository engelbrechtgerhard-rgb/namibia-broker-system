import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutCleanup() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("logging_out");
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return <div>Signing out…</div>;
}
