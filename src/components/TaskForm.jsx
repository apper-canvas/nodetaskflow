import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { createTask } from '../services/taskService';

// Icon definitions
const PlusIcon = getIcon('Plus');
const ClipboardListIcon = getIcon('ClipboardList');

const TaskForm = ({ onTaskCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'not-started'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create task in the database
      const createdTask = await createTask(newTask);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'not-started'
      });
      
      // Notify parent component
      if (onTaskCreated) {
        onTaskCreated(createdTask);
      }
      
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neu-card"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
          <ClipboardListIcon className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Create New Task</h2>
      </div>

      <form onSubmit={handleAddTask} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1 ml-1">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            placeholder="What needs to be done?"
            className="input"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1 ml-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={newTask.priority}
              onChange={handleInputChange}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1 ml-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleInputChange}
              className="input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 ml-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            placeholder="Add details about this task"
            className="input min-h-[80px] resize-y"
          ></textarea>
        </div>

        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary w-full flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Adding Task...</span>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>Add Task</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;