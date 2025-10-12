import React, { useState, useEffect } from 'react';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import Modal from '../components/ui/modal/Modal';
import Table, { TableColumn } from '../components/ui/table/Table';
import useLocationsApi from '../services/locations';
import { Location, CreateLocationCommand, UpdateLocationCommand, QueryParams } from '../types/api';

const LocationsManagement = () => {
  const { getLocations, createLocation, updateLocation, deleteLocation, loading, error } =
    useLocationsApi();

  const [locations, setLocations] = useState<Location[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [queryParams, setQueryParams] = useState<QueryParams>({
    Page: 1,
    PageSize: 10,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<CreateLocationCommand>({
    name: '',
  });

  useEffect(() => {
    fetchLocations();
  }, [queryParams]);

  const fetchLocations = async () => {
    try {
      const response = await getLocations(queryParams);
      setLocations(response.data.items);
      setPagination({
        current: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  };

  const handleCreateLocation = async () => {
    try {
      await createLocation(formData);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
      });
      fetchLocations();
    } catch (err) {
      console.error('Failed to create location:', err);
    }
  };

  const handleUpdateLocation = async () => {
    if (!selectedLocation) return;

    try {
      await updateLocation({ ...formData, id: selectedLocation.id } as UpdateLocationCommand);
      setIsEditModalOpen(false);
      setSelectedLocation(null);
      setFormData({
        name: '',
      });
      fetchLocations();
    } catch (err) {
      console.error('Failed to update location:', err);
    }
  };

  const handleDeleteLocation = async (location: Location) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vị trí này?')) return;

    try {
      await deleteLocation({ ids: [location.id] });
      fetchLocations();
    } catch (err) {
      console.error('Failed to delete location:', err);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, Page: page, PageSize: pageSize });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams({ ...queryParams, Q: e.target.value, Page: 1 });
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name || '',
    });
    setIsEditModalOpen(true);
  };

  const columns: TableColumn<Location>[] = [
    { key: 'name', title: 'Tên vị trí', sortable: true },
    { key: 'createdAt', title: 'Ngày tạo', sortable: true },
    {
      key: 'actions' as keyof Location,
      title: 'Thao tác',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteLocation(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Vị trí</h1>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Tìm kiếm vị trí..."
            value={queryParams.Q || ''}
            onChange={handleSearch}
            className="flex-1"
          />

          <div className="flex gap-2">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Thêm mới
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-800">{error.message}</p>
          </div>
        )}
      </div>

      {/* Locations Table */}
      <Table
        data={locations as unknown as Record<string, unknown>[]}
        columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
        }}
        onRowClick={(location) => console.log('Clicked location:', location)}
      />

      {/* Create Location Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm vị trí mới"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Tên vị trí"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên vị trí"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateLocation} loading={loading}>
              Tạo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Location Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLocation(null);
        }}
        title="Chỉnh sửa vị trí"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Tên vị trí"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên vị trí"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedLocation(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateLocation} loading={loading}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LocationsManagement;
