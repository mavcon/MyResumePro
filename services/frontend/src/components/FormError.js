import React from 'react';
import { motion } from 'framer-motion';

function FormError({ error }) {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-1"
      role="alert"
    >
      <div className="flex items-center space-x-1.5">
        <svg
          className="h-4 w-4 text-red-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm text-red-600 font-medium">
          {error}
        </span>
      </div>
    </motion.div>
  );
}

export default FormError;
