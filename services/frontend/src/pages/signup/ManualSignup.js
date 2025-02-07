import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SignupProgress from "../../components/SignupProgress";
import { ProfileSchema, emptyProfile } from '../../schemas/ProfileSchema';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useFormik } from 'formik';
import FormError from '../../components/FormError';
import DraftRecoveryNotification from '../../components/DraftRecoveryNotification';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

function ManualSignup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);
  const [showDraftNotification, setShowDraftNotification] = useState(false);
  const [draftData, setDraftData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const formik = useFormik({
    initialValues: emptyProfile,
    validationSchema: ProfileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      setError(null);

      try {
        const signupResponse = await axios.post(
          `${process.env.REACT_APP_USER_SERVICE_URL}/api/auth/register`,
          {
            email: values.email,
            password: values.password,
            name: values.name,
            professionalProfile: {
              ...values,
              email: undefined,
              password: undefined
            }
          }
        );

        login(signupResponse.data.user, signupResponse.data.token);
        localStorage.removeItem('profile-draft');
        navigate("/dashboard");
      } catch (err) {
        setError(err.response?.data?.message || "Error creating account");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  useAutoSave(formik.values, (data) => {
    localStorage.setItem('profile-draft', JSON.stringify(data));
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem('profile-draft');
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      formik.setValues(parsed);
      setDraftData(parsed);
      setShowDraftNotification(true);
    }
  }, []);

  const handleNext = async () => {
    setValidating(true);
    const errors = await formik.validateForm();
    const currentStepFields = getFieldsForStep(step);
    const hasStepErrors = currentStepFields.some(field => errors[field]);

    if (!hasStepErrors) {
      setValidating(false);
      if (step === 4) {
        setShowPreview(true);
      } else {
        setDirection(1);
        setStep(prev => prev + 1);
      }
    } else {
      currentStepFields.forEach(field => {
        formik.setFieldTouched(field, true);
      });
    }
  };

  const handleBack = () => {
    if (showPreview) {
      setShowPreview(false);
    } else {
      setDirection(-1);
      setStep(prev => prev - 1);
    }
  };

  const handleRecoverDraft = () => {
    formik.setValues(draftData);
    setShowDraftNotification(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem('profile-draft');
    setShowDraftNotification(false);
  };

  const getFieldsForStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return ['title', 'summary', 'location', 'phone'];
      case 2:
        return ['experience'];
      case 3:
        return ['education', 'skills', 'certifications', 'projects'];
      case 4:
        return ['email', 'password', 'name'];
      default:
        return [];
    }
  };

  const renderField = (name, label, type = 'text', options = {}) => {
    const error = formik.touched[name] && formik.errors[name];
    const value = formik.values[name] || '';
    const maxLength = options.maxLength || (type === 'textarea' ? 500 : 100);
    const characterCount = value.length;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            {label} {options.required && <span className="text-red-500">*</span>}
          </label>
          <span className="text-xs text-gray-500">
            {characterCount}/{maxLength} characters
          </span>
        </div>
        {type === 'textarea' ? (
          <textarea
            {...formik.getFieldProps(name)}
            maxLength={maxLength}
            onBlur={(e) => {
              formik.handleBlur(e);
              formik.setFieldTouched(name, true, true);
            }}
            className={`mt-1 block w-full rounded-md shadow-sm transition-colors
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                     : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
            `}
            {...options}
          />
        ) : (
          <input
            type={type}
            {...formik.getFieldProps(name)}
            maxLength={maxLength}
            onBlur={(e) => {
              formik.handleBlur(e);
              formik.setFieldTouched(name, true, true);
            }}
            className={`mt-1 block w-full rounded-md shadow-sm transition-colors
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                     : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
            `}
            {...options}
          />
        )}
        <FormError error={error} />
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Professional Profile</h3>
      <p className="text-sm text-gray-600">Tell us about your professional background</p>
      {renderField('title', 'Professional Title', 'text', { 
        required: true,
        placeholder: 'e.g., Senior Software Engineer'
      })}
      {renderField('headline', 'Professional Headline', 'text', {
        placeholder: 'e.g., Full-stack developer with 5+ years of experience in React and Node.js'
      })}
      {renderField('summary', 'Professional Summary', 'textarea', { 
        rows: 4,
        placeholder: 'Write a brief summary highlighting your key achievements, skills, and career goals. Focus on what makes you unique and valuable to potential employers.'
      })}
      <div className="grid grid-cols-2 gap-4">
        {renderField('location', 'Location', 'text', {
          placeholder: 'e.g., Toronto, ON'
        })}
        {renderField('phone', 'Phone Number', 'tel', {
          placeholder: 'e.g., +1 (555) 123-4567'
        })}
      </div>
      {renderField('website', 'Portfolio/Website', 'url', {
        placeholder: 'e.g., https://yourportfolio.com'
      })}
      {renderField('linkedin', 'LinkedIn Profile', 'url', {
        placeholder: 'e.g., https://linkedin.com/in/yourprofile'
      })}
      {renderField('github', 'GitHub Profile', 'url', {
        placeholder: 'e.g., https://github.com/yourusername'
      })}
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
          <p className="text-sm text-gray-600">Add your relevant work experience</p>
        </div>
        <button
          type="button"
          onClick={() => formik.setFieldValue('experience', [...formik.values.experience, {
            company: "",
            title: "",
            location: "",
            employmentType: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
            achievements: [""],
            technologies: [""],
            industry: ""
          }])}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {formik.values.experience.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {renderField(`experience.${index}.company`, 'Company', 'text', { 
                required: true,
                placeholder: 'e.g., Google'
              })}
              {renderField(`experience.${index}.title`, 'Job Title', 'text', { 
                required: true,
                placeholder: 'e.g., Senior Software Engineer'
              })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderField(`experience.${index}.employmentType`, 'Employment Type', 'select', {
                required: true,
                options: [
                  { value: 'full-time', label: 'Full-time' },
                  { value: 'part-time', label: 'Part-time' },
                  { value: 'contract', label: 'Contract' },
                  { value: 'freelance', label: 'Freelance' },
                  { value: 'internship', label: 'Internship' }
                ]
              })}
              {renderField(`experience.${index}.industry`, 'Industry', 'text', {
                placeholder: 'e.g., Technology, Healthcare, Finance'
              })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderField(`experience.${index}.location`, 'Location', 'text', {
                placeholder: 'e.g., San Francisco, CA'
              })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderField(`experience.${index}.startDate`, 'Start Date', 'date', { required: true })}
              {!formik.values.experience[index].current && 
                renderField(`experience.${index}.endDate`, 'End Date', 'date')}
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                {...formik.getFieldProps(`experience.${index}.current`)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label className="text-sm text-gray-700">I currently work here</label>
            </div>
            {renderField(`experience.${index}.description`, 'Description', 'textarea', { 
              rows: 4,
              placeholder: 'Describe your key responsibilities, projects, and quantifiable achievements. Use bullet points for better readability.'
            })}
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Key Achievements</label>
              {formik.values.experience[index].achievements.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex items-start space-x-2">
                  <span className="mt-2.5 text-gray-500">•</span>
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => {
                      const newAchievements = [...formik.values.experience[index].achievements];
                      newAchievements[achievementIndex] = e.target.value;
                      formik.setFieldValue(`experience.${index}.achievements`, newAchievements);
                    }}
                    className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Increased revenue by 25% through optimization of..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newAchievements = [...formik.values.experience[index].achievements];
                      newAchievements.splice(achievementIndex, 1);
                      formik.setFieldValue(`experience.${index}.achievements`, newAchievements);
                    }}
                    className="mt-1 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newAchievements = [...formik.values.experience[index].achievements, ""];
                  formik.setFieldValue(`experience.${index}.achievements`, newAchievements);
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Achievement
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Technologies Used</label>
              <div className="flex flex-wrap gap-2">
                {formik.values.experience[index].technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => {
                        const newTech = [...formik.values.experience[index].technologies];
                        newTech[techIndex] = e.target.value;
                        formik.setFieldValue(`experience.${index}.technologies`, newTech);
                      }}
                      className="bg-transparent border-none focus:ring-0 p-0 text-sm"
                      placeholder="Add technology"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newTech = [...formik.values.experience[index].technologies];
                        newTech.splice(techIndex, 1);
                        formik.setFieldValue(`experience.${index}.technologies`, newTech);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newTech = [...formik.values.experience[index].technologies, ""];
                    formik.setFieldValue(`experience.${index}.technologies`, newTech);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Technology
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const newExperience = [...formik.values.experience];
                  newExperience.splice(index, 1);
                  formik.setFieldValue('experience', newExperience);
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove Entry
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderEducationAndSkills = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Education & Skills</h3>
        <p className="text-sm text-gray-600">Add your educational background and skills</p>
      </div>

      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium text-gray-900">Education</h4>
          <button
            type="button"
            onClick={() => formik.setFieldValue('education', [...formik.values.education, {
              school: "",
              degree: "",
              field: "",
              location: "",
              startDate: "",
              endDate: "",
              gpa: "",
              achievements: [""],
              coursework: [""],
              activities: [""],
              honors: [""]
            }])}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Education
          </button>
        </div>
        
        {formik.values.education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {renderField(`education.${index}.school`, 'School', 'text', { required: true })}
              {renderField(`education.${index}.degree`, 'Degree', 'text', { required: true })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderField(`education.${index}.field`, 'Field of Study', 'text', { required: true })}
              {renderField(`education.${index}.gpa`, 'GPA (Optional)', 'text')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderField(`education.${index}.startDate`, 'Start Date', 'date', { required: true })}
              {renderField(`education.${index}.endDate`, 'End Date', 'date', { required: true })}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const newEducation = [...formik.values.education];
                  newEducation.splice(index, 1);
                  formik.setFieldValue('education', newEducation);
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove Entry
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="space-y-6">
        <h4 className="text-lg font-medium text-gray-900">Skills</h4>
        
        {/* Technical Skills */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Technical Skills</label>
            <button
              type="button"
              onClick={() => formik.setFieldValue('skills.technical', [...formik.values.skills.technical, ""])}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Skill
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {formik.values.skills.technical.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...formik.values.skills.technical];
                    newSkills[index] = e.target.value;
                    formik.setFieldValue('skills.technical', newSkills);
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., JavaScript"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSkills = [...formik.values.skills.technical];
                    newSkills.splice(index, 1);
                    formik.setFieldValue('skills.technical', newSkills);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Soft Skills</label>
            <button
              type="button"
              onClick={() => formik.setFieldValue('skills.soft', [...formik.values.skills.soft, ""])}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Skill
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {formik.values.skills.soft.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...formik.values.skills.soft];
                    newSkills[index] = e.target.value;
                    formik.setFieldValue('skills.soft', newSkills);
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Leadership"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSkills = [...formik.values.skills.soft];
                    newSkills.splice(index, 1);
                    formik.setFieldValue('skills.soft', newSkills);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSetup = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Create Your Account</h3>
      <p className="text-sm text-gray-600">Finally, set up your login credentials</p>
      {renderField('name', 'Full Name', 'text', { required: true })}
      {renderField('email', 'Email Address', 'email', { required: true })}
      {renderField('password', 'Password', 'password', { required: true })}
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Review Your Profile</h3>
        <p className="text-sm text-gray-600">Please review your information before submitting</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Professional Profile</h4>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{formik.values.title}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{formik.values.location}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Summary</dt>
              <dd className="mt-1 text-sm text-gray-900">{formik.values.summary}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Experience</h4>
          <div className="space-y-4">
            {formik.values.experience.map((exp, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h5 className="font-medium text-gray-900">{exp.title} at {exp.company}</h5>
                <p className="text-sm text-gray-600">
                  {new Date(exp.startDate).toLocaleDateString()} - 
                  {exp.current ? ' Present' : new Date(exp.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Education</h4>
          <div className="space-y-4">
            {formik.values.education.map((edu, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h5 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h5>
                <p className="text-sm text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-600">
                  {new Date(edu.startDate).toLocaleDateString()} - 
                  {new Date(edu.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Skills</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700">Technical Skills</h5>
              <div className="mt-2 flex flex-wrap gap-2">
                {formik.values.skills.technical.map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-700">Soft Skills</h5>
              <div className="mt-2 flex flex-wrap gap-2">
                {formik.values.skills.soft.map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Account Information</h4>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{formik.values.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{formik.values.email}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderProfile();
      case 2:
        return renderExperience();
      case 3:
        return renderEducationAndSkills();
      case 4:
        return renderAccountSetup();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {showDraftNotification && (
          <DraftRecoveryNotification
            onRecover={handleRecoverDraft}
            onDiscard={handleDiscardDraft}
          />
        )}
        
        <SignupProgress
          currentStep={step}
          totalSteps={4}
          labels={["Professional Profile", "Experience", "Education & Skills", "Account Setup"]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <form onSubmit={formik.handleSubmit}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={showPreview ? 'preview' : step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                  >
                    {showPreview ? renderPreview() : renderStep()}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex justify-between items-center pt-5 border-t border-gray-200 sticky bottom-0 bg-white">
                  {(step > 1 || showPreview) && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back
                    </button>
                  )}
                  
                  {showPreview ? (
                    <button
                      type="submit"
                      disabled={loading}
                      className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? "Creating Profile..." : "Complete Signup"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={validating}
                      className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {validating ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Validating...
                        </span>
                      ) : (
                        step === 4 ? "Review Profile" : `Continue to ${["Experience", "Education & Skills", "Account Setup"][step - 1]}`
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 rounded-md bg-red-50 p-4"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ManualSignup;
