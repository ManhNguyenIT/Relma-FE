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

  const get = useCallback(
    <T>(url: string, params?: object) => request(() => client.get<T>(url, params)),
    [request],
  );

  const post = useCallback(
    <T>(url: string, data?: object) => request(() => client.post<T>(url, data)),
    [request],
  );

  const put = useCallback(
    <T>(url: string, data?: object) => request(() => client.put<T>(url, data)),
    [request],
  );

  const del = useCallback(
    <T>(url: string, params?: object) => request(() => client.delete<T>(url, params)),
    [request],
  );

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
  };
};
