import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../lib/mongodb';
import Job from '../../../../models/Job';
import User from '../../../../models/User';

// GET - Fetch single job by ID
export async function GET(request, context) {
  try {
    await connectDB();
    
    const { jobId } = context.params;
    
    const job = await Job.findOne({ 
      $or: [
        { _id: jobId },
        { uuid: jobId }
      ]
    }).populate('employer', 'name email employerProfile.companyName employerProfile.companyLogo employerProfile.companyWebsite employerProfile.companyLocation');

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Increment view count
    await Job.findByIdAndUpdate(job._id, { $inc: { views: 1 } });

    return NextResponse.json({ job });

  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// PUT - Update specific job
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
    const updateData = await request.json();
    
    // Find the employer user
    const employer = await User.findOne({ email: session.user.email });
    if (!employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    // Find the job and verify ownership
    const job = await Job.findOne({ 
      $or: [
        { _id: jobId },
        { uuid: jobId }
      ],
      employer: employer._id 
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or access denied' }, { status: 404 });
    }

    // Update salary range if provided
    if (updateData.salaryRange) {
      updateData.salaryRange = {
        min: updateData.salaryRange.min ? parseInt(updateData.salaryRange.min) : job.salaryRange.min,
        max: updateData.salaryRange.max ? parseInt(updateData.salaryRange.max) : job.salaryRange.max,
        currency: updateData.salaryRange.currency || job.salaryRange.currency,
        period: updateData.salaryRange.period || job.salaryRange.period,
        negotiable: updateData.salaryRange.negotiable !== undefined ? updateData.salaryRange.negotiable : job.salaryRange.negotiable
      };
    }

    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(
      job._id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('employer', 'name email employerProfile.companyName employerProfile.companyLogo');

    return NextResponse.json({ 
      message: 'Job updated successfully',
      job: updatedJob 
    });

  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete specific job
export async function DELETE(request, context) {
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
    
    // Find the employer user
    const employer = await User.findOne({ email: session.user.email });
    if (!employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    // Find and delete the job (verify ownership)
    const job = await Job.findOneAndDelete({ 
      $or: [
        { _id: jobId },
        { uuid: jobId }
      ],
      employer: employer._id 
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Job deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Apply to job (for job seekers)
export async function POST(request, context) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'user') {
      return NextResponse.json({ error: 'Access denied. Job seeker role required.' }, { status: 403 });
    }

    await connectDB();
    
    const { jobId } = context.params;
    const { coverLetter, resumeUrl } = await request.json();
    
    // Find the job
    const job = await Job.findOne({ 
      $or: [
        { _id: jobId },
        { uuid: jobId }
      ]
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status !== 'active') {
      return NextResponse.json({ error: 'Job is not accepting applications' }, { status: 400 });
    }

    // Check if application deadline has passed
    if (job.isApplicationDeadlinePassed()) {
      return NextResponse.json({ error: 'Application deadline has passed' }, { status: 400 });
    }

    // Find the applicant user
    const applicant = await User.findOne({ email: session.user.email });
    if (!applicant) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has already applied
    const existingApplication = job.applications.find(
      app => app.applicant.toString() === applicant._id.toString()
    );

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 });
    }

    // Add application
    job.applications.push({
      applicant: applicant._id,
      appliedAt: new Date(),
      status: 'pending',
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || ''
    });

    await job.save();

    return NextResponse.json({ 
      message: 'Application submitted successfully',
      applicationId: job.applications[job.applications.length - 1]._id
    });

  } catch (error) {
    console.error('Error applying to job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}