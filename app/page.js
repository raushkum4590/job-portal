'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  BriefcaseIcon,
  UsersIcon,
  CheckCircleIcon,
  StarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  FireIcon,
  TrophyIcon,
  SparklesIcon,
  HeartIcon,
  RocketLaunchIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { data: session, status } = useSession();
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    { number: '15K+', label: 'Active Jobs', color: 'text-blue-600' },
    { number: '75K+', label: 'Job Seekers', color: 'text-purple-600' },
    { number: '8K+', label: 'Companies', color: 'text-green-600' },
    { number: '95%', label: 'Success Rate', color: 'text-orange-600' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'TechCorp',
      avatar: '👩‍💻',
      text: 'Found my dream job in just 2 weeks! The platform is incredibly user-friendly.'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'StartupXYZ',
      avatar: '👨‍💼',
      text: 'The AI-powered job matching saved me hours of searching. Highly recommended!'
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'DesignStudio',
      avatar: '👩‍🎨',
      text: 'Amazing platform with great companies. Got multiple offers within a month!'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      <Navbar />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              {/* Badge */}
              <div className={`inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-6 py-3 mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <FireIcon className="w-4 h-4 text-white mr-2" />
                <span className="text-white text-sm font-medium">🚀 #1 Career Platform - JobForge</span>
                <TrophyIcon className="w-4 h-4 text-white ml-2" />
              </div>
              
              {/* Main Heading */}
              <h1 className={`text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Find Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">
                  Dream Career
                </span>
                <span className="block relative">
                  Today!
                  <SparklesIcon className="absolute -top-2 -right-8 w-8 h-8 text-yellow-400 animate-spin" />
                </span>
              </h1>
              
              {/* Description */}
              <p className={`mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Connect with top employers, discover amazing opportunities, and take the next step in your career journey. Join thousands of professionals who found their perfect match with AI-powered job matching.
              </p>
              
              {/* CTA Buttons */}
              <div className={`mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {status === 'loading' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </div>
                ) : session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-600 before:to-purple-600 before:opacity-0 hover:before:opacity-20 before:blur-xl before:transition-opacity"
                    >
                      <RocketLaunchIcon className="w-5 h-5 mr-2" />
                      Go to Dashboard
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/jobs"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl hover:bg-white hover:border-blue-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                      Browse Jobs
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signup"
                      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-600 before:to-purple-600 before:opacity-0 hover:before:opacity-20 before:blur-xl before:transition-opacity"
                    >
                      <RocketLaunchIcon className="w-5 h-5 mr-2" />
                      Get Started Free
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/auth/signin"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl hover:bg-white hover:border-blue-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              
              {/* Animated Stats */}
              <div className={`mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {stats.map((stat, index) => (
                  <div key={index} className={`text-center lg:text-left p-4 rounded-xl transition-all duration-500 ${currentStat === index ? 'bg-white/50 backdrop-blur-sm shadow-lg scale-105' : ''}`}>
                    <div className={`text-3xl font-bold ${stat.color} transition-colors duration-300`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className={`mt-8 flex items-center justify-center lg:justify-start space-x-6 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 font-medium">4.9/5 from 10K+ reviews</span>
                </div>
              </div>
            </div>
            
            {/* Hero Illustration */}
            <div className="mt-16 lg:mt-0 lg:col-span-6">
              <div className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
                </div>
                
                {/* Main Illustration Container */}
                <div className={`relative bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 transform transition-all duration-1000 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="space-y-6">
                    {/* Job Cards Illustration */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <BriefcaseIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Senior Developer</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                              TechCorp Inc.
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">$120K</div>
                          <div className="text-xs text-gray-500 flex items-center justify-end">
                            <GlobeAltIcon className="w-3 h-3 mr-1" />
                            Remote
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <ChartBarIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Product Manager</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                              StartupXYZ
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">$100K</div>
                          <div className="text-xs text-gray-500 flex items-center justify-end">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            Hybrid
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <LightBulbIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">UX Designer</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                              DesignStudio
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">$85K</div>
                          <div className="text-xs text-gray-500 flex items-center justify-end">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            On-site
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105">
                        Apply Now
                      </button>
                      <button className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all group">
                        <HeartIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                  <CheckCircleIcon className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-yellow-500 text-white p-3 rounded-full shadow-lg animate-pulse">
                  <StarIcon className="w-6 h-6" />
                </div>
                <div className="absolute top-1/2 -left-8 bg-blue-500 text-white p-2 rounded-full shadow-lg animate-ping">
                  <SparklesIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of professionals who found their dream jobs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most comprehensive job platform with cutting-edge features to help you succeed in your career journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MagnifyingGlassIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Job Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI-powered search helps you find the perfect jobs that match your skills, experience, and career goals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BuildingOfficeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Top Companies</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with leading companies across all industries. From startups to Fortune 500, find your next opportunity.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with enterprise-grade security. Apply to jobs with confidence and privacy.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant notifications about new jobs, application status updates, and interview invitations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UsersIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Career Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized career advice, resume tips, and interview preparation from industry experts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Track your application progress, profile views, and get insights to improve your job search success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Companies
            </h2>
            <p className="text-lg text-gray-600">
              Join the best companies hiring through our platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {['TechCorp', 'StartupXYZ', 'DesignStudio', 'DataFlow', 'CloudTech', 'InnovateLab'].map((company, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just a few simple steps and find your dream job today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up and create your professional profile with your skills, experience, and career preferences.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-green-200"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse & Apply</h3>
              <p className="text-gray-600 leading-relaxed">
                Search through thousands of job listings and apply to positions that match your career goals.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Hired</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with employers, showcase your talents, and land your dream job with competitive salary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Stay Updated with Latest Jobs
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get weekly job alerts, career tips, and exclusive opportunities delivered directly to your inbox.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No spam, unsubscribe at any time. Join 50K+ subscribers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-6">
            <SparklesIcon className="w-16 h-16 text-white/80 mx-auto animate-spin" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Find Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Dream Job?
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have already found their perfect career match. Your next opportunity is just one click away. Start your journey today and unlock your potential.
          </p>
          
          {!session && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-blue-700 bg-white rounded-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl"
              >
                <RocketLaunchIcon className="w-6 h-6 mr-3" />
                Get Started Free
                <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-white border-2 border-white/50 rounded-2xl hover:bg-white/10 hover:border-white transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                <PlayCircleIcon className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>
          )}
          
          {/* Additional trust elements */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              <span>100% secure & private</span>
            </div>
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 mr-2 fill-current" />
              <span>4.9/5 rated platform</span>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
