import React from 'react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemNames?: string[];
  onConfirm: () => Promise<boolean>;
  onCancel: () => void;
  isDeleting?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  itemNames = [],
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  const handleConfirm = async () => {
    console.log('🔴 Delete confirmation clicked');
    const success = await onConfirm();
    console.log('🔴 Delete result:', success);
    if (success) {
      // Dialog will be closed by parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-600">{title}</h2>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">{message}</p>

          {itemNames.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">Items to be deleted:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {itemNames.map((name, index) => (
                  <li key={index} className="truncate">
                    • {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
