import { useApi } from '../hooks/useApi';
import {
  Storage,
  CreateStorageCommand,
  UpdateStorageCommand,
  DeleteStorageCommand,
  PaginatedResponse,
  PaginationQueryParams,
} from '../types/api';

export const useStoragesApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getStorages = async (params?: PaginationQueryParams) => {
    return get<PaginatedResponse<Storage>>('/api/v1/storages', { params });
  };

  const createStorage = async (data: CreateStorageCommand) => {
    return post<string>('/api/v1/storages', data);
  };

  const updateStorage = async (data: UpdateStorageCommand) => {
    return put<string>('/api/v1/storages', data);
  };

  const deleteStorage = async (data: DeleteStorageCommand) => {
    return del<boolean>('/api/v1/storages', { data });
  };

  const uploadStorageFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Storage>('/api/v1/storages/upload', formData);
  };

  const importStorages = async () => {
    return post<Storage>('/api/v1/storages/import');
  };

  const exportStorages = async (fileName: string) => {
    return get<Blob>(`/api/v1/storages/export?fileName=${fileName}`, { responseType: 'blob' });
  };

  const getStorageTemplate = async (fileName: string) => {
    return get<Blob>(`/api/v1/storages/template?fileName=${fileName}`, { responseType: 'blob' });
  };

  return {
    getStorages,
    createStorage,
    updateStorage,
    deleteStorage,
    uploadStorageFile,
    importStorages,
    exportStorages,
    getStorageTemplate,
    loading,
    error,
  };
};

export default useStoragesApi;
