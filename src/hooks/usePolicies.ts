import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';
import type { Policy } from '../types';

export const usePolicies = (tenantId: string) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<Policy[]>('/policies', tenantId);
      setPolicies(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetch(); }, [fetch]);

  const createPolicy = async (payload: Omit<Policy, 'policyId' | 'tenantId' | 'createdAt'>) => {
    const created = await apiClient.post<Policy>('/policies', payload, tenantId);
    setPolicies((prev) => [created, ...prev]);
    return created;
  };

  const updatePolicy = async (policyId: string, payload: Partial<Policy>) => {
    const updated = await apiClient.put<Policy>(`/policies/${policyId}`, payload, tenantId);
    setPolicies((prev) => prev.map((p) => (p.policyId === policyId ? { ...p, ...updated } : p)));
    return updated;
  };

  return { policies, loading, error, refetch: fetch, createPolicy, updatePolicy };
};
