import React from 'react';
import { motion } from 'framer-motion';

function FormCompletionTracker({ formik, steps }) {
  const calculateStepCompletion = (stepFields) => {
    const completedFields = stepFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], formik.values);
      return value && (!formik.errors[field] || !formik.touched[field]);
    });
    return (completedFields.length / stepFields.length) * 100;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
        <span className="text-sm font-medium text-blue-600">
          {Math.round(
            steps.reduce((acc, step) => acc + calculateStepCompletion(step.fields), 0) / steps.length
          )}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          className="bg-blue-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${steps.reduce((acc, step) => acc + calculateStepCompletion(step.fields), 0) / steps.length}%`
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

export default FormCompletionTracker; 