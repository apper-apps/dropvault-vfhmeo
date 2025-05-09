import { useState } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home() {
  const [activeTab, setActiveTab] = useState('files');
  
  // Icon component declarations
  const FileIcon = getIcon('File');
  const FolderIcon = getIcon('Folder');
  const ShareIcon = getIcon('Share2');
  const StarIcon = getIcon('Star');
  
  const tabs = [
    { id: 'files', label: 'My Files', icon: FileIcon },
    { id: 'recent', label: 'Recent', icon: FileIcon },
    { id: 'shared', label: 'Shared', icon: ShareIcon },
    { id: 'favorites', label: 'Favorites', icon: StarIcon },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-20">
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-3 mb-4">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-5">
              <div className="mb-3">
                <h3 className="text-lg font-semibold mb-1">Storage</h3>
                <p className="text-sm text-surface-500">Using 3.5 GB of 15 GB</p>
              </div>
              
              <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-2.5 mb-4">
                <div className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileIcon size={16} className="text-primary" />
                    <span>Documents</span>
                  </div>
                  <span>1.2 GB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FolderIcon size={16} className="text-secondary" />
                    <span>Media</span>
                  </div>
                  <span>2.1 GB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileIcon size={16} className="text-accent" />
                    <span>Other</span>
                  </div>
                  <span>0.2 GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MainFeature />
          </motion.div>
          
          {/* Recently uploaded files - only shown if we have files */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Your Files</h2>
            
            <div className="bg-surface-50 dark:bg-surface-900 rounded-xl border border-dashed border-surface-300 dark:border-surface-700 p-8 text-center">
              <div className="flex justify-center mb-3 text-surface-400">
                <FileIcon size={40} />
              </div>
              <h3 className="text-lg font-medium mb-1">No files yet</h3>
              <p className="text-surface-500 dark:text-surface-400 mb-4">
                Upload files to see them here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;