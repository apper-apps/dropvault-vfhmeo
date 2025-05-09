import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const navigate = useNavigate();
  
  // Icon component declarations
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const FileQuestionIcon = getIcon('FileQuestion');
  
  useEffect(() => {
    document.title = 'Page Not Found - DropVault';
    
    const timer = setTimeout(() => {
      // No auto-redirect to avoid user confusion
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-primary dark:text-primary-light mb-6"
      >
        <FileQuestionIcon size={80} />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-medium mb-6">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to managing your files.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
        >
          <ArrowLeftIcon size={18} />
          <span>Return Home</span>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;