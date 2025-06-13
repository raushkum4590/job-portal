import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all users with their authentication methods
    const users = await User.find({}).select('-password');
    
    const userStats = {
      total: users.length,
      emailAuth: users.filter(user => user.password && user.password !== 'google-oauth').length,
      googleAuth: users.filter(user => user.password === 'google-oauth').length,
      verified: users.filter(user => user.isVerified).length,
      roles: {
        users: users.filter(user => user.role === 'user').length,
        employers: users.filter(user => user.role === 'employer').length,
        admins: users.filter(user => user.role === 'admin').length,
      }
    };

    return NextResponse.json({ 
      users: users.slice(0, 50), // Limit to first 50 users
      stats: userStats 
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId, updates } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Only allow updating specific fields
    const allowedUpdates = {
      role: updates.role,
      isVerified: updates.isVerified,
    };

    const user = await User.findByIdAndUpdate(
      userId,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'User updated successfully',
      user 
    });

  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
