import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutCleanup() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any local state if needed
    navigate("/", { replace: true });
  }, [navigate]);

  return <div>Signing out...</div>;
}
