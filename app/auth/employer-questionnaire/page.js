'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployerQuestionnaire() {
  const { data: session, status } = useSession();
  const router = useRouter();  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    companySize: '',
    hiringFor: '',
    companyWebsite: '',
    companyLocation: '',
    companyDescription: '',
    workModel: '',
    experienceLevel: '',
    salaryRange: '',
    hiringUrgency: '',
    benefitsOffered: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Only allow employers
    if (session.user.role !== 'employer') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBenefitsChange = (benefit) => {
    setFormData(prev => ({
      ...prev,
      benefitsOffered: prev.benefitsOffered.includes(benefit)
        ? prev.benefitsOffered.filter(b => b !== benefit)
        : [...prev.benefitsOffered, benefit]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');    if (!formData.companyName || !formData.companyType || !formData.companySize || !formData.hiringFor) {
      setError('Please fill in the required fields (marked with *)');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/complete-employer-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to employer dashboard
        router.push('/hire');
      } else {
        setError(data.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/hire');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'employer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">Tell us about your company</h1>
          <p className="text-black font-medium">Help us personalize your hiring experience</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-lg font-semibold text-slate-800 mb-3">
                What's your company name? <span className="text-red-500">*</span>
              </label>              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm placeholder-slate-900 text-slate-900 bg-white"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            {/* Company Website */}
            <div>
              <label htmlFor="companyWebsite" className="block text-lg font-semibold text-slate-800 mb-3">
                Company Website (Optional)
              </label>              <input
                id="companyWebsite"
                name="companyWebsite"
                type="url"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm placeholder-slate-900 text-slate-900 bg-white"
                placeholder="https://your-company.com"
                value={formData.companyWebsite}
                onChange={handleChange}
              />
            </div>

            {/* Company Location */}
            <div>
              <label htmlFor="companyLocation" className="block text-lg font-semibold text-slate-800 mb-3">
                Company Location (Optional)
              </label>              <input
                id="companyLocation"
                name="companyLocation"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm placeholder-slate-900 text-slate-900 bg-white"
                placeholder="e.g., New York, NY or Remote"
                value={formData.companyLocation}
                onChange={handleChange}
              />
            </div>

            {/* Company Description */}
            <div>
              <label htmlFor="companyDescription" className="block text-lg font-semibold text-slate-800 mb-3">
                Company Description (Optional)
              </label>              <textarea
                id="companyDescription"
                name="companyDescription"
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm placeholder-slate-900 text-slate-900 bg-white resize-none"
                placeholder="Brief description of what your company does..."
                value={formData.companyDescription}
                onChange={handleChange}
              />
            </div>

            {/* Company Type */}
            <div>
              <label className="block text-lg font-semibold text-slate-800 mb-4">
                What type of company is it? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'software-company', label: 'Software Company' },
                  { value: 'startup', label: 'Startup' },
                  { value: 'consulting', label: 'Consulting' },
                  { value: 'finance', label: 'Finance & Banking' },
                  { value: 'healthcare', label: 'Healthcare' },
                  { value: 'education', label: 'Education' },
                  { value: 'retail', label: 'Retail & E-commerce' },
                  { value: 'manufacturing', label: 'Manufacturing' },
                  { value: 'non-profit', label: 'Non-Profit' },
                  { value: 'government', label: 'Government' },
                  { value: 'other', label: 'Other' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="companyType"
                      value={option.value}
                      checked={formData.companyType === option.value}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-900 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-lg font-semibold text-slate-800 mb-4">
                How many employees does your company have? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: '1-10', label: '1-10' },
                  { value: '11-50', label: '11-50' },
                  { value: '51-200', label: '51-200' },
                  { value: '201-500', label: '201-500' },
                  { value: '501-1000', label: '501-1000' },
                  { value: '1000+', label: '1000+' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="companySize"
                      value={option.value}
                      checked={formData.companySize === option.value}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-900 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Work Model */}
            <div>
              <label className="block text-lg font-semibold text-slate-800 mb-4">
                What work model do you prefer? (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'remote', label: 'Remote' },
                  { value: 'hybrid', label: 'Hybrid' },
                  { value: 'on-site', label: 'On-site' },
                  { value: 'flexible', label: 'Flexible' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="workModel"
                      value={option.value}
                      checked={formData.workModel === option.value}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-900 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hiring For */}
            <div>
              <label className="block text-lg font-semibold text-slate-800 mb-4">
                What type of roles are you primarily hiring for? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'software-development', label: 'Software Development' },
                  { value: 'data-science', label: 'Data Science & Analytics' },
                  { value: 'digital-marketing', label: 'Digital Marketing' },
                  { value: 'design', label: 'Design (UI/UX/Graphic)' },
                  { value: 'finance', label: 'Finance & Accounting' },
                  { value: 'sales', label: 'Sales & Business Development' },
                  { value: 'hr', label: 'Human Resources' },
                  { value: 'operations', label: 'Operations & Management' },
                  { value: 'consulting', label: 'Consulting' },
                  { value: 'healthcare', label: 'Healthcare' },
                  { value: 'education', label: 'Education & Training' },
                  { value: 'other', label: 'Other' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="hiringFor"
                      value={option.value}
                      checked={formData.hiringFor === option.value}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-900 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-lg font-semibold text-slate-800 mb-4">
                What experience level are you looking for? (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'entry-level', label: 'Entry Level (0-2 years)' },
                  { value: 'mid-level', label: 'Mid Level (3-5 years)' },
                  { value: 'senior-level', label: 'Senior Level (6+ years)' },
                  { value: 'executive', label: 'Executive/Leadership' },
                  { value: 'all-levels', label: 'All Levels' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={option.value}
                      checked={formData.experienceLevel === option.value}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-900 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-lg font-semibold text-slate-800 mb-4">
                What's your typical salary range? (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'under-30k', label: 'Under $30K' },
                  { value: '30k-50k', label: '$30K - $50K' },
                  { value: '50k-75k', label: '$50K - $75K' },
                  { value: '75k-100k', label: '$75K - $100K' },
                  { value: '100k-150k', label: '$100K - $150K' },
                  { value: '150k-200k', label: '$150K - $200K' },
                  { value: 'above-200k', label: 'Above $200K' },
                  { value: 'negotiable', label: 'Negotiable' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="salaryRange"
                      value={option.value}
                      checked={formData.salaryRange === option.value}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-900 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hiring Urgency */}
            <div>
              <label className="block text-lg font-semibold text-slate-800 mb-4">
                How urgent is your hiring need? (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'immediate', label: 'Immediate (ASAP)' },
                  { value: 'within-month', label: 'Within 1 Month' },
                  { value: 'within-quarter', label: 'Within 3 Months' },
                  { value: 'ongoing', label: 'Ongoing Process' },
                  { value: 'planning', label: 'Just Planning' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="hiringUrgency"
                      value={option.value}
                      checked={formData.hiringUrgency === option.value}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-900 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Benefits Offered */}
            <div>
              <label className="block text-lg font-semibold text-slate-800 mb-4">
                What benefits do you offer? (Optional - Select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'health-insurance', label: 'Health Insurance' },
                  { value: 'dental-insurance', label: 'Dental Insurance' },
                  { value: 'vision-insurance', label: 'Vision Insurance' },
                  { value: 'retirement-401k', label: '401(k) / Retirement Plan' },
                  { value: 'flexible-hours', label: 'Flexible Hours' },
                  { value: 'remote-work', label: 'Remote Work Options' },
                  { value: 'paid-time-off', label: 'Paid Time Off' },
                  { value: 'professional-development', label: 'Professional Development' },
                  { value: 'gym-membership', label: 'Gym Membership' },
                  { value: 'free-meals', label: 'Free Meals/Snacks' },
                  { value: 'stock-options', label: 'Stock Options/Equity' },
                  { value: 'parental-leave', label: 'Parental Leave' },
                  { value: 'mental-health-support', label: 'Mental Health Support' },
                  { value: 'transportation-allowance', label: 'Transportation Allowance' },
                  { value: 'other', label: 'Other Benefits' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.benefitsOffered.includes(option.value)}
                      onChange={() => handleBenefitsChange(option.value)}
                      className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                    />
                    <span className="text-slate-900 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Skip for now
              </button>
            </div>
          </form>          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              This comprehensive profile helps us match you with the best candidates and provide personalized recommendations. All fields marked with <span className="text-red-500">*</span> are required, others are optional but highly recommended. You can always update this information later in your profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
