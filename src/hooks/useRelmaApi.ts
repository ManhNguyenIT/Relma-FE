import { useAssetsApi } from '../services/assets';
import { useLocationsApi } from '../services/locations';
import { useMaterialsApi } from '../services/materials';
import { usePartsApi } from '../services/parts';
import { useRequestsApi } from '../services/requests';
import { useSetsApi } from '../services/sets';
import { useStoragesApi } from '../services/storages';
import { useTasksApi } from '../services/tasks';
import { useTeamsApi } from '../services/teams';
import { useUsersApi } from '../services/users';
import { useWorkOrdersApi } from '../services/workOrders';
import { useMaintenancesApi } from '../services/maintenances';
import { useChecklistsApi } from '../services/checklists';
import { useFilesApi } from '../services/files';
import { useAuthApi } from '../services/auth';

/**
 * Hook tổng hợp tất cả API services của RelMa
 * Sử dụng trong các pages để truy cập tất cả APIs
 */
export const useRelmaApi = () => {
  const assets = useAssetsApi();
  const locations = useLocationsApi();
  const materials = useMaterialsApi();
  const parts = usePartsApi();
  const requests = useRequestsApi();
  const sets = useSetsApi();
  const storages = useStoragesApi();
  const tasks = useTasksApi();
  const teams = useTeamsApi();
  const users = useUsersApi();
  const workOrders = useWorkOrdersApi();
  const maintenances = useMaintenancesApi();
  const checklists = useChecklistsApi();
  const files = useFilesApi();
  const auth = useAuthApi();

  return {
    // Individual APIs
    assets,
    locations,
    materials,
    parts,
    requests,
    sets,
    storages,
    tasks,
    teams,
    users,
    workOrders,
    maintenances,
    checklists,
    files,
    auth,

    // Global loading state
    isLoading:
      assets.loading ||
      locations.loading ||
      materials.loading ||
      parts.loading ||
      requests.loading ||
      sets.loading ||
      storages.loading ||
      tasks.loading ||
      teams.loading ||
      users.loading ||
      workOrders.loading ||
      maintenances.loading ||
      checklists.loading ||
      files.loading ||
      auth.loading,

    // Global error state
    hasError: !!(
      assets.error ||
      locations.error ||
      materials.error ||
      parts.error ||
      requests.error ||
      sets.error ||
      storages.error ||
      tasks.error ||
      teams.error ||
      users.error ||
      workOrders.error ||
      maintenances.error ||
      checklists.error ||
      files.error ||
      auth.error
    ),
  };
};

export default useRelmaApi;
