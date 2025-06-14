'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function AuthDebugPage() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState('');

  const testGoogleAuth = async () => {
    try {
      setTestResult('Testing Google OAuth...');
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/dashboard'
      });
      setTestResult(`OAuth Result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setTestResult(`OAuth Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">OAuth Debug Page</h1>
        
        {/* Session Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Session</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            {session ? (
              <div>
                <p><strong>User:</strong> {session.user?.name}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Role:</strong> {session.user?.role}</p>
                <p><strong>Image:</strong> {session.user?.image}</p>
              </div>
            ) : (
              <p>No active session</p>
            )}
          </div>
        </div>

        {/* Environment Variables Check */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not set publicly'}</p>
            <p><strong>Google Client ID:</strong> {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}</p>
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</p>
            <p><strong>Expected Callback:</strong> {typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/google` : '/api/auth/callback/google'}</p>
          </div>
        </div>

        {/* Auth Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Actions</h2>
          <div className="space-x-4">
            {!session ? (
              <>
                <button
                  onClick={() => signIn('google')}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Sign in with Google (Redirect)
                </button>
                <button
                  onClick={testGoogleAuth}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Test Google Auth (No Redirect)
                </button>
                <button
                  onClick={() => signIn('credentials')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Sign in with Credentials
                </button>
              </>
            ) : (
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {testResult}
            </pre>
          </div>
        )}

        {/* Troubleshooting Guide */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">Troubleshooting Google OAuth</h2>
          <div className="text-yellow-700 space-y-2 text-sm">
            <p><strong>1. Check Google Cloud Console:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>OAuth consent screen is configured</li>
              <li>Authorized redirect URIs include: <code>http://localhost:3000/api/auth/callback/google</code></li>
              <li>Your email is added as a test user (if app is in testing mode)</li>
            </ul>
            
            <p><strong>2. Environment Variables:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>GOOGLE_CLIENT_ID is set correctly</li>
              <li>GOOGLE_CLIENT_SECRET is set correctly</li>
              <li>NEXTAUTH_URL matches your current domain</li>
              <li>NEXTAUTH_SECRET is set</li>
            </ul>
            
            <p><strong>3. Common Issues:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>redirect_uri_mismatch: Check redirect URI in Google Cloud Console</li>
              <li>access_blocked: Add your email as test user</li>
              <li>unauthorized_client: Check client ID and secret</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
