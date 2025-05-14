import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const AlertCircleIcon = getIcon('AlertCircle');

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-50 dark:bg-surface-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center"
      >
        <div className="flex justify-center mb-6">
          <AlertCircleIcon className="w-16 h-16 text-accent" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-surface-800 dark:text-surface-100">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-surface-700 dark:text-surface-200">Page Not Found</h2>
        <p className="mb-8 text-surface-600 dark:text-surface-400">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-block">Return to Dashboard</Link>
      </motion.div>
    </div>
  );
};

export default NotFound;