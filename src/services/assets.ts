import { useApi } from '../hooks/useApi';
import {
  Asset,
  CreateAssetCommand,
  UpdateAssetCommand,
  DeleteAssetCommand,
  PaginatedResponse,
  QueryParams,
} from '../types/api';

export const useAssetsApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getAssets = async (params?: QueryParams) => {
    return get<PaginatedResponse<Asset>>('/api/v1/assets', { params });
  };

  const getAsset = async (id: string) => {
    return get<Asset>(`/api/v1/assets/${id}`);
  };

  const getAssetStatus = async (id: string) => {
    return get<number>(`/api/v1/assets/${id}/status`);
  };

  const createAsset = async (data: CreateAssetCommand) => {
    return post<string>('/api/v1/assets', data);
  };

  const updateAsset = async (data: UpdateAssetCommand) => {
    return put<string>(`/api/v1/assets/${data.id}`, data);
  };

  const deleteAsset = async (data: DeleteAssetCommand) => {
    return del<boolean>('/api/v1/assets', { data });
  };

  const uploadAssetFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Asset>('/api/v1/assets/upload', formData);
  };

  const importAssets = async () => {
    return post<Asset>('/api/v1/assets/import');
  };

  const exportAssets = async (params?: QueryParams) => {
    return get<Blob>('/api/v1/assets/export', { params, responseType: 'blob' });
  };

  const getAssetTemplate = async () => {
    return get<Blob>('/api/v1/assets/template', { responseType: 'blob' });
  };

  return {
    getAssets,
    getAsset,
    getAssetStatus,
    createAsset,
    updateAsset,
    deleteAsset,
    uploadAssetFile,
    importAssets,
    exportAssets,
    getAssetTemplate,
    loading,
    error,
  };
};

export default useAssetsApi;
