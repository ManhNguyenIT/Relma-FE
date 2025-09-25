import DataTable, { TableColumn, StatusConfig } from '../../common/DataTable';

interface InventoryData {
  id: number;
  location: string;
  area: string;
  status: string;
  availableQty: number;
  onHandQty: number;
  minimumQty: number;
}

const inventoryData: InventoryData[] = [
  {
    id: 1,
    location: 'Suite B',
    area: '',
    status: 'Out of stock',
    availableQty: 0,
    onHandQty: 1,
    minimumQty: 10,
  },
];

export default function InventoryTable1() {
  const columns: TableColumn[] = [
    {
      key: 'location',
      label: 'Location',
    },
    {
      key: 'area',
      label: 'Area',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'availableQty',
      label: 'Available Qty',
      render: (value: number) => (
        <span className="text-red-500 font-medium">{value.toFixed(2)}</span>
      ),
    },
    {
      key: 'onHandQty',
      label: 'On Hand Qty',
      render: (value: number) => value.toFixed(2),
    },
    {
      key: 'minimumQty',
      label: 'Minimum Qty',
    },
    {
      key: 'actions',
      label: '',
      render: () => <span className="text-gray-400">•••</span>,
    },
  ];

  const statusConfig: StatusConfig = {
    'Out of stock': {
      text: 'Out of stock',
      color: 'error',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
  };

  return (
    <DataTable
      data={inventoryData}
      columns={columns}
      statusConfig={statusConfig}
      className="overflow-x-auto rounded-[4px] shadow bg-white"
    />
  );
}
