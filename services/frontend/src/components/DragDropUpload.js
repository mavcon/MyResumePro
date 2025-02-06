import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

function DragDropUpload({ onFileSelect, loading }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const validFileTypes = [
    'application/pdf',                     // PDF
    'application/msword',                  // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/rtf',                     // RTF
    'text/plain',                          // TXT
    'application/vnd.oasis.opendocument.text', // ODT
    'text/markdown',                       // MD
    'application/x-iwork-pages-sffpages',  // PAGES
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    if (!validFileTypes.includes(file.type)) {
      alert("Please upload a valid resume file (PDF, DOC, DOCX, RTF, TXT, ODT, MD, or Pages)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert("File size should be less than 10MB");
      return;
    }
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.rtf,.txt,.odt,.md,.pages"
        onChange={handleChange}
        disabled={loading}
      />

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <motion.svg
              className={`w-12 h-12 ${dragActive ? "text-blue-500" : "text-gray-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ 
                scale: dragActive ? 1.1 : 1,
                transition: { duration: 0.2 }
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </motion.svg>
          </div>

          <div className="text-gray-600">
            <p className="text-lg font-medium">
              Drag and drop your resume here, or{" "}
              <button
                type="button"
                onClick={handleButtonClick}
                className="text-blue-500 hover:text-blue-600"
                disabled={loading}
              >
                browse
              </button>
            </p>
            <p className="text-sm mt-2">
              Supported formats: PDF, DOC, DOCX, RTF, TXT, ODT, MD, Pages
              <br />
              Maximum file size: 10MB
            </p>
          </div>
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-4 h-4 bg-blue-500 rounded-full"
                animate={{ scale: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <span className="text-gray-600">Processing...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default DragDropUpload; 