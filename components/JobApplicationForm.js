'use client';
import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  PaperClipIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  LinkIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function JobApplicationForm({ 
  isOpen, 
  onClose, 
  jobId,
  jobTitle,
  companyName,
  onApplicationSubmitted 
}) {  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [formData, setFormData] = useState({    // Basic Application Info
    coverLetter: '',
    resumeUrl: '',
    resumeFile: null,
    resumeFileName: '',
    
    // Additional Info
    availabilityDate: '',
    salaryExpectation: {
      min: '',
      max: '',
      currency: 'USD'
    },
    portfolio: '',
    linkedinProfile: '',
    githubProfile: '',
    experience: '',
    whyInterested: '',
    skills: [],
    references: []
  });

  const [skillInput, setSkillInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.includes('salaryExpectation.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salaryExpectation: {
          ...prev.salaryExpectation,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, {
        name: '',
        company: '',
        position: '',
        email: '',
        phone: ''
      }]
    }));
  };

  const updateReference = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };
  const removeReference = (index) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 5MB.');
      return;
    }

    setUploadingResume(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          resumeFile: data.fileUrl,
          resumeFileName: data.fileName,
          resumeUrl: '' // Clear URL when file is uploaded
        }));
        alert('Resume uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Error uploading resume. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };

  const removeUploadedFile = () => {
    setFormData(prev => ({
      ...prev,
      resumeFile: null,
      resumeFileName: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.coverLetter.trim()) {
        alert('Please provide a cover letter');
        setLoading(false);
        return;
      }

      if (!formData.whyInterested.trim()) {
        alert('Please explain why you are interested in this position');
        setLoading(false);
        return;
      }      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          resumeUrl: formData.resumeFile || formData.resumeUrl // Use uploaded file URL or provided URL
        }),
      });      if (response.ok) {
        const result = await response.json();
        alert('Application submitted successfully!');
        
        console.log('✅ Application submitted successfully:', {
          jobId,
          jobTitle,
          companyName,
          applicationId: result.applicationId
        });
        
        // Call the callback if provided
        if (onApplicationSubmitted) {
          onApplicationSubmitted(result);
        }
        
        onClose();// Reset form
        setFormData({
          coverLetter: '',
          resumeUrl: '',
          resumeFile: null,
          resumeFileName: '',
          availabilityDate: '',
          salaryExpectation: { min: '', max: '', currency: 'USD' },
          portfolio: '',
          linkedinProfile: '',
          githubProfile: '',
          experience: '',
          whyInterested: '',
          skills: [],
          references: []
        });
        setCurrentStep(1);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }

    // Add a simple notification to trigger dashboard refresh
    // In a real app, you might use WebSockets or Server-Sent Events
    if (typeof window !== 'undefined' && window.localStorage) {
      const notification = {
        type: 'new-application',
        jobId,
        jobTitle,
        companyName,
        applicationId: result.applicationId,
        timestamp: Date.now()
      };
      
      // Store notification for employer dashboards to pick up
      const existingNotifications = JSON.parse(localStorage.getItem('application-notifications') || '[]');
      existingNotifications.push(notification);
      localStorage.setItem('application-notifications', JSON.stringify(existingNotifications));
      
      console.log('📢 Application notification stored:', notification);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  const stepTitles = [
    'Basic Information',
    'Additional Details',
    'References & Review'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-black">
              Apply for {jobTitle}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {companyName} • Step {currentStep} of 3: {stepTitles[currentStep - 1]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2 bg-gray-50">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-black'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="px-6 py-4 flex-1 overflow-y-auto">
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Tell us why you're the perfect fit for this role..."
                    required
                  />
                </div>                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Resume/CV
                  </label>
                  
                  {/* File Upload Option */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Upload Resume File (PDF, DOC, DOCX, TXT - Max 5MB)
                    </label>
                    {!formData.resumeFile ? (
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileUpload}
                          disabled={uploadingResume}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {uploadingResume && (
                          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <PaperClipIcon className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-700 flex-1">{formData.resumeFileName}</span>
                        <button
                          type="button"
                          onClick={removeUploadedFile}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* URL Option (only show if no file uploaded) */}
                  {!formData.resumeFile && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Or provide a link to your resume
                      </label>
                      <div className="relative">
                        <PaperClipIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="url"
                          name="resumeUrl"
                          value={formData.resumeUrl}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="https://drive.google.com/your-resume"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Share a link to your resume (Google Drive, Dropbox, personal website, etc.)
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Why are you interested in this position? *
                  </label>
                  <textarea
                    name="whyInterested"
                    value={formData.whyInterested}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="What excites you about this role and our company?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Relevant Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Briefly describe your relevant work experience and achievements..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Additional Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Available Start Date
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        name="availabilityDate"
                        value={formData.availabilityDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Salary Expectations
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <input
                        type="number"
                        name="salaryExpectation.min"
                        value={formData.salaryExpectation.min}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Minimum"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="salaryExpectation.max"
                        value={formData.salaryExpectation.max}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Maximum"
                      />
                    </div>
                    <div>
                      <select
                        name="salaryExpectation.currency"
                        value={formData.salaryExpectation.currency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="INR">INR</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Portfolio/Website
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="githubProfile"
                      value={formData.githubProfile}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="https://github.com/yourprofile"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Key Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Add a skill and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
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
                          onClick={() => removeSkill(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: References & Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-black">
                      Professional References (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={addReference}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Reference
                    </button>
                  </div>
                  
                  {formData.references.map((reference, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-black">Reference {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeReference(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={reference.name}
                          onChange={(e) => updateReference(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                        <input
                          type="text"
                          placeholder="Company"
                          value={reference.company}
                          onChange={(e) => updateReference(index, 'company', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                        <input
                          type="text"
                          placeholder="Position/Title"
                          value={reference.position}
                          onChange={(e) => updateReference(index, 'position', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={reference.email}
                          onChange={(e) => updateReference(index, 'email', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={reference.phone}
                          onChange={(e) => updateReference(index, 'phone', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black md:col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>                {/* Application Summary */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 text-base">Application Summary</h4>
                  
                  {/* Completion Progress */}
                  <div className="mb-4 p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Application Completion</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {Math.round((
                          (formData.coverLetter ? 1 : 0) +
                          (formData.resumeFile || formData.resumeUrl ? 1 : 0) +
                          (formData.whyInterested ? 0.5 : 0) +
                          (formData.experience ? 0.5 : 0) +
                          (formData.skills.length > 0 ? 0.5 : 0) +
                          (formData.portfolio ? 0.5 : 0) +
                          (formData.references.length > 0 ? 0.5 : 0) +
                          (formData.salaryExpectation.min || formData.salaryExpectation.max ? 0.5 : 0) +
                          (formData.availabilityDate ? 0.5 : 0)
                        ) / 6 * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.round((
                            (formData.coverLetter ? 1 : 0) +
                            (formData.resumeFile || formData.resumeUrl ? 1 : 0) +
                            (formData.whyInterested ? 0.5 : 0) +
                            (formData.experience ? 0.5 : 0) +
                            (formData.skills.length > 0 ? 0.5 : 0) +
                            (formData.portfolio ? 0.5 : 0) +
                            (formData.references.length > 0 ? 0.5 : 0) +
                            (formData.salaryExpectation.min || formData.salaryExpectation.max ? 0.5 : 0) +
                            (formData.availabilityDate ? 0.5 : 0)
                          ) / 6 * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Position:</span>
                      <span>{jobTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Company:</span>
                      <span>{companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Cover Letter:</span>
                      <span className={formData.coverLetter ? 'text-green-600' : 'text-red-500'}>
                        {formData.coverLetter ? '✓ Provided' : '✗ Not provided'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Resume:</span>
                      <span className={
                        (formData.resumeFile || formData.resumeUrl) ? 'text-green-600' : 'text-red-500'
                      }>
                        {formData.resumeFile ? `✓ Uploaded: ${formData.resumeFileName}` :
                         formData.resumeUrl ? '✓ URL provided' : 
                         '✗ Not provided'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Why Interested:</span>
                      <span className={formData.whyInterested ? 'text-green-600' : 'text-gray-400'}>
                        {formData.whyInterested ? '✓ Provided' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Experience:</span>
                      <span className={formData.experience ? 'text-green-600' : 'text-gray-400'}>
                        {formData.experience ? '✓ Provided' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Skills:</span>
                      <span className={formData.skills.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                        {formData.skills.length > 0 ? `✓ ${formData.skills.length} skills listed` : 'None added'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Portfolio:</span>
                      <span className={formData.portfolio ? 'text-green-600' : 'text-gray-400'}>
                        {formData.portfolio ? '✓ Provided' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">References:</span>
                      <span className={formData.references.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                        {formData.references.length > 0 ? `✓ ${formData.references.length} references provided` : 'None added'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Salary Expectation:</span>
                      <span className={
                        (formData.salaryExpectation.min || formData.salaryExpectation.max) ? 'text-green-600' : 'text-gray-400'
                      }>
                        {formData.salaryExpectation.min || formData.salaryExpectation.max ? 
                          `✓ ${formData.salaryExpectation.currency} ${formData.salaryExpectation.min}${formData.salaryExpectation.max ? `-${formData.salaryExpectation.max}` : '+'}` : 
                          'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Availability Date:</span>
                      <span className={formData.availabilityDate ? 'text-green-600' : 'text-gray-400'}>
                        {formData.availabilityDate ? `✓ ${new Date(formData.availabilityDate).toLocaleDateString()}` : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-black hover:text-gray-800"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-black hover:text-gray-800"
              >
                Cancel
              </button>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
