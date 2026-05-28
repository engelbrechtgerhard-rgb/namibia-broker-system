import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';
import type { Client } from '../types';

export const useClients = (tenantId: string) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<Client[]>('/clients', tenantId);
      setClients(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetch(); }, [fetch]);

  const createClient = async (payload: Omit<Client, 'clientId' | 'tenantId' | 'createdAt'>) => {
    const created = await apiClient.post<Client>('/clients', payload, tenantId);
    setClients((prev) => [created, ...prev]);
    return created;
  };

  const updateClient = async (clientId: string, payload: Partial<Client>) => {
    const updated = await apiClient.put<Client>(`/clients/${clientId}`, payload, tenantId);
    setClients((prev) => prev.map((c) => (c.clientId === clientId ? { ...c, ...updated } : c)));
    return updated;
  };

  return { clients, loading, error, refetch: fetch, createClient, updateClient };
};
