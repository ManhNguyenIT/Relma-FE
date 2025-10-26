import { useApi } from '../hooks/useApi';
import { User, PaginatedResponse, PaginationQueryParams } from '../types/api';

export const useUsersApi = () => {
  const { get, post, del, loading, error } = useApi();

  const getUsers = async (params?: PaginationQueryParams) => {
    return get<PaginatedResponse<User>>('/api/v1/users', { params });
  };

  const getUserInfo = async () => {
    return get<User>('/api/v1/users/info');
  };

  const syncUsers = async () => {
    return post<User>('/api/v1/users/sync');
  };

  const deleteUser = async (id: string) => {
    return del<User>(`/api/v1/users?id=${id}`);
  };

  return {
    getUsers,
    getUserInfo,
    syncUsers,
    deleteUser,
    loading,
    error,
  };
};

export default useUsersApi;
