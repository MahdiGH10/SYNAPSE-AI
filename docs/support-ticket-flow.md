# 📊 System Architecture Diagram

## 🎯 Bug Reporting Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  User    │      │  Login   │      │  Support │      │  Submit  │
│  Visits  │─────▶│  Page    │─────▶│  Center  │─────▶│  Ticket  │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
                        │                                    │
                        ▼                                    ▼
                  ┌──────────┐                        ┌──────────┐
                  │   JWT    │                        │   POST   │
                  │  Token   │                        │   /api   │
                  │  Stored  │                        │ /tickets │
                  └──────────┘                        └──────────┘
                        │                                    │
                        └────────────────┬───────────────────┘
                                         ▼
                                  ┌─────────────┐
                                  │   MongoDB   │
                                  │   Tickets   │
                                  │ Collection  │
                                  └─────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                        ADMIN JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Admin   │      │  Login   │      │  Admin   │      │  Ticket  │
│  Visits  │─────▶│  (with   │─────▶│Dashboard │─────▶│  Mgmt    │
└──────────┘      │   role)  │      └──────────┘      └──────────┘
                  └──────────┘            │                  │
                        │                 │                  │
                        ▼                 ▼                  ▼
                  ┌──────────┐      ┌──────────┐      ┌──────────┐
                  │   JWT    │      │   View   │      │   View   │
                  │  Token   │      │  Stats   │      │   All    │
                  │with role │      │   Data   │      │ Tickets  │
                  └──────────┘      └──────────┘      └──────────┘
                        │                 │                  │
                        └────────────┬────┴──────────────────┘
                                     ▼
                              ┌─────────────┐
                              │   MongoDB   │
                              │   Tickets   │
                              │ Collection  │
                              └─────────────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │   Reply &   │
                              │   Update    │
                              │   Status    │
                              └─────────────┘
```

---

## 🗄️ Database Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                          MongoDB Database                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Users Collection                                                    │
├─────────────────────────────────────────────────────────────────────┤
│  {                                                                   │
│    _id: ObjectId("..."),                                            │
│    name: "John Doe",                                                │
│    email: "john@example.com",                                       │
│    password: "hashed",                                              │
│    role: "user" | "admin" | "superadmin",  ◄── KEY FIELD           │
│    verified: true,                                                  │
│    createdAt: Date,                                                 │
│    lastLogin: Date                                                  │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ References
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Tickets Collection                                                  │
├─────────────────────────────────────────────────────────────────────┤
│  {                                                                   │
│    _id: ObjectId("..."),                                            │
│    userId: ObjectId("ref:User"),  ◄── WHO SUBMITTED                │
│    title: "Login broken",                                           │
│    description: "Details...",                                       │
│    category: "bug" | "feature" | "support" | "other",              │
│    priority: "low" | "medium" | "high" | "critical",               │
│    status: "open" | "in-progress" | "resolved" | "closed",         │
│    messages: [                                                       │
│      {                                                               │
│        sender: ObjectId("ref:User"),                                │
│        senderRole: "user" | "admin",                                │
│        message: "Text...",                                          │
│        timestamp: Date                                              │
│      }                                                               │
│    ],                                                                │
│    assignedTo: ObjectId("ref:User"),  ◄── OPTIONAL                 │
│    createdAt: Date,                                                 │
│    updatedAt: Date                                                  │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### User Creates Ticket

```
┌────────────┐
│  Browser   │
│  /support  │
└─────┬──────┘
      │ User fills form
      │
      ▼
┌─────────────────────┐
│  TicketForm.tsx     │
│  - Validates input  │
│  - Gets JWT token   │
└─────┬───────────────┘
      │ POST request with JWT
      │
      ▼
┌─────────────────────────────────────┐
│  /api/tickets/route.ts              │
│  1. Verify JWT token                │
│  2. Extract userId from token       │
│  3. Validate data                   │
└─────┬───────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  Ticket.create()                    │
│  - Save to MongoDB                  │
│  - Create initial message           │
│  - Return ticket object             │
└─────┬───────────────────────────────┘
      │
      ▼
┌─────────────────────┐
│  MongoDB            │
│  tickets collection │
│  ✅ Data saved      │
└─────────────────────┘
```

### Admin Replies to Ticket

```
┌────────────────┐
│  Browser       │
│  /admin/tickets│
└─────┬──────────┘
      │ Admin types reply
      │
      ▼
┌──────────────────────────────┐
│  AdminTicketManagement.tsx   │
│  - Gets JWT token            │
│  - Calls PATCH endpoint      │
└─────┬────────────────────────┘
      │ PATCH request with JWT
      │
      ▼
┌─────────────────────────────────────┐
│  /api/tickets/[id]/route.ts         │
│  1. Verify JWT token                │
│  2. Check user role (admin?)        │
│  3. Add message to ticket           │
└─────┬───────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  ticket.messages.push()             │
│  ticket.save()                      │
│  - Update in MongoDB                │
└─────┬───────────────────────────────┘
      │
      ▼
┌─────────────────────┐
│  MongoDB            │
│  tickets collection │
│  ✅ Reply saved     │
└─────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     Login Process                             │
└──────────────────────────────────────────────────────────────┘

User enters email + password
           ▼
    POST /api/auth/login
           │
           ├─── Find user in MongoDB
           │
           ├─── Verify password (bcrypt)
           │
           ├─── Generate JWT token with:
           │    • userId
           │    • email
           │    • name
           │    • role ◄── IMPORTANT
           │
           └─── Return token + user data
                      ▼
           ┌───────────────────────┐
           │  Browser receives:     │
           │  {                    │
           │    token: "jwt...",   │
           │    user: {            │
           │      id: "...",       │
           │      email: "...",    │
           │      role: "admin"    │
           │    }                  │
           │  }                    │
           └───────────────────────┘
                      ▼
           Store token in localStorage
           (This is the ONLY thing in localStorage)
                      ▼
           ┌───────────────────────┐
           │  Every API request:   │
           │  Authorization:       │
           │  Bearer <token>       │
           └───────────────────────┘
```

---

## 🛡️ Role-Based Access Control

```
┌────────────────────────────────────────────────────────────────┐
│                    Permission Matrix                            │
└────────────────────────────────────────────────────────────────┘

Action                    │ User │ Admin │ SuperAdmin
──────────────────────────┼──────┼───────┼────────────
Submit Ticket            │  ✅  │  ✅   │    ✅
View Own Tickets         │  ✅  │  ✅   │    ✅
Reply to Own Tickets     │  ✅  │  ✅   │    ✅
──────────────────────────┼──────┼───────┼────────────
View All Tickets         │  ❌  │  ✅   │    ✅
Reply to Any Ticket      │  ❌  │  ✅   │    ✅
Update Ticket Status     │  ❌  │  ✅   │    ✅
Update Ticket Priority   │  ❌  │  ✅   │    ✅
Delete Tickets           │  ❌  │  ❌   │    ✅
Access Admin Dashboard   │  ❌  │  ✅   │    ✅
Promote Users           │  ❌  │  ❌   │    ✅
──────────────────────────┴──────┴───────┴────────────
```

---

## 📦 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      Application                             │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   ┌─────────┐         ┌─────────┐        ┌─────────┐
   │  Navbar │         │  Pages  │        │   API   │
   └─────────┘         └─────────┘        └─────────┘
                            │                   │
        ┌───────────────────┼─────┐             │
        ▼                   ▼     ▼             │
   ┌─────────┐        ┌─────────┐ │             │
   │ /support│        │ /admin  │ │             │
   └─────────┘        └─────────┘ │             │
        │                   │     │             │
        │                   │     └─────────────┤
        │                   │                   │
        ▼                   ▼                   ▼
   ┌──────────────┐   ┌─────────────────┐  ┌──────────┐
   │ TicketForm   │   │  AdminTicket    │  │ /tickets │
   │   .tsx       │   │  Management     │  │   /api   │
   └──────────────┘   │     .tsx        │  └──────────┘
                      └─────────────────┘       │
                                                 │
        ┌────────────────────────────────────────┘
        │
        ▼
   ┌──────────────────┐
   │    MongoDB       │
   │  ┌────────────┐  │
   │  │   Users    │  │
   │  └────────────┘  │
   │  ┌────────────┐  │
   │  │  Tickets   │  │
   │  └────────────┘  │
   └──────────────────┘
```

---

## 🎯 Data Persistence

```
┌─────────────────────────────────────────────────────────────┐
│              What's Stored Where                             │
└─────────────────────────────────────────────────────────────┘

LOCAL STORAGE (Browser):
├── token (JWT)              ◄── Only this!
└── (Expires in 7 days)

DATABASE (MongoDB):
├── Users Collection
│   ├── User accounts
│   ├── User roles
│   └── User profiles
├── Tickets Collection
│   ├── Bug reports
│   ├── Support requests
│   ├── Messages
│   └── Status/Priority
├── Posts Collection
├── Comments Collection
├── Likes Collection
├── Exercises Collection
└── Chats Collection          ◄── Everything else!

Result:
✅ Data persists forever in MongoDB
✅ Survives browser close
✅ Survives logout
✅ Survives server restart
✅ Can be backed up
✅ Can be scaled
```

---

## 🚀 Quick Command Reference

```bash
# Start MongoDB
mongod

# Start Dev Server
npm run dev

# Create Admin
node scripts/create-admin.js admin@email.com superadmin

# Check Database
mongosh
use synapseai
db.users.find()
db.tickets.find()

# Verify Admin Created
db.users.findOne({ role: "superadmin" })
```

---

**All systems are connected to MongoDB and production-ready! 🎉**
