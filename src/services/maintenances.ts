import { useApi } from '../hooks/useApi';
import {
  Maintenance,
  CreateMaintenanceCommand,
  UpdateMaintenanceCommand,
  DeleteMaintenanceCommand,
  PaginatedResponse,
  QueryParams,
} from '../types/api';

export const useMaintenancesApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getMaintenances = async (params?: QueryParams) => {
    return get<PaginatedResponse<Maintenance>>('/api/v1/maintenances', { params });
  };

  const createMaintenance = async (data: CreateMaintenanceCommand) => {
    return post<string>('/api/v1/maintenances', data);
  };

  const updateMaintenance = async (data: UpdateMaintenanceCommand) => {
    return put<string>(`/api/v1/maintenances/${data.id}`, data);
  };

  const deleteMaintenance = async (data: DeleteMaintenanceCommand) => {
    return del<boolean>('/api/v1/maintenances', { data });
  };

  const uploadMaintenanceFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Maintenance>('/api/v1/maintenances/upload', formData);
  };

  const importMaintenances = async () => {
    return post<Maintenance>('/api/v1/maintenances/import');
  };

  const exportMaintenances = async () => {
    return get<Blob>('/api/v1/maintenances/export', { responseType: 'blob' });
  };

  const getMaintenanceTemplate = async () => {
    return get<Blob>('/api/v1/maintenances/template', { responseType: 'blob' });
  };

  return {
    getMaintenances,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    uploadMaintenanceFile,
    importMaintenances,
    exportMaintenances,
    getMaintenanceTemplate,
    loading,
    error,
  };
};

export default useMaintenancesApi;
