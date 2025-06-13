'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  MagnifyingGlassIcon,
  HeartIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ClockIcon,
  BuildingOfficeIcon,
  EyeIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import JobApplicationForm from '../../components/JobApplicationForm';
import UserApplicationsSection from '../../components/UserApplicationsSection';
import UserProfile from '../../components/UserProfile';

export default function JobSeekerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [userData, setUserData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // User applications state
  const [userApplications, setUserApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
    rejected: 0
  });
    // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, profile, applications, jobs
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    department: '',
    jobType: '',
    workModel: '',
    location: ''
  });
  const [stats, setStats] = useState({
    appliedJobs: 0,
    savedJobs: 0,
    profileViews: 0,
    interviews: 0
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Redirect non-job seekers
    if (session.user.role !== 'user') {
      if (session.user.role === 'employer') {
        router.push('/hire');
      } else if (session.user.role === 'admin') {
        router.push('/admin/dashboard');
      }
      return;
    }

    // Fetch user data and jobs
    const fetchData = async () => {
      try {
        console.log('🔍 JobSeeker: Fetching data...');
        const [userResponse, jobsResponse, applicationsResponse] = await Promise.all([
          fetch('/api/user/me'),
          fetch('/api/jobs?status=active'),
          fetch('/api/user/applications')
        ]);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserData(userData.user);
          console.log('👤 JobSeeker: User data fetched:', userData.user);
        }

        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(jobsData.jobs || []);
        }

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setUserApplications(applicationsData.applications || []);
          setApplicationStats({
            total: applicationsData.totalApplications,
            pending: applicationsData.applicationsByStatus.pending.length,
            reviewing: applicationsData.applicationsByStatus.reviewing.length,
            shortlisted: applicationsData.applicationsByStatus.shortlisted.length,
            interview: applicationsData.applicationsByStatus.interview.length,
            hired: applicationsData.applicationsByStatus.hired.length,
            rejected: applicationsData.applicationsByStatus.rejected.length
          });
          
          // Update stats
          setStats(prev => ({
            ...prev,
            appliedJobs: applicationsData.totalApplications,
            interviews: applicationsData.interviewCount
          }));
        }
        
      } catch (error) {
        console.error('💥 JobSeeker: Error fetching data:', error);
      } finally {
        setLoadingJobs(false);
        setLoadingApplications(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyToJob = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const handleApplicationSubmitted = () => {
    // Refresh applications after submission
    fetchUserApplications();
    setShowApplicationForm(false);
    setSelectedJob(null);
  };

  const fetchUserApplications = async () => {
    try {
      setLoadingApplications(true);
      const response = await fetch('/api/user/applications');
      
      if (response.ok) {
        const data = await response.json();
        setUserApplications(data.applications || []);
        setApplicationStats({
          total: data.totalApplications,
          pending: data.applicationsByStatus.pending.length,
          reviewing: data.applicationsByStatus.reviewing.length,
          shortlisted: data.applicationsByStatus.shortlisted.length,
          interview: data.applicationsByStatus.interview.length,
          hired: data.applicationsByStatus.hired.length,
          rejected: data.applicationsByStatus.rejected.length
        });
      }
    } catch (error) {
      console.error('💥 Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserData(prev => ({
      ...prev,
      ...updatedProfile
    }));
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

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const filteredJobs = jobs.filter(job => {
    if (searchFilters.query && !job.title.toLowerCase().includes(searchFilters.query.toLowerCase()) &&
        !job.description.toLowerCase().includes(searchFilters.query.toLowerCase())) {
      return false;
    }
    if (searchFilters.department && job.department !== searchFilters.department) return false;
    if (searchFilters.jobType && job.jobType !== searchFilters.jobType) return false;
    if (searchFilters.workModel && job.workModel !== searchFilters.workModel) return false;
    if (searchFilters.location && !job.location.toLowerCase().includes(searchFilters.location.toLowerCase())) return false;
    return true;
  });

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    });
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'user') {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header with Profile Menu */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
                  <p className="text-gray-600">Ready to find your next opportunity?</p>
                </div>
              </div>
              
              {/* Profile Menu */}
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Job Seeker
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">{session.user.name}</div>
                      <div className="text-xs text-gray-500">{session.user.email}</div>
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 profile-menu">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">{session.user.name}</div>
                        <div className="text-xs text-gray-500">{session.user.email}</div>
                        <div className="text-xs text-gray-400 mt-1">ID: {userData?.uuid || 'Loading...'}</div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 mr-3" />
                        View Profile
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          // Add settings functionality later
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Cog6ToothIcon className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleSignOut();
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm relative ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Applications
                {applicationStats.shortlisted > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {applicationStats.shortlisted}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'jobs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Browse Jobs
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Applied Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.appliedJobs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.savedJobs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Profile Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Interviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.interviews}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setActiveTab('jobs')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Search Jobs</p>
                        <p className="text-sm text-gray-500">Find your dream job</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Update Profile</p>
                        <p className="text-sm text-gray-500">Keep your profile current</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Upload Resume</p>
                        <p className="text-sm text-gray-500">Update your resume</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveTab('applications')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">View Applications</p>
                        <p className="text-sm text-gray-500">Track your progress</p>
                      </div>
                    </button>
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
                      <p className="text-sm text-gray-900">Applied to Software Developer position</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Profile viewed by TechCorp</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Saved Frontend Developer job</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Updated resume</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>            {/* Enhanced Profile Summary with Experience & Education */}
            <div className="space-y-8 mt-8">
              {/* Basic Profile Info */}
              {userData?.jobSeekerProfile && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Overview</h2>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit Profile
                    </button>
                  </div>
                  
                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Experience Level</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {userData.jobSeekerProfile.experienceLevel ? 
                            userData.jobSeekerProfile.experienceLevel.replace('-', ' ') : 
                            'Not specified'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Field of Interest</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {userData.jobSeekerProfile.fieldOfInterest ? 
                            userData.jobSeekerProfile.fieldOfInterest.replace(/-/g, ' ') : 
                            'Not specified'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">
                          {userData.profile?.location || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Headline */}
                  {userData.profile?.headline && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Professional Headline</h3>
                      <p className="text-gray-700">{userData.profile.headline}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {userData.profile?.skills && userData.profile.skills.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.profile.skills.slice(0, 10).map((skill, index) => (
                          <span 
                            key={index}
                            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {userData.profile.skills.length > 10 && (
                          <span className="text-sm text-gray-500 px-3 py-1">
                            +{userData.profile.skills.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {!userData.jobSeekerProfile.profileCompleted && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Complete your profile</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Help us show you more relevant job opportunities by completing your profile.
                          </p>
                          <button 
                            onClick={() => setActiveTab('profile')}
                            className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                          >
                            Complete now →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Work Experience Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
                  </div>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add Experience
                  </button>
                </div>

                {userData?.profile?.experience && userData.profile.experience.length > 0 ? (
                  <div className="space-y-6">
                    {userData.profile.experience.slice(0, 3).map((exp, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <BuildingOfficeIcon className="w-6 h-6 text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                              <p className="text-blue-600 font-medium">{exp.company}</p>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                <span>
                                  {exp.startDate} - {exp.endDate || 'Present'}
                                </span>
                                {exp.location && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <MapPinIcon className="w-4 h-4 mr-1" />
                                    <span>{exp.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            {exp.current && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 mt-2 text-sm line-clamp-3">
                              {exp.description}
                            </p>
                          )}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="mt-2">
                              <ul className="text-sm text-gray-600 space-y-1">
                                {exp.achievements.slice(0, 2).map((achievement, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {userData.profile.experience.length > 3 && (
                      <div className="text-center pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => setActiveTab('profile')}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View all {userData.profile.experience.length} experiences
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No work experience added</h3>
                    <p className="text-gray-600 mb-4">
                      Add your work experience to help employers understand your background.
                    </p>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Add Experience
                    </button>
                  </div>
                )}
              </div>

              {/* Education Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                  </div>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add Education
                  </button>
                </div>

                {userData?.profile?.education && userData.profile.education.length > 0 ? (
                  <div className="space-y-6">
                    {userData.profile.education.slice(0, 3).map((edu, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                              <p className="text-blue-600 font-medium">{edu.institution}</p>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                <span>
                                  {edu.startYear} - {edu.endYear || 'Present'}
                                </span>
                                {edu.gpa && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>GPA: {edu.gpa}</span>
                                  </>
                                )}
                              </div>
                              {edu.fieldOfStudy && (
                                <p className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Field:</span> {edu.fieldOfStudy}
                                </p>
                              )}
                            </div>
                            {edu.current && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          {edu.description && (
                            <p className="text-gray-700 mt-2 text-sm">
                              {edu.description}
                            </p>
                          )}
                          {edu.achievements && edu.achievements.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-2">
                                {edu.achievements.slice(0, 3).map((achievement, idx) => (
                                  <span 
                                    key={idx}
                                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {achievement}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {userData.profile.education.length > 3 && (
                      <div className="text-center pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => setActiveTab('profile')}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View all {userData.profile.education.length} education records
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No education added</h3>
                    <p className="text-gray-600 mb-4">
                      Add your educational background to showcase your qualifications.
                    </p>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Add Education
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <UserProfile 
              userData={userData} 
              onProfileUpdate={handleProfileUpdate}
            />
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <UserApplicationsSection 
            userApplications={userApplications}
            loadingApplications={loadingApplications}
            applicationStats={applicationStats}
          />
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <>
            {/* Job Search and Filters */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Your Next Opportunity</h2>
                
                {/* Search Bar */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search jobs by title, company, or keywords..."
                      value={searchFilters.query}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                    Search
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    value={searchFilters.department}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, department: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Departments</option>
                    <option value="software-development">Software Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="digital-marketing">Digital Marketing</option>
                    <option value="design">Design</option>
                    <option value="finance">Finance</option>
                    <option value="sales">Sales</option>
                    <option value="hr">HR</option>
                    <option value="operations">Operations</option>
                  </select>

                  <select
                    value={searchFilters.jobType}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, jobType: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Job Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>

                  <select
                    value={searchFilters.workModel}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, workModel: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Work Models</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                    <option value="flexible">Flexible</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Location"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Available Jobs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Available Jobs</h2>
                  <p className="text-sm text-gray-600">
                    {loadingJobs ? 'Loading...' : `${filteredJobs.length} jobs found`}
                  </p>
                </div>
              </div>
              
              {loadingJobs ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading jobs...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-8">
                  <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredJobs.map((job) => (
                    <div key={job._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {job.employer?.companyLogo ? (
                              <img 
                                src={job.employer.companyLogo} 
                                alt={job.employer.companyName || job.companyName}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                              <p className="text-sm text-gray-600">
                                {job.employer?.companyName || job.companyName}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BriefcaseIcon className="w-4 h-4" />
                              <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-4 h-4" />
                              <span>{getTimeAgo(job.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CurrencyDollarIcon className="w-4 h-4" />
                              <span>{formatSalary(job.salaryRange)}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4 line-clamp-3">
                            {job.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-4">
                            {job.requiredSkills?.slice(0, 3).map((skill, index) => (
                              <span 
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.requiredSkills?.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{job.requiredSkills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-6 flex flex-col items-end gap-2">
                          <button
                            onClick={() => handleSaveJob(job._id)}
                            className="p-2 text-gray-400 hover:text-red-500"
                          >
                            {savedJobs.includes(job._id) ? (
                              <HeartIconSolid className="w-5 h-5 text-red-500" />
                            ) : (
                              <HeartIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleApplyToJob(job)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Job Application Form Modal */}
        {showApplicationForm && selectedJob && (
          <JobApplicationForm
            isOpen={showApplicationForm}
            onClose={() => {
              setShowApplicationForm(false);
              setSelectedJob(null);
            }}
            jobId={selectedJob._id}
            jobTitle={selectedJob.title}
            companyName={selectedJob.companyName}
            onApplicationSubmitted={handleApplicationSubmitted}
          />
        )}
      </div>
    </div>
  );
}
