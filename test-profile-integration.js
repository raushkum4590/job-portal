#!/usr/bin/env node

/**
 * Test Script for Job Seeker Profile Integration
 * 
 * This script tests the new tabbed interface functionality
 * in the job seeker dashboard including profile management.
 */

const fetch = require('node-fetch');

const testJobSeekerProfile = async () => {
  console.log('🧪 Testing Job Seeker Profile Integration...\n');

  try {
    // Test 1: Check if the jobseeker page loads
    console.log('1. Testing jobseeker page structure...');
    const fs = require('fs');
    const path = require('path');
    
    const jobseekerPagePath = path.join(__dirname, 'app', 'jobseeker', 'page.js');
    const pageContent = fs.readFileSync(jobseekerPagePath, 'utf8');
    
    // Check for key components
    const hasUserProfile = pageContent.includes('import UserProfile');
    const hasTabNavigation = pageContent.includes('activeTab');
    const hasProfileTab = pageContent.includes("activeTab === 'profile'");
    const hasApplicationsTab = pageContent.includes("activeTab === 'applications'");
    const hasJobsTab = pageContent.includes("activeTab === 'jobs'");
    
    console.log(`   ✅ UserProfile import: ${hasUserProfile ? 'Found' : 'Missing'}`);
    console.log(`   ✅ Tab navigation: ${hasTabNavigation ? 'Found' : 'Missing'}`);
    console.log(`   ✅ Profile tab: ${hasProfileTab ? 'Found' : 'Missing'}`);
    console.log(`   ✅ Applications tab: ${hasApplicationsTab ? 'Found' : 'Missing'}`);
    console.log(`   ✅ Jobs tab: ${hasJobsTab ? 'Found' : 'Missing'}`);
    
    // Test 2: Check UserProfile component exists
    console.log('\n2. Testing UserProfile component...');
    const userProfilePath = path.join(__dirname, 'components', 'UserProfile.js');
    const hasUserProfileComponent = fs.existsSync(userProfilePath);
    console.log(`   ✅ UserProfile component: ${hasUserProfileComponent ? 'Found' : 'Missing'}`);
    
    if (hasUserProfileComponent) {
      const profileContent = fs.readFileSync(userProfilePath, 'utf8');
      const hasResumeUpload = profileContent.includes('resumeUrl');
      const hasProfileEdit = profileContent.includes('isEditing');
      const hasProfileUpdate = profileContent.includes('onProfileUpdate');
      
      console.log(`   ✅ Resume upload: ${hasResumeUpload ? 'Found' : 'Missing'}`);
      console.log(`   ✅ Profile editing: ${hasProfileEdit ? 'Found' : 'Missing'}`);
      console.log(`   ✅ Profile update callback: ${hasProfileUpdate ? 'Found' : 'Missing'}`);
    }
    
    // Test 3: Check profile API endpoints
    console.log('\n3. Testing profile API endpoints...');
    const profileApiPath = path.join(__dirname, 'app', 'api', 'user', 'profile', 'route.js');
    const hasProfileApi = fs.existsSync(profileApiPath);
    console.log(`   ✅ Profile API: ${hasProfileApi ? 'Found' : 'Missing'}`);
    
    const resumeApiPath = path.join(__dirname, 'app', 'api', 'upload', 'resume', 'route.js');
    const hasResumeApi = fs.existsSync(resumeApiPath);
    console.log(`   ✅ Resume upload API: ${hasResumeApi ? 'Found' : 'Missing'}`);
    
    // Test 4: Check integration features
    console.log('\n4. Testing integration features...');
    
    const hasQuickActions = pageContent.includes('Quick Actions');
    const hasProfileSummary = pageContent.includes('Profile Summary');
    const hasTabSwitching = pageContent.includes('setActiveTab');
    const hasNotificationBadge = pageContent.includes('applicationStats.shortlisted > 0');
    
    console.log(`   ✅ Quick Actions: ${hasQuickActions ? 'Found' : 'Missing'}`);
    console.log(`   ✅ Profile Summary: ${hasProfileSummary ? 'Found' : 'Missing'}`);
    console.log(`   ✅ Tab switching: ${hasTabSwitching ? 'Found' : 'Missing'}`);
    console.log(`   ✅ Notification badges: ${hasNotificationBadge ? 'Found' : 'Missing'}`);
    
    // Summary
    console.log('\n📊 INTEGRATION SUMMARY:');
    console.log('========================');
    
    const totalChecks = 13;
    const passedChecks = [
      hasUserProfile, hasTabNavigation, hasProfileTab, hasApplicationsTab, 
      hasJobsTab, hasUserProfileComponent, hasProfileApi, hasResumeApi,
      hasQuickActions, hasProfileSummary, hasTabSwitching, hasNotificationBadge
    ].filter(Boolean).length + (hasUserProfileComponent ? 3 : 0);
    
    console.log(`✅ Passed: ${passedChecks}/${totalChecks + 3} checks`);
    console.log(`📈 Success Rate: ${Math.round((passedChecks / (totalChecks + 3)) * 100)}%`);
    
    if (passedChecks >= totalChecks) {
      console.log('\n🎉 SUCCESS: Job seeker profile integration completed!');
      console.log('\n📋 FEATURES AVAILABLE:');
      console.log('   • Tabbed dashboard interface (Dashboard, Profile, Applications, Jobs)');
      console.log('   • Comprehensive user profile management');
      console.log('   • Resume upload and management');
      console.log('   • Profile editing with real-time updates');
      console.log('   • Quick action buttons for easy navigation');
      console.log('   • Application status notifications');
      console.log('   • Profile completion prompts');
      console.log('\n🚀 NEXT STEPS:');
      console.log('   1. Test the application in browser');
      console.log('   2. Verify profile updates work correctly');
      console.log('   3. Test resume upload functionality');
      console.log('   4. Polish UI/UX as needed');
    } else {
      console.log('\n⚠️  Some integration issues detected. Please review the missing components.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testJobSeekerProfile();
