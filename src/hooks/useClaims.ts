import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';
import type { Claim } from '../types';

export const useClaims = (tenantId: string) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<Claim[]>('/claims', tenantId);
      setClaims(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetch(); }, [fetch]);

  const logClaim = async (payload: Omit<Claim, 'claimId' | 'tenantId' | 'createdAt' | 'status'>) => {
    const created = await apiClient.post<Claim>('/claims', payload, tenantId);
    setClaims((prev) => [created, ...prev]);
    return created;
  };

  const updateClaimStatus = async (claimId: string, status: Claim['status'], workflowState?: string) => {
    const updated = await apiClient.put<Claim>(`/claims/${claimId}`, { status, workflowState }, tenantId);
    setClaims((prev) => prev.map((c) => (c.claimId === claimId ? { ...c, ...updated } : c)));
    return updated;
  };

  return { claims, loading, error, refetch: fetch, logClaim, updateClaimStatus };
};
