'use client';

import React, { useRef, useState } from 'react';
import { FileUp, FileText, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  label?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  label = 'Upload Resume (PDF)',
  accept = '.pdf',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
        {label}
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
                : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <FileUp className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  <span className="text-emerald-600 font-bold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500 mt-1">PDF Resume files supported (Max 10MB)</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 rounded-xl border border-emerald-300 bg-emerald-50/80"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-emerald-700 flex items-center space-x-1 mt-0.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready for parsing ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleRemove}
              className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-rose-600 transition-colors ml-2"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
