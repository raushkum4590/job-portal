import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import connectDB from '../../../../../lib/mongodb';
import Job from '../../../../../models/Job';
import User from '../../../../../models/User';

// POST - Apply to a job
export async function POST(request, context) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'user') {
      return NextResponse.json({ error: 'Only job seekers can apply to jobs' }, { status: 403 });
    }

    await connectDB();
    
    const { jobId } = context.params;
    const applicationData = await request.json();
    
    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if job is active
    if (job.status !== 'active') {
      return NextResponse.json({ error: 'This job is no longer accepting applications' }, { status: 400 });
    }

    // Find the applicant user
    const applicant = await User.findOne({ email: session.user.email });
    if (!applicant) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already applied
    const existingApplication = job.applications.find(
      app => app.applicant.toString() === applicant._id.toString()
    );
    
    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 });
    }

    // Check application deadline
    if (job.applicationDeadline && new Date() > job.applicationDeadline) {
      return NextResponse.json({ error: 'Application deadline has passed' }, { status: 400 });
    }

    // Create application
    const application = {
      applicant: applicant._id,
      coverLetter: applicationData.coverLetter,
      resumeUrl: applicationData.resumeUrl,
      availabilityDate: applicationData.availabilityDate ? new Date(applicationData.availabilityDate) : undefined,
      salaryExpectation: applicationData.salaryExpectation,
      portfolio: applicationData.portfolio,
      linkedinProfile: applicationData.linkedinProfile,
      githubProfile: applicationData.githubProfile,
      experience: applicationData.experience,
      whyInterested: applicationData.whyInterested,
      skills: applicationData.skills || [],
      references: applicationData.references || [],
    };    // Add application to job
    job.applications.push(application);
    await job.save();

    const applicationId = job.applications[job.applications.length - 1]._id;    // Get employer details for notifications
    const employer = await User.findById(job.employer);
    const companyName = employer?.employerProfile?.companyName || employer?.name || 'Company';

    // Send email notification to applicant (don't block the response)
    sendJobApplicationEmail(applicant.email, {
      applicantName: applicant.name,
      jobTitle: job.title,
      companyName: companyName,
      applicationDate: new Date().toLocaleDateString()
    }).catch(error => {
      console.error('Error sending job application email:', error);
    });

    return NextResponse.json({ 
      message: 'Application submitted successfully',
      applicationId: applicationId
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// GET - Get job details for application
export async function GET(request, context) {
  try {
    await connectDB();
    
    const { jobId } = context.params;
    
    const job = await Job.findById(jobId)
      .populate('employer', 'name employerProfile.companyName employerProfile.companyLogo')
      .select('-applications'); // Don't include applications for public view

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });

  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
