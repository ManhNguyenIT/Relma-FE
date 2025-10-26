import { useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import {
  Location,
  CreateLocationCommand,
  UpdateLocationCommand,
  PaginatedResponse,
  PaginationQueryParams,
} from '../types/api';

export const useLocationsApi = () => {
  const { get, post, put, del: deleteApi, loading, error } = useApi();

  const getLocations = useCallback(
    async (params?: PaginationQueryParams) => {
      return get<PaginatedResponse<Location>>('/api/v1/locations', params);
    },
    [get],
  );

  const createLocation = useCallback(
    async (data: CreateLocationCommand) => {
      return post<string>('/api/v1/locations', data);
    },
    [post],
  );

  const updateLocation = useCallback(
    async (data: UpdateLocationCommand) => {
      const { id, ...updateData } = data;
      return put<string>(`/api/v1/locations/${id}`, updateData);
    },
    [put],
  );

  const deleteLocations = useCallback(
    async (ids: string[]) => {
      console.log('🔧 Delete API call with ids:', ids);
      return deleteApi<boolean>('/api/v1/locations', { ids: ids.join(',') });
    },
    [deleteApi],
  );

  return {
    getLocations,
    createLocation,
    updateLocation,
    deleteLocations,
    loading,
    error,
  };
};

export default useLocationsApi;
