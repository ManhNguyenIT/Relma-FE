import { useState } from 'react';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea';
import { client } from '../../services/api';
import { Location } from '../../types/response';

interface ModalCreateLocationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCreateLocation({
  isOpen,
  onClose,
  onSuccess,
}: ModalCreateLocationProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError('Địa chỉ là bắt buộc');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await client.post<Location>('/api/v1/locations', {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      // Reset form
      setFormData({ name: '', description: '' });

      // Call success callback
      console.log('Calling onSuccess with:', response);
      onSuccess();

      // Close modal
      onClose();
    } catch (err: unknown) {
      console.error('Error creating location:', err);
      let errorMessage = 'Có lỗi xảy ra khi tạo địa điểm';

      if (err && typeof err === 'object' && 'response' in err) {
        const errorWithResponse = err as { response?: { data?: { message?: string } } };
        errorMessage = errorWithResponse.response?.data?.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({ name: '', description: '' });
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="fixed inset-0 w-full h-full m-0 p-0">
      <div className="no-scrollbar relative w-full  overflow-y-auto bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Create Location
          </h4>
        </div>
        <div className="w-full border-b border-[#F3F3F3]" />

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="mt-7 mx-auto max-w-2xl">
              {/* Location Information Form Card */}
              <div className="p-6 bg-white rounded-[16px] border border-[#D9D9D9] shadow-md mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Location Information</h2>

                <div className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Address Field */}
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Address"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Description Field */}
                  <div>
                    <Label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </Label>
                    <div className="mt-1">
                      <TextArea
                        id="description"
                        value={formData.description}
                        onChange={(value) =>
                          setFormData((prev) => ({ ...prev, description: value }))
                        }
                        placeholder="Description"
                        rows={4}
                        className="w-full resize-none"
                      />
                    </div>
                  </div>

                  {/* Add from Saved Files Link */}
                  <div className="pt-2">
                    <button
                      type="button"
                      className="text-[#007FE6] hover:text-[#0056b3] text-sm font-medium cursor-pointer"
                    >
                      Add from Saved Files
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-end gap-2 md:gap-4 md:mt-3 mt-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="bg-white px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="border border-[#0C6FF9] bg-[#0C6FF9] text-white flex items-center justify-center px-4 py-2 rounded-[4px] hover:bg-[#0056b3] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang tạo...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
