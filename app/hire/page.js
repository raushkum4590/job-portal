'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CompanyProfileEditor from '../../components/CompanyProfileEditor';
import JobPostForm from '../../components/JobPostForm';
import { 
  PlusIcon, 
  PencilIcon, 
  EyeIcon, 
  TrashIcon,
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  XMarkIcon,
  PaperClipIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function HireDashboard() {
  console.log('🏢 HireDashboard component loading...');
  
  const { data: session, status } = useSession();
  const router = useRouter();  const [userData, setUserData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showApplications, setShowApplications] = useState(false);
  const [selectedJobForApplications, setSelectedJobForApplications] = useState(null);  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    candidatesInterviewed: 0,
    hiredCandidates: 0
  });
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);

  console.log('🏢 Session status:', status, 'Session data:', session);
  useEffect(() => {
    console.log('🏢 useEffect triggered with status:', status, 'session:', !!session);
    
    if (status === 'loading') {
      console.log('🏢 Session still loading, waiting...');
      return;
    }
    
    if (!session) {
      console.log('🏢 No session found, redirecting to signin');
      router.push('/auth/signin');
      return;
    }

    console.log('🏢 Session found:', {
      email: session.user?.email,
      role: session.user?.role,
      name: session.user?.name
    });

    // Redirect non-employers
    if (session.user.role !== 'employer') {
      console.log('🏢 User is not employer, role:', session.user.role);
      if (session.user.role === 'user') {
        router.push('/jobseeker');
      } else if (session.user.role === 'admin') {
        router.push('/admin/dashboard');
      }
      return;
    }

    console.log('🏢 User is employer, fetching data...');// Fetch user data including UUID
    const fetchUserData = async () => {
      try {
        console.log('👤 Fetching user data...');
        const response = await fetch('/api/user/me');
        
        console.log('👤 User API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('👤 User data:', data.user);
          console.log('🆔 User ID for job fetching:', data.user._id);
          
          setUserData(data.user);
          // Fetch jobs after getting user data
          await fetchJobs(data.user._id);
        } else {
          const errorData = await response.text();
          console.error('❌ User API error response:', response.status, errorData);
        }
      } catch (error) {
        console.error('💥 Error fetching user data:', error);
      }
    };    fetchUserData();
  }, [session, status, router]);

  // Auto-refresh jobs every 30 seconds to check for new applications
  useEffect(() => {
    if (userData?._id) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing jobs for new applications...');
        fetchJobs(userData._id);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [userData?._id]);const fetchJobs = async (employerId) => {
    // Only fetch jobs if we have a valid employerId
    if (!employerId) {
      console.warn('No employerId provided, skipping job fetch');
      return;
    }
    
    console.log('🔍 Fetching jobs for employerId:', employerId);
    
    try {
      setLoadingJobs(true);
      const response = await fetch(`/api/jobs?employer=${employerId}`);
      
      console.log('📡 Jobs API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Jobs API response data:', data);
        console.log('📋 Number of jobs fetched:', data.jobs?.length || 0);
        
        setJobs(data.jobs || []);
          // Calculate stats from jobs
        const activeJobs = (data.jobs || []).filter(job => job.status === 'active').length;
        const totalApplications = (data.jobs || []).reduce((sum, job) => sum + (job.applications?.length || 0), 0);
        
        console.log('📈 Active jobs:', activeJobs, 'Total applications:', totalApplications);
        
        // Check for new applications
        const previousApplications = stats.totalApplications;
        if (previousApplications > 0 && totalApplications > previousApplications) {
          const newApps = totalApplications - previousApplications;
          setNewApplicationsCount(prev => prev + newApps);
          console.log(`🎉 ${newApps} new application(s) received!`);
        }
        
        setStats(prev => ({
          ...prev,
          activeJobs,
          totalApplications
        }));
      } else {
        const errorData = await response.text();
        console.error('❌ Jobs API error response:', response.status, errorData);
      }
    } catch (error) {
      console.error('💥 Error fetching jobs:', error);
    } finally {
      setLoadingJobs(false);
      console.log('✅ Finished fetching jobs');
    }
  };

  // Function to refresh jobs data (can be called when applications are submitted)
  const refreshJobs = () => {
    if (userData?._id) {
      console.log('🔄 Refreshing jobs data...');
      fetchJobs(userData._id);
    }
  };  const handleProfileUpdate = (updatedUser) => {
    setUserData(updatedUser);
  };

  // Quick Action Handlers
  const handleViewAllApplications = () => {
    if (jobs.length > 0) {
      // Find the job with the most applications or the most recent one
      const jobWithApplications = jobs.find(job => job.applicationCount > 0) || jobs[0];
      if (jobWithApplications) {
        handleViewApplications(jobWithApplications);
      }
    }
  };

  const handleManageJobs = () => {
    // Scroll to job management section
    const jobSection = document.querySelector('#job-management-section');
    if (jobSection) {
      jobSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewAnalytics = () => {
    // Future implementation for analytics dashboard
    alert('Analytics dashboard coming soon!');
  };
  const handleViewApplications = async (job) => {
    setSelectedJobForApplications(job);
    setShowApplications(true);
    setLoadingApplications(true);
    
    // Clear new applications notification when viewing
    setNewApplicationsCount(0);
    
    try {
      const response = await fetch(`/api/jobs/${job._id}/applications`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Error fetching applications');
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`/api/jobs/${selectedJobForApplications._id}/applications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });

      if (response.ok) {
        // Update the applications list
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status');
    }
  };

  const handleJobSubmit = async (jobData) => {
    try {
      const url = editingJob ? `/api/jobs/${editingJob._id}` : '/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';
      const body = editingJob ? { jobId: editingJob._id, ...jobData } : jobData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        // Refresh jobs list
        await fetchJobs(userData._id);
        setShowJobForm(false);
        setEditingJob(null);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`/api/jobs?id=${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchJobs(userData._id);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Error deleting job');
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchJobs(userData._id);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Error updating job status');
    }
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
      return 'Salary not specified';
    }

    if (salaryRange.negotiable) {
      return 'Negotiable';
    }

    const currency = salaryRange.currency || 'USD';
    const period = salaryRange.period || 'yearly';
    
    let range = '';
    if (salaryRange.min && salaryRange.max) {
      range = `${currency} ${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()}`;
    } else if (salaryRange.min) {
      range = `${currency} ${salaryRange.min.toLocaleString()}+`;
    } else if (salaryRange.max) {
      range = `Up to ${currency} ${salaryRange.max.toLocaleString()}`;
    }

    return `${range} ${period}`;
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Listen for new application notifications (simple notification system)
  useEffect(() => {
    if (typeof window !== 'undefined' && userData?._id) {
      const checkForNotifications = () => {
        try {
          const notifications = JSON.parse(localStorage.getItem('application-notifications') || '[]');
          const newNotifications = notifications.filter(notification => 
            notification.timestamp > (Date.now() - 300000) // Last 5 minutes
          );
          
          if (newNotifications.length > 0) {
            console.log('📢 New application notifications found:', newNotifications);
            // Trigger a refresh of jobs data
            fetchJobs(userData._id);
            
            // Clear old notifications
            const recentNotifications = notifications.filter(notification => 
              notification.timestamp > (Date.now() - 86400000) // Keep for 24 hours
            );
            localStorage.setItem('application-notifications', JSON.stringify(recentNotifications));
          }
        } catch (error) {
          console.error('Error checking notifications:', error);
        }
      };
      
      // Check immediately and then every 30 seconds
      checkForNotifications();
      const interval = setInterval(checkForNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userData?._id]);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'employer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
                <p className="text-gray-600">Manage your hiring process and find the best talent</p>
                <p className="text-xs text-gray-400 mt-1">
                  Company ID: {userData?.uuid || 'Loading...'}
                </p>
              </div>              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Employer
                </div>
                  {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block">{session.user.name}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 profile-dropdown">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                        <p className="text-sm text-gray-500">{session.user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowCompanyProfile(true);
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserCircleIcon className="w-4 h-4 mr-3" />
                        Company Profile
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowCompanyProfile(true);
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <BuildingOfficeIcon className="w-4 h-4 mr-3" />
                        Company Settings
                      </button>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            handleSignOut();
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
            {newApplicationsCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                {newApplicationsCount > 9 ? '9+' : newApplicationsCount}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.candidatesInterviewed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hiredCandidates}</p>
              </div>
            </div>
          </div>        </div>        {/* Enhanced Company Profile Section */}
        <div className="mb-8">
          <CompanyProfileEditor 
            userData={userData} 
            onProfileUpdate={handleProfileUpdate}
          />
        </div>        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <span className="text-sm text-gray-500">Get started with hiring</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Post New Job */}
                <button 
                  onClick={() => setShowJobForm(true)}
                  className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <PlusIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Post New Job</h3>
                  <p className="text-sm text-gray-600 text-center">Create and publish a new job listing</p>
                  <div className="mt-3 text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to get started →
                  </div>
                </button>

                {/* View Applications */}
                <button 
                  onClick={handleViewAllApplications}
                  disabled={stats.totalApplications === 0}
                  className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 bg-gradient-to-br from-purple-50 to-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative">
                    <UsersIcon className="w-6 h-6 text-white" />
                    {stats.totalApplications > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {stats.totalApplications > 99 ? '99+' : stats.totalApplications}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">View Applications</h3>
                  <p className="text-sm text-gray-600 text-center">
                    {stats.totalApplications > 0 
                      ? `Review ${stats.totalApplications} candidate${stats.totalApplications > 1 ? 's' : ''}`
                      : 'No applications yet'
                    }
                  </p>
                  {stats.totalApplications > 0 && (
                    <div className="mt-3 text-xs text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Review now →
                    </div>
                  )}
                </button>

                {/* Manage Jobs */}
                <button 
                  onClick={handleManageJobs}
                  className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BriefcaseIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Manage Jobs</h3>
                  <p className="text-sm text-gray-600 text-center">
                    {jobs.length > 0 ? `${jobs.length} active job${jobs.length > 1 ? 's' : ''}` : 'No jobs posted'}
                  </p>
                  <div className="mt-3 text-xs text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View all jobs →
                  </div>
                </button>

                {/* Company Profile */}
                <button 
                  onClick={() => setShowCompanyProfile(true)}
                  className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 bg-gradient-to-br from-orange-50 to-yellow-50"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Company Profile</h3>
                  <p className="text-sm text-gray-600 text-center">Update your company information</p>
                  <div className="mt-3 text-xs text-orange-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit profile →
                  </div>
                </button>

                {/* Analytics */}
                <button 
                  onClick={handleViewAnalytics}
                  className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 bg-gradient-to-br from-indigo-50 to-blue-50"
                >
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 012 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
                  <p className="text-sm text-gray-600 text-center">View hiring performance metrics</p>
                  <div className="mt-3 text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Coming soon →
                  </div>
                </button>

                {/* Quick Tips */}
                <div className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50">
                  <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pro Tips</h3>
                  <p className="text-sm text-gray-600 text-center">
                    {jobs.length === 0 
                      ? "Start by posting your first job!"
                      : stats.totalApplications === 0
                      ? "Improve job visibility with better descriptions"
                      : "Consider reaching out to top candidates"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">New application for Frontend Developer</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Interview scheduled with Sarah Johnson</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Job posted: Backend Developer</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Candidate hired for UI/UX Designer</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Job Management Section */}
        <div className="mt-8" id="job-management-section">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Job Postings</h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={refreshJobs}
                  disabled={loadingJobs}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                  title="Refresh to see new applications"
                >
                  <svg className={`w-4 h-4 ${loadingJobs ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loadingJobs ? 'Refreshing...' : 'Refresh'}
                </button>
                <button 
                  onClick={() => setShowJobForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Post New Job
                </button>
              </div>
            </div>
            
            {loadingJobs ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                <p className="text-gray-600 mb-4">Start by posting your first job to find great candidates.</p>
                <button 
                  onClick={() => setShowJobForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job._id} className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                              {job.featured && (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Featured
                                </span>
                              )}
                              {job.urgent && (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Urgent
                                </span>
                              )}
                            </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <BriefcaseIcon className="w-4 h-4" />
                                <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPinIcon className="w-4 h-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CurrencyDollarIcon className="w-4 h-4" />
                                <span>{formatSalary(job.salaryRange)}</span>
                              </div>
                              {job.education && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                  </svg>
                                  <span className="capitalize">{job.education.replace(/-/g, ' ')}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
                              {job.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <UsersIcon className="w-4 h-4" />
                                <span>{job.applications?.length || 0} applications</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <EyeIcon className="w-4 h-4" />
                                <span>{job.views || 0} views</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                        <div className="flex items-center gap-2 ml-4">
                        {/* Applications Button */}
                        <button
                          onClick={() => handleViewApplications(job)}
                          className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 flex items-center gap-1"
                          title="View Applications"
                        >
                          <UsersIcon className="w-4 h-4" />
                          <span className="text-sm">{job.applications?.length || 0}</span>
                        </button>
                        
                        {/* Status Change Dropdown */}
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="closed">Closed</option>
                        </select>
                        
                        <button
                          onClick={() => handleEditJob(job)}
                          className="text-gray-400 hover:text-purple-600 p-2 rounded hover:bg-purple-50"
                          title="Edit Job"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50"
                          title="Delete Job"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                      {/* Job Tags and Education */}
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">REQUIRED SKILLS</p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 5 && (
                              <span className="text-gray-500 text-xs">
                                +{job.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Additional Qualifications */}
                      {job.additionalQualifications && job.additionalQualifications.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">ADDITIONAL QUALIFICATIONS</p>
                          <div className="flex flex-wrap gap-2">
                            {job.additionalQualifications.slice(0, 3).map((qualification, index) => (
                              <span
                                key={index}
                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                              >
                                {qualification.length > 40 ? `${qualification.substring(0, 40)}...` : qualification}
                              </span>
                            ))}
                            {job.additionalQualifications.length > 3 && (
                              <span className="text-gray-500 text-xs">
                                +{job.additionalQualifications.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job Post Form Modal */}
        <JobPostForm
          isOpen={showJobForm}
          onClose={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
          onSubmit={handleJobSubmit}
          jobData={editingJob}
          companyInfo={{
            location: userData?.employerProfile?.companyLocation,
            email: userData?.employerProfile?.companyEmail || userData?.email
          }}        />

        {/* Company Profile Modal */}
        {showCompanyProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Company Profile</h2>
                <button
                  onClick={() => setShowCompanyProfile(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <CompanyProfileEditor 
                  userData={userData}
                  onProfileUpdate={(updatedUser) => {
                    setUserData(updatedUser);
                    setShowCompanyProfile(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Applications Modal */}
        {showApplications && selectedJobForApplications && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-black">
                    Applications for {selectedJobForApplications.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {applications.length} total applications
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowApplications(false);
                    setSelectedJobForApplications(null);
                    setApplications([]);
                  }}
                  className="text-gray-400 hover:text-black"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Applications List */}
              <div className="px-6 py-4 flex-1 overflow-y-auto">
                {loadingApplications ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading applications...</p>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8">
                    <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600">Applications will appear here when job seekers apply to this position.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application._id} className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-lg">
                                {application.applicant.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">
                                {application.applicant.name}
                              </h3>
                              <p className="text-gray-600">{application.applicant.email}</p>
                              <p className="text-sm text-gray-500">
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <select
                              value={application.status}
                              onChange={(e) => handleUpdateApplicationStatus(application._id, e.target.value)}
                              className={`text-sm border rounded px-3 py-1 font-medium ${
                                application.status === 'pending' ? 'text-yellow-800 bg-yellow-50 border-yellow-200' :
                                application.status === 'reviewing' ? 'text-blue-800 bg-blue-50 border-blue-200' :
                                application.status === 'shortlisted' ? 'text-purple-800 bg-purple-50 border-purple-200' :
                                application.status === 'interview' ? 'text-orange-800 bg-orange-50 border-orange-200' :
                                application.status === 'hired' ? 'text-green-800 bg-green-50 border-green-200' :
                                'text-red-800 bg-red-50 border-red-200'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewing">Reviewing</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="interview">Interview</option>
                              <option value="hired">Hired</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>

                        {/* Applicant Profile Info */}
                        {(application.applicant.experienceLevel || application.applicant.fieldOfInterest) && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {application.applicant.experienceLevel && (
                                <div>
                                  <span className="font-medium text-gray-700">Experience Level:</span>
                                  <p className="text-gray-600 capitalize">
                                    {application.applicant.experienceLevel.replace('-', ' ')}
                                  </p>
                                </div>
                              )}
                              {application.applicant.fieldOfInterest && (
                                <div>
                                  <span className="font-medium text-gray-700">Field of Interest:</span>
                                  <p className="text-gray-600 capitalize">
                                    {application.applicant.fieldOfInterest.replace(/-/g, ' ')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Application Details */}
                        <div className="space-y-4">
                          {application.coverLetter && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                              <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                                {application.coverLetter}
                              </p>
                            </div>
                          )}

                          {application.whyInterested && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Why Interested</h4>
                              <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                                {application.whyInterested}
                              </p>
                            </div>
                          )}

                          {application.experience && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Relevant Experience</h4>
                              <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                                {application.experience}
                              </p>
                            </div>
                          )}

                          {/* Skills */}
                          {application.skills && application.skills.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {application.skills.map((skill, index) => (
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

                          {/* Additional Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {application.availabilityDate && (
                              <div>
                                <span className="font-medium text-gray-700">Available From:</span>
                                <p className="text-gray-600">
                                  {new Date(application.availabilityDate).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            
                            {application.salaryExpectation && (application.salaryExpectation.min || application.salaryExpectation.max) && (
                              <div>
                                <span className="font-medium text-gray-700">Salary Expectation:</span>
                                <p className="text-gray-600">
                                  {application.salaryExpectation.min && application.salaryExpectation.max
                                    ? `${application.salaryExpectation.currency} ${application.salaryExpectation.min} - ${application.salaryExpectation.max}`
                                    : application.salaryExpectation.min
                                    ? `${application.salaryExpectation.currency} ${application.salaryExpectation.min}+`
                                    : `Up to ${application.salaryExpectation.currency} ${application.salaryExpectation.max}`
                                  }
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Links */}
                          <div className="flex flex-wrap gap-4">
                            {application.resumeUrl && (
                              <a
                                href={application.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                              >
                                <PaperClipIcon className="w-4 h-4" />
                                View Resume
                              </a>
                            )}
                            {application.portfolio && (
                              <a
                                href={application.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                              >
                                <EyeIcon className="w-4 h-4" />
                                View Portfolio
                              </a>
                            )}
                            {application.linkedinProfile && (
                              <a
                                href={application.linkedinProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                LinkedIn
                              </a>
                            )}
                            {application.githubProfile && (
                              <a
                                href={application.githubProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                GitHub
                              </a>
                            )}
                          </div>

                          {/* References */}
                          {application.references && application.references.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">References</h4>
                              <div className="space-y-2">
                                {application.references.map((reference, index) => (
                                  <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <span className="font-medium">{reference.name}</span>
                                        {reference.position && <p className="text-gray-600">{reference.position}</p>}
                                      </div>
                                      <div>
                                        {reference.company && <p className="text-gray-600">{reference.company}</p>}
                                        {reference.email && <p className="text-gray-600">{reference.email}</p>}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Applications Overview */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">All Recent Applications</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshJobs}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                {newApplicationsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {newApplicationsCount} new
                  </span>
                )}
              </div>
            </div>
            
            {loadingJobs ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.flatMap(job => 
                  (job.applications || []).map(application => ({
                    ...application,
                    jobTitle: job.title,
                    jobId: job._id
                  }))
                )
                .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                .slice(0, 10) // Show last 10 applications
                .map((application, index) => (
                  <div key={`${application.jobId}-${application._id || index}`} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {application.applicant?.name?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {application.applicant?.name || 'Applicant'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Applied for: <span className="font-medium">{application.jobTitle}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(application.appliedAt).toLocaleDateString()} at {new Date(application.appliedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'shortlisted' ? 'bg-purple-100 text-purple-800' :
                          application.status === 'interview' ? 'bg-orange-100 text-orange-800' :
                          application.status === 'hired' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.status || 'pending'}
                        </span>
                        <button
                          onClick={() => {
                            const job = jobs.find(j => j._id === application.jobId);
                            if (job) {
                              handleViewApplications(job);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                    
                    {application.coverLetter && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {application.coverLetter.substring(0, 200)}
                          {application.coverLetter.length > 200 && '...'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {jobs.every(job => !job.applications || job.applications.length === 0) && (
                  <div className="text-center py-8">
                    <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600">Applications will appear here when job seekers apply to your positions.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Debug Section - Remove in production */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">🧪 Debug Tools (Remove in Production)</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={async () => {
                try {
                  console.log('Current jobs state:', jobs);
                  console.log('Total applications across all jobs:', 
                    jobs.reduce((total, job) => total + (job.applications?.length || 0), 0)
                  );
                  const applicationsBreakdown = jobs.map(job => ({
                    jobTitle: job.title,
                    jobId: job._id,
                    applicationsCount: job.applications?.length || 0,
                    applications: job.applications || []
                  }));
                  console.log('Applications breakdown by job:', applicationsBreakdown);
                  alert(`Debug info logged to console. Total applications: ${jobs.reduce((total, job) => total + (job.applications?.length || 0), 0)}`);
                } catch (error) {
                  console.error('Debug error:', error);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Debug Applications
            </button>
            <button
              onClick={async () => {
                if (userData?._id) {
                  console.log('Force refreshing jobs for employer:', userData._id);
                  await fetchJobs(userData._id);
                  alert('Jobs refreshed!');
                } else {
                  alert('No user data available');
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Force Refresh
            </button>              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/debug/jobs');
                    const data = await response.json();
                    console.log('All jobs in database:', data);
                    alert(`Found ${data.totalJobs} jobs in database. Check console for details.`);
                  } catch (error) {
                    console.error('Debug error:', error);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
              >
                Debug All Jobs
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/debug/applications');
                    const data = await response.json();
                    console.log('Debug: Detailed applications data:', data);
                    alert(`Found ${data.summary.totalApplications} total applications across ${data.summary.totalJobs} jobs. Recent: ${data.recentApplications.length}. Check console for details.`);
                  } catch (error) {
                    console.error('Debug error:', error);
                    alert('Debug error: ' + error.message);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Debug All Applications
              </button>
          </div>
          <div className="text-xs text-yellow-700">
            <p>Jobs loaded: {jobs.length} | Total applications: {jobs.reduce((total, job) => total + (job.applications?.length || 0), 0)}</p>
            <p>User ID: {userData?._id} | Auto-refresh: {userData?._id ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
