'use client';
import { useState } from 'react';

export default function DatabaseTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Database Connection'}
        </button>
        
        {result && (
          <div className={`mt-4 p-4 rounded-lg ${
            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <h3 className="font-bold mb-2">
              {result.success ? '✅ Success' : '❌ Error'}
            </h3>
            <p className="text-sm">
              {result.success ? result.message : result.error}
            </p>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Check MongoDB Atlas credentials</li>
            <li>Verify Network Access (IP whitelist)</li>
            <li>Ensure database user has proper permissions</li>
            <li>Check if password needs URL encoding</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
