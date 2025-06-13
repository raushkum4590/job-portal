'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Questionnaire() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    experienceLevel: '',
    fieldOfInterest: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Only allow job seekers (users with role 'user')
    if (session.user.role !== 'user') {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.experienceLevel || !formData.fieldOfInterest) {
      setError('Please answer all questions');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to job seeker dashboard
        router.push('/jobseeker');
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
    router.push('/jobseeker');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">Tell us about yourself</h1>
          <p className="text-black font-medium">Help us personalize your job search experience</p>
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
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Experience Level Question */}
            <div>              <label className="block text-lg font-semibold text-black mb-4">
                What best describes your experience level?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'student', label: 'Student', desc: 'Currently pursuing education' },
                  { value: 'fresher', label: 'Fresher', desc: 'Recently graduated, looking for first job' },
                  { value: 'experienced', label: 'Experienced', desc: 'Have work experience in my field' }
                ].map((option) => (
                  <label key={option.value} className="flex items-start p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={option.value}
                      checked={formData.experienceLevel === option.value}
                      onChange={handleChange}
                      className="mt-1 mr-4 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>                      <div className="text-black font-semibold">{option.label}</div>
                      <div className="text-black text-sm">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Field of Interest Question */}
            <div>              <label className="block text-lg font-semibold text-black mb-4">
                What field are you interested in?
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
                  <label key={option.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-indigo-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="fieldOfInterest"
                      value={option.value}
                      checked={formData.fieldOfInterest === option.value}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-black font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                  'Complete Profile'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-black hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Skip for now
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">            <p className="text-xs text-black">
              This information helps us show you more relevant job opportunities. You can always update this later in your profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
