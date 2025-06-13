'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';
import LoadingSpinner from './LoadingSpinner';
import {
  BriefcaseIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">{/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner />
                <span className="text-gray-600 font-medium">Loading...</span>
              </div>
            ) : session ? (
              <>
                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                  <Link 
                    href={
                      session.user.role === 'admin' ? '/admin/dashboard' :
                      session.user.role === 'employer' ? '/hire' : 
                      '/jobseeker'
                    }
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-blue-50"
                  >
                    {session.user.role === 'employer' ? (
                      <BuildingOfficeIcon className="w-4 h-4" />
                    ) : (
                      <BriefcaseIcon className="w-4 h-4" />
                    )}
                    <span>Dashboard</span>
                  </Link>

                  {session.user.role !== 'admin' && (
                    <Link 
                      href="/jobs" 
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-blue-50"
                    >
                      <MagnifyingGlassIcon className="w-4 h-4" />
                      <span>Browse Jobs</span>
                    </Link>
                  )}

                  {session.user.role === 'admin' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-red-50"
                    >
                      <SparklesIcon className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                </div>                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 hover:bg-blue-50 rounded-lg">
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleDropdownToggle}
                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 px-4 py-2 rounded-xl transition-all duration-200 border border-blue-100"
                  >
                    <div className="flex items-center space-x-2">
                      <UserCircleIcon className="w-8 h-8 text-blue-600" />
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-900">
                          {session.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.user.role}
                        </div>
                      </div>
                    </div>
                    <ChevronDownIcon 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <UserCircleIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">View Profile</span>
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth/signin" 
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-blue-50"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-2">              {status === 'loading' ? (
                <div className="flex items-center justify-center py-4">
                  <LoadingSpinner />
                  <span className="text-gray-600 ml-2">Loading...</span>
                </div>
              ) : session ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mx-2 mb-4">
                    <UserCircleIcon className="w-10 h-10 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{session.user.name}</div>
                      <div className="text-sm text-gray-500">{session.user.role}</div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <Link 
                    href={
                      session.user.role === 'admin' ? '/admin/dashboard' :
                      session.user.role === 'employer' ? '/hire' : 
                      '/jobseeker'
                    }
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-2 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {session.user.role === 'employer' ? (
                      <BuildingOfficeIcon className="w-5 h-5" />
                    ) : (
                      <BriefcaseIcon className="w-5 h-5" />
                    )}
                    <span>Dashboard</span>
                  </Link>

                  {session.user.role !== 'admin' && (
                    <Link 
                      href="/jobs" 
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-2 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MagnifyingGlassIcon className="w-5 h-5" />
                      <span>Browse Jobs</span>
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-2 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>

                  <hr className="my-2 mx-2 border-gray-200" />

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mx-2 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/signin" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-2 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl mx-2 text-center font-semibold transition-all duration-200 shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
}
