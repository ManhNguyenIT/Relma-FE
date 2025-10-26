import React, { useState, useEffect } from 'react';
import { Asset, UpdateAssetCommand } from '../types/api';

interface AssetEditDialogProps {
  isOpen: boolean;
  asset: Asset | null;
  onSave: (data: UpdateAssetCommand) => Promise<boolean>;
  onCancel: () => void;
}

const AssetEditDialog: React.FC<AssetEditDialogProps> = ({ isOpen, asset, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UpdateAssetCommand>({
    id: '',
    locationId: '',
    name: '',
    description: '',
    model: '',
    manufacturerId: '',
    serialNumber: '',
    category: '',
    area: '',
    barcode: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        id: asset.id,
        locationId: asset.locationId,
        name: asset.name || '',
        description: asset.description || '',
        model: asset.model || '',
        manufacturerId: asset.manufacturerId || '',
        serialNumber: asset.serialNumber || '',
        category: asset.category || '',
        area: asset.area || '',
        barcode: asset.barcode || '',
      });
    }
  }, [asset]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Asset</h2>

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
                placeholder="Asset name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Asset description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Asset model"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Serial Number</label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Serial number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Asset category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Area</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Asset area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Barcode</label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Asset barcode"
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

export default AssetEditDialog;
