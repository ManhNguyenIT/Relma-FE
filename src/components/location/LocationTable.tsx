import { useState, useEffect, useCallback } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import DataTable, { TableColumn, TableAction, StatusConfig } from '../common/DataTable';
import { client } from '../../services/api';
import { ApiResponse, Location } from '../../types/response';

interface LocationData {
  id: string | number;
  address: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  dateCreated: string;
  worker: string;
}

interface LocationTableProps {
  refreshTrigger?: number;
}

const columns: TableColumn<LocationData>[] = [
  { key: 'address', label: 'Address' },
  { key: 'status', label: 'Status' },
  { key: 'dateCreated', label: 'Date Created' },
  { key: 'worker', label: 'Worker' },
];

const statusConfig: StatusConfig = {
  Approved: {
    text: 'Approved',
    color: 'success',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
  },
  Pending: {
    text: 'Pending',
    color: 'warning',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  Rejected: { text: 'Rejected', color: 'error', bgColor: 'bg-red-100', textColor: 'text-red-800' },
};

const actions: TableAction<LocationData>[] = [
  {
    label: 'Edit',
    icon: <FiEdit2 className="h-4 w-4" />,
    onClick: (row: LocationData) => console.log('Edit location:', row.id),
  },
  {
    label: 'Delete',
    icon: <FiTrash2 className="h-4 w-4" />,
    onClick: (row: LocationData) => console.log('Delete location:', row.id),
    variant: 'danger',
  },
];

export default function LocationTable({ refreshTrigger }: LocationTableProps) {
  const [mappedLocationData, setMappedLocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);

  const fetchLocations = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        const response = await client.get<ApiResponse<Location>>(
          `/api/v1/locations?page=${page}&pageSize=${pageSize}`,
        );
        const mapped = response.items.map((loc, index) => ({
          id: `location-${loc.id}-${index}`,
          address: loc.name,
          status: 'Approved' as const,
          dateCreated: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: '2-digit',
          }),
          worker: 'Unknown',
        }));
        setMappedLocationData(mapped);
        setCurrentPage(response.currentPage);
        setTotalPages(response.pageCount);
        setTotalItems(response.rowCount);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    fetchLocations();
  }, [refreshTrigger, fetchLocations]);

  const handlePageChange = (page: number) => {
    fetchLocations(page);
  };

  if (loading) {
    return <div className="p-4">Loading locations...</div>;
  }

  return (
    <div className="space-y-4">
      <DataTable
        data={mappedLocationData}
        columns={columns}
        actions={actions}
        statusConfig={statusConfig}
        selectable={true}
        showActions={true}
        maxHeight="max-h-96"
        stickyHeader={true}
        className="bg-white rounded-lg shadow overflow-hidden"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Hiển thị {(currentPage - 1) * pageSize + 1} đến{' '}
              {Math.min(currentPage * pageSize, totalItems)} trong tổng số {totalItems} địa điểm
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
