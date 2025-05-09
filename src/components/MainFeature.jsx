import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  
  // Icon component declarations
  const UploadCloudIcon = getIcon('UploadCloud');
  const FileIcon = getIcon('File');
  const ImageIcon = getIcon('Image');
  const AudioIcon = getIcon('Music');
  const VideoIcon = getIcon('Video');
  const DocumentIcon = getIcon('FileText');
  const XIcon = getIcon('X');
  const AlertCircleIcon = getIcon('AlertCircle');
  const CheckCircleIcon = getIcon('CheckCircle');
  
  // Get icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return ImageIcon;
    if (fileType.startsWith('audio/')) return AudioIcon;
    if (fileType.startsWith('video/')) return VideoIcon;
    if (fileType.includes('document') || fileType.includes('pdf') || fileType.includes('text')) return DocumentIcon;
    return FileIcon;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  // Process files
  const processFiles = (selectedFiles) => {
    if (selectedFiles.length === 0) return;
    
    // Create file objects with additional metadata
    const newFiles = selectedFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      uploaded: false,
      error: null,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload for each file
    newFiles.forEach(fileObj => {
      simulateFileUpload(fileObj.id);
    });
    
    toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} added for upload`);
  };

  // Simulate file upload with progress
  const simulateFileUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setFiles(prev => 
          prev.map(f => 
            f.id === fileId ? { ...f, progress: 100, uploaded: true } : f
          )
        );
        
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: 100
        }));
        
        // Success message after completion
        toast.success("File uploaded successfully!");
      } else {
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: progress
        }));
        
        setFiles(prev => 
          prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          )
        );
      }
    }, 600);
  };

  // Remove file from the list
  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.info("File removed from queue");
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Upload Files</h1>
            <p className="text-surface-500 dark:text-surface-400">
              Drag &amp; drop files or browse to upload
            </p>
          </div>
        </div>
        
        {/* Drag & Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all text-center ${
            isDragging 
              ? 'border-primary bg-primary/5 dark:bg-primary/10' 
              : 'border-surface-300 dark:border-surface-600 hover:border-primary dark:hover:border-primary hover:bg-surface-50 dark:hover:bg-surface-700/50'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          
          <div className="flex flex-col items-center justify-center py-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`text-5xl mb-4 ${isDragging ? 'text-primary' : 'text-surface-400 dark:text-surface-500'}`}
            >
              <UploadCloudIcon size={64} />
            </motion.div>
            
            <h3 className="text-lg font-medium mb-2">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </h3>
            
            <p className="text-surface-500 dark:text-surface-400 max-w-md mb-4">
              Upload any file type. Files will be securely stored and organized in your vault.
            </p>
            
            <button
              onClick={() => fileInputRef.current.click()}
              className="btn btn-primary"
            >
              Browse Files
            </button>
          </div>
        </div>
        
        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Files ({files.length})
              </h3>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {files.map((file) => {
                  const FileTypeIcon = getFileIcon(file.type);
                  
                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="relative border rounded-lg p-4 bg-surface-50 dark:bg-surface-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-md p-2 ${file.uploaded ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-surface-100 dark:bg-surface-600 text-surface-500 dark:text-surface-300'}`}>
                          <FileTypeIcon size={20} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-medium text-sm sm:text-base truncate pr-8" title={file.name}>
                                {file.name}
                              </h4>
                              <p className="text-xs text-surface-500 dark:text-surface-400">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {file.uploaded ? (
                                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center gap-1">
                                  <CheckCircleIcon size={12} />
                                  Uploaded
                                </span>
                              ) : file.error ? (
                                <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center gap-1">
                                  <AlertCircleIcon size={12} />
                                  Error
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                  {file.progress}%
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {!file.uploaded && !file.error && (
                            <div className="mt-2 h-1.5 w-full bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                        
                        <button 
                          className="absolute top-3 right-3 p-1 text-surface-400 hover:text-red-500 dark:text-surface-500 dark:hover:text-red-400 rounded-full hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                          onClick={() => removeFile(file.id)}
                          aria-label="Remove file"
                        >
                          <XIcon size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainFeature;