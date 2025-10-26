import { useState } from 'react';
import Label from '../form/Label';
import { Modal } from '../ui/modal';
import Select from '../form/Select';
import Input from '../form/input/InputField';
import TaskPreview from '../checklist/TaskPreview';
import CheckListAccor from '../checklist/CheckListAccor';
import { GoPlus } from 'react-icons/go';
import { useChecklistsApi } from '../../services/checklists';
import { CreateChecklistCommand, Task } from '../../types/api';

interface OptionType {
  value: string;
  label: string;
}

interface ModalCreateCheckListProps {
  isOpen: boolean;
  onClose: () => void;
  onChecklistCreated?: () => void;
}

export default function ModalCreateCheckList({
  isOpen,
  onClose,
  onChecklistCreated,
}: ModalCreateCheckListProps) {
  console.log('🔍 ModalCreateCheckList rendering...');
  const { createChecklist, loading, error } = useChecklistsApi();
  console.log('🔍 API hook loaded:', { createChecklist, loading, error });

  const [formData, setFormData] = useState<CreateChecklistCommand>({
    name: '',
    description: '',
    workOrderId: undefined,
    tasks: [],
  });

  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options10: OptionType[] = [
    { value: 'tranlinh', label: 'Trần Linh' },
    { value: 'template', label: 'Template' },
    { value: 'development', label: 'Development' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inspection', label: 'Inspection' },
  ];

  const handleTagAdd = (value: string) => {
    console.log('Adding tag:', value);
    setSelectedTags((prev) => {
      if (!prev.includes(value)) {
        // Only add if not already selected
        return [...prev, value];
      }
      return prev; // No change if already exists
    });
  };

  const handleTagRemove = (value: string) => {
    console.log('Removing tag:', value);
    setSelectedTags((prev) => prev.filter((tag) => tag !== value));
  };

  const handleInputChange =
    (field: keyof CreateChecklistCommand) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent form submission from causing page reload
  };

  const handleConfirm = async () => {
    if (!formData.name?.trim()) {
      alert('Please enter a checklist name');
      return;
    }

    try {
      setIsSubmitting(true);

      // Use task IDs from TaskPreview component
      const checklistData = {
        ...formData,
        tasks: tasks.map((task) => task.id), // Extract only task IDs
        tags: selectedTags, // Include selected tags
      };

      console.log('📝 Creating checklist with data:', checklistData);
      console.log('🔍 Form data before sending:', formData);
      console.log('🔍 Description value:', formData.description);
      console.log('🔍 Description type:', typeof formData.description);
      console.log('🔍 Description length:', formData.description?.length);

      const result = await createChecklist(checklistData);
      console.log('✅ Checklist created successfully:', result);
      console.log('🔍 API Response:', result);
      console.log('🔍 Response type:', typeof result);

      // Reset form
      setFormData({
        name: '',
        description: '',
        workOrderId: undefined,
        tasks: [],
      });
      setTasks([]);
      setSelectedTags([]);

      // Close modal
      onClose();

      // Notify parent to refresh checklist list
      if (onChecklistCreated) {
        onChecklistCreated();
      }

      // Show success message
      alert('Checklist created successfully!');
    } catch (error) {
      console.error('❌ Failed to create checklist:', error);
      alert('Failed to create checklist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: '',
      description: '',
      workOrderId: undefined,
      tasks: [],
    });
    setTasks([]);
    setSelectedTags([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="fixed inset-0 w-full h-full m-0 p-0">
      <div className="no-scrollbar relative w-full  overflow-y-auto  bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Create Checklist
          </h4>
        </div>
        <div className="w-full border-b border-[#F3F3F3]" />

        <form className="flex flex-col" onSubmit={handleFormSubmit}>
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="mt-7 grid grid-cols-1 gap-3 md:flex items-start w-full md:gap-3">
              <div className="flex-1">
                <div className="flex flex-col gap-3 w-full mx-auto md:max-w-xl md:gap-3 gap-3">
                  <div>
                    <CheckListAccor />
                  </div>
                  <div>Checklist Details</div>
                  <div className="w-full">
                    <Label>Name</Label>
                    <Input
                      value={formData.name || ''}
                      onChange={handleInputChange('name')}
                      // onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      //   if (e.key === 'Enter') {
                      //     e.preventDefault();
                      //   }
                      // }}
                      placeholder="Enter checklist name"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <textarea
                      value={formData.description || ''}
                      onChange={handleInputChange('description')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter checklist description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div className="w-full">
                    <Label>Tags</Label>
                    <div className="space-y-2">
                      {/* Selected Tags Display */}
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => {
                            const tagOption = options10.find((opt) => opt.value === tag);
                            return (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {tagOption?.label || tag}
                                <button
                                  type="button"
                                  onClick={() => handleTagRemove(tag)}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Tag Selection */}
                      <Select
                        options={options10}
                        placeholder="Select tags..."
                        onChange={handleTagAdd}
                        className="dark:bg-dark-900 w-full"
                      />
                    </div>
                  </div>
                  <div className="w-full flex items-center md:justify-end">
                    <button
                      className="border border-[#1677FF] bg-[#1677FF] text-white flex items-center justify-center px-2 py-2 rounded-[4px]"
                      type="button"
                    >
                      <GoPlus />
                      Add Task
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full mx-auto">
                <TaskPreview onTasksChange={setTasks} />
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-end gap-2 md:gap-4 mt-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white px-2 py-2 rounded border border-gray-300 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`border border-[#1677FF] bg-[#1677FF] text-white flex items-center justify-center px-2 py-2 rounded-[4px] hover:bg-[#0d5bb8] ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? 'Creating...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
