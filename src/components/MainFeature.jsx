import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

// Icon definitions
const PlusIcon = getIcon('Plus');
const TrashIcon = getIcon('Trash2');
const EditIcon = getIcon('Pencil');
const CheckIcon = getIcon('Check');
const ClockIcon = getIcon('Clock');
const AlertTriangleIcon = getIcon('AlertTriangle');
const XIcon = getIcon('X');
const FlagIcon = getIcon('Flag');
const CheckCircleIcon = getIcon('CheckCircle');
const ClipboardListIcon = getIcon('ClipboardList');
const SaveIcon = getIcon('Save');
const InboxIcon = getIcon('Inbox');

const MainFeature = ({ onTasksUpdate }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'not-started'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
    onTasksUpdate(tasks);
  }, [tasks, onTasksUpdate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }
    
    const task = {
      id: Date.now().toString(),
      ...newTask,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString()
    };
    
    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'not-started'
    });
    
    toast.success("Task added successfully!");
  };
  
  const handleDelete = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
  };
  
  const handleStatusChange = (id, newStatus) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { 
              ...task, 
              status: newStatus, 
              modifiedDate: new Date().toISOString(),
              completedOn: newStatus === 'completed' ? new Date().toISOString() : null
            } 
          : task
      )
    );
    
    const statusMessages = {
      'not-started': "Task marked as not started",
      'in-progress': "Task moved to in progress",
      'completed': "Task completed! 🎉"
    };
    
    toast.info(statusMessages[newStatus]);
  };
  
  const startEditing = (task) => {
    setEditingTask({ ...task });
    setIsEditing(true);
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const saveEdit = () => {
    if (!editingTask.title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }
    
    setTasks(prev => 
      prev.map(task => 
        task.id === editingTask.id 
          ? { ...editingTask, modifiedDate: new Date().toISOString() } 
          : task
      )
    );
    
    setIsEditing(false);
    setEditingTask(null);
    toast.success("Task updated successfully!");
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingTask(null);
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="flex flex-col space-y-8">
      {/* Task Creation Form */}
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
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Task</span>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Task List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <InboxIcon className="w-5 h-5 text-primary" />
            <span>Your Tasks</span>
            <span className="text-sm bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-md ml-2">
              {filteredTasks.length}
            </span>
          </h2>
          
          {/* Filter Controls */}
          <div className="flex rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium ${filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('not-started')}
              className={`px-3 py-1.5 text-sm font-medium ${filter === 'not-started' 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              Not Started
            </button>
            <button 
              onClick={() => setFilter('in-progress')}
              className={`px-3 py-1.5 text-sm font-medium ${filter === 'in-progress' 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-sm font-medium ${filter === 'completed' 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
            >
              Completed
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center neu-card">
            <div className="rounded-full bg-surface-100 dark:bg-surface-800 p-4 mb-4">
              <InboxIcon className="w-12 h-12 text-surface-400 dark:text-surface-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md">
              {filter === 'all' 
                ? "You don't have any tasks yet. Create your first task to get started!"
                : `You don't have any ${filter.replace('-', ' ')} tasks.`}
            </p>
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            <AnimatePresence>
              {filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`neu-card relative overflow-hidden ${
                    task.status === 'completed' ? 'border-l-4 border-green-500' : 
                    task.status === 'in-progress' ? 'border-l-4 border-blue-500' : 
                    'border-l-4 border-amber-500'
                  }`}
                >
                  {isEditing && editingTask?.id === task.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="title"
                        value={editingTask.title}
                        onChange={handleEditChange}
                        className="input"
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 ml-1">
                            Priority
                          </label>
                          <select
                            name="priority"
                            value={editingTask.priority}
                            onChange={handleEditChange}
                            className="input"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1 ml-1">
                            Due Date
                          </label>
                          <input
                            type="date"
                            name="dueDate"
                            value={editingTask.dueDate}
                            onChange={handleEditChange}
                            className="input"
                          />
                        </div>
                      </div>
                      
                      <textarea
                        name="description"
                        value={editingTask.description}
                        onChange={handleEditChange}
                        className="input min-h-[80px]"
                        placeholder="Description"
                      ></textarea>
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <button 
                          onClick={cancelEdit}
                          className="btn-outline flex items-center space-x-1"
                        >
                          <XIcon className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <button 
                          onClick={saveEdit}
                          className="btn-primary flex items-center space-x-1"
                        >
                          <SaveIcon className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-4">
                          <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-surface-500 dark:text-surface-400' : ''}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`mt-2 text-surface-600 dark:text-surface-400 ${task.status === 'completed' ? 'line-through' : ''}`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEditing(task)}
                            className="p-2 text-surface-500 hover:text-primary rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                            aria-label="Edit task"
                          >
                            <EditIcon className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(task.id)}
                            className="p-2 text-surface-500 hover:text-accent rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                            aria-label="Delete task"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className={`flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            getPriorityColor(task.priority) === 'text-red-500' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                              : getPriorityColor(task.priority) === 'text-amber-500'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          }`}>
                            <FlagIcon className="w-3 h-3 mr-1" />
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </div>
                          
                          {task.dueDate && (
                            <div className="flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                              <ClockIcon className="w-3 h-3 mr-1" />
                              {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStatusChange(task.id, 'not-started')}
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              task.status === 'not-started' 
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' 
                                : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                            }`}
                          >
                            <AlertTriangleIcon className="w-3 h-3 inline mr-1" />
                            To Do
                          </button>
                          
                          <button
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              task.status === 'in-progress' 
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                                : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                            }`}
                          >
                            <ClockIcon className="w-3 h-3 inline mr-1" />
                            In Progress
                          </button>
                          
                          <button
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              task.status === 'completed' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                            }`}
                          >
                            <CheckCircleIcon className="w-3 h-3 inline mr-1" />
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MainFeature;