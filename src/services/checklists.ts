import { useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import {
  Checklist,
  ChecklistResponse,
  CreateChecklistCommand,
  UpdateChecklistCommand,
  DeleteChecklistCommand,
  PaginatedResponse,
  PaginationQueryParams,
} from '../types/api';

export const useChecklistsApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getChecklists = useCallback(
    async (params?: PaginationQueryParams) => {
      return get<PaginatedResponse<ChecklistResponse>>('/api/v1/checklists', { params });
    },
    [get],
  );

  const createChecklist = useCallback(
    async (data: CreateChecklistCommand) => {
      return post<string>('/api/v1/checklists', data);
    },
    [post],
  );

  const updateChecklist = useCallback(
    async (data: UpdateChecklistCommand) => {
      return put<string>('/api/v1/checklists', data);
    },
    [put],
  );

  const deleteChecklist = useCallback(
    async (data: DeleteChecklistCommand) => {
      return del<boolean>('/api/v1/checklists', { data });
    },
    [del],
  );

  const uploadChecklistFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return post<Checklist>('/api/v1/checklists/upload', formData);
    },
    [post],
  );

  const importChecklists = useCallback(async () => {
    return post<Checklist>('/api/v1/checklists/import');
  }, [post]);

  const exportChecklists = useCallback(async () => {
    return get<Blob>('/api/v1/checklists/export', { responseType: 'blob' });
  }, [get]);

  const getChecklistTemplate = useCallback(async () => {
    return get<Blob>('/api/v1/checklists/template', { responseType: 'blob' });
  }, [get]);

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
