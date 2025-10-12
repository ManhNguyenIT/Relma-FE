import React, { useState, useEffect } from 'react';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import Modal from '../components/ui/modal/Modal';
import Table, { TableColumn } from '../components/ui/table/Table';
import usePartsApi from '../services/parts';
import { Part, CreatePartCommand, UpdatePartCommand, QueryParams } from '../types/api';

interface ApiResponse<T> {
  data: T;
  page: number;
  pageSize: number;
  total: number;
}

interface ApiError {
  message: string;
}

const PartsManagement = () => {
  const {
    getParts,
    createPart,
    updatePart,
    deletePart,
    uploadPartFile,
    exportParts,
    getPartTemplate,
    loading,
    error,
  } = usePartsApi();

  const [parts, setParts] = useState<Part[]>([]);
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
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState<CreatePartCommand>({
    materialId: '',
    minimum: 0,
    quantity: 0,
    inventory: 0,
    cost: 0,
    category: '',
    description: '',
    status: 0,
    storageId: '',
    locationId: '',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchParts();
  }, [queryParams]);

  const fetchParts = async () => {
    try {
      const response = (await getParts(queryParams)) as ApiResponse<{
        items: Part[];
        page: number;
        pageSize: number;
        total: number;
      }>;
      setParts(response.data.items);
      setPagination({
        current: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
    } catch (err) {
      console.error('Failed to fetch parts:', err);
    }
  };

  const handleCreatePart = async () => {
    try {
      await createPart(formData);
      setIsCreateModalOpen(false);
      setFormData({
        materialId: '',
        minimum: 0,
        quantity: 0,
        inventory: 0,
        cost: 0,
        category: '',
        description: '',
        status: 0,
        storageId: '',
        locationId: '',
      });
      fetchParts();
    } catch (err) {
      console.error('Failed to create part:', err);
    }
  };

  const handleUpdatePart = async () => {
    if (!selectedPart) return;

    try {
      await updatePart({ ...formData, id: selectedPart.id } as UpdatePartCommand);
      setIsEditModalOpen(false);
      setSelectedPart(null);
      setFormData({
        materialId: '',
        minimum: 0,
        quantity: 0,
        inventory: 0,
        cost: 0,
        category: '',
        description: '',
        status: 0,
        storageId: '',
        locationId: '',
      });
      fetchParts();
    } catch (err) {
      console.error('Failed to update part:', err);
    }
  };

  const handleDeletePart = async (part: Part) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa linh kiện này?')) return;

    try {
      await deletePart({ ids: [part.id] });
      fetchParts();
    } catch (err) {
      console.error('Failed to delete part:', err);
    }
  };

  const handleUploadFile = async () => {
    if (!file) return;

    try {
      await uploadPartFile(file);
      setFile(null);
      fetchParts();
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
  };

  const handleExportParts = async () => {
    try {
      const response = (await exportParts(queryParams)) as ApiResponse<Blob>;
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `parts_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export parts:', err);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = (await getPartTemplate()) as ApiResponse<Blob>;
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'parts_template.xlsx';
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

  const handleEdit = (part: Part) => {
    setSelectedPart(part);
    setFormData({
      materialId: part.materialId || '',
      minimum: part.minimum || 0,
      quantity: part.quantity || 0,
      inventory: part.inventory || 0,
      cost: part.cost || 0,
      category: part.category || '',
      description: part.description || '',
      status: part.status || 0,
      storageId: part.storageId || '',
      locationId: part.locationId || '',
    });
    setIsEditModalOpen(true);
  };

  const columns: TableColumn<Part>[] = [
    { key: 'materialId', title: 'Vật tư', sortable: true },
    { key: 'category', title: 'Loại', sortable: true },
    { key: 'status', title: 'Trạng thái', sortable: true },
    { key: 'description', title: 'Mô tả', sortable: true },
    { key: 'createdAt', title: 'Ngày tạo', sortable: true },
    {
      key: 'actions' as keyof Part,
      title: 'Thao tác',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeletePart(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Linh kiện</h1>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Tìm kiếm linh kiện..."
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

            <Button variant="secondary" onClick={handleExportParts}>
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
            <p className="text-sm text-red-800">{(error as ApiError).message}</p>
          </div>
        )}
      </div>

      {/* Parts Table */}
      <Table
        data={parts as unknown as Record<string, unknown>[]}
        columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
        }}
        onRowClick={(part) => console.log('Clicked part:', part)}
      />

      {/* Create Part Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm linh kiện mới"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Vật tư"
            value={formData.materialId}
            onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
            placeholder="Nhập ID vật tư"
          />

          <Input
            label="Loại"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Nhập loại linh kiện"
          />

          <Input
            label="Số lượng tối thiểu"
            type="number"
            value={formData.minimum}
            onChange={(e) => setFormData({ ...formData, minimum: parseInt(e.target.value) || 0 })}
          />

          <Input
            label="Số lượng hiện có"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
          />

          <Input
            label="Tồn kho"
            type="number"
            value={formData.inventory}
            onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) || 0 })}
          />

          <Input
            label="Chi phí"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreatePart} loading={loading}>
              Tạo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Part Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPart(null);
        }}
        title="Chỉnh sửa linh kiện"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Vật tư"
            value={formData.materialId}
            onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
            placeholder="Nhập ID vật tư"
          />

          <Input
            label="Loại"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Nhập loại linh kiện"
          />

          <Input
            label="Số lượng tối thiểu"
            type="number"
            value={formData.minimum}
            onChange={(e) => setFormData({ ...formData, minimum: parseInt(e.target.value) || 0 })}
          />

          <Input
            label="Số lượng hiện có"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
          />

          <Input
            label="Tồn kho"
            type="number"
            value={formData.inventory}
            onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) || 0 })}
          />

          <Input
            label="Chi phí"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedPart(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdatePart} loading={loading}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PartsManagement;
