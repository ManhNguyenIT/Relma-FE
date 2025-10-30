import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router';
import { useMaintenancesApi } from '../../services/maintenances';
import { Maintenance } from '../../types/api';
import DataTable, { TableColumn, TableAction } from '../common/DataTable';

interface RowData {
  id: string;
  name: string;
  title: string;
  description: string;
  assets: number;
  category: string;
  priority: string;
  paused: string;
  checklist: string;
  priorityColor: string;
}

const PreventiveMainTable = forwardRef<{ refresh: () => void }, Record<string, never>>((_, ref) => {
  const navigate = useNavigate();
  const { getMaintenances, deleteMaintenance, error } = useMaintenancesApi();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  // Load maintenances function
  const loadMaintenances = async () => {
    try {
      console.log('📋 Loading maintenances...');
      const response = await getMaintenances();
      console.log('✅ Maintenances loaded:', response);
      setMaintenances(response.items || []);
    } catch (error) {
      console.error('❌ Failed to load maintenances:', error);
    }
  };

  // Load maintenances on component mount
  useEffect(() => {
    loadMaintenances();
  }, []);

  // Expose refresh function to parent
  useImperativeHandle(ref, () => ({
    refresh: loadMaintenances,
  }));

  const handleRowClick = () => {
    navigate('/preventive-details');
  };

  const handleEditClick = (row: RowData) => {
    console.log('Edit maintenance', row);
    // TODO: Implement edit maintenance functionality
  };

  const handleDeleteClick = async (row: RowData) => {
    if (window.confirm('Are you sure you want to delete this maintenance?')) {
      try {
        await deleteMaintenance({ ids: [row.id] });
        console.log('✅ Maintenance deleted:', row.id);
        await loadMaintenances();
      } catch (error) {
        console.error('❌ Failed to delete maintenance:', error);
        alert('Failed to delete maintenance. Please try again.');
      }
    }
  };

  const columns: TableColumn<RowData>[] = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'title',
      label: 'Work Order Title',
    },
    {
      key: 'description',
      label: 'Work Order Description',
    },
    {
      key: 'assets',
      label: 'Assets & Location',
      render: (value) => (
        <select
          value={value}
          onChange={(e) => console.log('Asset changed to:', e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      ),
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => {
        const priorityColor =
          value === 'High'
            ? 'bg-red-100 text-red-500'
            : value === 'Medium'
              ? 'bg-yellow-100 text-yellow-600'
              : value === 'Low'
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-500';

        return <span className={`px-2 py-1 text-xs rounded ${priorityColor}`}>{value}</span>;
      },
    },
    {
      key: 'paused',
      label: 'Paused',
    },
    {
      key: 'checklist',
      label: 'Checklist',
      render: (value) => <span className="text-blue-500 cursor-pointer">{value}</span>,
    },
  ];

  const actions: TableAction<RowData>[] = [
    {
      label: 'Edit',
      onClick: handleEditClick,
    },
    {
      label: 'Delete',
      onClick: handleDeleteClick,
      variant: 'danger',
    },
  ];

  // Convert maintenances to RowData format
  const tableData: RowData[] = maintenances.map((maintenance) => ({
    id: maintenance.id,
    name: 'Maintenance Name', // Placeholder - adjust based on actual Maintenance type
    title: 'Work Order Title', // Placeholder - adjust based on actual Maintenance type
    description: 'Work Order Description', // Placeholder - adjust based on actual Maintenance type
    assets: maintenance.assets?.length || 0,
    category: 'Category', // Placeholder - adjust based on actual Maintenance type
    priority: 'Medium', // Placeholder - adjust based on actual Maintenance type
    paused: 'No', // Placeholder - adjust based on actual Maintenance type
    checklist: 'Test 1', // Placeholder - adjust based on actual Maintenance type
    priorityColor: 'bg-yellow-100 text-yellow-600', // Default color for Medium priority
  }));

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error.message}
        </div>
      )}

      <DataTable
        data={tableData}
        columns={columns}
        actions={actions}
        selectable={true}
        onRowClick={handleRowClick}
        showActions={true}
        className="w-full bg-white rounded-lg border border-gray-200"
      />
    </>
  );
});

PreventiveMainTable.displayName = 'PreventiveMainTable';

export default PreventiveMainTable;
