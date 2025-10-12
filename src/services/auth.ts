import { useApi } from '../hooks/useApi';

export const useAuthApi = () => {
  const { get, loading, error } = useApi();

  const login = async (returnUrl: string = '/') => {
    return get(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const logout = async (returnUrl: string = '/') => {
    return get(`/auth/logout?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  return {
    login,
    logout,
    loading,
    error,
  };
};

export default useAuthApi;
