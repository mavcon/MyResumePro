import React from 'react';
import { motion } from 'framer-motion';

function ProfilePreview({ data, onEdit, onSubmit }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Profile Preview</h2>
        <div className="space-x-4">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Edit
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirm & Submit
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{data.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Title</p>
              <p className="font-medium">{data.title}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{data.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium">{data.phone}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Summary</p>
            <p className="font-medium">{data.summary}</p>
          </div>
        </section>

        {/* Experience */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Work Experience</h3>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="flex justify-between">
                <h4 className="font-medium">{exp.title}</h4>
                <span className="text-gray-600">{exp.company}</span>
              </div>
              <p className="text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
              <p className="mt-2">{exp.description}</p>
            </div>
          ))}
        </section>

        {/* Add similar sections for Education, Skills, etc. */}
      </div>
    </motion.div>
  );
}

export default ProfilePreview; 