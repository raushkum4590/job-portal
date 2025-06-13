import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';

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
    
    // Validate required fields
    if (!data.companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    // Find user by session email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare the updated employer profile data
    const updatedEmployerProfile = {
      ...user.employerProfile,
      // Basic Information
      companyName: data.companyName,
      companyWebsite: data.companyWebsite || user.employerProfile?.companyWebsite,
      companyLocation: data.companyLocation || user.employerProfile?.companyLocation,
      companyDescription: data.companyDescription || user.employerProfile?.companyDescription,
      companyType: data.companyType || user.employerProfile?.companyType,
      companySize: data.companySize || user.employerProfile?.companySize,
      
      // Enhanced Company Details
      foundedYear: data.foundedYear || user.employerProfile?.foundedYear,
      headquarters: data.headquarters || user.employerProfile?.headquarters,
      linkedinUrl: data.linkedinUrl || user.employerProfile?.linkedinUrl,
      twitterUrl: data.twitterUrl || user.employerProfile?.twitterUrl,
      facebookUrl: data.facebookUrl || user.employerProfile?.facebookUrl,
      instagramUrl: data.instagramUrl || user.employerProfile?.instagramUrl,
      companyPhone: data.companyPhone || user.employerProfile?.companyPhone,
      companyEmail: data.companyEmail || user.employerProfile?.companyEmail,
      
      // About Company
      aboutCompany: data.aboutCompany || user.employerProfile?.aboutCompany,
      mission: data.mission || user.employerProfile?.mission,
      vision: data.vision || user.employerProfile?.vision,
      values: data.values || user.employerProfile?.values,
      
      // Work Culture
      workModel: data.workModel || user.employerProfile?.workModel,
      workingHours: data.workingHours || user.employerProfile?.workingHours,
      dressCode: data.dressCode || user.employerProfile?.dressCode,
      teamSize: data.teamSize || user.employerProfile?.teamSize,
      
      // Hiring Details
      hiringFor: data.hiringFor || user.employerProfile?.hiringFor,
      experienceLevel: data.experienceLevel || user.employerProfile?.experienceLevel,
      salaryRange: data.salaryRange || user.employerProfile?.salaryRange,
      hiringUrgency: data.hiringUrgency || user.employerProfile?.hiringUrgency,
      
      // Benefits (convert to the format expected by the model)
      benefitsOffered: data.benefitsOffered ? data.benefitsOffered.map(benefit => 
        benefit.toLowerCase().replace(/\s+/g, '-').replace(/[()&]/g, '').replace(/--+/g, '-').replace(/^-|-$/g, '')
      ) : user.employerProfile?.benefitsOffered || [],
      
      // Company Achievements
      awards: data.awards || user.employerProfile?.awards,
      certifications: data.certifications || user.employerProfile?.certifications,
      clients: data.clients || user.employerProfile?.clients,
      
      // Additional Info
      companyLogo: data.companyLogo || user.employerProfile?.companyLogo,
      coverImage: data.coverImage || user.employerProfile?.coverImage,
      industry: data.industry || user.employerProfile?.industry,
      revenue: data.revenue || user.employerProfile?.revenue,
      employeeGrowth: data.employeeGrowth || user.employerProfile?.employeeGrowth,
      
      // Contact Person
      hrName: data.hrName || user.employerProfile?.hrName,
      hrEmail: data.hrEmail || user.employerProfile?.hrEmail,
      hrPhone: data.hrPhone || user.employerProfile?.hrPhone,
      hrDesignation: data.hrDesignation || user.employerProfile?.hrDesignation,
      
      // Mark profile as completed
      profileCompleted: true,
    };

    // Update the user with the new employer profile
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        employerProfile: updatedEmployerProfile,
        // Update main profile fields as well
        profile: {
          ...user.profile,
          phone: data.companyPhone || user.profile?.phone,
          location: data.companyLocation || user.profile?.location,
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Company profile updated successfully',
      user: {
        id: updatedUser._id,
        uuid: updatedUser.uuid,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        employerProfile: updatedUser.employerProfile,
        profile: updatedUser.profile,
      }
    });

  } catch (error) {
    console.error('Error updating company profile:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'employer') {
      return NextResponse.json({ error: 'Access denied. Employer role required.' }, { status: 403 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      employerProfile: user.employerProfile || {},
      profile: user.profile || {}
    });

  } catch (error) {
    console.error('Error fetching company profile:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
