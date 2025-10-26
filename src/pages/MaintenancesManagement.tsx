import React, { useState, useEffect } from 'react';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import Modal from '../components/ui/modal/Modal';
import Table, { TableColumn } from '../components/ui/table/Table';
import useMaintenancesApi from '../services/maintenances';
import {
  Maintenance,
  CreateMaintenanceCommand,
  UpdateMaintenanceCommand,
  PaginationQueryParams,
} from '../types/api';

const MaintenancesManagement = () => {
  const {
    getMaintenances,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    uploadMaintenanceFile,
    exportMaintenances,
    getMaintenanceTemplate,
    error,
  } = useMaintenancesApi();

  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [queryParams, setQueryParams] = useState<PaginationQueryParams>({
    page: 1,
    pageSize: 10,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [formData, setFormData] = useState<CreateMaintenanceCommand>({
    workOrderId: undefined,
    cronExpression: '',
    images: [],
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMaintenances();
  }, [queryParams]);

  const fetchMaintenances = async () => {
    try {
      const response = await getMaintenances(queryParams);
      setMaintenances(response.items);
      setPagination({
        current: response.currentPage,
        pageSize: response.pageSize,
        total: response.rowCount,
      });
    } catch (err) {
      console.error('Failed to fetch maintenances:', err);
    }
  };

  const handleCreateMaintenance = async () => {
    try {
      await createMaintenance(formData);
      setIsCreateModalOpen(false);
      setFormData({
        workOrderId: undefined,
        cronExpression: '',
        images: [],
      });
      fetchMaintenances();
    } catch (err) {
      console.error('Failed to create maintenance:', err);
    }
  };

  const handleUpdateMaintenance = async () => {
    if (!selectedMaintenance) return;

    try {
      await updateMaintenance({
        ...formData,
        id: selectedMaintenance.id,
      } as UpdateMaintenanceCommand);
      setIsEditModalOpen(false);
      setSelectedMaintenance(null);
      setFormData({
        workOrderId: undefined,
        cronExpression: '',
        images: [],
      });
      fetchMaintenances();
    } catch (err) {
      console.error('Failed to update maintenance:', err);
    }
  };

  const handleDeleteMaintenance = async (maintenance: Maintenance) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc bảo trì này?')) return;

    try {
      await deleteMaintenance({ ids: [maintenance.id] });
      fetchMaintenances();
    } catch (err) {
      console.error('Failed to delete maintenance:', err);
    }
  };

  const handleUploadFile = async () => {
    if (!file) return;

    try {
      await uploadMaintenanceFile(file);
      setFile(null);
      fetchMaintenances();
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
  };

  const handleExportMaintenances = async () => {
    try {
      const response = await exportMaintenances();
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `maintenances_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export maintenances:', err);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await getMaintenanceTemplate();
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'maintenances_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download template:', err);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page: page, pageSize: pageSize });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams({ ...queryParams, q: e.target.value, page: 1 });
  };

  const handleEdit = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setFormData({
      workOrderId: maintenance.workOrderId,
      cronExpression: maintenance.cronExpression || '',
      images: maintenance.images || [],
    });
    setIsEditModalOpen(true);
  };

  const columns: TableColumn<Maintenance>[] = [
    { key: 'workOrderId', title: 'Work Order', sortable: true },
    { key: 'cronExpression', title: 'Cron Expression', sortable: true },
    {
      key: 'actions' as keyof Maintenance,
      title: 'Thao tác',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDeleteMaintenance(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Công việc Bảo trì</h1>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Tìm kiếm công việc bảo trì..."
            value={queryParams.q || ''}
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

            <label className="relative cursor-pointer">
              <Button variant="outline">Tải lên</Button>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".xlsx,.xls"
              />
            </label>

            <Button variant="outline" onClick={handleExportMaintenances}>
              Xuất
            </Button>

            <Button variant="outline" onClick={handleDownloadTemplate}>
              Mẫu
            </Button>
          </div>
        </div>

        {/* File Upload Info */}
        {file && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Đã chọn file: {file.name}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleUploadFile}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Tải lên
                </Button>
                <Button size="sm" variant="outline" onClick={() => setFile(null)}>
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-800">{error.message}</p>
          </div>
        )}
      </div>

      {/* Maintenances Table */}
      <Table
        data={maintenances as unknown as Record<string, unknown>[]}
        columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
        }}
        onRowClick={(maintenance) => console.log('Clicked maintenance:', maintenance)}
      />

      {/* Create Maintenance Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm công việc bảo trì mới"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Work Order"
            value={formData.workOrderId}
            onChange={(e) => setFormData({ ...formData, workOrderId: e.target.value })}
            placeholder="Chọn work order"
          />

          <Input
            label="Cron Expression"
            value={formData.cronExpression}
            onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
            placeholder="Nhập cron expression"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateMaintenance}>Tạo</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Maintenance Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMaintenance(null);
        }}
        title="Chỉnh sửa công việc bảo trì"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Work Order"
            value={formData.workOrderId}
            onChange={(e) => setFormData({ ...formData, workOrderId: e.target.value })}
            placeholder="Chọn work order"
          />

          <Input
            label="Cron Expression"
            value={formData.cronExpression}
            onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
            placeholder="Nhập cron expression"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedMaintenance(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateMaintenance}>Cập nhật</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MaintenancesManagement;
