import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Job from '../../../../models/Job';
import User from '../../../../models/User';

export async function GET() {
  try {
    await connectDB();
    
    console.log('🔍 Debug: Fetching detailed job and application data...');
    
    // Get all jobs with populated applications
    const allJobs = await Job.find({})
      .populate('employer', 'name email employerProfile.companyName')
      .populate({
        path: 'applications.applicant',
        select: 'name email jobSeekerProfile'
      })
      .sort({ postedAt: -1 });
    
    console.log(`📊 Found ${allJobs.length} total jobs`);
    
    // Count total applications
    const totalApplications = allJobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
    console.log(`📋 Found ${totalApplications} total applications`);
    
    // Detailed breakdown
    const jobsWithApplications = allJobs.map(job => ({
      _id: job._id,
      title: job.title,
      status: job.status,
      employer: {
        _id: job.employer?._id,
        name: job.employer?.name,
        email: job.employer?.email,
        companyName: job.employer?.employerProfile?.companyName
      },
      postedAt: job.postedAt,
      applicationsCount: job.applications?.length || 0,
      applications: (job.applications || []).map(app => ({
        _id: app._id,
        appliedAt: app.appliedAt,
        status: app.status || 'pending',
        applicant: {
          _id: app.applicant?._id,
          name: app.applicant?.name,
          email: app.applicant?.email
        },
        coverLetterPreview: app.coverLetter ? app.coverLetter.substring(0, 100) + '...' : null,
        resumeUrl: app.resumeUrl
      }))
    }));
    
    // Find recent applications
    const recentApplications = allJobs
      .flatMap(job => 
        (job.applications || []).map(app => ({
          jobTitle: job.title,
          jobId: job._id,
          appliedAt: app.appliedAt,
          applicantName: app.applicant?.name,
          applicantEmail: app.applicant?.email,
          status: app.status || 'pending'
        }))
      )
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
      .slice(0, 20);
    
    return NextResponse.json({
      summary: {
        totalJobs: allJobs.length,
        totalApplications,
        activeJobs: allJobs.filter(job => job.status === 'active').length,
        draftJobs: allJobs.filter(job => job.status === 'draft').length,
        closedJobs: allJobs.filter(job => job.status === 'closed').length
      },
      jobsWithApplications,
      recentApplications,
      debug: {
        timestamp: new Date().toISOString(),
        message: 'Debug data retrieved successfully'
      }
    });
    
  } catch (error) {
    console.error('❌ Debug applications error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
