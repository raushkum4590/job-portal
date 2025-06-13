'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function OAuthDebug() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState(null);

  const testGoogleAuth = async () => {
    console.log('Testing Google OAuth...');
    setDebugInfo('Initiating Google OAuth...');
    
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/auth/oauth-debug'
      });
      
      console.log('OAuth result:', result);
      setDebugInfo(`OAuth result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('OAuth error:', error);
      setDebugInfo(`OAuth error: ${error.message}`);
    }
  };

  const checkEnvironment = () => {
    const envInfo = {
      NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: typeof Storage !== 'undefined'
    };
    
    setDebugInfo(JSON.stringify(envInfo, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">OAuth Debug Tool</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <p><strong>Status:</strong> {status}</p>
          {session ? (
            <div>
              <p><strong>User:</strong> {session.user?.email}</p>
              <p><strong>Role:</strong> {session.user?.role}</p>
              <p><strong>Name:</strong> {session.user?.name}</p>
            </div>
          ) : (
            <p>Not signed in</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button 
              onClick={testGoogleAuth}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Google OAuth
            </button>
            
            <button 
              onClick={checkEnvironment}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Check Environment
            </button>
            
            {session && (
              <button 
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {debugInfo && (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <pre className="text-sm overflow-auto whitespace-pre-wrap">
              {debugInfo}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">Required Google OAuth Setup</h2>
          <div className="text-sm text-yellow-700">
            <p><strong>Authorized redirect URI should be:</strong></p>
            <code className="bg-yellow-100 p-2 rounded">http://localhost:3000/api/auth/callback/google</code>
            
            <p className="mt-4"><strong>Authorized JavaScript origins:</strong></p>
            <code className="bg-yellow-100 p-2 rounded">http://localhost:3000</code>
          </div>
        </div>
      </div>
    </div>
  );
}
