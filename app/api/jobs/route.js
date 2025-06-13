import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../lib/mongodb';
import Job from '../../../models/Job';
import User from '../../../models/User';

// GET - Fetch jobs (with filtering)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const employer = searchParams.get('employer');
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const jobType = searchParams.get('jobType');
    const workModel = searchParams.get('workModel');
    const location = searchParams.get('location');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    console.log('🔍 Jobs GET API called with params:', {
      employer, status, department, jobType, workModel, location, page, limit
    });
    
    // Build query
    const query = {};
    
    // Validate employer parameter - only add if it's a valid ObjectId
    if (employer && employer !== 'undefined' && employer.match(/^[0-9a-fA-F]{24}$/)) {
      query.employer = employer;
      console.log('✅ Valid employer ID added to query:', employer);
    } else if (employer) {
      console.log('❌ Invalid employer ID format:', employer);
    }
    
    if (status) {
      query.status = status;
    } else {
      // By default, only show active jobs for public requests
      query.status = 'active';
    }
    
    if (department) {
      query.department = department;
    }
    
    if (jobType) {
      query.jobType = jobType;
    }
    
    if (workModel) {
      query.workModel = workModel;
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Get session to check if user is the employer
    const session = await getServerSession(authOptions);
    
    console.log('👤 Session info:', {
      hasSession: !!session,
      role: session?.user?.role,
      email: session?.user?.email
    });
    
    // If user is an employer requesting their own jobs, show all statuses
    if (session && session.user.role === 'employer' && employer) {
      const user = await User.findOne({ email: session.user.email });
      if (user && user._id.toString() === employer) {
        delete query.status; // Show all statuses for own jobs
        console.log('✅ Employer accessing own jobs - showing all statuses');
      } else {
        console.log('❌ User ID mismatch:', {
          userIdFromDB: user?._id?.toString(),
          employerParam: employer
        });
      }
    }

    console.log('🔎 Final query:', query);    const skip = (page - 1) * limit;
    
    // Build the query pipeline
    let jobsQuery = Job.find(query);
    
    // If this is an employer requesting their own jobs, populate applications
    if (session && session.user.role === 'employer' && employer) {
      const user = await User.findOne({ email: session.user.email });
      if (user && user._id.toString() === employer) {
        jobsQuery = jobsQuery.populate({
          path: 'applications.applicant',
          select: 'name email profile jobSeekerProfile'
        });
        console.log('✅ Populating applications for employer');
      }
    }
    
    const jobs = await jobsQuery
      .populate('employer', 'name email employerProfile.companyName employerProfile.companyLogo')
      .sort({ featured: -1, urgent: -1, postedAt: -1 })
      .skip(skip)
      .limit(limit);    const total = await Job.countDocuments(query);
    
    console.log('📊 Jobs found:', {
      count: jobs.length,
      total: total,
      query: query,
      applicationsCount: jobs.map(job => ({ 
        jobTitle: job.title, 
        applications: job.applications?.length || 0 
      }))
    });
    
    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Create new job
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'employer') {
      return NextResponse.json({ error: 'Access denied. Employer role required.' }, { status: 403 });
    }

    await connectDB();
    
    const data = await request.json();
    
    // Find the employer user
    const employer = await User.findOne({ email: session.user.email });
    if (!employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'requirements', 'department', 'jobType', 'workModel', 'experienceLevel', 'location'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        missingFields 
      }, { status: 400 });
    }

    // Create job data
    const jobData = {
      ...data,
      employer: employer._id,
      companyName: employer.employerProfile?.companyName || employer.name,
      companyLogo: employer.employerProfile?.companyLogo,
      // Set application email to company email if not provided
      applicationEmail: data.applicationEmail || employer.employerProfile?.companyEmail || employer.email,
      // Convert salary range strings to numbers
      salaryRange: {
        min: data.salaryRange?.min ? parseInt(data.salaryRange.min) : null,
        max: data.salaryRange?.max ? parseInt(data.salaryRange.max) : null,
        currency: data.salaryRange?.currency || 'USD',
        period: data.salaryRange?.period || 'yearly',
        negotiable: data.salaryRange?.negotiable || false
      },
      // Set expiration date (30 days from now by default)
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    const job = new Job(jobData);
    await job.save();
    
    // Populate employer info for response
    await job.populate('employer', 'name email employerProfile.companyName employerProfile.companyLogo');

    return NextResponse.json({ 
      message: 'Job created successfully',
      job 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// PUT - Update job
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'employer') {
      return NextResponse.json({ error: 'Access denied. Employer role required.' }, { status: 403 });
    }

    await connectDB();
    
    const data = await request.json();
    const { jobId, ...updateData } = data;
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Find the employer user
    const employer = await User.findOne({ email: session.user.email });
    if (!employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    // Find the job and verify ownership
    const job = await Job.findOne({ _id: jobId, employer: employer._id });
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
      jobId,
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

// DELETE - Delete job
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'employer') {
      return NextResponse.json({ error: 'Access denied. Employer role required.' }, { status: 403 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Find the employer user
    const employer = await User.findOne({ email: session.user.email });
    if (!employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    // Find and delete the job (verify ownership)
    const job = await Job.findOneAndDelete({ _id: jobId, employer: employer._id });
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