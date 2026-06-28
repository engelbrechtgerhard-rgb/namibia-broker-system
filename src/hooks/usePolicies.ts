import { useState, useEffect, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import { apiClient } from "../lib/apiClient";
import type { Policy } from "../types";

export const usePolicies = () => {
  const auth = useAuth();
  const user = auth.user;
  const tenantId = user?.profile?.["custom:tenantId"] as string | undefined;

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    if (!user || !tenantId) return;
    try {
      setLoading(true);
      const data = await apiClient.get<Policy[]>("/policies", user, tenantId);
      setPolicies(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [user, tenantId]);

  useEffect(() => { fetchPolicies(); }, [fetchPolicies]);

  const createPolicy = async (payload: Omit<Policy, "policyId" | "tenantId" | "createdAt">) => {
    if (!user || !tenantId) throw new Error("Missing auth");
    const created = await apiClient.post<Policy>("/policies", payload, user, tenantId);
    setPolicies((prev) => [created, ...prev]);
    return created;
  };

  const updatePolicy = async (policyId: string, payload: Partial<Policy>) => {
    if (!user || !tenantId) throw new Error("Missing auth");
    const updated = await apiClient.put<Policy>(`/policies/${policyId}`, payload, user, tenantId);
    setPolicies((prev) => prev.map((p) => (p.policyId === policyId ? { ...p, ...updated } : p)));
    return updated;
  };

  return { policies, loading, error, refetch: fetchPolicies, createPolicy, updatePolicy };
};
