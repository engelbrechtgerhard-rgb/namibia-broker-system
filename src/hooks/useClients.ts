import { useState, useEffect, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import { apiClient } from "../lib/apiClient";
import type { Client } from "../types";

export const useClients = () => {
  const auth = useAuth();
  const user = auth.user;
  const tenantId = user?.profile?.["custom:tenantId"] as string | undefined;

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!user || !tenantId) return;

    try {
      setLoading(true);
      const data = await apiClient.get<Client[]>("/clients", user, tenantId);
      setClients(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [user, tenantId]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (
    payload: Omit<Client, "clientId" | "tenantId" | "createdAt" | "updatedAt">
  ) => {
    if (!user || !tenantId) throw new Error("Missing auth");
    const created = await apiClient.post<Client>("/clients", payload, user, tenantId);
    setClients((prev) => [created, ...prev]);
    return created;
  };

  const updateClient = async (clientId: string, payload: Partial<Client>) => {
    if (!user || !tenantId) throw new Error("Missing auth");
    const updated = await apiClient.put<Client>(
      `/clients/${clientId}`,
      payload,
      user,
      tenantId
    );
    setClients((prev) =>
      prev.map((c) => (c.clientId === clientId ? { ...c, ...updated } : c))
    );
    return updated;
  };

  return { clients, loading, error, refetch: fetchClients, createClient, updateClient };
};
