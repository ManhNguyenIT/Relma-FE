import { useApi } from '../hooks/useApi';
import {
  WorkOrder,
  CreateWorkOrderCommand,
  UpdateWorkOrderCommand,
  DeleteWorkOrderCommand,
  PaginatedResponse,
  QueryParams,
} from '../types/api';

export const useWorkOrdersApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getWorkOrders = async (params?: QueryParams) => {
    return get<PaginatedResponse<WorkOrder>>('/api/v1/work-orders', { params });
  };

  const createWorkOrder = async (data: CreateWorkOrderCommand) => {
    return post<WorkOrder>('/api/v1/work-orders', data);
  };

  const updateWorkOrder = async (data: UpdateWorkOrderCommand) => {
    return put<WorkOrder>(`/api/v1/work-orders/${data.id}`, data);
  };

  const deleteWorkOrder = async (data: DeleteWorkOrderCommand) => {
    return del<WorkOrder>('/api/v1/work-orders', { data });
  };

  const importWorkOrders = async () => {
    return post<WorkOrder>('/api/v1/work-orders/import');
  };

  const exportWorkOrders = async () => {
    return get<Blob>('/api/v1/work-orders/export', { responseType: 'blob' });
  };

  const getWorkOrderTemplate = async () => {
    return get<Blob>('/api/v1/work-orders/template', { responseType: 'blob' });
  };

  return {
    getWorkOrders,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    importWorkOrders,
    exportWorkOrders,
    getWorkOrderTemplate,
    loading,
    error,
  };
};

export default useWorkOrdersApi;
