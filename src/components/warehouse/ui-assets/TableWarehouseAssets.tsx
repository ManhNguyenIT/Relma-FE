import { FaImage } from 'react-icons/fa';
import DataTable, { TableColumn, TableAction } from '../../common/DataTable';

interface AssetData {
  id: number;
  name: string;
  barcode: string;
  description: string;
}

export default function TableWarehouseAssets() {
  const data: AssetData[] = [
    {
      id: 1,
      name: 'Linh',
      barcode: 'MES',
      description: '',
    },
  ];

  const columns: TableColumn[] = [
    {
      key: 'image',
      label: '',
      render: () => (
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100">
          <FaImage className="text-gray-400 text-lg" />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'barcode',
      label: 'Barcode',
    },
    {
      key: 'description',
      label: 'Description',
    },
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      onClick: (row: AssetData) => {
        console.log('View asset:', row);
      },
    },
    {
      label: 'Edit',
      onClick: (row: AssetData) => {
        console.log('Edit asset:', row);
      },
    },
    {
      label: 'Delete',
      onClick: (row: AssetData) => {
        console.log('Delete asset:', row);
      },
      variant: 'danger',
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      actions={actions}
      showActions={true}
      className="overflow-x-auto rounded-[4px] shadow bg-white"
    />
  );
}
