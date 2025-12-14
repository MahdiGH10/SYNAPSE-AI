import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// POST: Promote user to admin or superadmin (superadmin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    // Check if requesting user is superadmin
    const requestingUser = await User.findById(decoded.userId);
    if (!requestingUser || requestingUser.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Only superadmins can promote users' },
        { status: 403 }
      );
    }

    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be user, admin, or superadmin' },
        { status: 400 }
      );
    }

    const userToPromote = await User.findOne({ email });
    if (!userToPromote) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    userToPromote.role = role;
    await userToPromote.save();

    return NextResponse.json(
      {
        message: `User ${email} promoted to ${role} successfully`,
        user: {
          id: userToPromote._id,
          name: userToPromote.name,
          email: userToPromote.email,
          role: userToPromote.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error promoting user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to promote user' },
      { status: 500 }
    );
  }
}

// GET: List all users (superadmin only)
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const requestingUser = await User.findById(decoded.userId);
    if (!requestingUser || (requestingUser.role !== 'admin' && requestingUser.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await User.find()
      .select('name email role verified createdAt lastLogin')
      .sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
