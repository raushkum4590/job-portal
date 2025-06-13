'use client';
import { useSession } from 'next-auth/react';
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
  CalendarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import JobApplicationForm from '../../components/JobApplicationForm';
import UserApplicationsSection from '../../components/UserApplicationsSection';
import UserProfile from '../../components/UserProfile';

export default function JobSeekerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();  const [userData, setUserData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // User applications state  const [userApplications, setUserApplications] = useState([]);
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
    }    // Fetch user data and jobs
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
        } else {
          console.error('❌ JobSeeker: Failed to fetch user data:', userResponse.status);
        }

        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          console.log('📊 JobSeeker: Jobs response:', jobsData);
          console.log('📋 JobSeeker: Number of active jobs found:', jobsData.jobs?.length || 0);
          setJobs(jobsData.jobs || []);
        } else {
          console.error('❌ JobSeeker: Failed to fetch jobs:', jobsResponse.status);
          const errorData = await jobsResponse.text();
          console.error('❌ JobSeeker: Jobs API error:', errorData);
        }

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          console.log('📊 JobSeeker: Applications response:', applicationsData);
          
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
          
        } else {
          console.error('❌ JobSeeker: Failed to fetch applications:', applicationsResponse.status);
        }
        
      } catch (error) {
        console.error('💥 JobSeeker: Error fetching data:', error);      } finally {
        setLoadingJobs(false);
        setLoadingApplications(false);
        console.log('✅ JobSeeker: Loading complete');
      }
    };

    fetchData();    // Simulate loading stats
    setTimeout(() => {
      setStats({
        appliedJobs: Math.floor(Math.random() * 20),
        savedJobs: savedJobs.length,
        profileViews: Math.floor(Math.random() * 50),
        interviews: Math.floor(Math.random() * 5)
      });
    }, 1000);
  }, [session, status, router, savedJobs.length]);

  // Fetch jobs for job seeker
  const fetchJobs = async () => {
    console.log('🔍 Fetching jobs for job seeker...');
    
    try {
      setLoadingJobs(true);
      const response = await fetch('/api/jobs?status=active');
      
      console.log('📡 Jobs API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Jobs API response data:', data);
        console.log('📋 Number of active jobs fetched:', data.jobs?.length || 0);
        
        setJobs(data.jobs || []);
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

  // Fetch user applications
  const fetchUserApplications = async () => {
    console.log('📋 Fetching user applications...');
    
    try {
      setLoadingApplications(true);
      const response = await fetch('/api/user/applications');
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 User applications data:', data);
        
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
        
        // Update stats
        setStats(prev => ({
          ...prev,
          appliedJobs: data.totalApplications,
          interviews: data.interviewCount
        }));
        
        console.log('✅ User applications loaded:', {
          total: data.totalApplications,
          shortlisted: data.shortlistedCount,
          interview: data.interviewCount
        });
        
      } else {
        const errorData = await response.text();
        console.error('❌ Applications API error:', response.status, errorData);
      }
    } catch (error) {
      console.error('💥 Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

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
  };  const handleApplicationSubmitted = () => {
    // Refresh applications after submission
    fetchUserApplications();
    setShowApplicationForm(false);
    setSelectedJob(null);
  };

  const handleProfileUpdate = (updatedProfile) => {
    // Update userData state with new profile data
    setUserData(prev => ({
      ...prev,
      ...updatedProfile
    }));
    console.log('✅ Profile updated:', updatedProfile);
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
                <p className="text-gray-600">Ready to find your next opportunity?</p>
                <p className="text-xs text-gray-400 mt-1">
                  User ID: {userData?.uuid || 'Loading...'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Job Seeker
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
        </div>        {/* Tab Content */}
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
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
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
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
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
              </div>

              {/* Profile Preferences Summary */}
              {userData?.jobSeekerProfile && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Summary</h2>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
                  
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
          {activeTab === 'jobs' && (necap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
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
                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
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

                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
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

                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
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

                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Job Alerts</p>
                    <p className="text-sm text-gray-500">Set up job notifications</p>
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
        </div>        {/* Job Search and Filters */}
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
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Available Jobs</h2>
                <p className="text-sm text-gray-600">
                  {loadingJobs ? 'Loading...' : `${filteredJobs.length} jobs found`}
                </p>
              </div>
              
              {/* Debug Button - Remove in production */}
              <button
                onClick={async () => {
                  try {
                    console.log('🔍 Debug: Fetching all jobs for debugging...');
                    const debugResponse = await fetch('/api/debug/jobs');
                    if (debugResponse.ok) {
                      const debugData = await debugResponse.json();
                      console.log('🔍 Debug: All jobs in database:', debugData);
                      alert(`Debug: Found ${debugData.totalJobs} total jobs in database. Check console for details.`);
                    }
                    
                    // Also try fetching without status filter
                    const allJobsResponse = await fetch('/api/jobs');
                    if (allJobsResponse.ok) {
                      const allJobsData = await allJobsResponse.json();
                      console.log('🔍 Debug: Jobs without status filter:', allJobsData);
                    }
                  } catch (error) {
                    console.error('Debug error:', error);
                  }
                }}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
              >
                Debug Jobs
              </button>
            </div>
            
            {loadingJobs ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading jobs...</p>
              </div>            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-8">
                <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any active job postings at the moment. This could mean:
                </p>
                <ul className="text-sm text-gray-500 text-left max-w-md mx-auto mb-4 space-y-1">
                  <li>• No jobs have been posted yet</li>
                  <li>• All posted jobs are in draft or inactive status</li>
                  <li>• Jobs don't match your current filters</li>
                </ul>
                <p className="text-gray-600">
                  Try adjusting your search filters or check back later for new opportunities.
                </p>
                
                {/* Show all jobs button for debugging */}
                <button
                  onClick={async () => {
                    try {
                      console.log('🔍 Trying to fetch ALL jobs (any status)...');
                      const response = await fetch('/api/jobs');
                      if (response.ok) {
                        const data = await response.json();
                        console.log('📊 All jobs response:', data);
                        if (data.jobs && data.jobs.length > 0) {
                          setJobs(data.jobs);
                          alert(`Found ${data.jobs.length} jobs with any status. Check console for details.`);
                        } else {
                          alert('No jobs found in database at all.');
                        }
                      }
                    } catch (error) {
                      console.error('Error fetching all jobs:', error);
                    }
                  }}
                  className="mt-4 text-xs bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200"
                >
                  Show All Jobs (Debug)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div key={job._id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Company Logo Placeholder */}
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {job.companyLogo ? (
                              <img src={job.companyLogo} alt={job.companyName} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 cursor-pointer">
                                  {job.title}
                                </h3>
                                <p className="text-gray-600 font-medium">{job.companyName}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
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
                              <div className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                <span className="capitalize">{job.workModel.replace('-', ' ')}</span>
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
                            </div>
                            
                            <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
                              {job.description}
                            </p>
                              {/* Skills and Education Requirements */}
                            <div className="mb-3 space-y-2">
                              {/* Skills */}
                              {job.skills && job.skills.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-1">REQUIRED SKILLS</p>
                                  <div className="flex flex-wrap gap-2">
                                    {job.skills.slice(0, 4).map((skill, index) => (
                                      <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {job.skills.length > 4 && (
                                      <span className="text-gray-500 text-xs">
                                        +{job.skills.length - 4} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Additional Qualifications */}
                              {job.additionalQualifications && job.additionalQualifications.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-1">PREFERRED QUALIFICATIONS</p>
                                  <div className="flex flex-wrap gap-2">
                                    {job.additionalQualifications.slice(0, 2).map((qualification, index) => (
                                      <span
                                        key={index}
                                        className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                                        title={qualification}
                                      >
                                        {qualification.length > 30 ? `${qualification.substring(0, 30)}...` : qualification}
                                      </span>
                                    ))}
                                    {job.additionalQualifications.length > 2 && (
                                      <span className="text-gray-500 text-xs">
                                        +{job.additionalQualifications.length - 2} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <EyeIcon className="w-4 h-4" />
                                <span>{job.views || 0} views</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Posted {getTimeAgo(job.postedAt)}</span>
                              </div>
                              {job.applicationDeadline && (
                                <div className="flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleSaveJob(job._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            savedJobs.includes(job._id)
                              ? 'text-red-600 bg-red-50 hover:bg-red-100'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={savedJobs.includes(job._id) ? 'Remove from saved' : 'Save job'}
                        >
                          {savedJobs.includes(job._id) ? (
                            <HeartIconSolid className="w-5 h-5" />
                          ) : (
                            <HeartIcon className="w-5 h-5" />
                          )}
                        </button>
                          <button
                          onClick={() => handleApplyToJob(job)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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
        </div>

        {/* Profile Preferences */}
        {userData?.jobSeekerProfile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
              <button 
                onClick={() => router.push('/auth/questionnaire')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Update Preferences
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
            
            {!userData.jobSeekerProfile.profileCompleted && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Complete your profile</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Help us show you more relevant job opportunities by completing your profile preferences.
                    </p>
                    <button 
                      onClick={() => router.push('/auth/questionnaire')}
                      className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                    >
                      Complete now →
                    </button>
                  </div>
                </div>
              </div>            )}
          </div>
        )}

        {/* My Applications Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">My Applications</h2>
              <div className="flex items-center gap-2">
                {applicationStats.shortlisted > 0 && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {applicationStats.shortlisted} Shortlisted!
                  </span>
                )}
                {applicationStats.interview > 0 && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {applicationStats.interview} Interview!
                  </span>
                )}
                {applicationStats.hired > 0 && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {applicationStats.hired} Hired!
                  </span>
                )}
              </div>
            </div>
            
            {loadingApplications ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading your applications...</p>
              </div>
            ) : userApplications.length === 0 ? (
              <div className="text-center py-8">
                <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600">Start applying to jobs to see your applications here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userApplications
                  .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                  .slice(0, 10) // Show last 10 applications
                  .map((application) => (
                    <div 
                      key={application._id} 
                      className={`border rounded-lg p-4 transition-colors ${
                        application.status === 'shortlisted' 
                          ? 'border-purple-300 bg-purple-50 shadow-md' 
                          : application.status === 'interview'
                          ? 'border-orange-300 bg-orange-50 shadow-md'
                          : application.status === 'hired'
                          ? 'border-green-300 bg-green-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {application.job.employer.companyLogo ? (
                              <img 
                                src={application.job.employer.companyLogo} 
                                alt={application.job.employer.companyName}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900">{application.job.title}</h3>
                              <p className="text-sm text-gray-600">
                                {application.job.employer.companyName || application.job.employer.name}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              <span>{application.job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BriefcaseIcon className="w-4 h-4" />
                              <span className="capitalize">{application.job.jobType.replace('-', ' ')}</span>
                            </div>
                          </div>
                          
                          {application.status === 'shortlisted' && (
                            <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium text-purple-800">🎉 Congratulations! You've been shortlisted!</span>
                              </div>
                              <p className="text-sm text-purple-700 mt-1">
                                The employer is interested in your profile. You may hear from them soon!
                              </p>
                            </div>
                          )}
                          
                          {application.status === 'interview' && (
                            <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="font-medium text-orange-800">📞 Interview Scheduled!</span>
                              </div>
                              <p className="text-sm text-orange-700 mt-1">
                                Great news! The employer wants to interview you. Check your email for details.
                              </p>
                            </div>
                          )}
                          
                          {application.status === 'hired' && (
                            <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium text-green-800">🎊 Congratulations! You got the job!</span>
                              </div>
                              <p className="text-sm text-green-700 mt-1">
                                Amazing! You've been hired for this position. Welcome to the team!
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex flex-col items-end gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'shortlisted' ? 'bg-purple-100 text-purple-800' :
                            application.status === 'interview' ? 'bg-orange-100 text-orange-800' :
                            application.status === 'hired' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.status === 'pending' ? 'Under Review' :
                             application.status === 'reviewing' ? 'In Review' :
                             application.status === 'shortlisted' ? 'Shortlisted' :
                             application.status === 'interview' ? 'Interview' :
                             application.status === 'hired' ? 'Hired' :
                             'Not Selected'}
                          </span>
                          
                          {application.resumeUrl && (
                            <a
                              href={application.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              View Resume
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                
                {userApplications.length > 10 && (
                  <div className="text-center pt-4">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      View All {userApplications.length} Applications
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Application Statistics */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Application Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{applicationStats.total}</div>
                  <div className="text-xs text-gray-600">Total Applied</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{applicationStats.shortlisted}</div>
                  <div className="text-xs text-gray-600">Shortlisted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{applicationStats.interview}</div>
                  <div className="text-xs text-gray-600">Interviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{applicationStats.hired}</div>
                  <div className="text-xs text-gray-600">Hired</div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {/* Debug Section - Remove in production */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">🧪 Debug Tools (Remove in Production)</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/debug/jobs');
                  const data = await response.json();
                  console.log('Debug: All jobs in database:', data);
                  alert(`Found ${data.totalJobs} jobs in database. Check console for details.`);
                } catch (error) {
                  console.error('Debug error:', error);
                  alert('Debug error: ' + error.message);
                }
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
            >
              Debug All Jobs
            </button>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/jobs?status=active');
                  const data = await response.json();
                  console.log('Debug: Active jobs for job seekers:', data);
                  alert(`Found ${data.jobs.length} active jobs. Check console for details.`);
                } catch (error) {
                  console.error('Debug error:', error);
                  alert('Debug error: ' + error.message);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Debug Active Jobs
            </button>              <button
                onClick={() => {
                  if (jobs.length > 0) {
                    console.log('Current jobs on page:', jobs);
                    console.log('Application counts:', jobs.map(job => ({ 
                      title: job.title, 
                      applications: job.applications?.length || 0 
                    })));
                    alert(`${jobs.length} jobs loaded on page. Check console for details.`);
                  } else {
                    alert('No jobs loaded on page');
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                Debug Page Jobs
              </button>              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/debug/applications');
                    const data = await response.json();
                    console.log('Debug: All applications data:', data);
                    alert(`Found ${data.summary.totalApplications} total applications across ${data.summary.totalJobs} jobs. Check console for details.`);
                  } catch (error) {
                    console.error('Debug error:', error);
                    alert('Debug error: ' + error.message);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Debug All Applications
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/user/applications');
                    const data = await response.json();
                    console.log('Debug: My applications data:', data);
                    alert(`Found ${data.totalApplications} of your applications. Shortlisted: ${data.shortlistedCount}. Check console for details.`);
                  } catch (error) {
                    console.error('Debug error:', error);
                    alert('Debug error: ' + error.message);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
              >
                Debug My Applications
              </button></div>
        </div>        {/* User Applications Section */}
        <UserApplicationsSection 
          userApplications={userApplications}
          loadingApplications={loadingApplications}
          applicationStats={applicationStats}
        />
      </div>
    </div>
  );
}
