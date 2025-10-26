import { useApi } from '../hooks/useApi';
import {
  Team,
  CreateTeamCommand,
  UpdateTeamCommand,
  DeleteTeamCommand,
  PaginatedResponse,
  PaginationQueryParams,
} from '../types/api';

export const useTeamsApi = () => {
  const { get, post, put, del: deleteApi, loading, error } = useApi();

  const getTeams = async (params?: PaginationQueryParams) => {
    return get<PaginatedResponse<Team>>('/api/v1/teams', { params });
  };

  const createTeam = async (data: CreateTeamCommand) => {
    return post<Team>('/api/v1/teams', data);
  };

  const updateTeam = async (data: UpdateTeamCommand) => {
    return put<Team>('/api/v1/teams', data);
  };

  const deleteTeam = async (data: DeleteTeamCommand) => {
    return deleteApi<Team>('/api/v1/teams', { data });
  };

  const uploadTeamFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Team>('/api/v1/teams/upload', formData);
  };

  const importTeams = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<Team>('/api/v1/teams/import', formData);
  };

  const exportTeams = async (params?: PaginationQueryParams) => {
    return get<Blob>('/api/v1/teams/export', { params, responseType: 'blob' });
  };

  const getTeamTemplate = async () => {
    return get<Blob>('/api/v1/teams/template', { responseType: 'blob' });
  };

  return {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    uploadTeamFile,
    importTeams,
    exportTeams,
    getTeamTemplate,
    loading,
    error,
  };
};

export default useTeamsApi;
