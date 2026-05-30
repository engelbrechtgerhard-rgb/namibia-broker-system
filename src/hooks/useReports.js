import { useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';
export const useReports = (tenantId) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        apiClient.get('/reports/summary', tenantId)
            .then(setSummary)
            .finally(() => setLoading(false));
    }, [tenantId]);
    return { summary, loading };
};
