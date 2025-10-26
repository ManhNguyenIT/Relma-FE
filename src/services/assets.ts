import { useApi } from '../hooks/useApi';
import {
  Asset,
  CreateAssetCommand,
  UpdateAssetCommand,
  DeleteAssetCommand,
  PaginatedResponse,
  PaginationQueryParams,
  FileUploadResponse,
  ImportResponse,
  ProcessingStatus,
} from '../types/api';

export const useAssetsApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getAssets = async (params?: PaginationQueryParams) => {
    return get<PaginatedResponse<Asset>>('/api/v1/assets', params);
  };

  const getAsset = async (id: string) => {
    return get<Asset>(`/api/v1/assets/${id}`);
  };

  const getAssetStatus = async (id: string) => {
    return get<ProcessingStatus>(`/api/v1/assets/${id}/status`);
  };

  const createAsset = async (data: CreateAssetCommand) => {
    return post<string>('/api/v1/assets', data);
  };

  const updateAsset = async (data: UpdateAssetCommand) => {
    const { id, ...updateData } = data;
    return put<string>(`/api/v1/assets/${id}`, updateData);
  };

  const deleteAssets = async (parmas: DeleteAssetCommand) => {
    return del<boolean>('/api/v1/assets', parmas);
  };

  const uploadAssetFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<FileUploadResponse>('/api/v1/assets/upload', formData);
  };

  const importAssets = async () => {
    return post<ImportResponse>('/api/v1/assets/import');
  };

  const exportAssets = async (params?: PaginationQueryParams) => {
    return get<Blob>('/api/v1/assets/export', params);
  };

  const getAssetTemplate = async () => {
    return get<Blob>('/api/v1/assets/template');
  };

  return {
    getAssets,
    getAsset,
    getAssetStatus,
    createAsset,
    updateAsset,
    deleteAssets,
    uploadAssetFile,
    importAssets,
    exportAssets,
    getAssetTemplate,
    loading,
    error,
  };
};

export default useAssetsApi;
