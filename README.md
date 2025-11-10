# Blood Donation Platform

A comprehensive blood donation management system connecting donors with recipients through an admin-approved workflow.

## Features

### For Recipients
- Create blood requests with urgency levels
- View approved donation offers from donors
- Track request status (pending/approved/rejected)
- Direct contact with donors
- Protected from editing approved requests

### For Donors
- View approved blood requests needing help
- Create donation offers
- Browse recipients' requests by urgency
- Manage donation offers with status tracking
- Direct contact with recipients

### For Admins
- Review and approve/reject blood requests
- Review and approve/reject donation offers
- Manage users (view all donors and recipients)
- System configuration and settings
- Comprehensive dashboard with statistics

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT + bcrypt
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Form Handling:** React Hook Form
- **State Management:** Zustand

## Quick Start

### 1. Clone and Install
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` in the project root:

```env
SUPABASE_PROJECT_URL=your-supabase-project-url
SUPABASE_API_KEY=your-supabase-api-key
JWT_SECRET=your-jwt-secret
```

### 3. Database Setup
Follow the instructions in `DATABASE_SETUP.md` to:
- Create required tables in Supabase
- Configure Row Level Security
- Create your first admin user

### 4. Seed Test Data
```bash
# Populate database with test users and requests
npm run seed
```

This creates:
- 5 donor accounts (donor1@example.com - donor5@example.com)
- 5 recipient accounts (recipient1@example.com - recipient5@example.com)
- Multiple blood requests with varying statuses
- Password for all: `password123`

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Database Management
```bash
npm run seed         # Add test data to database
npm run cleanup      # Remove all data except admins
npm run reset        # Cleanup + Seed (fresh start)
```

**Important:** The `cleanup` script preserves admin users while removing all test data.

## Test Accounts

After running `npm run seed`:

### Donors
- donor1@example.com to donor5@example.com

### Recipients
- recipient1@example.com to recipient5@example.com

**Password for all test accounts:** `password123`

## Workflow Overview

### 1. Recipient → Admin → Donor
1. **Recipient** creates a blood request
2. **Admin** reviews and approves/rejects
3. **Approved requests** appear on donor dashboard
4. **Donor** contacts recipient directly

### 2. Donor → Admin → Recipient
1. **Donor** creates a donation offer
2. **Admin** reviews and approves/rejects
3. **Approved donations** appear on recipient dashboard
4. **Recipient** contacts donor directly

Full workflow details: See `WORKFLOW_DOCUMENTATION.md`

## Documentation

- **[Workflow Documentation](WORKFLOW_DOCUMENTATION.md)** - Complete workflow and features
- **[Database Setup](DATABASE_SETUP.md)** - Database schema and setup guide
- **[Admin Features](ADMIN_FEATURES.md)** - Admin dashboard capabilities
- **[Scripts Guide](scripts/README.md)** - Database management scripts

## Development Tips

### Reset Database
When you need fresh test data:
```bash
npm run reset
```

This removes all data (except admins) and creates new test data.

## Support

For issues or questions, check the documentation files in the project root.
