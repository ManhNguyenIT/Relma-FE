import React, { useState, useEffect } from 'react';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import Modal from '../components/ui/modal/Modal';
import Table, { TableColumn } from '../components/ui/table/Table';
import { useRequestsApi } from '../services/requests';
import { Request, CreateRequestCommand, UpdateRequestCommand, QueryParams } from '../types/api';

const RequestsManagement = () => {
  const {
    getRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    uploadRequestFile,
    exportRequests,
    getRequestTemplate,
    loading,
    error,
  } = useRequestsApi();

  const [requests, setRequests] = useState<Request[]>([]);
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
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [formData, setFormData] = useState<CreateRequestCommand>({
    assetId: '',
    title: '',
    description: '',
    status: 0,
    category: 0,
    priority: 0,
    images: [],
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [queryParams]);

  const fetchRequests = async () => {
    try {
      const response = await getRequests(queryParams);
      setRequests(response.items);
      setPagination({
        current: response.page,
        pageSize: response.pageSize,
        total: response.total,
      });
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const handleCreateRequest = async () => {
    try {
      await createRequest(formData);
      setIsCreateModalOpen(false);
      setFormData({
        assetId: '',
        title: '',
        description: '',
        status: 0,
        category: 0,
        priority: 0,
        images: [],
      });
      fetchRequests();
    } catch (err) {
      console.error('Failed to create request:', err);
    }
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      await updateRequest({ ...formData, id: selectedRequest.id } as UpdateRequestCommand);
      setIsEditModalOpen(false);
      setSelectedRequest(null);
      setFormData({
        assetId: '',
        title: '',
        description: '',
        status: 0,
        category: 0,
        priority: 0,
        images: [],
      });
      fetchRequests();
    } catch (err) {
      console.error('Failed to update request:', err);
    }
  };

  const handleDeleteRequest = async (request: Request) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) return;

    try {
      await deleteRequest({ ids: [request.id] });
      fetchRequests();
    } catch (err) {
      console.error('Failed to delete request:', err);
    }
  };

  const handleUploadFile = async () => {
    if (!file) return;

    try {
      await uploadRequestFile(file);
      setFile(null);
      fetchRequests();
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
  };

  const handleExportRequests = async () => {
    try {
      const response = await exportRequests(queryParams);
      const blob = new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `requests_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export requests:', err);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await getRequestTemplate();
      const blob = new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'requests_template.xlsx';
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

  const handleEdit = (request: Request) => {
    setSelectedRequest(request);
    setFormData({
      assetId: request.assetId,
      title: request.title || '',
      description: request.description || '',
      status: request.status,
      category: request.category,
      priority: request.priority,
      images: request.images || [],
    });
    setIsEditModalOpen(true);
  };

  const columns: TableColumn<Request>[] = [
    { key: 'assetId', title: 'Tài sản', sortable: true },
    { key: 'title', title: 'Tiêu đề', sortable: true },
    { key: 'status', title: 'Trạng thái', sortable: true },
    { key: 'category', title: 'Loại', sortable: true },
    { key: 'priority', title: 'Mức độ', sortable: true },
    { key: 'createdAt', title: 'Ngày tạo', sortable: true },
    {
      key: 'actions' as keyof Request,
      title: 'Thao tác',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteRequest(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Yêu cầu</h1>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Tìm kiếm yêu cầu..."
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

            <Button variant="secondary" onClick={handleExportRequests}>
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

      {/* Requests Table */}
      <Table
        data={requests as unknown as Record<string, unknown>[]}
        columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
        }}
        onRowClick={(request) => console.log('Clicked request:', request)}
      />

      {/* Create Request Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm yêu cầu mới"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Tài sản"
            value={formData.assetId}
            onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
            placeholder="Nhập ID tài sản"
          />

          <Input
            label="Tiêu đề"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Nhập tiêu đề yêu cầu"
          />

          <Input
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
              >
                <option value={0}>Mới</option>
                <option value={1}>Đang xử lý</option>
                <option value={2}>Hoàn thành</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: parseInt(e.target.value) })}
              >
                <option value={0}>Bảo trì</option>
                <option value={1}>Sửa chữa</option>
                <option value={2}>Khác</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ ưu tiên</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              >
                <option value={0}>Thấp</option>
                <option value={1}>Trung bình</option>
                <option value={2}>Cao</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateRequest} loading={loading}>
              Tạo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Request Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRequest(null);
        }}
        title="Chỉnh sửa yêu cầu"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Tài sản"
            value={formData.assetId}
            onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
            placeholder="Nhập ID tài sản"
          />

          <Input
            label="Tiêu đề"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Nhập tiêu đề yêu cầu"
          />

          <Input
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
              >
                <option value={0}>Mới</option>
                <option value={1}>Đang xử lý</option>
                <option value={2}>Hoàn thành</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: parseInt(e.target.value) })}
              >
                <option value={0}>Bảo trì</option>
                <option value={1}>Sửa chữa</option>
                <option value={2}>Khác</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ ưu tiên</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              >
                <option value={0}>Thấp</option>
                <option value={1}>Trung bình</option>
                <option value={2}>Cao</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedRequest(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateRequest} loading={loading}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RequestsManagement;
