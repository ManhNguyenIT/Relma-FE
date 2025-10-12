import { useApi } from '../hooks/useApi';
import {
  Part,
  CreatePartCommand,
  UpdatePartCommand,
  DeletePartCommand,
  PaginatedResponse,
  QueryParams,
} from '../types/api';

export const usePartsApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getParts = async (params?: QueryParams) => {
    return get<PaginatedResponse<Part>>('/api/v1/parts', { params });
  };

  const createPart = async (data: CreatePartCommand) => {
    return post<string>('/api/v1/parts', data);
  };

  const updatePart = async (data: UpdatePartCommand) => {
    return put<string>(`/api/v1/parts/${data.id}`, data);
  };

  const deletePart = async (data: DeletePartCommand) => {
    return del<boolean>('/api/v1/parts', { data });
  };

  const uploadPartFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Part>('/api/v1/parts/upload', formData);
  };

  const importParts = async () => {
    return post<Part>('/api/v1/parts/import');
  };

  const exportParts = async (fileName: string) => {
    return get<Blob>(`/api/v1/parts/export?fileName=${fileName}`, { responseType: 'blob' });
  };

  const getPartTemplate = async (fileName: string) => {
    return get<Blob>(`/api/v1/parts/template?fileName=${fileName}`, { responseType: 'blob' });
  };

  return {
    getParts,
    createPart,
    updatePart,
    deletePart,
    uploadPartFile,
    importParts,
    exportParts,
    getPartTemplate,
    loading,
    error,
  };
};

export default usePartsApi;
