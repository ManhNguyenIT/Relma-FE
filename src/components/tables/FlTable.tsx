import { FaImage } from 'react-icons/fa';
import DataTable, { TableColumn } from '../common/DataTable';

interface Product {
  id: number;
  name: string;
  image?: string; // Add image property
  status: string;
  statusColor: string;
  qty: number;
  qtyColor: string;
  allocated: number;
}

const data: Product[] = [
  {
    id: 1,
    name: 'Bút',
    image: '', // Add image property (empty or url)
    status: 'Out of stock',
    statusColor: 'bg-red-100 text-red-600',
    qty: 0,
    qtyColor: 'text-red-500',
    allocated: 1,
  },
  {
    id: 2,
    name: 'Foil Tape 1.89 - paper...',
    image: '', // Add image property
    status: 'Non-stock',
    statusColor: 'bg-gray-100 text-gray-500',
    qty: 2,
    qtyColor: 'text-gray-800',
    allocated: 1,
  },
  {
    id: 3,
    name: 'HVAC Filter 20x20x1',
    image: '', // Add image property
    status: 'Low stock',
    statusColor: 'bg-yellow-100 text-yellow-600',
    qty: 3,
    qtyColor: 'text-gray-800',
    allocated: 2,
  },
];

const columns: TableColumn<Product>[] = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'image',
    label: 'Image',
    render: () => (
      <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-md">
        <FaImage className="text-gray-500" />
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string | number | undefined, row: Product) => (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${row.statusColor}`}>{value}</span>
    ),
  },
  {
    key: 'qty',
    label: 'Available Qty',
    render: (value: string | number | undefined, row: Product) => (
      <span className={`font-medium ${row.qtyColor}`}>
        {typeof value === 'number' ? value.toFixed(2) : (value ?? '')}
      </span>
    ),
  },
  {
    key: 'allocated',
    label: 'Allocated',
    render: (value: string | number | undefined) =>
      typeof value === 'number' ? value.toFixed(2) : value,
  },
];

const FlTable: React.FC = () => {
  return <DataTable data={data} columns={columns} selectable={true} className="overflow-x-auto" />;
};

export default FlTable;
