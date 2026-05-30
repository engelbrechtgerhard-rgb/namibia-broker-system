import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';
export const usePolicies = (tenantId) => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiClient.get('/policies', tenantId);
            setPolicies(data);
        }
        catch (e) {
            setError(String(e));
        }
        finally {
            setLoading(false);
        }
    }, [tenantId]);
    useEffect(() => { fetch(); }, [fetch]);
    const createPolicy = async (payload) => {
        const created = await apiClient.post('/policies', payload, tenantId);
        setPolicies((prev) => [created, ...prev]);
        return created;
    };
    const updatePolicy = async (policyId, payload) => {
        const updated = await apiClient.put(`/policies/${policyId}`, payload, tenantId);
        setPolicies((prev) => prev.map((p) => (p.policyId === policyId ? { ...p, ...updated } : p)));
        return updated;
    };
    return { policies, loading, error, refetch: fetch, createPolicy, updatePolicy };
};
