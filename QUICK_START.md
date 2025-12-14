# 🎯 Quick Reference: How Everything Works

## 📍 User Reports a Bug

### Simple 3-Step Process:

1. **Go to Support**
   ```
   URL: http://localhost:3000/support
   ```

2. **Click "New Ticket"**
   - Big blue button in top right

3. **Fill the Form**
   - Title: "What's wrong?"
   - Category: Bug Report
   - Priority: How urgent?
   - Description: Explain in detail
   - Click "Submit"

### What Happens Behind the Scenes:
```
User clicks Submit
    ↓
POST /api/tickets
    ↓
Saved to MongoDB.tickets collection
    ↓
Admin sees it immediately at /admin/tickets
```

---

## 👨‍💼 Admin Account Setup

### ⚡ Fastest Way:

**Run this ONE command:**
```bash
node scripts/create-admin.js your-email@example.com superadmin
```

**Then login at:** http://localhost:3000/login

### What This Does:
- ✅ Creates or promotes user to superadmin
- ✅ Saves role in MongoDB
- ✅ Sets verified: true
- ✅ Ready to access /admin immediately

---

## 🗄️ What's in MongoDB (Not LocalStorage)

### ✅ In Database:
- User accounts & roles
- All tickets & conversations
- Ticket status & priority
- Posts, comments, likes
- Exercise data
- Chat history
- Everything persists forever

### 📱 In LocalStorage (Normal):
- Only JWT token (for staying logged in)
- This is standard security practice
- Token expires after 7 days

---

## 🔄 Complete Flow Example

### Scenario: User finds a bug

```
DAY 1 - User Side:
1. User: Clicks "Login button doesn't work"
2. Goes to /support
3. Clicks "New Ticket"
4. Types: "Login button not responding on mobile"
5. Selects: Bug Report, High Priority
6. Clicks Submit
   → Saved to MongoDB ✅

DAY 1 - Admin Side:
1. Admin login at /login
2. Goes to /admin/tickets
3. Sees new ticket (red badge)
4. Clicks on it
5. Reads: "Login button not responding..."
6. Types: "Thanks! Can you tell me which phone?"
7. Changes status: "In Progress"
8. Clicks "Send Reply"
   → Saved to MongoDB ✅

DAY 2 - User Side:
1. User logs in
2. Goes to /support
3. Sees ticket now says "In Progress" 🟡
4. Clicks to read admin reply
5. Replies: "iPhone 13, iOS 16"
6. Sends message
   → Saved to MongoDB ✅

DAY 2 - Admin Side:
1. Admin sees new reply (unread badge)
2. Reads iPhone info
3. Developer fixes the bug
4. Admin replies: "Fixed! Please try now"
5. Changes status: "Resolved" ✅
   → Saved to MongoDB ✅

DAY 3 - User Side:
1. User tests - it works!
2. Admin marks ticket "Closed"
3. Ticket archived but saved in DB forever
```

---

## 🎫 Data Storage Breakdown

### Tickets Table in MongoDB:
```javascript
{
  _id: "abc123",
  userId: "user456",           // Who submitted
  title: "Login broken",       // What's wrong
  category: "bug",            // Type
  priority: "high",           // How urgent
  status: "in-progress",      // Current state
  messages: [                 // Conversation
    {
      sender: "user456",
      message: "Login doesn't work",
      timestamp: "2025-12-14 10:00"
    },
    {
      sender: "admin789",
      message: "We're on it!",
      timestamp: "2025-12-14 11:00"
    }
  ],
  createdAt: "2025-12-14 10:00",
  updatedAt: "2025-12-14 11:00"
}
```

**This is ALL in MongoDB, not browser storage!**

---

## 🛡️ Admin Account Privileges

### What SuperAdmins Can Do:

**Ticket Management:**
- ✅ View ALL tickets from ALL users
- ✅ Reply to any ticket
- ✅ Change status (Open → In Progress → Resolved → Closed)
- ✅ Change priority (Low → High → Critical)
- ✅ Delete tickets
- ✅ See full conversation history

**User Management:**
- ✅ View all registered users
- ✅ Promote users to admin
- ✅ See user activity

**Analytics:**
- ✅ View ticket statistics
- ✅ See critical issues count
- ✅ Monitor system health

**System Access:**
- ✅ Full admin dashboard
- ✅ All features unlocked

---

## 🚀 Getting Started NOW

### 1. Create Your Admin (30 seconds)
```bash
node scripts/create-admin.js admin@myemail.com superadmin
```
Enter name and password when prompted.

### 2. Login as Admin
```
http://localhost:3000/login
```

### 3. Access Dashboard
```
http://localhost:3000/admin
```

### 4. Test with Dummy Ticket
```
Open another browser/incognito
Login as regular user
Go to /support
Create test ticket
```

### 5. Respond as Admin
```
Back to admin browser
Go to /admin/tickets
See your test ticket
Click it and reply
```

**Done! System is working! 🎉**

---

## 📊 Verify It's All in Database

### Check MongoDB:
```bash
# Open MongoDB shell
mongosh

# Switch to your database
use synapseai

# See all tickets
db.tickets.find().pretty()

# See all users
db.users.find({}, {name:1, email:1, role:1}).pretty()

# Count tickets by status
db.tickets.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

You'll see everything is stored permanently in MongoDB! 

---

## 🎯 Key URLs

| Purpose | URL | Who Can Access |
|---------|-----|----------------|
| Submit Bug | /support | Any logged-in user |
| Admin Dashboard | /admin | Admin & SuperAdmin |
| Manage Tickets | /admin/tickets | Admin & SuperAdmin |
| Login | /login | Everyone |
| Register | /register | Everyone |

---

## ✅ Everything is Connected to Database

**No Data Loss:**
- Close browser → Data stays in MongoDB
- Logout → Data stays in MongoDB  
- Clear cache → Data stays in MongoDB
- Server restart → Data stays in MongoDB
- Browser crash → Data stays in MongoDB

**Only JWT token is temporary:**
- Expires after 7 days
- Can be refreshed by logging in again
- This is normal and secure

---

**🎉 Your system is production-ready with full database persistence!**
