'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Check if user needs role selection (users with default 'user' role and no completed profiles)
    const checkUserProfileAndRedirect = async () => {
      try {
        if (session.user.role === 'user') {
          // Fetch user profile to check completion status
          const response = await fetch('/api/user/me');
          const data = await response.json();
          
          if (response.ok && data.user) {
            const hasJobSeekerProfile = data.user.jobSeekerProfile?.profileCompleted;
            const hasEmployerProfile = data.user.employerProfile?.profileCompleted;
            
            // If no profiles are completed, user needs role selection
            if (!hasJobSeekerProfile && !hasEmployerProfile) {
              router.push('/auth/select-role');
              return;
            }
            
            // If job seeker profile is completed, go to job seeker dashboard
            if (hasJobSeekerProfile) {
              router.push('/jobseeker');
              return;
            }
            
            // If employer profile is completed, go to employer dashboard
            if (hasEmployerProfile) {
              router.push('/hire');
              return;
            }
          }
          
          // Fallback: if we can't determine profile status, go to role selection
          router.push('/auth/select-role');
        } else {
          // User has specific role, redirect accordingly
          if (session.user.role === 'employer') {
            router.push('/hire');
          } else if (session.user.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            // Default to job seeker for any other roles
            router.push('/jobseeker');
          }
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        // On error, default to role selection for safety
        router.push('/auth/select-role');
      }
    };

    checkUserProfileAndRedirect();
  }, [session, status, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  // This should not render since we redirect immediately
  return null;
}