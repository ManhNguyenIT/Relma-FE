import React, { useState, useEffect } from 'react';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import Modal from '../components/ui/modal/Modal';
import Table, { TableColumn } from '../components/ui/table/Table';
import useMaterialsApi from '../services/materials';
import { Material, CreateMaterialCommand, UpdateMaterialCommand, QueryParams } from '../types/api';

interface ApiResponse<T> {
  data: T;
  page: number;
  pageSize: number;
  total: number;
}

interface ApiError {
  message: string;
}

const MaterialsManagement = () => {
  const {
    getMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    uploadMaterialFile,
    exportMaterials,
    getMaterialTemplate,
    loading,
    error,
  } = useMaterialsApi();

  const [materials, setMaterials] = useState<Material[]>([]);
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
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState<CreateMaterialCommand>({
    name: '',
    code: '',
    status: 0,
    description: '',
    images: [],
    parts: [],
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, [queryParams]);

  const fetchMaterials = async () => {
    try {
      const response = (await getMaterials(queryParams)) as ApiResponse<{
        items: Material[];
        page: number;
        pageSize: number;
        total: number;
      }>;
      setMaterials(response.data.items);
      setPagination({
        current: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    }
  };

  const handleCreateMaterial = async () => {
    try {
      await createMaterial(formData);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        code: '',
        status: 0,
        description: '',
        images: [],
        parts: [],
      });
      fetchMaterials();
    } catch (err) {
      console.error('Failed to create material:', err);
    }
  };

  const handleUpdateMaterial = async () => {
    if (!selectedMaterial) return;

    try {
      await updateMaterial({ ...formData, id: selectedMaterial.id } as UpdateMaterialCommand);
      setIsEditModalOpen(false);
      setSelectedMaterial(null);
      setFormData({
        name: '',
        code: '',
        status: 0,
        description: '',
        images: [],
        parts: [],
      });
      fetchMaterials();
    } catch (err) {
      console.error('Failed to update material:', err);
    }
  };

  const handleDeleteMaterial = async (material: Material) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vật tư này?')) return;

    try {
      await deleteMaterial({ ids: [material.id] });
      fetchMaterials();
    } catch (err) {
      console.error('Failed to delete material:', err);
    }
  };

  const handleUploadFile = async () => {
    if (!file) return;

    try {
      await uploadMaterialFile(file);
      setFile(null);
      fetchMaterials();
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
  };

  const handleExportMaterials = async () => {
    try {
      const response = (await exportMaterials(queryParams)) as ApiResponse<Blob>;
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `materials_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export materials:', err);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = (await getMaterialTemplate()) as ApiResponse<Blob>;
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'materials_template.xlsx';
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

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setFormData({
      name: material.name || '',
      code: material.code || '',
      status: material.status || 0,
      description: material.description || '',
      images: material.images || [],
      parts: material.parts || [],
    });
    setIsEditModalOpen(true);
  };

  const columns: TableColumn<Material>[] = [
    { key: 'name', title: 'Tên vật tư', sortable: true },
    { key: 'code', title: 'Mã vật tư', sortable: true },
    { key: 'status', title: 'Trạng thái', sortable: true },
    { key: 'description', title: 'Mô tả', sortable: true },
    { key: 'createdAt', title: 'Ngày tạo', sortable: true },
    {
      key: 'actions' as keyof Material,
      title: 'Thao tác',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteMaterial(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Vật tư</h1>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Tìm kiếm vật tư..."
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

            <Button variant="secondary" onClick={handleExportMaterials}>
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

      {/* Materials Table */}
      <Table
        data={materials as unknown as Record<string, unknown>[]}
        columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
        }}
        onRowClick={(material) => console.log('Clicked material:', material)}
      />

      {/* Create Material Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm vật tư mới"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Tên vật tư"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên vật tư"
          />

          <Input
            label="Mã vật tư"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Nhập mã vật tư"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateMaterial} loading={loading}>
              Tạo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Material Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMaterial(null);
        }}
        title="Chỉnh sửa vật tư"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Tên vật tư"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên vật tư"
          />

          <Input
            label="Mã vật tư"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Nhập mã vật tư"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedMaterial(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateMaterial} loading={loading}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MaterialsManagement;
