import { useEffect, useState } from "react";

interface User {
  email: string;
  tenantId: string;
  groups: string[];
  sub: string;
}

function decodeJwt(token: string): any {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("idToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const claims = decodeJwt(token);

      const newUser: User = {
        email: claims.email,
        tenantId: claims["custom:tenantId"],
        groups: claims["cognito:groups"] ?? [],
        sub: claims.sub,
      };

      setUser(newUser);
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      localStorage.removeItem("idToken");
    }

    setLoading(false);
  }, []);

  return { user, loading };
}
