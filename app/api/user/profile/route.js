import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await request.json();
    
    // Don't allow certain fields to be updated
    delete updates.password;
    delete updates._id;
    delete updates.role;
    
    // Structure the update data properly
    const updateData = {
      name: updates.name,
      profile: {
        phone: updates.phone,
        dateOfBirth: updates.dateOfBirth,
        gender: updates.gender,
        location: updates.location,
        headline: updates.headline,
        summary: updates.summary,
        education: updates.education || [],
        experience: updates.experience || [],
        skills: updates.skills || [],
        portfolio: updates.portfolio,
        linkedinProfile: updates.linkedinProfile,
        githubProfile: updates.githubProfile,
        resumeUrl: updates.resumeUrl,
        resumeFileName: updates.resumeFileName
      },
      jobSeekerProfile: {
        experienceLevel: updates.jobSeekerProfile?.experienceLevel,
        fieldOfInterest: updates.jobSeekerProfile?.fieldOfInterest,
        expectedSalary: updates.jobSeekerProfile?.expectedSalary,
        availability: updates.jobSeekerProfile?.availability,
        workModel: updates.jobSeekerProfile?.workModel
      }
    };

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user 
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error',
        details: error.message },
      { status: 500 }
    );
  }
}
