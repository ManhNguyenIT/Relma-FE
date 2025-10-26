import React, { useState, useEffect } from 'react';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import Modal from '../components/ui/modal/Modal';
import Table, { TableColumn } from '../components/ui/table/Table';
import useAssetsApi from '../services/assets';
import { Asset, CreateAssetCommand, UpdateAssetCommand, PaginationQueryParams } from '../types/api';

const AssetsManagement = () => {
  const {
    getAssets,
    createAsset,
    updateAsset,
    uploadAssetFile,
    exportAssets,
    getAssetTemplate,
    error,
  } = useAssetsApi();

  const [assets, setAssets] = useState<Asset[]>([]);
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
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<CreateAssetCommand>({
    name: '',
    serialNumber: '',
    locationId: '',
    images: [],
    area: '',
    barcode: '',
    category: '',
    description: '',
    manufacturerId: '',
    model: '',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAssets();
  });

  const fetchAssets = async () => {
    try {
      const response = await getAssets(queryParams);
      setAssets(response.items);
      setPagination({
        current: response.currentPage,
        pageSize: response.pageSize,
        total: response.rowCount,
      });
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    }
  };

  const handleCreateAsset = async () => {
    try {
      await createAsset(formData);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        serialNumber: '',
        locationId: '',
        images: [],
        area: '',
        barcode: '',
        category: '',
        description: '',
        manufacturerId: '',
        model: '',
      });
      fetchAssets();
    } catch (err) {
      console.error('Failed to create asset:', err);
    }
  };

  const handleUpdateAsset = async () => {
    if (!selectedAsset) return;

    try {
      await updateAsset({ ...formData, id: selectedAsset.id } as UpdateAssetCommand);
      setIsEditModalOpen(false);
      setSelectedAsset(null);
      setFormData({
        name: '',
        serialNumber: '',
        locationId: '',
        images: [],
        area: '',
        barcode: '',
        category: '',
        description: '',
        manufacturerId: '',
        model: '',
      });
      fetchAssets();
    } catch (err) {
      console.error('Failed to update asset:', err);
    }
  };

  const handleDeleteAsset = async (asset: Asset) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài sản này?')) return;
    console.log(asset);
    try {
      deleteAssets();
      fetchAssets();
    } catch (err) {
      console.error('Failed to delete asset:', err);
    }
  };

  const handleUploadFile = async () => {
    if (!file) return;

    try {
      await uploadAssetFile(file);
      setFile(null);
      fetchAssets();
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
  };

  const handleExportAssets = async () => {
    try {
      const response = await exportAssets(queryParams);
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assets_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export assets:', err);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await getAssetTemplate();
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'assets_template.xlsx';
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

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name || '',
      serialNumber: asset.serialNumber || '',
      locationId: asset.locationId,
      images: asset.images || [],
      area: asset.area || '',
      barcode: asset.barcode || '',
      category: asset.category || '',
      description: asset.description || '',
      manufacturerId: asset.manufacturerId || '',
      model: asset.model || '',
    });
    setIsEditModalOpen(true);
  };

  const columns: TableColumn<Asset>[] = [
    { key: 'name', title: 'Tên', sortable: true },
    { key: 'serialNumber', title: 'Số serial', sortable: true },
    { key: 'locationId', title: 'Vị trí', sortable: true },
    { key: 'category', title: 'Danh mục', sortable: true },
    { key: 'model', title: 'Mẫu', sortable: true },
    { key: 'manufacturerId', title: 'Nhà sản xuất', sortable: true },
    { key: 'barcode', title: 'Mã vạch', sortable: true },
    { key: 'area', title: 'Khu vực', sortable: true },
    {
      key: 'actions' as keyof Asset,
      title: 'Thao tác',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteAsset(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Tài sản</h1>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Tìm kiếm tài sản..."
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

            <Button variant="outline" onClick={handleExportAssets}>
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

      {/* Assets Table */}
      <Table
        data={assets as unknown as Record<string, unknown>[]}
        columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePageChange,
        }}
        onRowClick={(asset) => console.log('Clicked asset:', asset)}
      />

      {/* Create Asset Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm tài sản mới"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Tên tài sản"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên tài sản"
          />

          <Input
            label="Số serial"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            placeholder="Nhập số serial"
          />

          <Input
            label="Vị trí"
            value={formData.locationId}
            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
            placeholder="Chọn vị trí"
          />

          <Input
            label="Mẫu"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Nhập mẫu"
          />

          <Input
            label="Nhà sản xuất"
            value={formData.manufacturerId}
            onChange={(e) => setFormData({ ...formData, manufacturerId: e.target.value })}
            placeholder="Nhập nhà sản xuất"
          />

          <Input
            label="Mã vạch"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            placeholder="Nhập mã vạch"
          />

          <Input
            label="Danh mục"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Nhập danh mục"
          />

          <Input
            label="Khu vực"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="Nhập khu vực"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateAsset}>Tạo</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Asset Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAsset(null);
        }}
        title="Chỉnh sửa tài sản"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Tên tài sản"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên tài sản"
          />

          <Input
            label="Số serial"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            placeholder="Nhập số serial"
          />

          <Input
            label="Vị trí"
            value={formData.locationId}
            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
            placeholder="Chọn vị trí"
          />

          <Input
            label="Mẫu"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Nhập mẫu"
          />

          <Input
            label="Nhà sản xuất"
            value={formData.manufacturerId}
            onChange={(e) => setFormData({ ...formData, manufacturerId: e.target.value })}
            placeholder="Nhập nhà sản xuất"
          />

          <Input
            label="Mã vạch"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            placeholder="Nhập mã vạch"
          />

          <Input
            label="Danh mục"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Nhập danh mục"
          />

          <Input
            label="Khu vực"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="Nhập khu vực"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedAsset(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateAsset}>Cập nhật</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssetsManagement;
function deleteAssets() {
  throw new Error('Function not implemented.');
}
