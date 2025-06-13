'use client';
import { useState, useEffect } from 'react';
import { 
  UserIcon,
  PencilIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  PlusIcon,
  XMarkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

export default function UserProfile({ userData, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    
    // Profile Info
    headline: '',
    summary: '',
    
    // Education
    education: [],
    
    // Experience
    experience: [],
    
    // Skills
    skills: [],
    
    // Links
    portfolio: '',
    linkedinProfile: '',
    githubProfile: '',
    
    // Resume
    resumeUrl: '',
    resumeFileName: '',
    
    // Job Preferences
    jobSeekerProfile: {
      experienceLevel: '',
      fieldOfInterest: '',
      expectedSalary: {
        min: '',
        max: '',
        currency: 'USD'
      },
      availability: '',
      workModel: ''
    }
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.profile?.phone || '',
        dateOfBirth: userData.profile?.dateOfBirth || '',
        gender: userData.profile?.gender || '',
        location: userData.profile?.location || '',
        headline: userData.profile?.headline || '',
        summary: userData.profile?.summary || '',
        education: userData.profile?.education || [],
        experience: userData.profile?.experience || [],
        skills: userData.profile?.skills || [],
        portfolio: userData.profile?.portfolio || '',
        linkedinProfile: userData.profile?.linkedinProfile || '',
        githubProfile: userData.profile?.githubProfile || '',
        resumeUrl: userData.profile?.resumeUrl || '',
        resumeFileName: userData.profile?.resumeFileName || '',
        jobSeekerProfile: {
          experienceLevel: userData.jobSeekerProfile?.experienceLevel || '',
          fieldOfInterest: userData.jobSeekerProfile?.fieldOfInterest || '',
          expectedSalary: userData.jobSeekerProfile?.expectedSalary || {
            min: '', max: '', currency: 'USD'
          },
          availability: userData.jobSeekerProfile?.availability || '',
          workModel: userData.jobSeekerProfile?.workModel || ''
        }
      });
    }
  }, [userData]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
        current: false,
        gpa: '',
        description: '',
        achievements: []
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducationAchievement = (index, achievement) => {
    if (achievement && achievement.trim()) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.map((edu, i) => 
          i === index ? { 
            ...edu, 
            achievements: [...(edu.achievements || []), achievement.trim()] 
          } : edu
        )
      }));
    }
  };

  const removeEducationAchievement = (eduIndex, achievementIndex) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === eduIndex ? { 
          ...edu, 
          achievements: edu.achievements.filter((_, idx) => idx !== achievementIndex) 
        } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [],
        skills: []
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperienceAchievement = (index, achievement) => {
    if (achievement && achievement.trim()) {
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.map((exp, i) => 
          i === index ? { 
            ...exp, 
            achievements: [...(exp.achievements || []), achievement.trim()] 
          } : exp
        )
      }));
    }
  };

  const removeExperienceAchievement = (expIndex, achievementIndex) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? { 
          ...exp, 
          achievements: exp.achievements.filter((_, idx) => idx !== achievementIndex) 
        } : exp
      )
    }));
  };

  const addExperienceSkill = (index, skill) => {
    if (skill && skill.trim()) {
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.map((exp, i) => 
          i === index ? { 
            ...exp, 
            skills: [...(exp.skills || []), skill.trim()] 
          } : exp
        )
      }));
    }
  };

  const removeExperienceSkill = (expIndex, skillIndex) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? { 
          ...exp, 
          skills: exp.skills.filter((_, idx) => idx !== skillIndex) 
        } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;

    setUploadingResume(true);
    const uploadFormData = new FormData();
    uploadFormData.append('resume', file);

    try {
      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          resumeUrl: data.fileUrl,
          resumeFileName: data.fileName
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onProfileUpdate(updatedUser.user);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };
  const ProfileField = ({ label, value, placeholder = "Not provided" }) => (
    <div className="py-2">
      <dt className="text-sm font-medium text-gray-700">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || <span className="text-gray-500">{placeholder}</span>}</dd>
    </div>
  );

  if (!userData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-gray-900">
      {/* Profile Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
              <p className="text-gray-600">{formData.headline || 'Job Seeker'}</p>
              {formData.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{formData.location}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {isEditing ? (        /* Edit Mode */
        <form onSubmit={handleSubmit} className="p-6 space-y-8 bg-white text-gray-900">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                  placeholder="e.g., Software Developer | React.js Expert"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Brief description of your skills, experience, and career goals..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"                />
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <PlusIcon className="w-4 h-4" />
                Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {formData.experience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position/Title *</label>
                      <input
                        type="text"
                        value={exp.position || ''}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        placeholder="e.g., Software Engineer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        placeholder="e.g., Tech Corp"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                        placeholder="e.g., San Francisco, CA"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={exp.current || false}
                        onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`current-${index}`} className="text-sm text-gray-700">
                        I currently work here
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                      <input
                        type="month"
                        value={exp.startDate || ''}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date {exp.current ? '(Current)' : '*'}
                      </label>
                      <input
                        type="month"
                        value={exp.endDate || ''}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      placeholder="Describe your role, responsibilities, and day-to-day activities..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Achievements */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Achievements</label>
                    <div className="space-y-2">
                      {(exp.achievements || []).map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...(exp.achievements || [])];
                              newAchievements[achIndex] = e.target.value;
                              updateExperience(index, 'achievements', newAchievements);
                            }}
                            placeholder="e.g., Increased team productivity by 25%"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeExperienceAchievement(index, achIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addExperienceAchievement(index, '')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Achievement
                      </button>
                    </div>
                  </div>

                  {/* Skills Used */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills Used</label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {(exp.skills || []).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeExperienceSkill(index, skillIndex)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a skill (press Enter)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addExperienceSkill(index, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.experience.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No work experience added yet</p>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Add Your First Experience
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <PlusIcon className="w-4 h-4" />
                Add Education
              </button>
            </div>
            <div className="space-y-6">
              {formData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="e.g., Bachelor of Science"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        placeholder="e.g., University of California"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                        placeholder="e.g., Computer Science"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        placeholder="e.g., 3.8/4.0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Year *</label>
                      <input
                        type="number"
                        value={edu.startYear || ''}
                        onChange={(e) => updateEducation(index, 'startYear', e.target.value)}
                        placeholder="e.g., 2019"
                        min="1950"
                        max="2030"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Year {edu.current ? '(Expected)' : '*'}
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={edu.endYear || ''}
                          onChange={(e) => updateEducation(index, 'endYear', e.target.value)}
                          placeholder="e.g., 2023"
                          min="1950"
                          max="2030"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`current-edu-${index}`}
                            checked={edu.current || false}
                            onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`current-edu-${index}`} className="text-sm text-gray-700">
                            Currently studying here
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={edu.description || ''}
                      onChange={(e) => updateEducation(index, 'description', e.target.value)}
                      placeholder="Describe your coursework, projects, thesis, or focus areas..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Achievements/Honors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Achievements & Honors</label>
                    <div className="space-y-2">
                      {(edu.achievements || []).map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...(edu.achievements || [])];
                              newAchievements[achIndex] = e.target.value;
                              updateEducation(index, 'achievements', newAchievements);
                            }}
                            placeholder="e.g., Dean's List, Summa Cum Laude, Honor Society"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeEducationAchievement(index, achIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addEducationAchievement(index, '')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Achievement
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.education.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No education added yet</p>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Add Your Education
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill (press Enter)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Professional Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Website</label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={formData.linkedinProfile}
                  onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
                <input
                  type="url"
                  value={formData.githubProfile}
                  onChange={(e) => handleInputChange('githubProfile', e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {formData.resumeUrl ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="w-10 h-10 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{formData.resumeFileName}</p>
                      <p className="text-sm text-gray-500">Resume uploaded</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={formData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      View
                    </a>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => e.target.files[0] && handleResumeUpload(e.target.files[0])}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
                    >
                      Replace
                    </label>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="mb-4">
                    <p className="text-gray-700 font-medium">Upload your resume</p>
                    <p className="text-sm text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files[0] && handleResumeUpload(e.target.files[0])}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer inline-flex items-center gap-2"
                  >
                    <CloudArrowUpIcon className="w-4 h-4" />
                    {uploadingResume ? 'Uploading...' : 'Choose File'}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Save Profile
            </button>
          </div>
        </form>
      ) : (        /* View Mode */
        <div className="p-6 space-y-6 bg-white text-gray-900">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField label="Email" value={userData.email} />
              <ProfileField label="Phone" value={formData.phone} />
              <ProfileField label="Location" value={formData.location} />
              <ProfileField label="Date of Birth" value={formData.dateOfBirth} />
            </dl>
          </div>

          {/* Professional Summary */}
          {(formData.headline || formData.summary) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
              {formData.headline && (
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900">{formData.headline}</h4>
                </div>
              )}
              {formData.summary && (
                <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
              )}
            </div>
          )}

          {/* Resume */}
          {formData.resumeUrl && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{formData.resumeFileName}</p>
                  <p className="text-sm text-gray-500">Resume document</p>
                </div>
                <a
                  href={formData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View
                </a>
              </div>            </div>
          )}

          {/* Work Experience */}
          {formData.experience && formData.experience.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5" />
                Work Experience
              </h3>
              <div className="space-y-6">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>                        <h4 className="font-semibold text-gray-900 text-lg">{exp.position}</h4>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                        {exp.location && (
                          <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>                      <div className="text-right text-sm text-gray-600">
                        <p>
                          {exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {' - '}
                          {exp.current ? 'Present' : 
                           (exp.endDate && new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))}
                        </p>
                        {exp.current && (
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mt-1">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                      {exp.description && (
                      <p className="text-gray-800 mb-4 leading-relaxed">{exp.description}</p>
                    )}
                    
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Key Achievements:</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-800">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {exp.skills && exp.skills.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Skills Used:</h5>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, skillIndex) => (                          <span
                            key={skillIndex}
                            className="bg-gray-200 text-gray-900 px-2 py-1 rounded text-sm font-medium"
                          >
                            {skill}
                          </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {formData.education && formData.education.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AcademicCapIcon className="w-5 h-5" />
                Education
              </h3>
              <div className="space-y-6">
                {formData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-6 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{edu.degree}</h4>
                        <p className="text-green-600 font-medium">{edu.institution}</p>                        {edu.fieldOfStudy && (
                          <p className="text-gray-700">{edu.fieldOfStudy}</p>
                        )}
                        {edu.gpa && (
                          <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                        )}
                      </div>                      <div className="text-right text-sm text-gray-600">
                        <p>
                          {edu.startYear} - {edu.current ? 'Expected ' + edu.endYear : edu.endYear}
                        </p>
                        {edu.current && (
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mt-1">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                      {edu.description && (
                      <p className="text-gray-800 mb-4 leading-relaxed">{edu.description}</p>
                    )}
                    
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Achievements & Honors:</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-800">
                          {edu.achievements.map((achievement, achIndex) => (
                            <li key={achIndex}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {formData.skills && formData.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(formData.portfolio || formData.linkedinProfile || formData.githubProfile) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Links</h3>
              <div className="space-y-2">
                {formData.portfolio && (
                  <a
                    href={formData.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
                {formData.linkedinProfile && (
                  <a
                    href={formData.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <LinkIcon className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {formData.githubProfile && (
                  <a
                    href={formData.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <LinkIcon className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
