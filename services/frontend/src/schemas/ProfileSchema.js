import * as Yup from 'yup';

export const ProfileSchema = Yup.object().shape({
  // Professional Profile
  title: Yup.string()
    .required('Professional title is required')
    .min(2, 'Title must be at least 2 characters'),
  headline: Yup.string()
    .max(150, 'Headline must be less than 150 characters'),
  summary: Yup.string()
    .max(2000, 'Summary must be less than 2000 characters')
    .min(50, 'Please provide a more detailed summary (at least 50 characters)'),
  location: Yup.string(),
  phone: Yup.string()
    .matches(/^[0-9+-\s()]*$/, 'Invalid phone number'),
  website: Yup.string()
    .url('Invalid URL format'),
  linkedin: Yup.string()
    .url('Invalid LinkedIn URL')
    .matches(/linkedin\.com/, 'Must be a LinkedIn URL'),
  github: Yup.string()
    .url('Invalid GitHub URL')
    .matches(/github\.com/, 'Must be a GitHub URL'),

  // Work Experience
  experience: Yup.array().of(
    Yup.object().shape({
      company: Yup.string()
        .required('Company name is required')
        .min(2, 'Company name must be at least 2 characters'),
      title: Yup.string()
        .required('Job title is required')
        .min(2, 'Job title must be at least 2 characters'),
      location: Yup.string(),
      employmentType: Yup.string()
        .required('Employment type is required')
        .oneOf(['full-time', 'part-time', 'contract', 'freelance', 'internship'], 'Invalid employment type'),
      industry: Yup.string(),
      startDate: Yup.date()
        .required('Start date is required')
        .max(new Date(), 'Start date cannot be in the future'),
      endDate: Yup.date().when('current', {
        is: false,
        then: Yup.date()
          .min(Yup.ref('startDate'), 'End date must be after start date')
          .max(new Date(), 'End date cannot be in the future')
      }),
      current: Yup.boolean(),
      description: Yup.string()
        .min(50, 'Please provide a more detailed description (at least 50 characters)')
        .max(5000, 'Description must be less than 5000 characters'),
      achievements: Yup.array().of(
        Yup.string()
          .min(10, 'Achievement must be at least 10 characters')
          .max(200, 'Achievement must be less than 200 characters')
      ),
      technologies: Yup.array().of(
        Yup.string()
          .min(1, 'Technology name is required')
          .max(50, 'Technology name must be less than 50 characters')
      )
    })
  ),

  // Education
  education: Yup.array().of(
    Yup.object().shape({
      school: Yup.string()
        .required('School name is required')
        .min(2, 'School name must be at least 2 characters'),
      degree: Yup.string()
        .required('Degree is required')
        .min(2, 'Degree must be at least 2 characters'),
      field: Yup.string()
        .required('Field of study is required')
        .min(2, 'Field must be at least 2 characters'),
      startDate: Yup.date()
        .required('Start date is required')
        .max(new Date(), 'Start date cannot be in the future'),
      endDate: Yup.date()
        .min(Yup.ref('startDate'), 'End date must be after start date')
        .max(new Date(), 'End date cannot be in the future'),
      gpa: Yup.string()
        .matches(/^[0-4]\.[0-9]{1,2}$|^[0-4]$/, 'Invalid GPA (must be between 0.0 and 4.0)'),
      achievements: Yup.array().of(
        Yup.string()
          .min(10, 'Achievement must be at least 10 characters')
          .max(200, 'Achievement must be less than 200 characters')
      ),
      coursework: Yup.array().of(
        Yup.string()
          .min(3, 'Course name must be at least 3 characters')
          .max(100, 'Course name must be less than 100 characters')
      ),
      activities: Yup.array().of(
        Yup.string()
          .min(10, 'Activity must be at least 10 characters')
          .max(200, 'Activity must be less than 200 characters')
      ),
      honors: Yup.array().of(
        Yup.string()
          .min(10, 'Honor must be at least 10 characters')
          .max(200, 'Honor must be less than 200 characters')
      )
    })
  ),

  // Skills
  skills: Yup.object().shape({
    technical: Yup.array().of(
      Yup.string()
        .min(1, 'Skill name is required')
        .max(50, 'Skill name must be less than 50 characters')
    ),
    soft: Yup.array().of(
      Yup.string()
        .min(1, 'Skill name is required')
        .max(50, 'Skill name must be less than 50 characters')
    )
  }),

  // Account Info (moved to end)
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
    .required('Password is required'),
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required')
});

export const emptyProfile = {
  // Professional Profile
  title: '',
  headline: '',
  summary: '',
  location: '',
  phone: '',
  website: '',
  linkedin: '',
  github: '',
  
  // Work Experience
  experience: [],
  
  // Education
  education: [],
  
  // Skills
  skills: {
    technical: [],
    soft: []
  },
  
  // Account Info
  email: '',
  password: '',
  name: ''
};
