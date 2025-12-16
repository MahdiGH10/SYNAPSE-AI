import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { verifyToken } from '@/lib/jwt';

// GET: Get a specific ticket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const ticket = await Ticket.findById(id)
      .populate('userId', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('messages.sender', 'name email role');

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Check if user is authorized to view this ticket
    if (
      user.role !== 'admin' &&
      user.role !== 'superadmin' &&
      ticket.userId._id.toString() !== decoded.userId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ ticket }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

// PATCH: Update ticket (admin only) or add message
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const body = await request.json();
    const { message, status, priority, assignedTo } = body;

    // Track if admin is replying to create notification
    const isAdminReply = message && (user.role === 'admin' || user.role === 'superadmin') && ticket.userId.toString() !== decoded.userId;

    // Add message to conversation
    if (message) {
      ticket.messages.push({
        sender: decoded.userId,
        senderRole: user.role,
        message,
        timestamp: new Date(),
      });

      // Create notification for ticket owner if admin/superadmin replies
      if (isAdminReply) {
        await Notification.create({
          userId: ticket.userId,
          type: 'ticket_reply',
          title: 'New Reply to Your Ticket',
          message: `Admin replied to "${ticket.title}": ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`,
          link: `/support/ticket/${ticket._id}`,
          ticketId: ticket._id,
          read: false,
        });
      }
    }

    // Admin/SuperAdmin can update status, priority, and assignment
    if (user.role === 'admin' || user.role === 'superadmin') {
      if (status && status !== ticket.status) {
        const oldStatus = ticket.status;
        ticket.status = status;
        
        // Notify user of status change
        await Notification.create({
          userId: ticket.userId,
          type: 'ticket_status',
          title: 'Ticket Status Updated',
          message: `Your ticket "${ticket.title}" status changed from ${oldStatus} to ${status}`,
          link: `/support/ticket/${ticket._id}`,
          ticketId: ticket._id,
          read: false,
        });
      }
      if (priority) ticket.priority = priority;
      if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    } else {
      // Regular users can only add messages to their own tickets
      if (ticket.userId.toString() !== decoded.userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(id)
      .populate('userId', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('messages.sender', 'name email role');

    return NextResponse.json(
      { message: 'Ticket updated successfully', ticket: updatedTicket },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a ticket (admin/superadmin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Ticket deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}
