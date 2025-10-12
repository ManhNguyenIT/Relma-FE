// useApi.ts
import { useState, useCallback } from 'react';
import { client } from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(async <T>(fn: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    get: <T>(url: string, params?: object) => request(() => client.get<T>(url, params)),
    post: <T>(url: string, data?: object) => request(() => client.post<T>(url, data)),
    put: <T>(url: string, data?: object) => request(() => client.put<T>(url, data)),
    del: <T>(url: string, params?: object) => request(() => client.delete<T>(url, params)),
  };
};
