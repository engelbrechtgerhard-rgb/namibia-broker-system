import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';
export const useClaims = (tenantId) => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiClient.get('/claims', tenantId);
            setClaims(data);
        }
        catch (e) {
            setError(String(e));
        }
        finally {
            setLoading(false);
        }
    }, [tenantId]);
    useEffect(() => { fetch(); }, [fetch]);
    const logClaim = async (payload) => {
        const created = await apiClient.post('/claims', payload, tenantId);
        setClaims((prev) => [created, ...prev]);
        return created;
    };
    const updateClaimStatus = async (claimId, status, workflowState) => {
        const updated = await apiClient.put(`/claims/${claimId}`, { status, workflowState }, tenantId);
        setClaims((prev) => prev.map((c) => (c.claimId === claimId ? { ...c, ...updated } : c)));
        return updated;
    };
    return { claims, loading, error, refetch: fetch, logClaim, updateClaimStatus };
};
