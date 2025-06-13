'use client';
import { useSession } from 'next-auth/react';

export default function SessionTest() {
  const { data: session, status } = useSession();
  
  console.log('🧪 SessionTest - Status:', status, 'Session:', session);
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Session Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>
          
          <div>
            <strong>Session exists:</strong> {session ? 'Yes' : 'No'}
          </div>
          
          {session && (
            <div className="space-y-2">
              <div><strong>Email:</strong> {session.user?.email}</div>
              <div><strong>Name:</strong> {session.user?.name}</div>
              <div><strong>Role:</strong> {session.user?.role}</div>
              <div><strong>Image:</strong> {session.user?.image}</div>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="font-bold">Raw Session Data:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          
          <div className="mt-6">
            <h3 className="font-bold">Status Details:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs">
              Status: {status}
              Loading: {status === 'loading' ? 'true' : 'false'}
              Authenticated: {status === 'authenticated' ? 'true' : 'false'}
              Unauthenticated: {status === 'unauthenticated' ? 'true' : 'false'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
