import React, { useState, useEffect } from 'react';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import Modal from '../components/ui/modal/Modal';
import Table, { TableColumn } from '../components/ui/table/Table';
import useChecklistsApi from '../services/checklists';
import {
  Checklist,
  CreateChecklistCommand,
  UpdateChecklistCommand,
  QueryParams,
} from '../types/api';

const ChecklistsManagement = () => {
  const {
    getChecklists,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    uploadChecklistFile,
    importChecklists,
    exportChecklists,
    getChecklistTemplate,
    loading,
    error,
  } = useChecklistsApi();

  const [checklists, setChecklists] = useState<Checklist[]>([]);
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
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [formData, setFormData] = useState<CreateChecklistCommand>({
    name: '',
    description: '',
    workOrderId: '',
    tasks: [],
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchChecklists();
  }, [queryParams]);

  const fetchChecklists = async () => {
    try {
      const response = await getChecklists(queryParams);
      setChecklists(response.data.items);
      setPagination({
        current: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
    } catch (err) {
      console.error('Failed to fetch checklists:', err);
    }
  };

  const handleCreateChecklist = async () => {
    try {
      await createChecklist(formData);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        description: '',
        workOrderId: '',
        tasks: [],
      });
      fetchChecklists();
    } catch (err) {
      console.error('Failed to create checklist:', err);
    }
  };

  const handleUpdateChecklist = async () => {
    if (!selectedChecklist) return;

    try {
      await updateChecklist({ ...formData, id: selectedChecklist.id } as UpdateChecklistCommand);
      setIsEditModalOpen(false);
      setSelectedChecklist(null);
      setFormData({
        name: '',
        description: '',
        workOrderId: '',
        tasks: [],
      });
      fetchChecklists();
    } catch (err) {
      console.error('Failed to update checklist:', err);
    }
  };

  const handleDeleteChecklist = async (checklist: Checklist) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa checklist này?')) return;

    try {
      await deleteChecklist({ id: checklist.id });
      fetchChecklists();
    } catch (err) {
      console.error('Failed to delete checklist:', err);
    }
  };

  const handleUploadFile = async () => {
    if (!file) return;

    try {
      await uploadChecklistFile(file);
      setFile(null);
      fetchChecklists();
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
  };

  const handleExportChecklists = async () => {
    try {
      const response = await exportChecklists(queryParams);
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checklists_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export checklists:', err);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await getChecklistTemplate();
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'checklists_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download template:', err);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, Page: page, PageSize: pageSize });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams({ ...queryParams, Q: e.target.value, Page: 1 });
  };

  const handleEdit = (checklist: Checklist) => {
    setSelectedChecklist(checklist);
    setFormData({
      name: checklist.name || '',
      description: checklist.description || '',
      workOrderId: checklist.workOrderId,
      tasks: checklist.tasks || [],
    });
    setIsEditModalOpen(true);
  };

  const columns: TableColumn<Checklist>[] = [
    { key: 'name', title: 'Tên', sortable: true },
    { key: 'description', title: 'Mô tả', sortable: true },
    { key: 'workOrderId', title: 'Work Order', sortable: true },
    { key: 'createdAt', title: 'Ngày tạo', sortable: true },
    {
      key: 'actions' as keyof Checklist,
      title: 'Thao tác',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteChecklist(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Checklist</h1>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Tìm kiếm checklist..."
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

            <label className="relative cursor-pointer">
              <Button variant="secondary">Tải lên</Button>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".xlsx,.xls"
              />
            </label>

            <Button variant="secondary" onClick={handleExportChecklists}>
              Xuất
            </Button>

            <Button variant="secondary" onClick={handleDownloadTemplate}>
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
                <Button size="sm" variant="secondary" onClick={() => setFile(null)}>
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

      {/* Checklists Table */}
      <Table
        data={checklists as unknown as Record<string, unknown>[]}
        columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
        }}
        onRowClick={(checklist) => console.log('Clicked checklist:', checklist)}
      />

      {/* Create Checklist Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm checklist mới"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Tên checklist"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên checklist"
          />

          <Input
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả"
          />

          <Input
            label="Work Order"
            value={formData.workOrderId}
            onChange={(e) => setFormData({ ...formData, workOrderId: e.target.value })}
            placeholder="Chọn work order"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateChecklist} loading={loading}>
              Tạo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Checklist Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedChecklist(null);
        }}
        title="Chỉnh sửa checklist"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Tên checklist"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên checklist"
          />

          <Input
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả"
          />

          <Input
            label="Work Order"
            value={formData.workOrderId}
            onChange={(e) => setFormData({ ...formData, workOrderId: e.target.value })}
            placeholder="Chọn work order"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedChecklist(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateChecklist} loading={loading}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChecklistsManagement;
