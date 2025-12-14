# Scripts

## create-admin.js

Create or promote users to admin or superadmin roles.

### Usage

```bash
node scripts/create-admin.js <email> [role]
```

### Parameters

- `email` (required): Email address of the user
- `role` (optional): Either `admin` or `superadmin` (default: `superadmin`)

### Examples

**Create new superadmin:**
```bash
node scripts/create-admin.js admin@example.com superadmin
```

**Promote existing user to admin:**
```bash
node scripts/create-admin.js user@example.com admin
```

**Promote existing user to superadmin:**
```bash
node scripts/create-admin.js user@example.com superadmin
```

### What it does

1. Connects to MongoDB
2. Checks if user with the email exists
3. If exists: Updates role and sets verified to true
4. If not exists: Prompts for name and password, creates new user
5. Displays success message with access URLs

### Requirements

- MongoDB must be running
- Node.js installed
- Dependencies installed (`npm install`)

### Environment Variables

The script uses `MONGODB_URI` from your environment, or defaults to:
```
mongodb://localhost:27017/synapseai
```

To use a different database, set the environment variable:
```bash
MONGODB_URI="mongodb://your-connection-string" node scripts/create-admin.js admin@example.com
```

### Output

Success output will show:
```
✅ Connected to MongoDB
✅ SUCCESS! User promoted to superadmin
📧 Email: admin@example.com
👤 Name: Admin User
🎭 Role: superadmin

✨ You can now login at /login with these credentials

🚀 Admin Features Available:
   • View Dashboard: /admin
   • Manage Tickets: /admin/tickets
   • View as User: /support

✅ Disconnected from MongoDB
```

### Troubleshooting

**Error: Cannot connect to MongoDB**
- Ensure MongoDB is running: `mongod`
- Check your connection string

**Error: Email is required**
- You must provide an email as the first argument

**Error: Password must be at least 8 characters**
- When creating new users, password must be 8+ characters

**Error: Role must be "admin" or "superadmin"**
- Only these two roles can be set via this script
- Regular users are created through registration
