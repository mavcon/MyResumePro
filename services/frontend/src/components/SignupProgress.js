import React from 'react';
import { motion } from 'framer-motion';

function SignupProgress({ currentStep, totalSteps, labels }) {
  return (
    <nav aria-label="Progress">
      <div className="mb-8">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />
          
          {/* Progress Bar Fill */}
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {Array.from({ length: totalSteps }).map((_, index) => {
              const isCompleted = currentStep > index + 1;
              const isCurrent = currentStep === index + 1;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <motion.div
                    className={`
                      relative flex items-center justify-center w-10 h-10 rounded-full
                      ${isCompleted ? 'bg-blue-500' : isCurrent ? 'bg-blue-500' : 'bg-white'}
                      ${!isCompleted && !isCurrent ? 'border-2 border-gray-300' : ''}
                      transition-colors duration-200
                    `}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: isCurrent ? 1.1 : 1,
                      opacity: 1
                    }}
                    transition={{ 
                      duration: 0.2,
                      delay: index * 0.1
                    }}
                  >
                    {isCompleted ? (
                      <motion.svg
                        className="w-6 h-6 text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    ) : (
                      <span className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                        {index + 1}
                      </span>
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-max">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ 
                          y: 0,
                          opacity: 1,
                        }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className={`
                          text-sm font-medium whitespace-nowrap
                          ${isCurrent ? 'text-blue-600' : 'text-gray-500'}
                        `}
                      >
                        {labels[index]}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SignupProgress;
