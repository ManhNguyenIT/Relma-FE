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
  PaginationQueryParams,
} from '../types/api';

const ChecklistsManagement = () => {
  const {
    getChecklists,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    uploadChecklistFile,
    exportChecklists,
    getChecklistTemplate,
    error,
  } = useChecklistsApi();

  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [queryParams, setQueryParams] = useState<PaginationQueryParams>({
    page: 1,
    pageSize: 10,
    includes: 'tasks',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [formData, setFormData] = useState<CreateChecklistCommand>({
    name: '',
    description: '',
    workOrderId: undefined,
    tasks: [],
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchChecklists();
  }, [queryParams]);

  const fetchChecklists = async () => {
    try {
      const response = await getChecklists(queryParams);
      console.log('response', response);
      setChecklists(response.items);
      setPagination({
        current: response.currentPage,
        pageSize: response.pageSize,
        total: response.rowCount,
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
        workOrderId: undefined,
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
        workOrderId: undefined,
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
      await deleteChecklist({ ids: [checklist.id] });
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
      const response = await exportChecklists();
      const blob = new Blob([response], {
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
      const blob = new Blob([response], {
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
    setQueryParams({ ...queryParams, page: page, pageSize: pageSize });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams({ ...queryParams, q: e.target.value, page: 1 });
  };

  const handleEdit = (checklist: Checklist) => {
    setSelectedChecklist(checklist);
    setFormData({
      name: checklist.name || '',
      description: checklist.description || '',
      workOrderId: checklist.workOrderId,
      tasks: checklist.tasks?.map((i) => i.id) || [],
    });
    setIsEditModalOpen(true);
  };

  const columns: TableColumn<Checklist>[] = [
    { key: 'name', title: 'Tên', sortable: true },
    { key: 'description', title: 'Mô tả', sortable: true },
    { key: 'workOrderId', title: 'Work Order', sortable: true },
    {
      key: 'actions' as keyof Checklist,
      title: 'Thao tác',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
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

            <Button variant="outline" onClick={handleExportChecklists}>
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

      {/* Checklists Table */}
      <Table
        data={checklists as unknown as Record<string, unknown>[]}
        columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
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
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateChecklist}>Tạo</Button>
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
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedChecklist(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateChecklist}>Cập nhật</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChecklistsManagement;
