import { useState, useEffect, useCallback } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import DataTable, { TableColumn, TableAction, StatusConfig } from '../common/DataTable';
import { useLocationsApi } from '../../services/locations';
import { Location, PaginationQueryParams, UpdateLocationCommand } from '../../types/api';
import LocationEditDialog from '../LocationEditDialog';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog';

interface LocationData {
  id: string;
  address: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  dateCreated: string;
  worker: string;
  originalLocation: Location; // Store original location data for API calls
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

// Actions will be defined inside component to access handlers

export default function LocationTable({ refreshTrigger }: LocationTableProps) {
  const {
    getLocations,
    updateLocation,
    deleteLocations,
    loading: apiLoading,
    error,
  } = useLocationsApi();

  const [mappedLocationData, setMappedLocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);

  // Edit/Delete states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null);

  const fetchLocations = useCallback(
    async (page: number = 1) => {
      try {
        console.log('🔄 Fetching locations, page:', page);
        setLoading(true);
        const params: PaginationQueryParams = {
          page: page,
          pageSize: pageSize,
        };

        const response = await getLocations(params);
        console.log('✅ Locations fetched successfully:', response);
        const mapped =
          response.items?.map((loc) => ({
            id: loc.id,
            address: loc.name || 'Unnamed Location',
            status: 'Approved' as const,
            dateCreated: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: '2-digit',
            }),
            worker: 'Unknown',
            originalLocation: loc,
          })) || [];

        setMappedLocationData(mapped);
        setCurrentPage(response.currentPage || 1);
        setTotalPages(response.pageCount || 0);
        setTotalItems(response.rowCount || 0);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, getLocations],
  );

  useEffect(() => {
    fetchLocations();
  }, [refreshTrigger]); // Removed fetchLocations from dependencies

  const handlePageChange = (page: number) => {
    fetchLocations(page);
  };

  // Edit handlers
  const handleEdit = (row: LocationData) => {
    setSelectedLocation(row.originalLocation);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (data: UpdateLocationCommand) => {
    try {
      await updateLocation(data);
      setIsEditDialogOpen(false);
      setSelectedLocation(null);
      await fetchLocations(currentPage); // Refresh current page
      return true;
    } catch (error) {
      console.error('Failed to update location:', error);
      return false;
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedLocation(null);
  };

  // Delete handlers
  const handleDelete = (row: LocationData) => {
    console.log('🗑️ Delete button clicked for:', row.originalLocation);
    setDeletingLocation(row.originalLocation);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingLocation) {
      console.log('❌ No location to delete');
      return false;
    }

    try {
      console.log('🗑️ Deleting location:', deletingLocation.id, deletingLocation.name);
      const result = await deleteLocations([deletingLocation.id]);
      console.log('✅ Delete result:', result);

      setIsDeleteDialogOpen(false);
      setDeletingLocation(null);
      await fetchLocations(currentPage); // Refresh current page
      return true;
    } catch (error) {
      console.error('❌ Failed to delete location:', error);
      return false;
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeletingLocation(null);
  };

  // Define actions inside component to access handlers
  const actions: TableAction<LocationData>[] = [
    {
      label: 'Edit',
      icon: <FiEdit2 className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: 'Delete',
      icon: <FiTrash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: 'danger',
    },
  ];

  if (loading) {
    return <div className="p-4">Loading locations...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error.message}
        </div>
      )}

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

      {/* Edit Dialog */}
      <LocationEditDialog
        isOpen={isEditDialogOpen}
        location={selectedLocation}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Location"
        message="Are you sure you want to delete this location? This action cannot be undone."
        itemNames={deletingLocation ? [deletingLocation.name || 'Unnamed Location'] : []}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={apiLoading}
      />
    </div>
  );
}
