import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import DataTable, { TableColumn, TableAction, StatusConfig } from '../common/DataTable';

interface LocationData {
  id: number;
  address: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  dateCreated: string;
  worker: string;
}

const locationData: LocationData[] = [
  {
    id: 1,
    address: 'Kho A',
    status: 'Approved',
    dateCreated: '07/01/25',
    worker: 'Tran Linh',
  },
  {
    id: 2,
    address: 'Kho A',
    status: 'Approved',
    dateCreated: '07/01/25',
    worker: 'Tran Linh',
  },
  {
    id: 3,
    address: 'Kho A',
    status: 'Approved',
    dateCreated: '07/01/25',
    worker: 'Tran Linh',
  },
  {
    id: 4,
    address: 'Kho A',
    status: 'Approved',
    dateCreated: '07/01/25',
    worker: 'Tran Linh',
  },
  {
    id: 5,
    address: 'Kho A',
    status: 'Approved',
    dateCreated: '07/01/25',
    worker: 'Tran Linh',
  },
];

export default function LocationTable() {
  const columns: TableColumn[] = [
    {
      key: 'address',
      label: 'Address',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'dateCreated',
      label: 'Date Created',
    },
    {
      key: 'worker',
      label: 'Worker',
    },
  ];

  const statusConfig: StatusConfig = {
    Approved: {
      text: 'Approved',
      color: 'success',
      bgColor: 'bg-green-500',
      textColor: 'text-white',
    },
    Pending: {
      text: 'Pending',
      color: 'warning',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
    Rejected: {
      text: 'Rejected',
      color: 'error',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
  };

  const actions: TableAction[] = [
    {
      label: 'Edit',
      icon: <FiEdit2 className="h-4 w-4" />,
      onClick: (row: LocationData) => {
        console.log('Edit location:', row.id);
      },
    },
    {
      label: 'Delete',
      icon: <FiTrash2 className="h-4 w-4" />,
      onClick: (row: LocationData) => {
        console.log('Delete location:', row.id);
      },
      variant: 'danger',
    },
  ];

  return (
    <DataTable
      data={locationData}
      columns={columns}
      actions={actions}
      statusConfig={statusConfig}
      selectable={true}
      showActions={true}
      maxHeight="max-h-96"
      stickyHeader={true}
      className="bg-white rounded-lg shadow overflow-hidden"
    />
  );
}
