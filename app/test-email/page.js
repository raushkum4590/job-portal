'use client';
import { useState } from 'react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [emailType, setEmailType] = useState('test');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: 'Test User',
          type: emailType
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Test Email Functionality
          </h1>
          
          <form onSubmit={handleSendTestEmail} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="emailType" className="block text-sm font-medium text-gray-700 mb-2">
                Email Type
              </label>              <select
                id="emailType"
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="test">Basic Test Email</option>
                <option value="welcome">Welcome Email</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading || !email
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? 'Sending...' : 'Send Test Email'}
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-md ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className={`text-sm ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? (
                  <div>
                    <p className="font-semibold">✅ Email sent successfully!</p>
                    {result.messageId && (
                      <p className="mt-1">Message ID: {result.messageId}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold">❌ Failed to send email</p>
                    <p className="mt-1">Error: {result.error}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Email Configuration Status
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Email Service:</strong> NodeMailer with Brevo SMTP</p>
              <p><strong>SMTP Host:</strong> smtp-relay.brevo.com</p>
              <p><strong>Port:</strong> 587 (TLS)</p>
              <p className="mt-2 text-xs">
                This test page helps verify that your email configuration is working correctly.
                All email credentials are configured in the .env.local file.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-lg font-medium text-yellow-900 mb-2">
              📧 Email Features
            </h3>
            <div className="text-sm text-yellow-800">
              <ul className="list-disc list-inside space-y-1">
                <li>Job application confirmation emails</li>
                <li>Shortlist notification emails</li>
                <li>Welcome emails for new users</li>
                <li>Beautiful HTML email templates</li>
                <li>Automatic email sending on job apply & shortlist</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
