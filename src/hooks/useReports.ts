import { useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';
import type { ReportSummary } from '../types';

export const useReports = (tenantId: string) => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<ReportSummary>('/reports/summary', tenantId)
      .then(setSummary)
      .finally(() => setLoading(false));
  }, [tenantId]);

  return { summary, loading };
};
