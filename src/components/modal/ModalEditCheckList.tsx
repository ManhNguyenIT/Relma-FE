import { useState, useEffect } from 'react';
import Label from '../form/Label';
import { Modal } from '../ui/modal';
import Select from '../form/Select';
import { GoPlus } from 'react-icons/go';
import Input from '../form/input/InputField';

import TaskPreview from '../checklist/TaskPreview';
import { useChecklistsApi } from '../../services/checklists';
import { ChecklistResponse, UpdateChecklistCommand, Task } from '../../types/api';

interface OptionType {
  value: string;
  label: string;
}

interface ModalEditCheckListProps {
  isOpen: boolean;
  onClose: () => void;
  checklist?: ChecklistResponse | null;
  onChecklistUpdated?: () => void;
}

export default function ModalEditCheckList({
  isOpen,
  onClose,
  checklist,
  onChecklistUpdated,
}: ModalEditCheckListProps) {
  const { updateChecklist, loading } = useChecklistsApi();

  const [formData, setFormData] = useState<UpdateChecklistCommand>({
    id: '',
    name: '',
    description: '',
    workOrderId: undefined,
    tasks: [],
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load checklist data when modal opens
  useEffect(() => {
    if (checklist && isOpen) {
      console.log('📋 Loading checklist data:', checklist);
      console.log('📋 Checklist tasks:', checklist.tasks);
      console.log('📋 Checklist tags:', checklist.tags);
      console.log(
        '📋 Checklist workOrderId:',
        checklist.workOrderId,
        'type:',
        typeof checklist.workOrderId,
      );

      setFormData({
        id: checklist.id,
        name: checklist.name || '',
        description: checklist.description || '',
        workOrderId: checklist.workOrderId,
        tasks: checklist.tasks?.map((task) => task.id) || [],
      });
      setTasks(checklist.tasks || []);
      setSelectedTags(checklist.tags || []); // Load tags from checklist

      console.log('📋 Tasks set to:', checklist.tasks || []);
      console.log('📋 Tags set to:', checklist.tags || []);
    }
  }, [checklist, isOpen]);

  const options12: OptionType[] = [
    { value: 'tranlinh', label: 'Trần Linh' },
    { value: 'template', label: 'A' },
    { value: 'development', label: 'B' },
  ];

  const handleSelectChange12 = (value: string) => {
    console.log('Selected value:', value);
  };

  const handleInputChange =
    (field: keyof UpdateChecklistCommand) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleConfirm = async () => {
    if (!formData.name?.trim()) {
      alert('Please enter a checklist name');
      return;
    }

    try {
      setIsSubmitting(true);

      const updateData = {
        ...formData,
        tasks: tasks.map((task) => task.id),
        tags: selectedTags,
      };

      // Filter out undefined values
      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined),
      ) as unknown as UpdateChecklistCommand;

      console.log('📝 Updating checklist with data:', updateData);
      console.log('📝 Filtered data:', filteredUpdateData);
      console.log(
        '📝 workOrderId value:',
        updateData.workOrderId,
        'type:',
        typeof updateData.workOrderId,
      );
      console.log(
        '📝 formData.workOrderId:',
        formData.workOrderId,
        'type:',
        typeof formData.workOrderId,
      );

      const result = await updateChecklist(filteredUpdateData);
      console.log('✅ Checklist updated successfully:', result);

      // Reset form
      setFormData({
        id: '',
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
      if (onChecklistUpdated) {
        onChecklistUpdated();
      }

      // Show success message
      alert('Checklist updated successfully!');
    } catch (error) {
      console.error('❌ Failed to update checklist:', error);
      alert('Failed to update checklist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: '',
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
      <div className="no-scrollbar relative w-full overflow-y-auto  bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Checklist
          </h4>
        </div>
        <div className="w-full border-b border-[#F3F3F3]" />

        <form className="flex flex-col" onSubmit={handleFormSubmit}>
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="mt-7 grid grid-cols-1 gap-3 md:flex items-center w-full md:gap-3">
              <div className="flex-1">
                <div className="flex flex-col items-center md:gap-3 gap-3 w-full mx-auto md:max-w-xl">
                  <div className="w-full">
                    <Label>Name</Label>
                    <Input
                      value={formData.name || ''}
                      onChange={handleInputChange('name')}
                      placeholder="Enter checklist name"
                    />
                  </div>
                  <div className="w-full">
                    <Label>Description</Label>
                    <textarea
                      value={formData.description || ''}
                      onChange={handleInputChange('description')}
                      placeholder="Enter checklist description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div className="w-full">
                    <Label>Tags</Label>
                    <Select
                      options={options12}
                      placeholder="Select an option"
                      onChange={handleSelectChange12}
                      className="dark:bg-dark-900 w-full"
                    />
                  </div>
                  <div className="w-full flex items-center md:justify-end">
                    <button
                      type="button"
                      className="rounded bg-blue-500 px-4 py-2 text-white flex items-center gap-2"
                    >
                      <GoPlus />
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full mx-auto">
                <TaskPreview
                  key={checklist?.id || 'new'}
                  tasks={checklist?.tasks || []}
                  onTasksChange={setTasks}
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-end gap-2 md:gap-4 md:mt-3 mt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-white px-2 py-2 rounded border border-gray-300"
              >
                Cancel
              </button>
              <button
                className={`border border-[#1677FF] bg-[#1677FF] text-white flex items-center justify-center px-2 py-2 rounded-[4px] hover:bg-[#0d5bb8] ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Updating...' : 'Save Checklist'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
