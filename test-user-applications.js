/**
 * Test script for User Applications API
 * Run this in the browser console to test the applications endpoint
 */

async function testUserApplicationsAPI() {
  console.log('🧪 Testing User Applications API...');
  console.log('=====================================');

  try {
    // Test the user applications endpoint
    console.log('📡 Fetching user applications...');
    const response = await fetch('/api/user/applications');
    
    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Applications data received:', data);
      
      console.log('📋 Summary:');
      console.log(`   Total Applications: ${data.totalApplications}`);
      console.log(`   Shortlisted: ${data.shortlistedCount}`);
      console.log(`   Interview: ${data.interviewCount}`);
      console.log(`   Hired: ${data.hiredCount}`);
      
      console.log('📄 Applications by Status:');
      Object.entries(data.applicationsByStatus).forEach(([status, apps]) => {
        console.log(`   ${status}: ${apps.length} applications`);
      });
      
      console.log('📝 Recent Applications:');
      data.applications.slice(0, 3).forEach((app, index) => {
        console.log(`   ${index + 1}. ${app.job.title} at ${app.job.employer.companyName || app.job.employer.name} - Status: ${app.status}`);
      });
      
      return data;
      
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return null;
    }
    
  } catch (error) {
    console.error('💥 Network Error:', error);
    return null;
  }
}

// Test function for checking if user is logged in
async function checkUserSession() {
  try {
    const response = await fetch('/api/user/me');
    if (response.ok) {
      const data = await response.json();
      console.log('👤 Current user:', data.user.name, '- Role:', data.user.role);
      return data.user;
    } else {
      console.log('❌ Not logged in or error fetching user data');
      return null;
    }
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
}

// Combined test
async function runApplicationsTest() {
  console.log('🚀 Starting User Applications Test');
  console.log('==================================');
  
  // Check if user is logged in
  const user = await checkUserSession();
  if (!user) {
    console.log('⚠️  Please log in as a job seeker to test this API');
    return;
  }
  
  if (user.role !== 'user') {
    console.log('⚠️  Please log in as a job seeker (not employer/admin) to test this API');
    return;
  }
  
  // Test the applications API
  const applicationsData = await testUserApplicationsAPI();
  
  if (applicationsData) {
    console.log('✅ Test completed successfully!');
    console.log('💡 Tip: Apply to some jobs and ask an employer to change your application status to "shortlisted" to see the highlighting feature.');
  } else {
    console.log('❌ Test failed. Check the errors above.');
  }
}

// Export for browser usage
if (typeof window !== 'undefined') {
  window.testUserApplicationsAPI = testUserApplicationsAPI;
  window.runApplicationsTest = runApplicationsTest;
  
  console.log('🔧 User Applications API Test Loaded');
  console.log('Usage: runApplicationsTest() or testUserApplicationsAPI()');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testUserApplicationsAPI, runApplicationsTest };
}
