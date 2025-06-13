import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow job seekers (users with role 'user')
    if (session.user.role !== 'user') {
      return NextResponse.json(
        { error: 'This endpoint is only for job seekers' },
        { status: 403 }
      );
    }

    const { experienceLevel, fieldOfInterest } = await request.json();

    // Validate required fields
    if (!experienceLevel || !fieldOfInterest) {
      return NextResponse.json(
        { error: 'Experience level and field of interest are required' },
        { status: 400 }
      );
    }

    // Validate enum values
    const validExperienceLevels = ['student', 'fresher', 'experienced'];
    const validFields = [
      'software-development',
      'data-science', 
      'digital-marketing',
      'design',
      'finance',
      'sales',
      'hr',
      'operations',
      'consulting',
      'healthcare',
      'education',
      'other'
    ];

    if (!validExperienceLevels.includes(experienceLevel)) {
      return NextResponse.json(
        { error: 'Invalid experience level' },
        { status: 400 }
      );
    }

    if (!validFields.includes(fieldOfInterest)) {
      return NextResponse.json(
        { error: 'Invalid field of interest' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update user's job seeker profile
    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          'jobSeekerProfile.experienceLevel': experienceLevel,
          'jobSeekerProfile.fieldOfInterest': fieldOfInterest,
          'jobSeekerProfile.profileCompleted': true,
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile completed successfully',
      jobSeekerProfile: user.jobSeekerProfile
    });

  } catch (error) {
    console.error('Profile completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
