import { useApi } from '../hooks/useApi';
import {
  Location,
  CreateLocationCommand,
  UpdateLocationCommand,
  DeleteLocationCommand,
  PaginatedResponse,
  QueryParams,
} from '../types/api';

export const useLocationsApi = () => {
  const { get, post, put, del: deleteApi, loading, error } = useApi();

  const getLocations = async (params?: QueryParams) => {
    return get<PaginatedResponse<Location>>('/api/v1/locations', { params });
  };

  const createLocation = async (data: CreateLocationCommand) => {
    return post<string>('/api/v1/locations', data);
  };

  const updateLocation = async (data: UpdateLocationCommand) => {
    return put<string>(`/api/v1/locations/${data.id}`, data);
  };

  const deleteLocation = async (data: DeleteLocationCommand) => {
    return deleteApi<boolean>('/api/v1/locations', { data });
  };

  return {
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    loading,
    error,
  };
};

export default useLocationsApi;
