import { useApi } from '../hooks/useApi';
import {
  Request,
  CreateRequestCommand,
  UpdateRequestCommand,
  DeleteRequestCommand,
  PaginatedResponse,
  PaginationQueryParams,
} from '../types/api';
import { useCallback } from 'react';

export const useRequestsApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getRequests = useCallback(
    async (params?: PaginationQueryParams) => {
      return get<PaginatedResponse<Request>>('/api/v1/requests', { params });
    },
    [get],
  );

  const getRequestById = useCallback(
    async (id: string) => get<Request>(`/api/v1/requests/${id}`),
    [get],
  );

  const createRequest = useCallback(
    async (data: CreateRequestCommand) => post<string>('/api/v1/requests', data),
    [post],
  );

  const updateRequest = useCallback(
    async (data: UpdateRequestCommand) => put<string>('/api/v1/requests', data),
    [put],
  );

  const deleteRequest = useCallback(
    async (data: DeleteRequestCommand) => del<boolean>('/api/v1/requests', data),
    [del],
  );

  const uploadRequestFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return post<Request>('/api/v1/requests/upload', formData);
    },
    [post],
  );

  const importRequests = useCallback(async () => post<Request>('/api/v1/requests/import'), [post]);

  const exportRequests = useCallback(
    async () => get<Blob>('/api/v1/requests/export', { responseType: 'blob' }),
    [get],
  );

  const getRequestTemplate = useCallback(
    async () => get<Blob>('/api/v1/requests/template', { responseType: 'blob' }),
    [get],
  );

  return {
    getRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest,
    uploadRequestFile,
    importRequests,
    exportRequests,
    getRequestTemplate,
    loading,
    error,
  };
};

export default useRequestsApi;
