import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-lg font-medium text-white"
    >
      {currentTime.format('HH:mm:ss')}
    </motion.div>
  );
};
export default Clock;