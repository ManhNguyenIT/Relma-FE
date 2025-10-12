import { useApi } from '../hooks/useApi';
import {
  Material,
  CreateMaterialCommand,
  UpdateMaterialCommand,
  DeleteMaterialCommand,
  PaginatedResponse,
  QueryParams,
} from '../types/api';

export const useMaterialsApi = () => {
  const { get, post, put, del, loading, error } = useApi();

  const getMaterials = async (params?: QueryParams) => {
    return get<PaginatedResponse<Material>>('/api/v1/materials', { params });
  };

  const createMaterial = async (data: CreateMaterialCommand) => {
    return post<string>('/api/v1/materials', data);
  };

  const updateMaterial = async (data: UpdateMaterialCommand) => {
    return put<string>(`/api/v1/materials/${data.id}`, data);
  };

  const deleteMaterial = async (data: DeleteMaterialCommand) => {
    return del<boolean>('/api/v1/materials', { data });
  };

  const uploadMaterialFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Material>('/api/v1/materials/upload', formData);
  };

  const importMaterials = async () => {
    return post<Material>('/api/v1/materials/import');
  };

  const exportMaterials = async (fileName: string) => {
    return get<Blob>(`/api/v1/materials/export?fileName=${fileName}`, { responseType: 'blob' });
  };

  const getMaterialTemplate = async (fileName: string) => {
    return get<Blob>(`/api/v1/materials/template?fileName=${fileName}`, { responseType: 'blob' });
  };

  return {
    getMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    uploadMaterialFile,
    importMaterials,
    exportMaterials,
    getMaterialTemplate,
    loading,
    error,
  };
};

export default useMaterialsApi;
