import { fetchAuthSession } from 'aws-amplify/auth';

const getHeaders = async (tenantId: string) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString() ?? '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-tenant-id': tenantId,
  };
};

const apiBase = (): string => {
  // Populated from amplify_outputs.json at runtime
  const outputs = (window as unknown as { amplifyOutputs?: { custom?: { API?: { endpoint?: string } } } }).amplifyOutputs;
  return outputs?.custom?.API?.endpoint ?? import.meta.env.VITE_API_ENDPOINT ?? '';
};

export const apiClient = {
  get: async <T>(path: string, tenantId: string): Promise<T> => {
    const res = await fetch(`${apiBase()}${path}`, { headers: await getHeaders(tenantId) });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async <T>(path: string, body: unknown, tenantId: string): Promise<T> => {
    const res = await fetch(`${apiBase()}${path}`, {
      method: 'POST', headers: await getHeaders(tenantId), body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  put: async <T>(path: string, body: unknown, tenantId: string): Promise<T> => {
    const res = await fetch(`${apiBase()}${path}`, {
      method: 'PUT', headers: await getHeaders(tenantId), body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
