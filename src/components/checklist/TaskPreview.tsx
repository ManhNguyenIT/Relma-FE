import { useState, useEffect, useRef } from 'react';
import Select from '../form/Select';
import { LuClipboardCheck } from 'react-icons/lu';
import { LuClipboardPen } from 'react-icons/lu';
import { LuPlus } from 'react-icons/lu';
import { LuTrash2 } from 'react-icons/lu';
import { useTasksApi } from '../../services/tasks';
import { Task, CreateTaskCommand } from '../../types/api';

interface TaskPreviewProps {
  tasks?: Task[];
  onTasksChange?: (tasks: Task[]) => void;
}

export default function TaskPreview({ tasks: initialTasks, onTasksChange }: TaskPreviewProps) {
  const { createTask, updateTask, deleteTask } = useTasksApi();

  console.log('🔄 TaskPreview render with initialTasks:', initialTasks);

  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Sync with initialTasks when they change
  useEffect(() => {
    if (initialTasks) {
      console.log('🔄 TaskPreview: Loading initial tasks:', initialTasks);
      setTasks(initialTasks);
    }
  }, [initialTasks]);
  const editFormRef = useRef<HTMLDivElement>(null);

  interface OptionType {
    value: string;
    label: string;
  }

  const options12: OptionType[] = [
    { value: 'tranlinh', label: 'Trần Linh' },
    { value: 'template', label: 'A' },
    { value: 'development', label: 'B' },
  ];

  const handleSelectChange12 = (value: string) => {
    console.log('Selected value:', value);
  };

  // Handle click outside to close edit form
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editFormRef.current && !editFormRef.current.contains(event.target as Node)) {
        if (editingTaskId) {
          setEditingTaskId(null);
          setEditingContent('');
        }
      }
    };

    if (editingTaskId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingTaskId]);

  // Notify parent when tasks change
  useEffect(() => {
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);

  const handleAddTask = () => {
    setIsAddingTask(true);
    setNewTaskContent('');
  };

  const handleSaveNewTask = async () => {
    if (!newTaskContent.trim()) return;

    try {
      console.log('📝 Creating new task with content:', newTaskContent);

      // Create task command
      const createTaskCommand: CreateTaskCommand = {
        type: 1,
        value: newTaskContent,
      };
      console.log('📤 Create command:', createTaskCommand);

      // Call API to create task
      const createdTaskId = await createTask(createTaskCommand);
      console.log('✅ Task created successfully with ID:', createdTaskId);

      // Create task object with real ID from API response
      const newTask: Task = {
        id: String(createdTaskId),
        assetId: undefined, // Default empty string
        type: 1,
        value: newTaskContent,
      };
      console.log('🔍 New task object:', newTask);

      // Add to local state with real ID
      setTasks((prev) => [...prev, newTask]);

      setIsAddingTask(false);
      setNewTaskContent('');
    } catch (error) {
      const err = error as {
        message?: string;
        response?: { status?: number; data?: unknown };
        stack?: string;
      };
      console.error('❌ Failed to create task:', error);
      console.error('❌ Create error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        stack: err.stack,
      });
      alert(`Failed to create task: ${err.message || 'Unknown error'}`);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingTask(false);
    setNewTaskContent('');
  };

  const handleEditTask = (taskId: string, currentContent: string) => {
    console.log('🔧 Edit task clicked:', taskId, currentContent);
    setEditingTaskId(taskId);
    setEditingContent(currentContent);
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!editingContent.trim()) return;

    try {
      console.log('📝 Updating task:', taskId, 'with content:', editingContent);

      // Find the task to get current data
      const currentTask = tasks.find((task) => task.id === taskId);
      if (!currentTask) {
        console.error('Task not found:', taskId);
        return;
      }

      console.log('🔍 Current task data:', currentTask);

      // Prepare update command
      const updateCommand = {
        id: taskId,
        assetId: currentTask.assetId,
        type: currentTask.type,
        value: editingContent,
      };
      console.log('📤 Update command:', updateCommand);

      // Call API to update task
      const updatedTaskId = await updateTask(updateCommand);
      console.log('✅ Task updated successfully with ID:', updatedTaskId);

      // Update local state with new content
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, value: editingContent } : task)),
      );

      setEditingTaskId(null);
      setEditingContent('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorObj = error as { response?: { status?: number; data?: unknown }; stack?: string };
      console.error('❌ Failed to update task:', error);
      console.error('❌ Error details:', {
        message: errorMessage,
        status: errorObj.response?.status,
        data: errorObj.response?.data,
        stack: errorObj.stack,
      });
      alert(`Failed to update task: ${errorMessage}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingContent('');
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa task này?')) return;

    try {
      console.log('🗑️ Deleting task:', taskId);

      // Call API to delete task
      await deleteTask({ ids: [taskId] });
      console.log('✅ Task deleted successfully');

      // Remove from local state
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('❌ Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };
  return (
    <div className="w-full bg-[#dddddd] p-6 flex items-center justify-center ">
      <div className=" border-solid border-2 border-white shadow-2xl bg-[#dddddd] rounded-[8px] flex flex-col w-full h-[600px] md:max-w-xl ">
        <div className="flex items-center md:gap-2 gap-2 p-2 bg-white w-full">
          <LuClipboardCheck size={30} />
          Task Preview
        </div>
        <div className="w-full border-b border-[#F3F3F3]" />

        {/* Tasks List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {tasks.map((task) => {
            console.log(
              '🔍 Rendering task:',
              task.id,
              'value:',
              task.value,
              'value type:',
              typeof task.value,
              'editingTaskId:',
              editingTaskId,
              'isEditing:',
              editingTaskId === task.id,
            );
            return (
              <div
                key={task.id}
                className="bg-[#f8f9f9] p-2 flex items-center justify-between w-full rounded"
              >
                <div className="flex flex-col md:gap-2 gap-2 w-full">
                  {editingTaskId === task.id ? (
                    <div
                      ref={editFormRef}
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(task.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập nội dung task..."
                        autoFocus
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit(task.id);
                        }}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-800">
                      {task.value && typeof task.value === 'string'
                        ? task.value
                        : task.value
                          ? String(task.value)
                          : `Task ${task.id}`}
                    </div>
                  )}
                  <div>
                    <Select
                      options={options12}
                      placeholder="Open"
                      onChange={handleSelectChange12}
                      className="dark:bg-dark-900 w-full md:w-32 md:rounded-full"
                    />
                  </div>
                </div>
                <div className="w-full flex items-center md:gap-2 gap-2 justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTask(task.id, typeof task.value === 'string' ? task.value : '');
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Edit task"
                  >
                    <LuClipboardPen size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(task.id);
                    }}
                    className="p-1 hover:bg-red-200 rounded text-red-600"
                    title="Delete task"
                  >
                    <LuTrash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Task Form */}
          {isAddingTask && (
            <div className="bg-blue-50 p-2 flex items-center justify-between w-full rounded border border-blue-200">
              <div className="flex flex-col md:gap-2 gap-2 w-full">
                <input
                  type="text"
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  placeholder="Nhập nội dung task mới..."
                  autoFocus
                />
                <div>
                  <Select
                    options={options12}
                    placeholder="Open"
                    onChange={handleSelectChange12}
                    className="dark:bg-dark-900 w-full md:w-32 md:rounded-full"
                  />
                </div>
              </div>
              <div className="w-full flex items-center md:gap-2 gap-2 justify-end">
                <button
                  onClick={handleSaveNewTask}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Task Button */}
        <div className="p-2 border-t border-[#F3F3F3]">
          <button
            onClick={handleAddTask}
            disabled={isAddingTask}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuPlus size={20} />
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
