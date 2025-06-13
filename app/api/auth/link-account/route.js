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

    const { provider, providerId, providerEmail } = await request.json();

    if (!provider || !providerId || !providerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user by session email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the provider email matches the user email
    if (providerEmail !== user.email) {
      return NextResponse.json(
        { error: 'Provider email must match your account email' },
        { status: 400 }
      );
    }

    // Link the OAuth account
    if (provider === 'google') {
      if (!user.oauth) {
        user.oauth = {};
      }
      user.oauth.google = {
        id: providerId,
        email: providerEmail,
      };
    }

    user.isVerified = true; // Mark as verified since OAuth provider verified the email
    await user.save();

    return NextResponse.json({ 
      message: `${provider} account linked successfully`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        oauth: user.oauth,
      }
    });

  } catch (error) {
    console.error('Account linking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
