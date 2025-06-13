// Test script to verify job application flow
// This can be run in Node.js to test the API endpoints

const testApplicationFlow = async () => {
  console.log('🧪 Testing Job Application Flow');
  console.log('================================');
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Step 1: Get all jobs from debug endpoint
    console.log('\n1️⃣ Fetching all jobs...');
    const debugResponse = await fetch(`${baseUrl}/api/debug/jobs`);
    const debugData = await debugResponse.json();
    
    console.log(`📊 Total jobs in database: ${debugData.totalJobs}`);
    debugData.jobs.forEach(job => {
      console.log(`   - ${job.title} (${job.status}) by ${job.employerName || job.companyName}`);
    });
    
    if (debugData.jobs.length === 0) {
      console.log('❌ No jobs found. Please create a job first.');
      return;
    }
    
    // Step 2: Get active jobs (what job seekers see)
    console.log('\n2️⃣ Fetching active jobs for job seekers...');
    const activeJobsResponse = await fetch(`${baseUrl}/api/jobs?status=active`);
    const activeJobsData = await activeJobsResponse.json();
    
    console.log(`📋 Active jobs visible to job seekers: ${activeJobsData.jobs.length}`);
    activeJobsData.jobs.forEach(job => {
      console.log(`   - ${job.title} - Applications: ${job.applications?.length || 0}`);
    });
    
    // Step 3: Test fetching jobs for a specific employer
    const firstJob = debugData.jobs[0];
    if (firstJob?.employer) {
      console.log(`\n3️⃣ Fetching jobs for employer ${firstJob.employer}...`);
      const employerJobsResponse = await fetch(`${baseUrl}/api/jobs?employer=${firstJob.employer}`);
      const employerJobsData = await employerJobsResponse.json();
      
      console.log(`👔 Employer jobs found: ${employerJobsData.jobs.length}`);
      employerJobsData.jobs.forEach(job => {
        console.log(`   - ${job.title} - Applications: ${job.applications?.length || 0}`);
        if (job.applications && job.applications.length > 0) {
          job.applications.forEach((app, index) => {
            console.log(`     Application ${index + 1}: ${app.applicant?.name || 'Name not populated'} - Status: ${app.status || 'pending'}`);
          });
        }
      });
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Export for use in browser console or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testApplicationFlow;
} else {
  // For browser console
  window.testApplicationFlow = testApplicationFlow;
}

// Auto-run if in Node.js environment
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  testApplicationFlow();
}
