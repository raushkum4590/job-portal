'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function UserProfileTest() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/user/me');
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  if (status === 'loading') {
    return <div className="p-8">Loading session...</div>;
  }

  if (!session) {
    return <div className="p-8">Not signed in. Please sign in first.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">User Profile Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Data</h2>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Database Profile</h2>
            <button 
              onClick={fetchUserProfile}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {userProfile ? (
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(userProfile, null, 2)}
            </pre>
          ) : (
            <p>No profile data loaded</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Analysis</h2>
          {userProfile?.user && (
            <div className="space-y-2">
              <p><strong>Role:</strong> {userProfile.user.role}</p>
              <p><strong>Job Seeker Profile Completed:</strong> {userProfile.user.jobSeekerProfile?.profileCompleted ? 'Yes' : 'No'}</p>
              <p><strong>Employer Profile Completed:</strong> {userProfile.user.employerProfile?.profileCompleted ? 'Yes' : 'No'}</p>
              
              <div className="mt-4 p-4 bg-yellow-50 rounded">
                <h3 className="font-semibold text-yellow-800">Redirect Logic:</h3>
                {userProfile.user.role === 'user' && 
                 !userProfile.user.jobSeekerProfile?.profileCompleted && 
                 !userProfile.user.employerProfile?.profileCompleted ? (
                  <p className="text-yellow-700">✅ Should redirect to role selection</p>
                ) : userProfile.user.jobSeekerProfile?.profileCompleted ? (
                  <p className="text-green-700">✅ Should redirect to job seeker dashboard</p>
                ) : userProfile.user.employerProfile?.profileCompleted ? (
                  <p className="text-green-700">✅ Should redirect to employer dashboard</p>
                ) : (
                  <p className="text-blue-700">✅ Should redirect based on role: {userProfile.user.role}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
