import Label from '../form/Label';
import { Modal } from '../ui/modal';
import Select from '../form/Select';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea';
import UpFile10 from '../upload/UpFile10';
import { useRequestsApi } from '../../services/requests';
import { useState, useEffect } from 'react';
import { Request, UpdateRequestCommand } from '../../types/api';

interface ModalEditRequestProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestUpdated?: () => void;
  request?: Request;
}

export default function ModalEditRequest({
  isOpen,
  onClose,
  onRequestUpdated,
  request,
}: ModalEditRequestProps) {
  const { updateRequest, loading, error } = useRequestsApi();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 0,
    assetId: '',
    images: [] as string[],
  });

  useEffect(() => {
    if (request) {
      setFormData({
        title: request.title || '',
        description: request.description || '',
        priority:
          request.priority === 0
            ? 'low'
            : request.priority === 1
              ? 'medium'
              : request.priority === 2
                ? 'high'
                : 'urgent',
        category: request.category || 0,
        assetId: request.assetId?.toString() || '',
        images: request.images || [],
      });
    }
  }, [request]);

  const handleSelectChange12 = (value: string) => {
    console.log('Selected value:', value);
    setFormData((prev) => ({ ...prev, priority: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!request) {
      console.error('No request data provided');
      return;
    }

    try {
      const requestData: UpdateRequestCommand = {
        id: request.id,
        title: formData.title || undefined,
        description: formData.description || undefined,
        status: request.status,
        priority:
          formData.priority === 'low'
            ? 0
            : formData.priority === 'medium'
              ? 1
              : formData.priority === 'high'
                ? 2
                : 3,
        category: formData.category,
        assetId: formData.assetId || undefined,
        images: formData.images,
      };

      console.log('Updating request:', requestData);
      await updateRequest(requestData);
      console.log('✅ Request updated successfully');

      // Close modal
      onClose();

      // Call callback to refresh the table
      if (onRequestUpdated) {
        onRequestUpdated();
      }
    } catch (error) {
      console.error('❌ Failed to update request:', error);
      alert('Failed to update request. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] m-4">
      <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Request
          </h4>
        </div>
        <div className="w-full border-b border-[#F3F3F3]" />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="custom-scrollbar h-[500px] overflow-y-auto px-2 pb-3">
            <div className="mt-7 space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter title"
                  className="w-full"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <TextArea
                  placeholder="Enter description"
                  rows={4}
                  className="w-full resize-none"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Priority Field */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                  placeholder="Select priority"
                  onChange={handleSelectChange12}
                  className="w-full"
                  value={formData.priority}
                />
              </div>

              {/* Asset Field */}
              <div className="space-y-2">
                <Label htmlFor="assetId">Asset</Label>
                <Input
                  id="assetId"
                  name="assetId"
                  placeholder="Enter asset ID"
                  className="w-full"
                  value={formData.assetId}
                  onChange={handleInputChange}
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Image</Label>
                <UpFile10
                  onFilesSelected={(files) => {
                    console.log('Image files selected:', files);
                    // Convert files to URLs if needed
                    const fileUrls = files.map((file) => URL.createObjectURL(file));
                    setFormData((prev) => ({ ...prev, images: fileUrls }));
                  }}
                />
              </div>

              {/* Files Upload Section */}
              <div className="space-y-2">
                <Label>Files</Label>
                <UpFile10 onFilesSelected={(files) => console.log('Files selected:', files)} />
              </div>
            </div>

            <div className="w-full flex items-center justify-end gap-2 md:gap-4 md:mt-3 mt-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-white px-2 py-2 rounded border border-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center px-2 py-2 rounded-[4px] ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'border border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                {loading ? 'Updating...' : 'Update Request'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
