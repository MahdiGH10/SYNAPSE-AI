# 🚀 Complete Setup Guide - Super Admin & Bug Reporting

## 📋 Overview

Your SynapseAI platform now has a complete ticket/bug reporting system with Super Admin privileges. Everything is stored in **MongoDB** (not localStorage) for a smooth, production-ready experience.

---

## 🗄️ What's Stored in Database (MongoDB)

### ✅ All User Data:
- User accounts (name, email, password, role)
- User profiles
- Authentication sessions

### ✅ All Ticket Data:
- Ticket submissions
- Ticket status and priority
- Full conversation history
- Message threads between users and admins

### ✅ All System Data:
- Posts, comments, likes
- Exercise data
- Chat history
- User preferences

### ℹ️ Only JWT Token in LocalStorage:
- The authentication token (JWT) is stored in localStorage - this is **normal and secure** for web applications
- Everything else is in MongoDB

---

## 🎯 How Users Report Bugs

### Method 1: Via Support Center (Recommended)

1. **User logs in** to their account
2. **Navigate to Support**:
   - Click "**Support**" in the navigation bar
   - Or go directly to: `http://localhost:3000/support`

3. **Create a ticket**:
   - Click the blue "**New Ticket**" button
   - Fill in the form:
     - **Title**: Brief description (e.g., "Login button not working")
     - **Category**: Choose "Bug Report"
     - **Priority**: Select severity (Low/Medium/High/Critical)
     - **Description**: Detailed explanation of the bug
   
4. **Submit**: Click "Submit Ticket"

5. **Track progress**:
   - See all tickets on the support page
   - View status updates (Open → In Progress → Resolved)
   - See admin responses
   - Continue conversation with admins

### Method 2: Direct API Call

Users can also submit via API:
```javascript
POST /api/tickets
Headers: {
  "Authorization": "Bearer <user_jwt_token>",
  "Content-Type": "application/json"
}
Body: {
  "title": "Bug: Login not working",
  "description": "When I click login, nothing happens",
  "category": "bug",
  "priority": "high"
}
```

---

## 👨‍💼 Setting Up Admin Account

### Option 1: Using the Script (Easiest)

Run this command in your terminal:

```bash
node scripts/create-admin.js admin@example.com superadmin
```

The script will:
- Check if user exists
- If exists: Promote to superadmin
- If not: Create new account (will ask for name and password)

**Example:**
```bash
# Promote existing user
node scripts/create-admin.js john@example.com superadmin

# Or create new admin
node scripts/create-admin.js newadmin@example.com superadmin
```

### Option 2: Via MongoDB Directly

```bash
# Connect to MongoDB
mongosh

# Use your database
use synapseai

# Promote existing user to superadmin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "superadmin", verified: true } }
)

# Verify the change
db.users.findOne({ email: "your-email@example.com" })
```

### Option 3: Via API (After first superadmin exists)

```javascript
POST /api/admin/promote-user
Headers: {
  "Authorization": "Bearer <superadmin_jwt_token>",
  "Content-Type": "application/json"
}
Body: {
  "email": "user@example.com",
  "role": "superadmin"
}
```

---

## 🔐 User Roles Explained

### 👤 **Regular User** (role: "user")
- Submit tickets/bug reports
- View their own tickets
- Reply to admin responses
- Use all standard features

### 👨‍💼 **Admin** (role: "admin")
- Everything a user can do, PLUS:
- View all tickets from all users
- Reply to any ticket
- Update ticket status and priority
- View ticket statistics
- Access admin dashboard

### 🛡️ **SuperAdmin** (role: "superadmin")
- Everything an admin can do, PLUS:
- Delete tickets
- Promote users to admin
- Full system access
- Manage all users

---

## 🎫 Admin Workflow: Managing Bug Reports

### Step 1: Login as Admin
```
1. Go to: http://localhost:3000/login
2. Enter admin email and password
3. Login
```

### Step 2: Access Admin Dashboard
```
1. Go to: http://localhost:3000/admin
2. See statistics overview:
   - Total tickets
   - Open tickets
   - Critical issues
   - System status
```

### Step 3: Manage Tickets
```
1. Click "Ticket Management" or go to: /admin/tickets
2. See all user tickets with filters
3. Click on a ticket to view details
```

### Step 4: Respond to Bug Reports
```
1. Read the bug report
2. Update status: "Open" → "In Progress"
3. Type your response in the message box
4. Click "Send Reply"
5. User will see your response in their support center
```

### Step 5: Close Resolved Tickets
```
1. When bug is fixed, update status to "Resolved"
2. Add final message: "This has been fixed in version X.X"
3. Later, change to "Closed" to archive
```

---

## 📊 Data Flow (Everything in MongoDB)

### User Submits Bug:
```
User fills form → POST /api/tickets → Saves to MongoDB Tickets collection
```

### Admin Views Tickets:
```
Admin opens /admin/tickets → GET /api/tickets → Fetches from MongoDB
```

### Admin Replies:
```
Admin types message → PATCH /api/tickets/[id] → Updates MongoDB document
```

### User Sees Reply:
```
User visits /support → GET /api/tickets → Fetches from MongoDB with new message
```

### No localStorage except JWT:
- JWT token stored in localStorage (for authentication)
- All data persists in MongoDB
- No data lost on logout or browser close

---

## 🧪 Testing the Complete System

### Test 1: Create Admin Account
```bash
# Run in terminal
node scripts/create-admin.js admin@test.com superadmin

# Follow prompts to enter name and password
```

### Test 2: User Reports Bug
```
1. Login as regular user
2. Go to /support
3. Click "New Ticket"
4. Fill: Title: "Test Bug", Category: Bug, Priority: High
5. Description: "This is a test bug report"
6. Submit
7. Verify ticket appears in support center
```

### Test 3: Admin Responds
```
1. Logout regular user
2. Login as admin
3. Go to /admin/tickets
4. See the test ticket
5. Click on it
6. Type reply: "Thank you! We're investigating this."
7. Send reply
8. Update status to "In Progress"
```

### Test 4: Verify Database
```bash
# Connect to MongoDB
mongosh

# Check ticket was saved
use synapseai
db.tickets.find().pretty()

# You should see the ticket with messages
```

### Test 5: User Sees Response
```
1. Logout admin
2. Login as original user
3. Go to /support
4. See ticket status changed to "In Progress"
5. View ticket to see admin response
```

---

## 📁 Database Collections Used

### Users Collection:
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "superadmin", // or "admin" or "user"
  verified: true,
  createdAt: Date,
  lastLogin: Date
}
```

### Tickets Collection:
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: "Bug: Login not working",
  description: "When I click...",
  category: "bug",
  priority: "high",
  status: "in-progress",
  messages: [
    {
      sender: ObjectId (ref: User),
      senderRole: "user",
      message: "When I click...",
      timestamp: Date
    },
    {
      sender: ObjectId (ref: User),
      senderRole: "superadmin",
      message: "We're investigating...",
      timestamp: Date
    }
  ],
  assignedTo: ObjectId (ref: User) // optional
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Complete User Journey

### For Regular Users:

```
1. Register/Login → Stored in MongoDB
2. Use app features → All data in MongoDB
3. Find bug → Report at /support
4. Submit ticket → Saved to MongoDB Tickets
5. Track progress → Fetch from MongoDB
6. See admin reply → Read from MongoDB
7. Continue conversation → Updates MongoDB
8. Bug resolved → Ticket closed in MongoDB
```

### For Admins:

```
1. Login as admin → JWT with role in token
2. Go to /admin → Protected route checks role
3. View dashboard → Stats from MongoDB
4. Check tickets → Fetch all from MongoDB
5. Read bug report → From MongoDB
6. Reply to user → Update MongoDB
7. Update status → Save to MongoDB
8. Close ticket → Mark closed in MongoDB
```

---

## 🚀 Quick Start Commands

### Start MongoDB:
```bash
# Make sure MongoDB is running
mongod
```

### Start Development Server:
```bash
npm run dev
```

### Create First Admin:
```bash
node scripts/create-admin.js admin@example.com superadmin
```

### Access URLs:
- User Support: http://localhost:3000/support
- Admin Dashboard: http://localhost:3000/admin
- Ticket Management: http://localhost:3000/admin/tickets
- Login: http://localhost:3000/login

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Created at least one superadmin account
- [ ] Can login as superadmin
- [ ] Can access /admin dashboard
- [ ] Can access /admin/tickets
- [ ] Can submit ticket as regular user
- [ ] Ticket appears in MongoDB
- [ ] Admin can see ticket
- [ ] Admin can reply
- [ ] User sees admin reply
- [ ] Status updates work
- [ ] All data persists after logout

---

## 🎉 You're Ready!

Your system is fully connected to MongoDB and ready for production use. Users can report bugs easily, and admins have full control to manage and respond to all tickets.

### Need Help?
- Check [SUPER_ADMIN_GUIDE.md](SUPER_ADMIN_GUIDE.md) for technical details
- See [HOW_TO_USE.md](HOW_TO_USE.md) for detailed usage instructions
