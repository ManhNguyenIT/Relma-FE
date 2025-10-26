import React, { useState, useEffect } from 'react';
import { Location, UpdateLocationCommand } from '../types/api';

interface LocationEditDialogProps {
  isOpen: boolean;
  location: Location | null;
  onSave: (data: UpdateLocationCommand) => Promise<boolean>;
  onCancel: () => void;
}

const LocationEditDialog: React.FC<LocationEditDialogProps> = ({
  isOpen,
  location,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<UpdateLocationCommand>({
    id: '',
    name: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (location) {
      setFormData({
        id: location.id,
        name: location.name || '',
      });
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const success = await onSave(formData);
    if (success) {
      setIsSaving(false);
    } else {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen || !location) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Location</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Location name"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationEditDialog;
