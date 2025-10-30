import { useState, useEffect } from 'react';
import WorkOrderTask from '../components/workorder/work-order-task/WorkOrderTask';
import FilterButton from '../components/workorder/work-order-button/FilterButton';
import LocationButton from '../components/workorder/work-order-button/LocationButton';
import AssetsHeader from '../components/assets/AssetsHeader';
import useAssetsApi from '../services/assets';
import { Asset, CreateAssetCommand, UpdateAssetCommand, PaginationQueryParams } from '../types/api';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import Modal from '../components/ui/modal/Modal';
import Table, { TableColumn } from '../components/ui/table/Table';

export default function Assets() {
  const {
    getAssets,
    createAsset,
    updateAsset,
    deleteAssets,
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
    manufacturerId: '',
    model: '',
    description: '',
    area: '',
    barcode: '',
    category: '',
    images: [],
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAssets();
  }, [queryParams]);

  const fetchAssets = async () => {
    try {
      const response = await getAssets(queryParams);
      console.log('response', response);
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
        manufacturerId: '',
        model: '',
        description: '',
        area: '',
        barcode: '',
        category: '',
        images: [],
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
        manufacturerId: '',
        model: '',
        description: '',
        area: '',
        barcode: '',
        category: '',
        images: [],
      });
      fetchAssets();
    } catch (err) {
      console.error('Failed to update asset:', err);
    }
  };

  const handleDeleteAsset = async (asset: Asset) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài sản này?')) return;

    try {
      await deleteAssets({ ids: [asset.id] });
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
      const response = await exportAssets();
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
      locationId: asset.locationId || '',
      manufacturerId: asset.manufacturerId || '',
      model: asset.model || '',
      description: asset.description || '',
      area: asset.area || '',
      barcode: asset.barcode || '',
      category: asset.category || '',
      images: asset.images || [],
    });
    setIsEditModalOpen(true);
  };

  const columns: TableColumn<Asset>[] = [
    { key: 'name', title: 'Tên', sortable: true },
    { key: 'description', title: 'Mô tả', sortable: true },
    { key: 'locationId', title: 'Địa điểm', sortable: true },
    { key: 'manufacturerId', title: 'Nhà sản xuất', sortable: true },
    { key: 'serialNumber', title: 'Số serial', sortable: true },
    { key: 'model', title: 'Mẫu', sortable: true },
    { key: 'area', title: 'Khu vực', sortable: true },
    { key: 'barcode', title: 'Mã vạch', sortable: true },
    { key: 'category', title: 'Loại', sortable: true },
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
    <div className="w-full flex flex-col gap-6">
      <div>
        <AssetsHeader />
      </div>
      <div>
        <WorkOrderTask />
      </div>
      <div className=" grid grid-cols-1 md:flex items-center md:gap-4 gap-4">
        <FilterButton />
        <LocationButton />
        <p className="cursor-pointer font-medium text-[#007FE6]">Reset</p>
      </div>

      <div className="mt-4">
        <Input
          placeholder="Tìm kiếm tài sản..."
          value={queryParams.q || ''}
          onChange={(e) => handleSearch(e)}
          className="w-full mb-4"
        />

        <div className="flex gap-2 mb-4">
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-800">{error.message}</p>
          </div>
        )}

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
      </div>

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
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả"
          />

          <Input
            label="Địa điểm"
            value={formData.locationId}
            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
            placeholder="Chọn địa điểm"
          />

          <Input
            label="Nhà sản xuất"
            value={formData.manufacturerId}
            onChange={(e) => setFormData({ ...formData, manufacturerId: e.target.value })}
            placeholder="Chọn nhà sản xuất"
          />

          <Input
            label="Số serial"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            placeholder="Nhập số serial"
          />

          <Input
            label="Mẫu"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Nhập mẫu"
          />

          <Input
            label="Khu vực"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="Nhập khu vực"
          />

          <Input
            label="Mã vạch"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            placeholder="Nhập mã vạch"
          />

          <Input
            label="Loại"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Nhập loại"
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
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả"
          />

          <Input
            label="Địa điểm"
            value={formData.locationId}
            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
            placeholder="Chọn địa điểm"
          />

          <Input
            label="Nhà sản xuất"
            value={formData.manufacturerId}
            onChange={(e) => setFormData({ ...formData, manufacturerId: e.target.value })}
            placeholder="Chọn nhà sản xuất"
          />

          <Input
            label="Số serial"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            placeholder="Nhập số serial"
          />

          <Input
            label="Mẫu"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Nhập mẫu"
          />

          <Input
            label="Khu vực"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="Nhập khu vực"
          />

          <Input
            label="Mã vạch"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            placeholder="Nhập mã vạch"
          />

          <Input
            label="Loại"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Nhập loại"
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
}
