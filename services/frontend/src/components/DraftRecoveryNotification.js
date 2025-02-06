import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function DraftRecoveryNotification({ onRecover, onDiscard }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-blue-100 max-w-md z-50 overflow-hidden"
        role="alert"
        aria-live="polite"
      >
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Resume Your Progress
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                We found a saved draft of your profile from{' '}
                {new Date().toLocaleDateString()} at{' '}
                {new Date().toLocaleTimeString()}. Would you like to continue where you left off?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onDiscard}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                  aria-label="Discard draft"
                >
                  Discard
                </button>
                <button
                  onClick={onRecover}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Recover draft"
                >
                  Recover Draft
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar - Auto dismiss after 10s */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="h-1 bg-blue-500 origin-left"
          onAnimationComplete={onDiscard}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default DraftRecoveryNotification;
