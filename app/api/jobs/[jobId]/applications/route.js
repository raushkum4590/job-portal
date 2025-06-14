import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import connectDB from '../../../../../lib/mongodb';
import Job from '../../../../../models/Job';
import User from '../../../../../models/User';

// GET - Get applications for a specific job (for employers)
export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'employer') {
      return NextResponse.json({ error: 'Access denied. Employer role required.' }, { status: 403 });
    }

    await connectDB();
    
    const { jobId } = context.params;
    
    // Find the job and verify ownership
    const job = await Job.findById(jobId)
      .populate({
        path: 'applications.applicant',
        select: 'name email jobSeekerProfile',
        model: 'User'
      })
      .populate('employer', '_id');

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Find the employer user to verify ownership
    const employer = await User.findOne({ email: session.user.email });
    if (!employer || job.employer._id.toString() !== employer._id.toString()) {
      return NextResponse.json({ error: 'Access denied. You can only view applications for your own jobs.' }, { status: 403 });
    }

    // Return applications with populated applicant data
    const applications = job.applications.map(app => ({
      _id: app._id,
      appliedAt: app.appliedAt,
      status: app.status,
      coverLetter: app.coverLetter,
      resumeUrl: app.resumeUrl,
      availabilityDate: app.availabilityDate,
      salaryExpectation: app.salaryExpectation,
      portfolio: app.portfolio,
      linkedinProfile: app.linkedinProfile,
      githubProfile: app.githubProfile,
      experience: app.experience,
      whyInterested: app.whyInterested,
      skills: app.skills,
      references: app.references,
      applicant: {
        _id: app.applicant._id,
        name: app.applicant.name,
        email: app.applicant.email,
        experienceLevel: app.applicant.jobSeekerProfile?.experienceLevel,
        fieldOfInterest: app.applicant.jobSeekerProfile?.fieldOfInterest
      }
    }));

    return NextResponse.json({ 
      applications,
      jobTitle: job.title,
      totalApplications: applications.length 
    });

  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// PUT - Update application status (for employers)
export async function PUT(request, context) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'employer') {
      return NextResponse.json({ error: 'Access denied. Employer role required.' }, { status: 403 });
    }

    await connectDB();
    
    const { jobId } = context.params;
    const { applicationId, status } = await request.json();
    
    // Validate status
    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'interview', 'hired', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Find the job and verify ownership
    const job = await Job.findById(jobId).populate('employer', '_id');

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Find the employer user to verify ownership
    const employer = await User.findOne({ email: session.user.email });
    if (!employer || job.employer._id.toString() !== employer._id.toString()) {
      return NextResponse.json({ error: 'Access denied. You can only update applications for your own jobs.' }, { status: 403 });
    }    // Find and update the application
    const application = job.applications.id(applicationId);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const previousStatus = application.status;
    application.status = status;
    await job.save();    // Send shortlist notification email if status changed to shortlisted
    if (status === 'shortlisted' && previousStatus !== 'shortlisted') {
      // Get applicant details
      const applicant = await User.findById(application.applicant);
      const companyName = employer?.employerProfile?.companyName || employer?.name || 'Company';
      
      if (applicant) {
        // Send shortlist notification email (don't block response)
        sendShortlistEmail(applicant.email, {
          applicantName: applicant.name,
          jobTitle: job.title,
          companyName: companyName,
          nextStep: 'Interview/Assessment'
        }).catch(error => {
          console.error('Error sending shortlist notification email:', error);
        });
      }
    }

    return NextResponse.json({ 
      message: 'Application status updated successfully',
      applicationId,
      newStatus: status 
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
