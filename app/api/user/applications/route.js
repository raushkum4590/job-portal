import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import User from '@/models/User';

// GET - Fetch applications for the current job seeker
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'user') {
      return NextResponse.json({ error: 'Access denied. Job seeker role required.' }, { status: 403 });
    }

    await connectDB();
    
    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find all jobs where this user has applied
    const jobsWithApplications = await Job.find({
      'applications.applicant': user._id
    })
    .populate('employer', 'name employerProfile.companyName employerProfile.companyLogo')
    .sort({ 'applications.appliedAt': -1 });

    // Extract applications for this user
    const userApplications = [];
    
    jobsWithApplications.forEach(job => {
      const userApplication = job.applications.find(
        app => app.applicant.toString() === user._id.toString()
      );
      
      if (userApplication) {
        userApplications.push({
          _id: userApplication._id,
          appliedAt: userApplication.appliedAt,
          status: userApplication.status || 'pending',
          coverLetter: userApplication.coverLetter,
          resumeUrl: userApplication.resumeUrl,
          job: {
            _id: job._id,
            title: job.title,
            department: job.department,
            jobType: job.jobType,
            workModel: job.workModel,
            location: job.location,
            salaryRange: job.salaryRange,
            status: job.status,
            employer: {
              name: job.employer.name,
              companyName: job.employer.employerProfile?.companyName,
              companyLogo: job.employer.employerProfile?.companyLogo
            }
          }
        });
      }
    });

    // Separate applications by status
    const applicationsByStatus = {
      pending: userApplications.filter(app => app.status === 'pending'),
      reviewing: userApplications.filter(app => app.status === 'reviewing'),
      shortlisted: userApplications.filter(app => app.status === 'shortlisted'),
      interview: userApplications.filter(app => app.status === 'interview'),
      hired: userApplications.filter(app => app.status === 'hired'),
      rejected: userApplications.filter(app => app.status === 'rejected')
    };

    return NextResponse.json({
      applications: userApplications,
      applicationsByStatus,
      totalApplications: userApplications.length,
      shortlistedCount: applicationsByStatus.shortlisted.length,
      interviewCount: applicationsByStatus.interview.length,
      hiredCount: applicationsByStatus.hired.length
    });

  } catch (error) {
    console.error('Error fetching user applications:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
