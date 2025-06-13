'use client';
import { useState, useEffect, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function SignInContent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    
    if (errorParam === 'OAuthAccountNotLinked') {
      setError('Account already exists with this email. Please sign in with your email and password first, then link your Google account in your profile settings.');
    } else if (messageParam) {
      // Handle success messages (like after registration)
      if (messageParam === 'Registration successful') {
        setError(''); // Clear any errors
      }
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        if (result.error === 'OAuthAccountNotLinked') {
          setError('An account with this email already exists. Please sign in with your email and password first, then link your Google account in your profile settings.');
        } else {
          setError('Google sign-in failed. Please try again.');
        }
        setLoading(false);
      }
      // If successful, NextAuth will handle the redirect
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Something went wrong with Google sign-in. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });      if (result?.error) {
        setError('Invalid credentials');
      } else {        // Get the session to redirect based on role
        const session = await getSession();
        if (session?.user?.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (session?.user?.role === 'employer') {
          // For employers, check if they need to complete their profile
          try {
            const profileResponse = await fetch('/api/user/me');
            const userData = await profileResponse.json();
            
            if (userData.user?.employerProfile?.profileCompleted) {
              router.push('/hire');
            } else {
              router.push('/auth/employer-questionnaire');
            }
          } catch (error) {
            console.error('Error checking profile:', error);
            // Fallback to questionnaire if we can't check profile
            router.push('/auth/employer-questionnaire');
          }
        } else {
          // For job seekers, check if they need to complete their profile
          try {
            const profileResponse = await fetch('/api/user/me');
            const userData = await profileResponse.json();
            
            if (userData.user?.jobSeekerProfile?.profileCompleted) {
              router.push('/jobseeker');
            } else {
              router.push('/auth/questionnaire');
            }
          } catch (error) {
            console.error('Error checking profile:', error);
            // Fallback to questionnaire if we can't check profile
            router.push('/auth/questionnaire');
          }
        }
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome back</h1>
          <p className="text-slate-600 font-medium">Sign in to your JobPortal account</p>
        </div>        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Error Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-red-800 font-medium">
                  {error}
                  {error.includes('already exists') && (
                    <div className="mt-3">
                      <p className="font-semibold">Need help linking accounts?</p>
                      <ol className="list-decimal list-inside mt-2 space-y-1 text-xs text-red-700">
                        <li>Sign in with your email and password below</li>
                        <li>Go to your profile settings</li>
                        <li>Link your Google account from there</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}          {/* Success Message */}
          {searchParams.get('message') === 'Registration successful' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-800 font-semibold">Registration successful! Please sign in with your credentials.</p>
              </div>
            </div>
          )}          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-600 font-semibold">Or continue with email</span>
            </div>
          </div>          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm placeholder-gray-900 text-black bg-white"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm placeholder-gray-900 text-black bg-white"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-slate-500 hover:text-slate-700" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-slate-500 hover:text-slate-700" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}            </button>
          </form>
        </div>        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-600 font-medium">
            Don't have an account?{' '}
            <Link              href="/auth/signup" 
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors underline decoration-2 underline-offset-2"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignInLoading() {
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

export default function SignIn() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
}
