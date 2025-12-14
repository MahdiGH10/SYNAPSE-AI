import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// GET: Get ticket statistics (admin only)
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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get statistics
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'closed' });
    
    const criticalTickets = await Ticket.countDocuments({ 
      priority: 'critical',
      status: { $nin: ['resolved', 'closed'] }
    });
    const highPriorityTickets = await Ticket.countDocuments({ 
      priority: 'high',
      status: { $nin: ['resolved', 'closed'] }
    });

    // Category breakdown
    const bugTickets = await Ticket.countDocuments({ category: 'bug' });
    const featureTickets = await Ticket.countDocuments({ category: 'feature' });
    const supportTickets = await Ticket.countDocuments({ category: 'support' });
    const otherTickets = await Ticket.countDocuments({ category: 'other' });

    // Recent tickets
    const recentTickets = await Ticket.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Unassigned tickets
    const unassignedTickets = await Ticket.countDocuments({
      assignedTo: null,
      status: { $nin: ['resolved', 'closed'] }
    });

    return NextResponse.json({
      stats: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
        critical: criticalTickets,
        highPriority: highPriorityTickets,
        unassigned: unassignedTickets,
      },
      categories: {
        bug: bugTickets,
        feature: featureTickets,
        support: supportTickets,
        other: otherTickets,
      },
      recentTickets,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching ticket statistics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
