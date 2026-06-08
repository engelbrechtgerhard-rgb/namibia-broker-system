import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth"; // adjust path if needed
export const useClients = () => {
    const { user } = useAuth();
    const tenantId = user?.tenantId;
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetch = useCallback(async () => {
        if (!tenantId)
            return;
        try {
            setLoading(true);
            const data = await apiClient.get("/clients", tenantId);
            setClients(data);
        }
        catch (e) {
            setError(String(e));
        }
        finally {
            setLoading(false);
        }
    }, [tenantId]);
    useEffect(() => {
        fetch();
    }, [fetch]);
    const createClient = async (payload) => {
        if (!tenantId)
            throw new Error("Missing tenantId");
        const created = await apiClient.post("/clients", payload, tenantId);
        setClients((prev) => [created, ...prev]);
        return created;
    };
    const updateClient = async (clientId, payload) => {
        if (!tenantId)
            throw new Error("Missing tenantId");
        const updated = await apiClient.put(`/clients/${clientId}`, payload, tenantId);
        setClients((prev) => prev.map((c) => (c.clientId === clientId ? { ...c, ...updated } : c)));
        return updated;
    };
    return { clients, loading, error, refetch: fetch, createClient, updateClient };
};
