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

    // Only allow employers
    if (session.user.role !== 'employer') {
      return NextResponse.json(
        { error: 'This endpoint is only for employers' },
        { status: 403 }
      );
    }    const { 
      companyName, 
      companyType, 
      companySize, 
      hiringFor,
      companyWebsite,
      companyLocation,
      companyDescription,
      workModel,
      experienceLevel,
      salaryRange,
      hiringUrgency,
      benefitsOffered 
    } = await request.json();

    // Validate required fields
    if (!companyName || !companyType || !companySize || !hiringFor) {
      return NextResponse.json(
        { error: 'Required fields: companyName, companyType, companySize, hiringFor' },
        { status: 400 }
      );
    }

    // Validate enum values
    const validCompanyTypes = [
      'software-company',
      'startup',
      'consulting',
      'finance',
      'healthcare',
      'education',
      'retail',
      'manufacturing',
      'non-profit',
      'government',
      'other'
    ];

    const validCompanySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
    
    const validHiringFields = [
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

    if (!validCompanyTypes.includes(companyType)) {
      return NextResponse.json(
        { error: 'Invalid company type' },
        { status: 400 }
      );
    }

    if (!validCompanySizes.includes(companySize)) {
      return NextResponse.json(
        { error: 'Invalid company size' },
        { status: 400 }
      );
    }    if (!validHiringFields.includes(hiringFor)) {
      return NextResponse.json(
        { error: 'Invalid hiring field' },
        { status: 400 }
      );
    }

    // Validate optional fields if provided
    const validWorkModels = ['remote', 'hybrid', 'on-site', 'flexible'];
    const validExperienceLevels = ['entry-level', 'mid-level', 'senior-level', 'executive', 'all-levels'];
    const validSalaryRanges = [
      'under-30k',
      '30k-50k',
      '50k-75k',
      '75k-100k',
      '100k-150k',
      '150k-200k',
      'above-200k',
      'negotiable'
    ];
    const validHiringUrgencies = ['immediate', 'within-month', 'within-quarter', 'ongoing', 'planning'];
    const validBenefits = [
      'health-insurance',
      'dental-insurance',
      'vision-insurance',
      'retirement-401k',
      'flexible-hours',
      'remote-work',
      'paid-time-off',
      'professional-development',
      'gym-membership',
      'free-meals',
      'stock-options',
      'parental-leave',
      'mental-health-support',
      'transportation-allowance',
      'other'
    ];

    if (workModel && !validWorkModels.includes(workModel)) {
      return NextResponse.json(
        { error: 'Invalid work model' },
        { status: 400 }
      );
    }

    if (experienceLevel && !validExperienceLevels.includes(experienceLevel)) {
      return NextResponse.json(
        { error: 'Invalid experience level' },
        { status: 400 }
      );
    }

    if (salaryRange && !validSalaryRanges.includes(salaryRange)) {
      return NextResponse.json(
        { error: 'Invalid salary range' },
        { status: 400 }
      );
    }

    if (hiringUrgency && !validHiringUrgencies.includes(hiringUrgency)) {
      return NextResponse.json(
        { error: 'Invalid hiring urgency' },
        { status: 400 }
      );
    }

    if (benefitsOffered && Array.isArray(benefitsOffered)) {
      const invalidBenefits = benefitsOffered.filter(benefit => !validBenefits.includes(benefit));
      if (invalidBenefits.length > 0) {
        return NextResponse.json(
          { error: `Invalid benefits: ${invalidBenefits.join(', ')}` },
          { status: 400 }
        );
      }
    }

    await connectDB();    // Update user's employer profile
    const updateData = {
      'employerProfile.companyName': companyName,
      'employerProfile.companyType': companyType,
      'employerProfile.companySize': companySize,
      'employerProfile.hiringFor': hiringFor,
      'employerProfile.profileCompleted': true,
    };

    // Add optional fields if provided
    if (companyWebsite) updateData['employerProfile.companyWebsite'] = companyWebsite;
    if (companyLocation) updateData['employerProfile.companyLocation'] = companyLocation;
    if (companyDescription) updateData['employerProfile.companyDescription'] = companyDescription;
    if (workModel) updateData['employerProfile.workModel'] = workModel;
    if (experienceLevel) updateData['employerProfile.experienceLevel'] = experienceLevel;
    if (salaryRange) updateData['employerProfile.salaryRange'] = salaryRange;
    if (hiringUrgency) updateData['employerProfile.hiringUrgency'] = hiringUrgency;
    if (benefitsOffered && Array.isArray(benefitsOffered)) {
      updateData['employerProfile.benefitsOffered'] = benefitsOffered;
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Employer profile completed successfully',
      employerProfile: user.employerProfile
    });

  } catch (error) {
    console.error('Employer profile completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
