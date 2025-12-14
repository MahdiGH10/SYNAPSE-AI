# Super Admin System Documentation

## Overview
The Super Admin system provides comprehensive ticket management and user support capabilities for SynapseAI.

## Features Implemented

### 1. **User Roles**
- **User**: Regular users with standard access
- **Admin**: Can manage tickets and view all system data
- **SuperAdmin**: Full system access with all privileges

### 2. **Ticket System**

#### For Users:
- Submit bug reports and support tickets
- Track ticket status (open, in-progress, resolved, closed)
- Set priority levels (low, medium, high, critical)
- Categorize tickets (bug, feature, support, other)
- View conversation history
- Reply to admin responses

#### For Admins/SuperAdmins:
- View all tickets from all users
- Filter tickets by status and priority
- Update ticket status and priority
- Reply to user tickets
- Assign tickets to specific admins
- View ticket statistics and analytics
- Delete tickets

### 3. **Admin Dashboard**
Located at `/admin`, provides:
- Quick statistics overview
- Total tickets, open tickets, critical tickets
- System status monitoring
- Quick access to all admin functions
- Full privilege management

### 4. **Ticket Management Interface**
Located at `/admin/tickets`, features:
- Real-time ticket list with filters
- Detailed ticket view with full conversation history
- Inline status and priority updates
- Message reply system
- Statistics cards (open, in-progress, critical, resolved)
- Category breakdown

### 5. **Support Center**
Located at `/support`, provides:
- User-friendly ticket submission form
- View user's own tickets
- Track ticket status
- See admin responses
- Continue conversations

## API Endpoints

### Tickets
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets` - Get tickets (all for admin, user's own for users)
- `GET /api/tickets/[id]` - Get specific ticket
- `PATCH /api/tickets/[id]` - Update ticket or add message
- `DELETE /api/tickets/[id]` - Delete ticket (admin only)
- `GET /api/tickets/stats` - Get ticket statistics (admin only)

## Database Models

### Ticket Model
```typescript
{
  userId: ObjectId,
  title: String,
  description: String,
  category: 'bug' | 'feature' | 'support' | 'other',
  priority: 'low' | 'medium' | 'high' | 'critical',
  status: 'open' | 'in-progress' | 'resolved' | 'closed',
  messages: [{
    sender: ObjectId,
    senderRole: 'user' | 'admin' | 'superadmin',
    message: String,
    timestamp: Date
  }],
  assignedTo: ObjectId (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### User Model (Updated)
```typescript
{
  name: String,
  email: String,
  password: String,
  role: 'user' | 'admin' | 'superadmin',
  // ... other fields
}
```

## Super Admin Privileges

### Full Access:
1. ✅ View all tickets from all users
2. ✅ Respond to any ticket
3. ✅ Update ticket status and priority
4. ✅ Delete tickets
5. ✅ Assign tickets to admins
6. ✅ View system statistics
7. ✅ Access admin dashboard
8. ✅ Manage user permissions (structure ready)

### Ticket Management:
- Change status: open → in-progress → resolved → closed
- Adjust priority: low → medium → high → critical
- Reply to user messages
- View full conversation history
- Track ticket metrics

### Analytics:
- Total tickets count
- Open tickets count
- In-progress tickets count
- Resolved tickets count
- Critical and high priority counts
- Unassigned tickets count
- Category breakdown (bug, feature, support, other)

## Usage

### Creating a SuperAdmin User
To create a superadmin user, update a user in the database:
```javascript
// In MongoDB or through API
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "superadmin" } }
)
```

### User Submitting a Ticket
1. Navigate to `/support`
2. Click "New Ticket"
3. Fill in title, description, category, and priority
4. Submit ticket
5. Track status on support page

### Admin Managing Tickets
1. Navigate to `/admin` (superadmin dashboard)
2. Click "Ticket Management" or go to `/admin/tickets`
3. View all tickets with filters
4. Click on a ticket to see details
5. Update status/priority using dropdowns
6. Reply to user in the message box
7. Track all conversations in real-time

## Navigation Structure

```
/support          → User ticket submission and tracking
/admin            → Super Admin dashboard
/admin/tickets    → Ticket management interface
```

## Components Created

1. **TicketForm.tsx** - Modal for submitting new tickets
2. **AdminTicketManagement.tsx** - Full ticket management interface
3. **AdminDashboard.tsx** - Super admin overview dashboard

## Security

- All admin routes protected with role-based authentication
- JWT token verification on all API endpoints
- Users can only see their own tickets
- Admins/SuperAdmins can see all tickets
- Role checks on both frontend and backend

## Future Enhancements

- Email notifications for ticket updates
- Real-time notifications using WebSockets
- Ticket assignment system
- Admin activity logs
- User management interface
- System settings configuration
- Bulk ticket operations
- Export tickets to CSV/PDF
- Advanced analytics and reporting
- Ticket templates
- Auto-assignment based on category
- SLA tracking and alerts

## Getting Started

1. Start your MongoDB database
2. Start the Next.js development server: `npm run dev`
3. Create a superadmin user in the database
4. Login with superadmin credentials
5. Navigate to `/admin` to access the dashboard
6. Test ticket creation at `/support`
7. Manage tickets at `/admin/tickets`

## Notes

- The system is fully integrated with the existing authentication
- All ticket data is stored in MongoDB
- The UI is responsive and works on all devices
- Dark mode is fully supported throughout
- Real-time updates require page refresh (WebSocket integration planned)
