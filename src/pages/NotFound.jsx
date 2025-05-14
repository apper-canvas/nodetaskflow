import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icon definitions
const AlertCircleIcon = getIcon('AlertCircle');
const HomeIcon = getIcon('Home');

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full neu-card text-center"
      >
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-surface-200 dark:bg-surface-700 p-4 mb-4">
            <AlertCircleIcon className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="btn-primary flex items-center space-x-2"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Go Home</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;