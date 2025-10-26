import { useApi } from '../hooks/useApi';
import {
  Material,
  CreateMaterialCommand,
  UpdateMaterialCommand,
  DeleteMaterialCommand,
  PaginatedResponse,
  PaginationQueryParams,
  FileUploadResponse,
  ImportResponse,
} from '../types/api';

export const useMaterialsApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getMaterials = async (params?: PaginationQueryParams) => {
    return get<PaginatedResponse<Material>>('/api/v1/materials', params);
  };

  const createMaterial = async (data: CreateMaterialCommand) => {
    return post<string>('/api/v1/materials', data);
  };

  const updateMaterial = async (data: UpdateMaterialCommand) => {
    const { id, ...updateData } = data;
    return put<string>(`/api/v1/materials/${id}`, updateData);
  };

  const deleteMaterials = async (parmas: DeleteMaterialCommand) => {
    return del<boolean>('/api/v1/materials', parmas);
  };

  const uploadMaterialFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<FileUploadResponse>('/api/v1/materials/upload', formData);
  };

  const importMaterials = async () => {
    return post<ImportResponse>('/api/v1/materials/import');
  };

  const exportMaterials = async (fileName: string) => {
    return get<Blob>('/api/v1/materials/export', { fileName });
  };

  const getMaterialTemplate = async (fileName: string) => {
    return get<Blob>('/api/v1/materials/template', { fileName });
  };

  return {
    getMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterials,
    uploadMaterialFile,
    importMaterials,
    exportMaterials,
    getMaterialTemplate,
    loading,
    error,
  };
};

export default useMaterialsApi;
