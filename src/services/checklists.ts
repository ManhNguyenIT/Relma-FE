import { useApi } from '../hooks/useApi';
import {
  Checklist,
  CreateChecklistCommand,
  UpdateChecklistCommand,
  DeleteChecklistCommand,
  PaginatedResponse,
  QueryParams,
} from '../types/api';

export const useChecklistsApi = () => {
  const { get, post, put, del: deleteApi, loading, error } = useApi();

  const getChecklists = async (params?: QueryParams) => {
    return get<PaginatedResponse<Checklist>>('/api/v1/checklists', { params });
  };

  const createChecklist = async (data: CreateChecklistCommand) => {
    return post<string>('/api/v1/checklists', data);
  };

  const updateChecklist = async (data: UpdateChecklistCommand) => {
    return put<string>(`/api/v1/checklists/${data.id}`, data);
  };

  const deleteChecklist = async (data: DeleteChecklistCommand) => {
    return deleteApi<boolean>('/api/v1/checklists', { data });
  };

  const uploadChecklistFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Checklist>('/api/v1/checklists/upload', formData);
  };

  const importChecklists = async () => {
    return post<Checklist>('/api/v1/checklists/import');
  };

  const exportChecklists = async () => {
    return get<Blob>('/api/v1/checklists/export', { responseType: 'blob' });
  };

  const getChecklistTemplate = async () => {
    return get<Blob>('/api/v1/checklists/template', { responseType: 'blob' });
  };

  return {
    getChecklists,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    uploadChecklistFile,
    importChecklists,
    exportChecklists,
    getChecklistTemplate,
    loading,
    error,
  };
};

export default useChecklistsApi;
