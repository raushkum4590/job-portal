'use client';
import { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon, 
  GlobeAltIcon, 
  MapPinIcon, 
  UsersIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  LinkIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function CompanyProfileEditor({ userData, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Company Information
    companyName: '',
    companyWebsite: '',
    companyLocation: '',
    companyDescription: '',
    companyType: '',
    companySize: '',
    
    // Company Details (Internshala-like)
    foundedYear: '',
    headquarters: '',
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    companyPhone: '',
    companyEmail: '',
    
    // About Company
    aboutCompany: '',
    mission: '',
    vision: '',
    values: '',
    
    // Work Culture
    workModel: '',
    workingHours: '',
    dressCode: '',
    teamSize: '',
    
    // Hiring Details
    hiringFor: '',
    experienceLevel: '',
    salaryRange: '',
    hiringUrgency: '',
    
    // Benefits & Perks
    benefitsOffered: [],
    
    // Company Achievements
    awards: '',
    certifications: '',
    clients: '',
    
    // Additional Info
    companyLogo: '',
    coverImage: '',
    industry: '',
    revenue: '',
    employeeGrowth: '',
    
    // Contact Person
    hrName: '',
    hrEmail: '',
    hrPhone: '',
    hrDesignation: ''
  });

  useEffect(() => {
    if (userData?.employerProfile) {
      const profile = userData.employerProfile;
      setFormData({
        companyName: profile.companyName || '',
        companyWebsite: profile.companyWebsite || '',
        companyLocation: profile.companyLocation || '',
        companyDescription: profile.companyDescription || '',
        companyType: profile.companyType || '',
        companySize: profile.companySize || '',
        foundedYear: profile.foundedYear || '',
        headquarters: profile.headquarters || '',
        linkedinUrl: profile.linkedinUrl || '',
        twitterUrl: profile.twitterUrl || '',
        facebookUrl: profile.facebookUrl || '',
        instagramUrl: profile.instagramUrl || '',
        companyPhone: profile.companyPhone || '',
        companyEmail: profile.companyEmail || '',
        aboutCompany: profile.aboutCompany || '',
        mission: profile.mission || '',
        vision: profile.vision || '',
        values: profile.values || '',
        workModel: profile.workModel || '',
        workingHours: profile.workingHours || '',
        dressCode: profile.dressCode || '',
        teamSize: profile.teamSize || '',
        hiringFor: profile.hiringFor || '',
        experienceLevel: profile.experienceLevel || '',
        salaryRange: profile.salaryRange || '',
        hiringUrgency: profile.hiringUrgency || '',
        benefitsOffered: profile.benefitsOffered || [],
        awards: profile.awards || '',
        certifications: profile.certifications || '',
        clients: profile.clients || '',
        companyLogo: profile.companyLogo || '',
        coverImage: profile.coverImage || '',
        industry: profile.industry || '',
        revenue: profile.revenue || '',
        employeeGrowth: profile.employeeGrowth || '',
        hrName: profile.hrName || '',
        hrEmail: profile.hrEmail || '',
        hrPhone: profile.hrPhone || '',
        hrDesignation: profile.hrDesignation || ''
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBenefitsChange = (benefit) => {
    setFormData(prev => ({
      ...prev,
      benefitsOffered: prev.benefitsOffered.includes(benefit)
        ? prev.benefitsOffered.filter(b => b !== benefit)
        : [...prev.benefitsOffered, benefit]
    }));
  };
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/update-company-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        onProfileUpdate(result.user);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        console.error('Failed to update profile:', result);
        alert(`Failed to update profile: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (userData?.employerProfile) {
      const profile = userData.employerProfile;
      setFormData({
        companyName: profile.companyName || '',
        companyWebsite: profile.companyWebsite || '',
        companyLocation: profile.companyLocation || '',
        companyDescription: profile.companyDescription || '',
        // ... reset all other fields
      });
    }
    setIsEditing(false);
  };

  const benefitsOptions = [
    'Health Insurance', 'Dental Insurance', 'Vision Insurance', 'Life Insurance',
    '401(k) / Retirement Plan', 'Paid Time Off', 'Sick Leave', 'Parental Leave',
    'Flexible Working Hours', 'Remote Work Options', 'Work from Home',
    'Professional Development', 'Training & Certification', 'Conference Attendance',
    'Gym Membership', 'Wellness Programs', 'Mental Health Support',
    'Free Meals', 'Snacks & Beverages', 'Transportation Allowance',
    'Stock Options', 'Performance Bonus', 'Annual Bonus', 'Profit Sharing',
    'Employee Discounts', 'Relocation Assistance', 'Education Assistance',
    'Childcare Support', 'Team Building Activities', 'Company Events'
  ];

  if (!isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Cover Image Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl">
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-xl"></div>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Company Logo & Basic Info */}
        <div className="px-6 py-6">
          <div className="flex items-start gap-6 -mt-16 relative z-10">
            <div className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center">
              {formData.companyLogo ? (
                <img src={formData.companyLogo} alt="Company Logo" className="w-20 h-20 rounded-lg object-cover" />
              ) : (
                <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1 mt-4">              <h1 className="text-2xl font-bold text-black">{formData.companyName || 'Company Name'}</h1>
              <p className="text-black mt-1">{formData.companyDescription || 'Company description will appear here'}</p>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-black">
                {formData.companyLocation && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {formData.companyLocation}
                  </div>
                )}
                {formData.companyWebsite && (
                  <div className="flex items-center gap-1">
                    <GlobeAltIcon className="w-4 h-4" />
                    <a href={formData.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </div>
                )}
                {formData.companySize && (
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-4 h-4" />
                    {formData.companySize} employees
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {/* About Company */}
            <div className="lg:col-span-2 space-y-6">
              <div>                <h3 className="text-lg font-semibold text-black mb-3">About Company</h3>
                <p className="text-black leading-relaxed">
                  {formData.aboutCompany || 'Company description will appear here when added.'}
                </p>
              </div>

              {formData.mission && (
                <div>                  <h4 className="font-semibold text-black mb-2">Mission</h4>
                  <p className="text-black">{formData.mission}</p>
                </div>
              )}

              {formData.vision && (
                <div>                  <h4 className="font-semibold text-black mb-2">Vision</h4>
                  <p className="text-black">{formData.vision}</p>
                </div>
              )}

              {formData.values && (
                <div>                  <h4 className="font-semibold text-black mb-2">Values</h4>
                  <p className="text-black">{formData.values}</p>
                </div>
              )}

              {/* Benefits */}
              {formData.benefitsOffered && formData.benefitsOffered.length > 0 && (
                <div>
                  <h4 className="font-semibold text-black mb-3">Benefits & Perks</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.benefitsOffered.map((benefit, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Company Info Sidebar */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Company Details</h3>
                <div className="space-y-3">
                  {formData.foundedYear && (
                    <div>
                      <span className="text-sm text-gray-500">Founded</span>
                      <p className="font-medium">{formData.foundedYear}</p>
                    </div>
                  )}
                  
                  {formData.companyType && (
                    <div>
                      <span className="text-sm text-gray-500">Industry</span>
                      <p className="font-medium capitalize">{formData.companyType.replace('-', ' ')}</p>
                    </div>
                  )}
                  
                  {formData.headquarters && (
                    <div>
                      <span className="text-sm text-gray-500">Headquarters</span>
                      <p className="font-medium">{formData.headquarters}</p>
                    </div>
                  )}
                  
                  {formData.workModel && (
                    <div>
                      <span className="text-sm text-gray-500">Work Model</span>
                      <p className="font-medium capitalize">{formData.workModel.replace('-', ' ')}</p>
                    </div>
                  )}
                  
                  {formData.workingHours && (
                    <div>
                      <span className="text-sm text-gray-500">Working Hours</span>
                      <p className="font-medium">{formData.workingHours}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              {(formData.linkedinUrl || formData.twitterUrl || formData.facebookUrl) && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Follow Us</h4>
                  <div className="space-y-2">
                    {formData.linkedinUrl && (
                      <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 text-blue-600 hover:underline">
                        <LinkIcon className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {formData.twitterUrl && (
                      <a href={formData.twitterUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 text-blue-600 hover:underline">
                        <LinkIcon className="w-4 h-4" />
                        Twitter
                      </a>
                    )}
                    {formData.facebookUrl && (
                      <a href={formData.facebookUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 text-blue-600 hover:underline">
                        <LinkIcon className="w-4 h-4" />
                        Facebook
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {(formData.hrName || formData.companyEmail || formData.companyPhone) && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Info</h4>
                  <div className="space-y-2 text-sm">
                    {formData.hrName && (
                      <div>
                        <span className="text-gray-500">HR Contact:</span>
                        <p className="font-medium">{formData.hrName}</p>
                      </div>
                    )}
                    {formData.companyEmail && (
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{formData.companyEmail}</p>
                      </div>
                    )}
                    {formData.companyPhone && (
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium">{formData.companyPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode UI
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Company Profile</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <XMarkIcon className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <CheckIcon className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>                <label className="block text-sm font-medium text-black mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Enter company name"
                />
              </div>
              
              <div>                <label className="block text-sm font-medium text-black mb-2">Company Website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="https://your-company.com"
                />
              </div>
              
              <div>                <label className="block text-sm font-medium text-black mb-2">Location</label>
                <input
                  type="text"
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="City, State"
                />
              </div>
              
              <div>                <label className="block text-sm font-medium text-black mb-2">Founded Year</label>
                <input
                  type="number"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="2020"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>            <div className="mt-4">
              <label className="block text-sm font-medium text-black mb-2">Company Description</label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Brief description of your company"
              />
            </div>
          </div>

          {/* Company Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Company Type</label>                <select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">Select type</option>
                  <option value="software-company">Software Company</option>
                  <option value="startup">Startup</option>
                  <option value="consulting">Consulting</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="non-profit">Non-Profit</option>
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Company Size</label>                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>
          </div>

          {/* About Company Section */}          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">About Company</label>
                <textarea
                  name="aboutCompany"
                  value={formData.aboutCompany}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Detailed description about your company, what you do, your culture, etc."
                />
              </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Mission</label>
                  <textarea
                    name="mission"
                    value={formData.mission}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Company mission statement"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Vision</label>
                  <textarea
                    name="vision"
                    value={formData.vision}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Company vision statement"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Values</label>
                  <textarea
                    name="values"
                    value={formData.values}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Company core values"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {benefitsOptions.map((benefit) => (
                <label key={benefit} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.benefitsOffered.includes(benefit)}
                    onChange={() => handleBenefitsChange(benefit)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-black">{benefit}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Social Media & Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">              <div>
                <label className="block text-sm font-medium text-black mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="https://linkedin.com/company/your-company"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Company Email</label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="contact@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Company Phone</label>
                <input
                  type="tel"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>                <label className="block text-sm font-medium text-black mb-2">HR Contact Name</label>
                <input
                  type="text"
                  name="hrName"
                  value={formData.hrName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="HR Manager Name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
