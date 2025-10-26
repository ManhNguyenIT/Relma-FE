import { useApi } from '../hooks/useApi';
import {
  Request,
  CreateRequestCommand,
  UpdateRequestCommand,
  DeleteRequestCommand,
  PaginatedResponse,
  PaginationQueryParams,
} from '../types/api';

export const useRequestsApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getRequests = async (params?: PaginationQueryParams) => {
    return get<PaginatedResponse<Request>>('/api/v1/requests', { params });
  };

  const getRequestById = async (id: string) => {
    return get<Request>(`/api/v1/requests/${id}`);
  };

  const createRequest = async (data: CreateRequestCommand) => {
    return post<string>('/api/v1/requests', data);
  };

  const updateRequest = async (data: UpdateRequestCommand) => {
    return put<string>('/api/v1/requests', data);
  };

  const deleteRequest = async (data: DeleteRequestCommand) => {
    return del<boolean>('/api/v1/requests', { data });
  };

  const uploadRequestFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Request>('/api/v1/requests/upload', formData);
  };

  const importRequests = async () => {
    return post<Request>('/api/v1/requests/import');
  };

  const exportRequests = async () => {
    return get<Blob>('/api/v1/requests/export', { responseType: 'blob' });
  };

  const getRequestTemplate = async () => {
    return get<Blob>('/api/v1/requests/template', { responseType: 'blob' });
  };

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
