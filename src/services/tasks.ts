import { useApi } from '../hooks/useApi';
import {
  Task,
  CreateTaskCommand,
  UpdateTaskCommand,
  DeleteTaskCommand,
  PaginatedResponse,
  PaginationQueryParams,
} from '../types/api';

export const useTasksApi = () => {
  const { get, post, put, del: deleteApi, loading, error } = useApi();

  const getTasks = async (params?: PaginationQueryParams) => {
    return get<PaginatedResponse<Task>>('/api/v1/tasks', params);
  };

  const createTask = async (data: CreateTaskCommand) => {
    return post<string>('/api/v1/tasks', data);
  };

  const updateTask = async (data: UpdateTaskCommand) => {
    return put<string>(`/api/v1/tasks`, data);
  };

  const deleteTask = async (params: DeleteTaskCommand) => {
    return deleteApi<Task>('/api/v1/tasks', params);
  };

  const uploadTaskFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Task>('/api/v1/tasks/upload', formData);
  };

  const importTasks = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Task>('/api/v1/tasks/import', formData);
  };

  const exportTasks = async (params?: PaginationQueryParams) => {
    return get<Blob>('/api/v1/tasks/export', { params, responseType: 'blob' });
  };

  const getTaskTemplate = async () => {
    return get<Blob>('/api/v1/tasks/template', { responseType: 'blob' });
  };

  return {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    uploadTaskFile,
    importTasks,
    exportTasks,
    getTaskTemplate,
    loading,
    error,
  };
};

export default useTasksApi;
