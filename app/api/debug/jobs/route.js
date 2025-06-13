import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Job from '../../../../models/Job';

// Debug endpoint to see all jobs in database
export async function GET() {
  try {
    await connectDB();
    
    const allJobs = await Job.find({})
      .populate('employer', 'name email employerProfile.companyName')
      .sort({ postedAt: -1 });
    
    console.log('🔍 Debug: All jobs in database:', allJobs.length);
    
    return NextResponse.json({
      totalJobs: allJobs.length,
      jobs: allJobs.map(job => ({
        _id: job._id,
        title: job.title,
        status: job.status,
        employer: job.employer?._id,
        employerName: job.employer?.name,
        companyName: job.employer?.employerProfile?.companyName,
        postedAt: job.postedAt
      }))
    });
    
  } catch (error) {
    console.error('Debug jobs error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
