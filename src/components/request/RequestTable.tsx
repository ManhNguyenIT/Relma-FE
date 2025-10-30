import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import ModalRequestDetails from '../modal/ModalRequestDetails';
import ModalEditRequest from '../modal/ModalEditRequest';
import DataTable, { TableColumn, TableAction } from '../common/DataTable';
import { useRequestsApi } from '../../services/requests';
import { Request } from '../../types/api';

interface RowData {
  id: string;
  title: string;
  asset: string;
  status: {
    text: string;
    color: string;
    bgColor: string;
  };
  workOrderStatus: string;
  submittedCreated: string;
  category: string;
  submittedBy: string;
  priority: string;
  workOrder: string;
  isSelected?: boolean;
  image?: string;
}

const RequestTable = forwardRef<{ refresh: () => void }, Record<string, never>>((_, ref) => {
  const { getRequests, deleteRequest, error } = useRequestsApi();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Load requests function
  const loadRequests = async () => {
    try {
      console.log('📋 Loading requests...');
      const response = await getRequests();
      console.log('✅ Requests loaded:', response);
      setRequests(response.items || []);
    } catch (error) {
      console.error('❌ Failed to load requests:', error);
    }
  };

  // Load requests on component mount
  useEffect(() => {
    loadRequests();
  }, []); // Empty dependency array ensures this only runs once on mount

  // Expose refresh function to parent
  useImperativeHandle(ref, () => ({
    refresh: loadRequests,
  }));

  const handleRowClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditClick = (row: RowData) => {
    const request = requests.find((r) => r.id === row.id);
    if (request) {
      setEditingRequest(request);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRequest(undefined);
  };

  const handleRequestUpdated = () => {
    loadRequests();
  };

  const columns: TableColumn<RowData>[] = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'image',
      label: 'Image',
      render: () => (
        <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-300 transition-colors">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      ),
    },
    {
      key: 'asset',
      label: 'Asset',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        if (
          value &&
          typeof value === 'object' &&
          'text' in value &&
          'color' in value &&
          'bgColor' in value
        ) {
          return (
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${value.bgColor} ${value.color} whitespace-nowrap`}
            >
              {value.text}
            </span>
          );
        }
        return null;
      },
    },
    {
      key: 'workOrderStatus',
      label: 'Work Order Status',
    },
    {
      key: 'submittedCreated',
      label: 'Submitted Created',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'submittedBy',
      label: 'Submitted By',
    },
    {
      key: 'priority',
      label: 'Priority',
    },
    {
      key: 'workOrder',
      label: 'Work Order',
      render: (value) => (
        <span className="text-blue-600 font-medium cursor-pointer hover:text-blue-800">
          {typeof value === 'string' ? value : ''}
        </span>
      ),
    },
  ];

  const actions: TableAction<RowData>[] = [
    {
      label: 'Edit',
      onClick: handleEditClick,
    },
    {
      label: 'Delete',
      onClick: async (row: RowData) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
          try {
            await deleteRequest({ ids: [row.id] });
            console.log('✅ Request deleted:', row.id);
            // Reload requests after deletion
            await loadRequests();
          } catch (error) {
            console.error('❌ Failed to delete request:', error);
            alert('Failed to delete request. Please try again.');
          }
        }
      },
      variant: 'danger',
    },
  ];

  // Convert requests to RowData format
  const tableData: RowData[] = requests.map((request) => ({
    id: request.id,
    title: request.title || '',
    asset: request.asset?.name || '',
    status: {
      text: request.status?.toString() || '',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    workOrderStatus: request.workOrder?.status?.toString() || '',
    submittedCreated: '',
    category: request.category?.toString() || '',
    submittedBy: '',
    priority: request.priority?.toString() || '',
    workOrder: request.workOrder?.no || '',
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
      <ModalRequestDetails isOpen={isModalOpen} onClose={handleCloseModal} />
      <ModalEditRequest
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onRequestUpdated={handleRequestUpdated}
        request={editingRequest}
      />
    </>
  );
});

RequestTable.displayName = 'RequestTable';

export default RequestTable;
