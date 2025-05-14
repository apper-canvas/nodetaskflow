import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import getIcon from '../utils/iconUtils';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

// Icon definitions
const CheckCheckIcon = getIcon('CheckCheck');
const LayersIcon = getIcon('Layers');
const ListChecksIcon = getIcon('ListChecks');
const ChevronRightIcon = getIcon('ChevronRight');
const LogOutIcon = getIcon('LogOut');
const UserIcon = getIcon('User');

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    tasks: 0,
    completed: 0,
    inProgress: 0
  });

  const updateStats = (tasks) => {
    setStats({
      tasks: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length
    });
  };

  const handleTaskCreated = () => {
    // Trigger a refresh of the task list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LayersIcon className="w-6 h-6" />
            <h1 className="text-xl md:text-2xl font-bold">TaskFlow</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center mr-4 text-white/90">
              <UserIcon className="w-4 h-4 mr-1" />
              <span>{user?.firstName || 'User'}</span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 text-sm transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="neu-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Total Tasks</h3>
              <ListChecksIcon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.tasks}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="neu-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Completed</h3>
              <CheckCheckIcon className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.completed}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="neu-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">In Progress</h3>
              <ChevronRightIcon className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
          </motion.div>
        </motion.div>

        <div className="flex flex-col space-y-8">
          <TaskForm onTaskCreated={handleTaskCreated} />
          <TaskList shouldRefresh={refreshTrigger} onStatsUpdate={updateStats} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;