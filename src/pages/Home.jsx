import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import Clock from '../components/Clock';

// Icon definitions
const CheckCheckIcon = getIcon('CheckCheck');
const LayersIcon = getIcon('Layers');
const ListChecksIcon = getIcon('ListChecks');
const ChevronRightIcon = getIcon('ChevronRight');

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

const Home = () => {
  const [stats, setStats] = useState({
    tasks: 0,
    completed: 0,
    inProgress: 0
  });

  const updateStats = (newTasks) => {
    setStats({
      tasks: newTasks.length,
      completed: newTasks.filter(task => task.status === 'completed').length,
      inProgress: newTasks.filter(task => task.status === 'in-progress').length
    });
  };

  useEffect(() => {
    // Welcome toast on first visit
    const hasVisited = localStorage.getItem('hasVisitedTaskFlow');
    if (!hasVisited) {
      setTimeout(() => {
        toast.info("Welcome to TaskFlow! Create your first task to get started.", {
          icon: "👋"
        });
        localStorage.setItem('hasVisitedTaskFlow', 'true');
      }, 1000);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LayersIcon className="w-6 h-6" />
            <h1 className="text-xl md:text-2xl font-bold">TaskFlow</h1>
            <Clock />
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

        <MainFeature onTasksUpdate={updateStats} />
      </main>
    </div>
  );
};

export default Home;