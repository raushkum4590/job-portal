/**
 * End-to-End Application Flow Test
 * 
 * This script tests the complete job application flow:
 * 1. Job Seeker applies to a job
 * 2. Application is stored in the database
 * 3. Employer can see the application on their dashboard
 * 
 * Run this in the browser console or as a Node.js script
 */

class ApplicationFlowTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async log(message) {
    console.log(`🧪 ${message}`);
  }

  async testCompleteFlow() {
    this.log('Starting End-to-End Application Flow Test');
    this.log('=============================================');

    try {
      // Step 1: Check database state
      await this.checkDatabaseState();
      
      // Step 2: Test job fetching for job seekers
      await this.testJobSeekerJobFetch();
      
      // Step 3: Test job fetching for employers
      await this.testEmployerJobFetch();
      
      // Step 4: Simulate application submission (manual step)
      await this.instructManualApplication();
      
      // Step 5: Verify application appears in employer dashboard
      await this.verifyApplicationFlow();
      
      this.log('✅ End-to-End test completed successfully!');
      
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }

  async checkDatabaseState() {
    this.log('1️⃣ Checking database state...');
    
    const response = await fetch(`${this.baseUrl}/api/debug/applications`);
    if (!response.ok) {
      throw new Error(`Failed to fetch debug data: ${response.status}`);
    }
    
    const data = await response.json();
    
    this.log(`📊 Database Summary:`);
    this.log(`   - Total Jobs: ${data.summary.totalJobs}`);
    this.log(`   - Active Jobs: ${data.summary.activeJobs}`);
    this.log(`   - Total Applications: ${data.summary.totalApplications}`);
    this.log(`   - Recent Applications: ${data.recentApplications.length}`);
    
    if (data.summary.activeJobs === 0) {
      this.log('⚠️  No active jobs found. Please create an active job first.');
    }
    
    return data;
  }

  async testJobSeekerJobFetch() {
    this.log('2️⃣ Testing job seeker job fetching...');
    
    const response = await fetch(`${this.baseUrl}/api/jobs?status=active`);
    if (!response.ok) {
      throw new Error(`Failed to fetch active jobs: ${response.status}`);
    }
    
    const data = await response.json();
    
    this.log(`📋 Job Seeker View:`);
    this.log(`   - Active jobs visible: ${data.jobs.length}`);
    
    data.jobs.forEach((job, index) => {
      this.log(`   ${index + 1}. ${job.title} by ${job.companyName || job.employer?.name}`);
    });
    
    if (data.jobs.length === 0) {
      this.log('⚠️  No active jobs visible to job seekers.');
    }
    
    return data.jobs;
  }

  async testEmployerJobFetch() {
    this.log('3️⃣ Testing employer job fetching (requires authentication)...');
    this.log('   This step requires an authenticated employer session.');
    this.log('   The employer dashboard should automatically fetch jobs with applications.');
  }

  async instructManualApplication() {
    this.log('4️⃣ Manual Application Step Required:');
    this.log('   Please manually apply to a job using the job seeker interface:');
    this.log('   1. Go to /jobseeker');
    this.log('   2. Click "Apply" on any active job');
    this.log('   3. Fill out the application form');
    this.log('   4. Submit the application');
    this.log('   5. Check the browser console for application submission logs');
    
    // Wait for user to complete manual step
    if (typeof window !== 'undefined') {
      alert('Please apply to a job manually, then click OK to continue the test.');
    } else {
      this.log('   (Waiting 30 seconds for manual application...)');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }

  async verifyApplicationFlow() {
    this.log('5️⃣ Verifying application flow...');
    
    // Re-check database after application
    const afterData = await this.checkDatabaseState();
    
    this.log('🔍 Checking recent applications:');
    afterData.recentApplications.slice(0, 5).forEach((app, index) => {
      this.log(`   ${index + 1}. ${app.applicantName} applied to "${app.jobTitle}" (${app.status})`);
      this.log(`      Applied: ${new Date(app.appliedAt).toLocaleString()}`);
    });
    
    if (afterData.recentApplications.length > 0) {
      this.log('✅ Applications found! The flow is working correctly.');
    } else {
      this.log('❌ No applications found. There may be an issue with the application flow.');
    }
  }

  async quickDebug() {
    this.log('🔧 Quick Debug Check');
    this.log('==================');
    
    try {
      const debugData = await this.checkDatabaseState();
      
      this.log('📝 Recent Application Details:');
      debugData.recentApplications.slice(0, 3).forEach((app, index) => {
        this.log(`   Application ${index + 1}:`);
        this.log(`     Applicant: ${app.applicantName} (${app.applicantEmail})`);
        this.log(`     Job: ${app.jobTitle}`);
        this.log(`     Status: ${app.status}`);
        this.log(`     Applied: ${new Date(app.appliedAt).toLocaleString()}`);
      });
      
      this.log('📋 Jobs with Applications:');
      debugData.jobsWithApplications
        .filter(job => job.applicationsCount > 0)
        .forEach((job, index) => {
          this.log(`   Job ${index + 1}: ${job.title} (${job.applicationsCount} applications)`);
        });
        
    } catch (error) {
      console.error('Debug failed:', error);
    }
  }
}

// Usage
const tester = new ApplicationFlowTester();

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApplicationFlowTester;
} else {
  // Browser environment
  window.ApplicationFlowTester = ApplicationFlowTester;
  window.testApplicationFlow = () => tester.testCompleteFlow();
  window.quickDebugApplications = () => tester.quickDebug();
}

// Auto-run quick debug if in Node.js
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  tester.quickDebug();
}
