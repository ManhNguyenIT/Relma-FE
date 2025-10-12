import { useApi } from '../hooks/useApi';

export const useFilesApi = () => {
  const { get, post, loading, error } = useApi();

  const uploadFiles = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return post('/api/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const downloadFiles = async (fileName: string, ids: string[]) => {
    const params = new URLSearchParams();
    params.append('FileName', fileName);
    ids.forEach((id) => params.append('Ids', id));

    return get(`/api/v1/files/download?${params.toString()}`, { responseType: 'blob' });
  };

  return {
    uploadFiles,
    downloadFiles,
    loading,
    error,
  };
};

export default useFilesApi;
