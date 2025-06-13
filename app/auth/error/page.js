'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    
    switch (errorParam) {
      case 'OAuthAccountNotLinked':
        setError('Account Linking Required');
        setErrorDetails(
          'An account with this email already exists. The account was created using a different sign-in method. Please sign in using your original method, or contact support to link your accounts.'
        );
        break;
      case 'OAuthCallback':
        setError('OAuth Callback Error');
        setErrorDetails('There was an error during the authentication process. Please try again.');
        break;
      case 'OAuthCreateAccount':
        setError('Account Creation Error');
        setErrorDetails('Unable to create your account. Please try again or contact support.');
        break;
      case 'EmailCreateAccount':
        setError('Email Account Error');
        setErrorDetails('Unable to create account with this email. Please try a different email.');
        break;
      case 'Callback':
        setError('Callback Error');
        setErrorDetails('Authentication callback failed. Please try signing in again.');
        break;
      case 'OAuthSignin':
        setError('OAuth Sign-in Error');
        setErrorDetails('There was an error signing in with OAuth. Please try again.');
        break;
      case 'EmailSignin':
        setError('Email Sign-in Error');
        setErrorDetails('There was an error signing in with email. Please check your credentials.');
        break;
      case 'CredentialsSignin':
        setError('Invalid Credentials');
        setErrorDetails('The email or password you entered is incorrect. Please try again.');
        break;
      case 'SessionRequired':
        setError('Session Required');
        setErrorDetails('You must be signed in to access this page.');
        break;
      default:
        setError('Authentication Error');
        setErrorDetails('An unknown authentication error occurred. Please try again.');
    }
  }, [searchParams]);

  const handleRetry = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {error}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorDetails}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {error === 'Account Linking Required' && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    How to resolve this:
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Sign in using your email and password</li>
                      <li>Go to your profile settings</li>
                      <li>Link your Google account from there</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleRetry}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go Home
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signup"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
