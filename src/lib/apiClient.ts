import { User } from "oidc-client-ts";

const getHeaders = (user: User, tenantId: string) => {
  const token = user?.access_token ?? "";

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "x-tenant-id": tenantId,
  };
};

const apiBase = (): string => {
  return import.meta.env.VITE_API_ENDPOINT ?? "";
};

export const apiClient = {
  get: async <T>(path: string, user: User, tenantId: string): Promise<T> => {
    const res = await fetch(`${apiBase()}${path}`, {
      headers: getHeaders(user, tenantId),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  post: async <T>(path: string, body: unknown, user: User, tenantId: string): Promise<T> => {
    const res = await fetch(`${apiBase()}${path}`, {
      method: "POST",
      headers: getHeaders(user, tenantId),
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  put: async <T>(path: string, body: unknown, user: User, tenantId: string): Promise<T> => {
    const res = await fetch(`${apiBase()}${path}`, {
      method: "PUT",
      headers: getHeaders(user, tenantId),
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
