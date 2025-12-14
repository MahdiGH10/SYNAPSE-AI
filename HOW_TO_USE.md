# How to Use the Super Admin System

## 🎯 Quick Navigation

### For Users:
- **Submit Bug Report**: Go to `/support` → Click "New Ticket"
- **View My Tickets**: Go to `/support`

### For Admins/SuperAdmins:
- **Admin Dashboard**: Go to `/admin`
- **Manage Tickets**: Go to `/admin/tickets`
- **View as User**: Go to `/support`

---

## 👤 For Regular Users

### Step 1: Submit a Ticket

1. **Navigate to Support Center**
   - Click "Support" in the navigation bar
   - Or go directly to: `http://localhost:3000/support`

2. **Create New Ticket**
   - Click the blue "New Ticket" button (top right)
   - A modal form will appear

3. **Fill in the Form**
   - **Title**: Brief summary (required)
   - **Category**: Choose from:
     - Bug Report
     - Feature Request
     - Support
     - Other
   - **Priority**: Choose from:
     - Low
     - Medium
     - High
     - Critical
   - **Description**: Detailed explanation (required)

4. **Submit**
   - Click "Submit Ticket"
   - You'll see a success message
   - The ticket appears in your support center

### Step 2: Track Your Tickets

- All your tickets are displayed as cards
- Each card shows:
  - ✅ Status icon (open, in-progress, resolved, closed)
  - 📌 Priority badge (color-coded)
  - 💬 Message count
  - 📅 Creation date
  - 🏷️ Category tag

### Step 3: View Ticket Details (Coming Soon)
- Click on any ticket card to view full conversation
- See admin responses
- Continue the conversation

---

## 👨‍💼 For Admins & SuperAdmins

### Step 1: Access Admin Dashboard

1. **Login as Admin/SuperAdmin**
   - Your account must have role: `admin` or `superadmin`

2. **Go to Admin Dashboard**
   - Navigate to: `http://localhost:3000/admin`
   - You'll see:
     - 📊 Statistics overview
     - 🎫 Total, Open, Critical tickets
     - ✅ System status

3. **Dashboard Features**
   - Quick stats cards with live counts
   - Access cards to all admin functions
   - System privileges list
   - Quick action buttons

### Step 2: Manage Tickets

1. **Open Ticket Management**
   - Click "Ticket Management" card on dashboard
   - Or go to: `http://localhost:3000/admin/tickets`

2. **View Statistics**
   - Top row shows 4 stat cards:
     - 🎫 Open Tickets
     - ⏰ In Progress
     - 🚨 Critical
     - ✅ Resolved

3. **Filter Tickets**
   - **Status Filter**: All Status / Open / In Progress / Resolved / Closed
   - **Priority Filter**: All Priority / Low / Medium / High / Critical
   - Filters apply instantly

4. **View Ticket List**
   - Left sidebar shows filtered tickets
   - Each ticket displays:
     - Title
     - Priority badge
     - Status badge
     - User name
   - Click any ticket to view details

### Step 3: Manage Individual Ticket

1. **Select a Ticket**
   - Click on ticket in left sidebar
   - Details appear in right panel

2. **View Ticket Information**
   - Title and full description
   - User who submitted it
   - Creation date
   - Category
   - Full conversation history

3. **Update Status**
   - Use the "Status" dropdown:
     - Open → Just created
     - In Progress → Working on it
     - Resolved → Fixed/Answered
     - Closed → Completed
   - Changes save automatically

4. **Update Priority**
   - Use the "Priority" dropdown:
     - Low → Not urgent
     - Medium → Normal priority
     - High → Important
     - Critical → Urgent attention needed
   - Changes save automatically

5. **Reply to User**
   - Type your message in the text box at bottom
   - Click "Send Reply" button
   - Your reply appears in conversation
   - User will see it in their support center

### Step 4: Track Progress

- **Message History**: All messages appear chronologically
- **Sender Identification**: 
  - User messages: Gray background
  - Admin messages: Blue background
- **Timestamps**: Each message shows when it was sent
- **Role Display**: Shows if sender is user/admin/superadmin

---

## 🎨 Visual Indicators

### Status Colors:
- 🔵 **Blue** = Open (needs attention)
- 🟡 **Yellow** = In Progress (being worked on)
- 🟢 **Green** = Resolved (completed)
- ⚫ **Gray** = Closed (archived)

### Priority Colors:
- 🔵 **Blue** = Low priority
- 🟡 **Yellow** = Medium priority
- 🟠 **Orange** = High priority
- 🔴 **Red** = Critical priority

### Icons:
- 🎫 **Ticket** = Total tickets
- ⏰ **Clock** = In progress / Pending
- 🚨 **Alert** = Critical issues
- ✅ **Check** = Resolved / Completed
- 💬 **Chat** = Messages
- 👤 **User** = User information
- 📅 **Calendar** = Dates
- 🏷️ **Tag** = Categories

---

## 🔐 Setting Up Super Admin

### Method 1: Direct Database Update

```javascript
// Connect to MongoDB
use synapseai;

// Update user to superadmin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "superadmin" } }
)

// Verify the change
db.users.findOne({ email: "your-email@example.com" })
```

### Method 2: Via API (Create endpoint if needed)

```javascript
// POST /api/admin/promote-user
{
  "userId": "user_id_here",
  "role": "superadmin"
}
```

---

## 🧪 Testing the System

### Test as User:

1. **Login as regular user**
2. **Go to** `/support`
3. **Click** "New Ticket"
4. **Fill form**:
   - Title: "Test Bug Report"
   - Category: Bug Report
   - Priority: High
   - Description: "This is a test ticket to verify the system works"
5. **Submit** and see it in your list
6. **Verify** ticket appears with correct status/priority

### Test as Admin:

1. **Login as admin/superadmin**
2. **Go to** `/admin` - Verify dashboard loads
3. **Go to** `/admin/tickets` - See all tickets
4. **Click** on the test ticket
5. **Change status** to "In Progress"
6. **Change priority** if needed
7. **Type reply**: "Thank you for reporting this. We're investigating."
8. **Click** "Send Reply"
9. **Verify** message appears in conversation

### Verify Updates:

1. **Logout** from admin account
2. **Login** as the user who created ticket
3. **Go to** `/support`
4. **Verify** ticket status changed
5. **Verify** admin reply is visible (when viewing ticket details)

---

## 🐛 Troubleshooting

### Cannot Access Admin Pages
- ✅ Check your user role in database
- ✅ Should be `admin` or `superadmin`, not `user`
- ✅ Logout and login again after role change
- ✅ Check JWT token includes role field

### Tickets Not Appearing
- ✅ Check database connection
- ✅ Verify MongoDB is running
- ✅ Check browser console for errors
- ✅ Verify token is valid (check localStorage)

### Cannot Submit Ticket
- ✅ Must be logged in
- ✅ Check all required fields filled
- ✅ Check browser console for API errors
- ✅ Verify `/api/tickets` endpoint is working

### Filters Not Working
- ✅ Refresh the page
- ✅ Check if tickets exist with selected filters
- ✅ Try "All Status" and "All Priority" first

---

## 📱 Mobile Usage

The system is fully responsive:

- **Support Page**: Cards stack vertically on mobile
- **Admin Dashboard**: Stats cards stack in single column
- **Ticket Management**: 
  - Ticket list full width on mobile
  - Click ticket to see details (full screen)
  - Swipe back to return to list

---

## 💡 Tips & Best Practices

### For Users:
- ✅ Be specific in ticket titles
- ✅ Provide detailed descriptions
- ✅ Set appropriate priority (don't mark everything critical)
- ✅ Choose correct category for faster routing
- ✅ Check support center before creating duplicate tickets

### For Admins:
- ✅ Respond to critical tickets first
- ✅ Change status to "In Progress" when you start working
- ✅ Be clear and helpful in responses
- ✅ Set realistic priorities
- ✅ Close resolved tickets to keep dashboard clean
- ✅ Use filters to focus on specific ticket types
- ✅ Check "Open" tickets daily

---

## 🎉 You're All Set!

Your Super Admin system is fully functional and ready to use. Start by:

1. Creating a superadmin user
2. Testing ticket submission as user
3. Managing tickets as admin
4. Exploring the dashboard features

For technical details, see [SUPER_ADMIN_GUIDE.md](SUPER_ADMIN_GUIDE.md)
