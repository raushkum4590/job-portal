'use client';
import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  CheckIcon, 
  PlusIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function JobPostForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  jobData = null, 
  companyInfo = {} 
}) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    
    // Job Details
    department: '',
    jobType: '',
    workModel: '',
    experienceLevel: '',
    
    // Location & Salary
    location: '',
    salaryRange: {
      min: '',
      max: '',
      currency: 'USD',
      period: 'yearly',
      negotiable: false
    },    // Skills & Qualifications
    skills: [],
    education: '',
    additionalQualifications: [],
    
    // Benefits & Application
    benefits: [],
    applicationDeadline: '',
    applicationInstructions: '',
    applicationEmail: '',
      // Job Settings
    status: 'active', // Default to active so jobs are immediately visible
    featured: false,
    urgent: false,
    tags: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (jobData) {
      // Edit mode - populate form with existing job data
      setFormData({
        title: jobData.title || '',
        description: jobData.description || '',
        requirements: jobData.requirements || '',
        responsibilities: jobData.responsibilities || '',
        department: jobData.department || '',
        jobType: jobData.jobType || '',
        workModel: jobData.workModel || '',
        experienceLevel: jobData.experienceLevel || '',
        location: jobData.location || '',
        salaryRange: {
          min: jobData.salaryRange?.min || '',
          max: jobData.salaryRange?.max || '',
          currency: jobData.salaryRange?.currency || 'USD',
          period: jobData.salaryRange?.period || 'yearly',
          negotiable: jobData.salaryRange?.negotiable || false
        },        skills: jobData.skills || [],
        education: jobData.education || '',
        additionalQualifications: jobData.additionalQualifications || [],
        benefits: jobData.benefits || [],
        applicationDeadline: jobData.applicationDeadline ? 
          new Date(jobData.applicationDeadline).toISOString().split('T')[0] : '',
        applicationInstructions: jobData.applicationInstructions || '',
        applicationEmail: jobData.applicationEmail || '',
        status: jobData.status || 'draft',
        featured: jobData.featured || false,
        urgent: jobData.urgent || false,
        tags: jobData.tags || []
      });
    } else {
      // Create mode - use company info for defaults
      setFormData(prev => ({
        ...prev,
        location: companyInfo.location || '',
        applicationEmail: companyInfo.email || ''
      }));
    }
  }, [jobData, companyInfo]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('salaryRange.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayInput = (inputValue, setInputValue, arrayName) => {
    if (inputValue.trim() && !formData[arrayName].includes(inputValue.trim())) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], inputValue.trim()]
      }));
      setInputValue('');
    }
  };
  const removeArrayItem = (index, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (education) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.includes(education)
        ? prev.education.filter(e => e !== education)
        : [...prev.education, education]
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'requirements', 'department', 'jobType', 'workModel', 'experienceLevel', 'location'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Call the onSubmit function passed from parent
      await onSubmit(formData);
      
      // Only close if submission was successful
      onClose();
    } catch (error) {
      console.error('Error submitting job:', error);
      // Show more detailed error message
      const errorMessage = error.message || 'Error submitting job. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  const stepTitles = [
    'Basic Information',
    'Job Details',
    'Requirements & Benefits',
    'Application & Settings'
  ];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {jobData ? 'Edit Job Posting' : 'Create New Job Posting'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Step {currentStep} of 4: {stepTitles[currentStep - 1]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2 bg-gray-50 flex-shrink-0">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-6 py-4 flex-1 overflow-y-auto">            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., Senior Frontend Developer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Key Responsibilities
                  </label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="List the main responsibilities and duties..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Requirements *
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="List the required qualifications, skills, and experience..."
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Job Details */}
            {currentStep === 2 && (
              <div className="space-y-4">                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="software-development">Software Development</option>
                      <option value="data-science">Data Science</option>
                      <option value="digital-marketing">Digital Marketing</option>
                      <option value="design">Design</option>
                      <option value="finance">Finance</option>
                      <option value="sales">Sales</option>
                      <option value="hr">Human Resources</option>
                      <option value="operations">Operations</option>
                      <option value="consulting">Consulting</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="customer-service">Customer Service</option>
                      <option value="business-development">Business Development</option>
                      <option value="product-management">Product Management</option>
                      <option value="quality-assurance">Quality Assurance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Job Type *
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    >
                      <option value="">Select Job Type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                      <option value="temporary">Temporary</option>
                    </select>
                  </div>                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Work Model *
                    </label>
                    <select
                      name="workModel"
                      value={formData.workModel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    >
                      <option value="">Select Work Model</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="on-site">On-site</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Experience Level *
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    >
                      <option value="">Select Experience Level</option>
                      <option value="entry-level">Entry Level</option>
                      <option value="mid-level">Mid Level</option>
                      <option value="senior-level">Senior Level</option>
                      <option value="executive">Executive</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="e.g., San Francisco, CA or Remote"
                    required
                  />
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Salary Range
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>                      <input
                        type="number"
                        name="salaryRange.min"
                        value={formData.salaryRange.min}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="salaryRange.max"
                        value={formData.salaryRange.max}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Max"
                      />
                    </div>
                    <div>
                      <select
                        name="salaryRange.currency"
                        value={formData.salaryRange.currency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="INR">INR</option>
                      </select>
                    </div>                    <div>
                      <select
                        name="salaryRange.period"
                        value={formData.salaryRange.period}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      >
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="salaryRange.negotiable"
                        checked={formData.salaryRange.negotiable}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-black">Salary is negotiable</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Requirements & Benefits */}
            {currentStep === 3 && (
              <div className="space-y-4">                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Required Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayInput(skillInput, setSkillInput, 'skills'))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Add a skill and press Enter"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayInput(skillInput, setSkillInput, 'skills')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'skills')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>                {/* Education Requirements */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Minimum Education Requirement
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="">No formal education required</option>
                    <option value="high-school">High School Diploma/GED</option>
                    <option value="some-college">Some College or vocational training</option>
                    <option value="certificate-program">Certificate Program</option>
                    <option value="trade-school">Trade School/Vocational Certificate</option>
                    <option value="associate-degree">Associate Degree (AA/AS/AAS)</option>
                    <option value="associate-degree-related">Associate Degree in related field</option>
                    <option value="bachelor-degree">Bachelor's Degree (Any field)</option>
                    <option value="bachelor-degree-related">Bachelor's Degree in related field</option>
                    <option value="bachelor-computer-science">Bachelor's in Computer Science/IT/Software Engineering</option>
                    <option value="bachelor-engineering">Bachelor's in Engineering (Any discipline)</option>
                    <option value="bachelor-business">Bachelor's in Business Administration/Management</option>
                    <option value="bachelor-marketing">Bachelor's in Marketing/Communications/Advertising</option>
                    <option value="bachelor-finance">Bachelor's in Finance/Accounting/Economics</option>
                    <option value="bachelor-design">Bachelor's in Design/Fine Arts/Creative Arts</option>
                    <option value="bachelor-sciences">Bachelor's in Sciences (Physics, Chemistry, Biology, etc.)</option>
                    <option value="bachelor-liberal-arts">Bachelor's in Liberal Arts/Humanities</option>
                    <option value="master-degree">Master's Degree (Any field)</option>
                    <option value="master-degree-related">Master's Degree in related field</option>
                    <option value="master-computer-science">Master's in Computer Science/IT/Data Science</option>
                    <option value="master-engineering">Master's in Engineering</option>
                    <option value="master-business">Master's in Business Administration (MBA)</option>
                    <option value="master-marketing">Master's in Marketing/Digital Marketing</option>
                    <option value="master-finance">Master's in Finance/Accounting</option>
                    <option value="master-design">Master's in Design/Creative Arts</option>
                    <option value="master-sciences">Master's in Sciences</option>
                    <option value="phd">PhD/Doctorate (Any field)</option>
                    <option value="phd-related">PhD/Doctorate in related field</option>
                    <option value="phd-computer-science">PhD in Computer Science/Engineering</option>
                    <option value="phd-sciences">PhD in Sciences</option>
                    <option value="professional-certification">Professional Certification required</option>
                    <option value="coding-bootcamp">Coding Bootcamp/Intensive Training Program</option>
                    <option value="online-courses">Relevant Online Courses/MOOCs</option>
                    <option value="equivalent-experience">Equivalent work experience in lieu of degree</option>
                    <option value="self-taught">Self-taught with demonstrable skills</option>
                  </select>                  <p className="mt-1 text-xs text-black">
                    Select the minimum education level required for this position
                  </p>
                </div>

                {/* Additional Education Preferences */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Preferred Additional Qualifications (Select all that apply)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        'Professional certifications in relevant field',
                        'Industry-specific training programs',
                        'Continuing education courses',
                        'Technical bootcamp graduates preferred',
                        'Advanced degree preferred but not required',
                        'Relevant online course certifications (Coursera, edX, Udacity)',
                        'Professional development workshops',
                        'Leadership or management training',
                        'Project management certification (PMP, Agile, Scrum)',
                        'Technology certifications (AWS, Google Cloud, Microsoft Azure)',
                        'Programming certifications (Oracle Java, Microsoft .NET)',
                        'Data science certifications (Google Analytics, Tableau)',
                        'Digital marketing certifications (Google Ads, Facebook Blueprint)',
                        'Sales certifications (Salesforce, HubSpot)',
                        'Financial industry certifications (CPA, CFA, FRM)',
                        'Healthcare certifications',
                        'Design certifications (Adobe Creative Suite)',
                        'Language certifications (TOEFL, IELTS for English)',
                        'Six Sigma certification',
                        'ITIL certification',
                        'Cybersecurity certifications (CISSP, CEH)',
                        'Database certifications (Oracle, Microsoft SQL Server)',
                        'Cloud platform certifications',
                        'Mobile development certifications',
                        'UX/UI design certifications',
                        'Digital transformation certifications',
                        'Artificial Intelligence/Machine Learning certifications'
                      ].map((qualification) => (
                        <label key={qualification} className="flex items-start space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.additionalQualifications?.includes(qualification) || false}
                            onChange={(e) => {
                              const qualifications = formData.additionalQualifications || [];
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  additionalQualifications: [...qualifications, qualification]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  additionalQualifications: qualifications.filter(q => q !== qualification)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-sm text-black leading-tight">{qualification}</span>
                        </label>
                      ))}
                    </div>
                  </div>                  <p className="mt-2 text-xs text-black">
                    Check any additional qualifications that would be beneficial for this role
                  </p>
                  
                  {/* Display selected qualifications */}
                  {formData.additionalQualifications && formData.additionalQualifications.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-black mb-2">Selected Additional Qualifications:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.additionalQualifications.map((qualification, index) => (
                          <span
                            key={index}
                            className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                          >
                            {qualification}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  additionalQualifications: prev.additionalQualifications.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-indigo-600 hover:text-indigo-800 ml-1"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Benefits & Perks
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayInput(benefitInput, setBenefitInput, 'benefits'))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Add a benefit and press Enter"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayInput(benefitInput, setBenefitInput, 'benefits')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {benefit}
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'benefits')}
                          className="text-green-600 hover:text-green-800"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Application & Settings */}
            {currentStep === 4 && (
              <div className="space-y-4">                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Application Email
                    </label>
                    <input
                      type="email"
                      name="applicationEmail"
                      value={formData.applicationEmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="hr@company.com"
                    />
                  </div>
                </div>                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Application Instructions
                  </label>
                  <textarea
                    name="applicationInstructions"
                    value={formData.applicationInstructions}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Special instructions for applicants..."
                  />
                </div>                {/* Job Settings */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Job Settings</h4>
                  <div className="space-y-3"><div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Job Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="draft">Draft - Not visible to job seekers</option>
                        <option value="active">Active - Visible to job seekers</option>
                        <option value="paused">Paused - Temporarily hidden</option>
                        <option value="closed">Closed - No longer accepting applications</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.status === 'active' ? '✅ This job will be visible to job seekers' :
                         formData.status === 'draft' ? '⚠️ This job will only be visible to you' :
                         formData.status === 'paused' ? '⏸️ This job is temporarily hidden from job seekers' :
                         '🔒 This job is closed and not accepting applications'}
                      </p>
                    </div>                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">Featured Job (higher visibility)</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="urgent"
                          checked={formData.urgent}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">Urgent Hiring (priority badge)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>                  <label className="block text-sm font-medium text-black mb-2">
                    Tags (for better visibility)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayInput(tagInput, setTagInput, 'tags'))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayInput(tagInput, setTagInput, 'tags')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'tags')}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0 bg-white">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  <CheckIcon className="w-4 h-4" />
                  {loading ? 'Saving...' : (jobData ? 'Update Job' : 'Post Job')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}