import { useState, useEffect, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import { apiClient } from "../lib/apiClient";
import type { Claim } from "../types";

export const useClaims = () => {
  const auth = useAuth();
  const user = auth.user;
  const tenantId = user?.profile?.["custom:tenantId"] as string | undefined;

  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    if (!user || !tenantId) return;
    try {
      setLoading(true);
      const data = await apiClient.get<Claim[]>("/claims", user, tenantId);
      setClaims(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [user, tenantId]);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const logClaim = async (payload: Omit<Claim, "claimId" | "tenantId" | "createdAt" | "status">) => {
    if (!user || !tenantId) throw new Error("Missing auth");
    const created = await apiClient.post<Claim>("/claims", payload, user, tenantId);
    setClaims((prev) => [created, ...prev]);
    return created;
  };

  const updateClaimStatus = async (claimId: string, status: Claim["status"], workflowState?: string) => {
    if (!user || !tenantId) throw new Error("Missing auth");
    const updated = await apiClient.put<Claim>(`/claims/${claimId}`, { status, workflowState }, user, tenantId);
    setClaims((prev) => prev.map((c) => (c.claimId === claimId ? { ...c, ...updated } : c)));
    return updated;
  };

  return { claims, loading, error, refetch: fetchClaims, logClaim, updateClaimStatus };
};
