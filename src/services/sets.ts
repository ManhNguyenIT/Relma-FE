import { useApi } from '../hooks/useApi';
import {
  Set,
  CreateSetCommand,
  UpdateSetCommand,
  DeleteSetCommand,
  PaginatedResponse,
  PaginationQueryParams,
} from '../types/api';

export const useSetsApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getSets = async (params?: PaginationQueryParams) => {
    return get<PaginatedResponse<Set>>('/api/v1/sets', { params });
  };

  const createSet = async (data: CreateSetCommand) => {
    return post<string>('/api/v1/sets', data);
  };

  const updateSet = async (data: UpdateSetCommand) => {
    return put<string>('/api/v1/sets', data);
  };

  const deleteSet = async (data: DeleteSetCommand) => {
    return del<boolean>('/api/v1/sets', { data });
  };

  const uploadSetFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Set>('/api/v1/sets/upload', formData);
  };

  const importSets = async () => {
    return post<Set>('/api/v1/sets/import');
  };

  const exportSets = async (fileName: string) => {
    return get<Blob>(`/api/v1/sets/export?fileName=${fileName}`, { responseType: 'blob' });
  };

  const getSetTemplate = async (fileName: string) => {
    return get<Blob>(`/api/v1/sets/template?fileName=${fileName}`, { responseType: 'blob' });
  };

  return {
    getSets,
    createSet,
    updateSet,
    deleteSet,
    uploadSetFile,
    importSets,
    exportSets,
    getSetTemplate,
    loading,
    error,
  };
};

export default useSetsApi;
