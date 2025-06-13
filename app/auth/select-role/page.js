'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function SelectRoleContent() {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    // Check if user is authenticated
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Only show role selection for users with default 'user' role who haven't completed any profiles
    if (session.user.role && session.user.role !== 'user') {
      // User already has a specific role, redirect to appropriate dashboard
      if (session.user.role === 'employer') {
        router.push('/hire');
      } else if (session.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/jobseeker');
      }
    }
  }, [session, router]);

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedRole,
        }),
      });

      const data = await response.json();      if (response.ok) {
        // Update the session with new role
        await update({ role: selectedRole });        // Redirect based on role
        if (selectedRole === 'employer') {
          router.push('/auth/employer-questionnaire');
        } else {
          // Job seekers go to questionnaire first
          router.push('/auth/questionnaire');
        }
      } else {
        setError(data.error || 'Failed to update role');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {session.user.name}!</h1>
          <p className="text-gray-600">Let us know how you'd like to use JobPortal</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleRoleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">I want to:</h3>
              <div className="space-y-3">
                {/* Job Seeker Option */}
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedRole === 'user' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={selectedRole === 'user'}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center w-full">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === 'user' 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedRole === 'user' && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">                      <div className="flex items-center mb-1">
                        <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="font-medium text-gray-900">Find Jobs</span>
                      </div>
                      <p className="text-sm text-gray-600">Search and apply for job opportunities as a job seeker</p>
                    </div>
                  </div>
                </label>

                {/* Employer Option */}
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedRole === 'employer' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={selectedRole === 'employer'}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center w-full">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === 'employer' 
                          ? 'border-purple-500 bg-purple-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedRole === 'employer' && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">                      <div className="flex items-center mb-1">
                        <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium text-gray-900">Hire Talent</span>
                      </div>
                      <p className="text-sm text-gray-600">Post jobs and find the perfect candidates for your company</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading || !selectedRole}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting started...
                </div>
              ) : (
                'Continue to Dashboard'
              )}
            </button>
          </form>
        </div>        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            You can change your role later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}

function SelectRoleLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Loading...
          </h2>
        </div>
      </div>
    </div>
  );
}

export default function SelectRole() {
  return (
    <Suspense fallback={<SelectRoleLoading />}>
      <SelectRoleContent />
    </Suspense>
  );
}
