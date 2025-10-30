import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import ModalEditCheckList from '../modal/ModalEditCheckList';
import { useModal } from '../../hooks/useModal';
import DataTable, { TableColumn, TableAction } from '../common/DataTable';
import { useChecklistsApi } from '../../services/checklists';
import { ChecklistResponse } from '../../types/api';

interface RowData {
  id: string;
  name: string;
  description: string;
  tasks?: string;
  tags?: string;
}

const CheckListTable = forwardRef<{ refresh: () => void }>((_, ref) => {
  const {
    isOpen: isModalEditCheckListOpen,
    openModal: openModalEditCheckList,
    closeModal: closeModalEditCheckList,
  } = useModal();

  const { getChecklists, deleteChecklist, error } = useChecklistsApi();

  const [checklists, setChecklists] = useState<ChecklistResponse[]>([]);
  const [editingChecklist, setEditingChecklist] = useState<ChecklistResponse | null>(null);

  // Load checklists function
  const loadChecklists = async () => {
    try {
      console.log('📋 Loading checklists...');
      const response = await getChecklists();
      console.log('✅ Checklists loaded:', response);
      console.log('🔍 Response items:', response.items);
      console.log('🔍 Items count:', response.items?.length);
      setChecklists(response.items || []);
    } catch (error) {
      console.error('❌ Failed to load checklists:', error);
    }
  };

  // Load checklists on component mount
  useEffect(() => {
    loadChecklists();
  }, [getChecklists]);

  // Expose refresh function to parent
  useImperativeHandle(ref, () => ({
    refresh: loadChecklists,
  }));

  const columns: TableColumn<RowData>[] = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'tasks',
      label: 'Tasks',
      render: (value: string | number | undefined) => {
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        return '0';
      },
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (value: string | number | undefined) => {
        if (typeof value === 'string') return value;
        return '';
      },
    },
  ];

  const actions: TableAction<RowData>[] = [
    {
      label: 'Edit',
      onClick: (row: RowData) => {
        console.log('Edit', row);
        const checklist = checklists.find((c) => c.id === row.id);
        if (checklist) {
          setEditingChecklist(checklist);
          openModalEditCheckList();
        }
      },
    },
    {
      label: 'Delete',
      onClick: async (row: RowData) => {
        if (window.confirm('Are you sure you want to delete this checklist?')) {
          try {
            await deleteChecklist({ ids: [row.id] });
            console.log('✅ Checklist deleted:', row.id);
            // Reload checklists after deletion
            await loadChecklists();
          } catch (error) {
            console.error('❌ Failed to delete checklist:', error);
            alert('Failed to delete checklist. Please try again.');
          }
        }
      },
      variant: 'danger',
    },
    {
      label: 'Duplicate',
      onClick: (row: RowData) => {
        console.log('Duplicate', row);
      },
    },
  ];

  // Convert checklists to RowData format
  const tableData: RowData[] = checklists.map((checklist) => {
    console.log('🔍 Converting checklist:', checklist);
    console.log('🔍 Checklist description:', checklist.description);
    return {
      id: checklist.id,
      name: checklist.name || 'Unnamed Checklist',
      description: checklist.description || 'No description',
      tasks: checklist.tasks?.length?.toString() || '0',
      tags: '', // TODO: Add tags support if needed
    };
  });

  console.log('🔍 Table data:', tableData);

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
        showActions={true}
        className="overflow-x-auto rounded-lg shadow bg-white relative"
      />
      <ModalEditCheckList
        isOpen={isModalEditCheckListOpen}
        onClose={closeModalEditCheckList}
        checklist={editingChecklist}
        onChecklistUpdated={loadChecklists}
      />
    </>
  );
});

CheckListTable.displayName = 'CheckListTable';

export default CheckListTable;
