# Enrollio — Product Requirements Document
### Event & Internship Pipeline Platform | v1.2 | February 2026
**Teams:** Code Red, ThinkSync | **Topic 9** | **Status:** In Development

---

## Table of Contents
1. [Product Overview](#1-product-overview)
2. [Technology Stack](#2-technology-stack)
3. [Site Architecture](#3-site-architecture)
4. [Feature Requirements](#4-feature-requirements)
5. [Database Schema (SQL)](#5-database-schema-sql)
6. [API Endpoints](#6-api-endpoints)
7. [UI/UX Guidelines](#7-uiux-guidelines)
8. [The Enrollment Stepper](#8-the-enrollment-stepper-compulsory)
9. [Certificate Auto-Generation](#9-certificate-auto-generation)
10. [User Flows](#10-user-flows)
11. [Non-Functional Requirements](#11-non-functional-requirements)

---

## 1. Product Overview

### 1.1 What We're Building
Enrollio is a **mini Unstop** — a streamlined, end-to-end event and internship management platform with a significantly smoother experience. It eliminates the administrative burden of running programs by automating the full participant lifecycle: from discovery and enrollment, through selection, all the way to auto-generated certificates.

The platform has **two portals**:
- **Admin Portal** — Organizers create and manage events/internships, review applicants, and track completions
- **User Portal** — Applicants browse opportunities, enroll via a smooth multi-step form, track their status, and download certificates

### 1.2 The Problem
Organizers managing events and internships are buried in manual admin work:
- Tracking applications across spreadsheets
- Sending individual emails for status updates
- Generating certificates one by one
- No unified system — everything is disconnected

### 1.3 The Solution
One platform. Full pipeline. Zero manual grunt work. When a participant completes a program, their certificate is generated automatically. Organizers manage everything from a single dashboard.

### 1.4 Core Design Goals
- **Form fatigue elimination** via the mandatory Enrollment Stepper
- **Inspired by Unstop** but with cleaner, faster, more modern UX
- **Mobile-first** responsive design
- **3-click principle** — every critical action achievable in 3 clicks or fewer

---

## 2. Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14 (App Router)** | Full-stack React framework — handles routing, SSR, SSG, and API routes in one project |
| **Tailwind CSS** | Utility-first styling, fast and consistent |
| **React Hook Form** | Form state management for the Enrollment Stepper |
| **jsPDF / html2canvas** | Client-side certificate PDF generation |

> **Removed:** React Router (Next.js App Router handles all routing natively), shadcn/ui, Lucide React, Zod, Axios, TanStack Query

### Authentication
| Technology | Purpose |
|---|---|
| **Clerk** | Fully managed auth — sign up, sign in, sessions, user management, role-based access via `publicMetadata` |

Clerk replaces all manual auth logic. No JWT handling, no bcrypt, no session management needed. Clerk's `middleware.ts` protects routes, and `auth()` / `currentUser()` are used in Server Components and API Routes.

**Role setup with Clerk:**
- On registration, users are assigned `role: "user"` in Clerk `publicMetadata`
- Admin role (`role: "admin"`) is set manually via Clerk Dashboard or a secure API call
- Middleware checks `sessionClaims.metadata.role` to gate `/admin/*` routes

### Backend
| Technology | Purpose |
|---|---|
| **Next.js API Routes** (`/app/api/`) | Serverless API handlers — replaces Express entirely |
| **Prisma ORM** | Type-safe SQL database modeling and querying |
| **Multer / Next.js FormData** | File upload handling (resume, profile photo) |
| **Nodemailer** | Email notifications for status updates |
| **PDFKit** | Server-side certificate generation |

> **Removed:** Express.js, JWT, bcryptjs, CORS, Helmet — all handled by Next.js + Clerk natively

### Database
| Technology | Purpose |
|---|---|
| **MySQL / PostgreSQL** | Primary relational database |
| **Prisma Migrations** | Version-controlled, type-safe schema changes |

### DevOps / Tools
| Technology | Purpose |
|---|---|
| **dotenv / `.env.local`** | Environment variable management (Next.js native) |
| **Git + GitHub** | Version control |
| **Postman** | API testing |

---

## 3. Site Architecture

Based on the wireframe provided, the app is structured as follows:

```
Landing Page
├── → Admin Portal (login-gated)
│   ├── Create Event
│   │   ├── Event details form
│   │   ├── Custom enrollment fields builder
│   │   ├── Applicant list & status manager
│   │   └── Certificate trigger (mark complete)
│   └── Create Internship
│       ├── Internship details form
│       ├── Custom enrollment fields builder
│       ├── Applicant list & status manager
│       └── Certificate trigger
│
└── → User Portal (auth required)
    ├── Homepage
    │   ├── Events Page (browse + filter + search)
    │   │   └── Event Detail → [Enrollment Stepper]
    │   └── Internships Page (browse + filter + search)
    │       └── Internship Detail → [Enrollment Stepper]
    └── Dashboard
        ├── Profile (edit personal info, upload photo)
        └── My Activity
            ├── Applied programs + status tracker
            └── Certificates (download if eligible)
```

### Route Map (Next.js App Router)

Next.js uses file-based routing. All routes live inside `/app/`. Protected routes are handled by Clerk middleware.

```
/                              → Landing Page          (app/page.tsx)
/sign-in                       → Clerk Sign In         (app/sign-in/page.tsx)
/sign-up                       → Clerk Sign Up         (app/sign-up/page.tsx)

/admin                         → Admin Dashboard       (app/admin/page.tsx)
/admin/events/new              → Create Event          (app/admin/events/new/page.tsx)
/admin/events/[id]             → Manage Event          (app/admin/events/[id]/page.tsx)
/admin/internships/new         → Create Internship     (app/admin/internships/new/page.tsx)
/admin/internships/[id]        → Manage Internship     (app/admin/internships/[id]/page.tsx)

/home                          → User Homepage         (app/home/page.tsx)
/events                        → Events Listing        (app/events/page.tsx)
/events/[id]                   → Event Detail          (app/events/[id]/page.tsx)
/events/[id]/enroll            → Enrollment Stepper    (app/events/[id]/enroll/page.tsx)
/internships                   → Internships Listing   (app/internships/page.tsx)
/internships/[id]              → Internship Detail     (app/internships/[id]/page.tsx)
/internships/[id]/enroll       → Enrollment Stepper    (app/internships/[id]/enroll/page.tsx)

/dashboard                     → User Dashboard        (app/dashboard/page.tsx)
/dashboard/profile             → Profile Settings      (app/dashboard/profile/page.tsx)
/dashboard/activity            → My Activity           (app/dashboard/activity/page.tsx)

/verify/[certId]               → Certificate Verify    (app/verify/[certId]/page.tsx)

/api/programs                  → API Route             (app/api/programs/route.ts)
/api/programs/[id]             → API Route             (app/api/programs/[id]/route.ts)
/api/applications/[id]/status  → API Route             (app/api/applications/[id]/status/route.ts)
... (all API routes follow same pattern)
```

---

## 4. Feature Requirements

### 4.1 Landing Page
- Hero section with platform tagline and CTA buttons (Explore Events, Post a Program)
- Featured/trending events and internships carousel
- Stats bar (e.g., X programs listed, Y certificates issued)
- Login / Register links
- Clean nav with Enrollio branding

### 4.2 Authentication (via Clerk)
- Clerk handles all sign-up, sign-in, session management, and user profile out of the box
- `/sign-in` and `/sign-up` use Clerk's hosted or embedded components (`<SignIn />`, `<SignUp />`)
- Role-based access controlled via Clerk `publicMetadata.role` — values: `"user"` or `"admin"`
- `middleware.ts` at the root uses Clerk's `authMiddleware` to protect all routes under `/admin/*`, `/dashboard/*`, `/events/*/enroll`, and `/internships/*/enroll`
- Admin role is assigned via Clerk Dashboard or a one-time setup API call — not self-selected by users
- `auth()` used in Server Components; `useAuth()` / `useUser()` used in Client Components
- No "Change Password" in our app — handled natively by Clerk's user profile

### 4.3 Admin — Event Management
- Create event with: title, description, category, date/time, location (online/offline), max participants, banner image, deadline
- Custom field builder — add extra questions shown in the Enrollment Stepper (e.g., GitHub link, portfolio, essay question)
- View all applicants in a table: name, email, date applied, status
- Change applicant status: Pending → Accepted / Rejected
- Mark participants as "Completed" — triggers automatic certificate generation
- Dashboard stats: total applicants, accepted count, completion rate

### 4.4 Admin — Internship Management
- Same as Event Management but with additional fields: duration, stipend, role type (remote/onsite), required skills
- Batch status update (select multiple applicants, change status at once)

### 4.5 User — Homepage
- Personalized greeting with user's name
- Search bar with filters (category, date, type, location)
- Tabs: Events | Internships
- Cards showing: banner, title, organizer, deadline, spots remaining
- Pagination or infinite scroll

### 4.6 User — Events Page
- Full listing of all active events
- Filters: Category, Date Range, Mode (online/offline), Status (open/closed)
- Sort: Newest, Deadline Soonest, Most Popular
- Each card links to Event Detail page

### 4.7 User — Internships Page
- Full listing of all active internships
- Filters: Domain, Duration, Stipend Range, Mode
- Each card links to Internship Detail page

### 4.8 User — Dashboard: Profile
- Edit name, bio (stored in our DB)
- Upload profile photo and resume (PDF)
- Account details (email, profile picture) managed via Clerk's `<UserProfile />` component
- Password changes handled entirely by Clerk — no custom UI needed

### 4.9 User — Dashboard: My Activity
- Table of all applications with columns: Program, Type, Applied On, Status (badge)
- Status badges: Pending (yellow), Accepted (green), Rejected (red), Completed (blue)
- Download certificate button (enabled only if status = Completed)
- Click a row to view full application submitted

---

## 5. Database Schema (SQL)

### Table: `users`
> Auth is managed by Clerk. This table stores only app-specific user data, synced from Clerk via webhook on user creation.

| Field | Type | Null? | Description |
|---|---|---|---|
| id | INT PRIMARY KEY AUTO_INCREMENT | No | Internal DB user ID |
| clerk_id | VARCHAR(255) UNIQUE | No | Clerk's user ID (`user_xxx`) — foreign key to Clerk |
| name | VARCHAR(100) | No | Full name (synced from Clerk) |
| email | VARCHAR(150) UNIQUE | No | Email (synced from Clerk) |
| role | ENUM('user','admin') DEFAULT 'user' | No | Mirrors Clerk `publicMetadata.role` |
| profile_photo | VARCHAR(255) | Yes | File path or URL to photo |
| resume_url | VARCHAR(255) | Yes | File path to uploaded resume |
| bio | TEXT | Yes | Short bio |
| created_at | TIMESTAMP | No | Account creation time |

### Table: `programs`
> Unified table for both events and internships

| Field | Type | Null? | Description |
|---|---|---|---|
| id | INT PRIMARY KEY AUTO_INCREMENT | No | Unique program ID |
| admin_id | INT FOREIGN KEY → users.id | No | Creator |
| type | ENUM('event','internship') | No | Program type |
| title | VARCHAR(200) | No | Program title |
| description | TEXT | No | Full description |
| category | VARCHAR(100) | Yes | Domain/category tag |
| banner_url | VARCHAR(255) | Yes | Banner image path |
| location | VARCHAR(200) | Yes | Location or "Online" |
| mode | ENUM('online','offline','hybrid') | No | Delivery mode |
| max_participants | INT | Yes | Cap on enrollment |
| deadline | DATETIME | No | Application deadline |
| start_date | DATE | Yes | Program start |
| end_date | DATE | Yes | Program end |
| stipend | VARCHAR(100) | Yes | Internships only |
| duration | VARCHAR(100) | Yes | Internships only |
| required_skills | TEXT | Yes | Internships only |
| is_active | BOOLEAN DEFAULT true | No | Listing visibility |
| created_at | TIMESTAMP | No | Creation timestamp |

### Table: `custom_fields`
> Extra questions admins add to the enrollment form

| Field | Type | Null? | Description |
|---|---|---|---|
| id | INT PRIMARY KEY AUTO_INCREMENT | No | Field ID |
| program_id | INT FOREIGN KEY → programs.id | No | Associated program |
| label | VARCHAR(200) | No | Question text |
| field_type | ENUM('text','textarea','url','file','select') | No | Input type |
| options | TEXT | Yes | JSON array for select type |
| is_required | BOOLEAN DEFAULT true | No | Mandatory or optional |
| step_number | INT DEFAULT 3 | No | Which stepper step it appears on |
| order_index | INT DEFAULT 0 | No | Display order |

### Table: `applications`
| Field | Type | Null? | Description |
|---|---|---|---|
| id | INT PRIMARY KEY AUTO_INCREMENT | No | Application ID |
| user_id | INT FOREIGN KEY → users.id | No | Applicant |
| program_id | INT FOREIGN KEY → programs.id | No | Program applied to |
| status | ENUM('pending','accepted','rejected','completed') | No | Current status |
| applied_at | TIMESTAMP | No | Submission time |
| reviewed_at | TIMESTAMP | Yes | When admin acted |
| certificate_url | VARCHAR(255) | Yes | Generated cert path |
| certificate_issued_at | TIMESTAMP | Yes | When cert was made |

### Table: `application_responses`
> Stores answers to custom fields

| Field | Type | Null? | Description |
|---|---|---|---|
| id | INT PRIMARY KEY AUTO_INCREMENT | No | Response ID |
| application_id | INT FOREIGN KEY → applications.id | No | Parent application |
| custom_field_id | INT FOREIGN KEY → custom_fields.id | No | Question answered |
| response_value | TEXT | Yes | The answer |

### Table: `notifications`
| Field | Type | Null? | Description |
|---|---|---|---|
| id | INT PRIMARY KEY AUTO_INCREMENT | No | Notification ID |
| user_id | INT FOREIGN KEY → users.id | No | Recipient |
| message | TEXT | No | Notification body |
| is_read | BOOLEAN DEFAULT false | No | Read state |
| created_at | TIMESTAMP | No | Timestamp |

---

## 6. API Endpoints

All API routes live in `/app/api/` and follow Next.js App Router conventions using `route.ts` files. Authentication is verified server-side using Clerk's `auth()` helper. No separate Express server needed.

### Auth (Clerk-managed — no custom auth endpoints needed)
```
Clerk handles /sign-in, /sign-up, /sign-out natively.
We only need a webhook to sync new users into our DB:

POST   /api/webhooks/clerk        → Sync new Clerk user → insert into users table
```

### Programs (Admin)
```
POST   /api/programs              → Create event or internship
GET    /api/programs/[id]         → Get program details
PUT    /api/programs/[id]         → Update program
DELETE /api/programs/[id]         → Soft delete (is_active = false)
GET    /api/admin/programs        → Get all programs created by current admin
```

### Custom Fields (Admin)
```
POST   /api/programs/[id]/fields  → Add custom field to enrollment form
PUT    /api/fields/[id]           → Update field
DELETE /api/fields/[id]           → Remove field
```

### Applications (Admin)
```
GET    /api/programs/[id]/applications       → List all applicants for a program
PATCH  /api/applications/[id]/status        → Update applicant status
PATCH  /api/applications/[id]/complete      → Mark complete + trigger cert generation
```

### Browse (User)
```
GET    /api/programs              → List programs (query: type, category, mode, search)
GET    /api/programs/[id]         → Program detail + custom fields
```

### Enroll (User)
```
POST   /api/programs/[id]/apply   → Submit enrollment form with answers
GET    /api/dashboard/activity    → All current user's applications + statuses
GET    /api/applications/[id]/certificate   → Download certificate PDF
```

### User Profile
```
GET    /api/users/profile         → Get current user's DB profile
PUT    /api/users/profile         → Update bio, name
POST   /api/users/upload-resume   → Upload resume file (multipart/form-data)
```

---

## 7. UI/UX Guidelines

### Visual Style
Enrollio's color palette is directly inspired by **lu.ma** — minimal, sophisticated, and modern. Luma uses a dark gray foundation with soft blue accents, creating a clean and trustworthy event-platform aesthetic.

| Role | Name | Hex | Usage |
|---|---|---|---|
| **Base / Text** | Shark | `#333537` | Primary text, nav background, dark UI surfaces |
| **Primary Accent** | Shakespeare | `#53ADD2` | Buttons, links, active states, highlights |
| **Light Accent** | Anakiwa | `#A9C9FF` | Hover states, badges, soft highlights, stepper active |
| **Background** | Off-White | `#F9F9F9` | Page background |
| **Surface** | White | `#FFFFFF` | Cards, modals, form containers |
| **Border** | Light Gray | `#E5E7EB` | Dividers, input borders, card outlines |
| **Muted Text** | Cool Gray | `#6B7280` | Subtitles, placeholders, secondary labels |
| **Success** | Sage Green | `#4CAF7D` | Accepted status, completion states |
| **Warning** | Warm Amber | `#F4A942` | Pending status, deadline near |
| **Error** | Soft Red | `#E05C5C` | Rejected status, form errors |

**Design language notes:**
- Dark mode friendly — Shark `#333537` works as a surface color in dark contexts
- Avoid pure black (`#000000`) — use Shark for all "dark" needs
- Gradients: subtle `#A9C9FF → #53ADD2` allowed on hero sections and certificate banners
- All interactive elements use Shakespeare `#53ADD2` as the primary action color

**Typography & Components:**
- **Font:** Inter (same as Luma — clean, geometric, highly legible)
- **Radius:** `rounded-xl` for cards, `rounded-full` for badges and buttons
- **Shadows:** Subtle `shadow-sm` on cards (Luma keeps shadows very light), stronger `shadow-lg` on modals
- **Borders:** Prefer `border border-[#E5E7EB]` over heavy shadows for card separation
- All cards must show: banner image, title, organizer name, deadline badge, mode tag
- Status badges are colored pills — never plain text
- Empty states must have an illustration + CTA (never just "No results")
- Loading states use skeleton screens — never spinners alone
- All forms use inline validation (show error immediately on blur)

### Responsive Breakpoints
- Mobile: single column, bottom nav
- Tablet: 2-column grid for cards
- Desktop: 3-column grid for cards, sidebar layouts for dashboards

---

## 8. The Enrollment Stepper (Compulsory)

The Enrollment Stepper is the **core compulsory UI element**. It must be polished, animated, and intuitive. It breaks the application form into digestible steps so users never feel overwhelmed.

### Stepper Structure

```
Step 1: Personal Info  →  Step 2: Background  →  Step 3: Program Questions  →  Step 4: Review & Submit
```

### Step 1 — Personal Info
- Name (pre-filled from profile)
- Email (pre-filled, read-only)
- Phone number
- City / Location

### Step 2 — Background
- Education (degree, institution, year)
- Resume upload (or use saved resume toggle)
- LinkedIn URL
- Brief intro / motivation (150 words max)

### Step 3 — Program Questions
- Dynamically rendered from `custom_fields` for that program
- Field types: text input, textarea, URL, file upload, dropdown
- Required fields marked with asterisk

### Step 4 — Review & Submit
- Summary of all answers across all steps
- Edit button per section (jumps back to that step)
- Terms & conditions checkbox
- Submit button with loading state

### Stepper UX Rules
- Progress bar at top showing % completion
- Step indicators (numbered circles, active = filled, complete = checkmark)
- "Back" and "Next" buttons on every step
- Data persists if user navigates back (no data loss)
- Cannot jump ahead to incomplete steps
- On mobile, step labels collapse to just numbers
- Submit triggers a confirmation animation before redirecting to My Activity

---

## 9. Certificate Auto-Generation

When an admin marks an application as **Completed**, the backend automatically generates a certificate PDF.

### Certificate Content
- Platform branding (Enrollio logo, colors)
- Participant full name (large, centered)
- Text: *"This is to certify that [Name] has successfully completed [Program Title]"*
- Program type, organizer name
- Completion date
- Unique Certificate ID (format: `STPUP-YYYY-XXXXXXXX`)
- Admin signature placeholder
- QR code linking to a verification URL (`/verify/:cert_id`)

### Generation Flow
```
Admin clicks "Mark Completed"
  → PATCH /api/applications/:id/complete
  → Server generates PDF using PDFKit
  → PDF saved to /certificates/ folder
  → certificate_url and certificate_issued_at saved to DB
  → Email sent to user via Nodemailer with PDF attached
  → Notification created in notifications table
  → User sees "Download Certificate" button enabled in My Activity
```

### Certificate Verification
- Public route: `/verify/:cert_id`
- Shows: participant name, program, completion date, issuing organization
- No login required — shareable link for LinkedIn etc.

---

## 10. User Flows

### Flow 1: User Finds and Applies to an Event
```
Landing Page → Sign Up via Clerk → Homepage → Events Page
→ Filter by category → Click event card → Event Detail page
→ Click "Apply Now" → Enrollment Stepper (4 steps)
→ Submit → Success screen → Redirected to My Activity
→ Status: Pending
```

### Flow 2: Admin Creates an Event and Reviews Applications
```
Sign In via Clerk (admin role) → Admin Dashboard → "Create Event"
→ Fill event details → Add custom questions → Publish
→ View applicants as they come in
→ Change status: Pending → Accepted or Rejected
→ After program ends: Mark participants as Completed
→ Certificates auto-generated and emailed
```

### Flow 3: User Downloads Their Certificate
```
Login → Dashboard → My Activity
→ Find completed program → Status badge shows "Completed"
→ Click "Download Certificate" → PDF downloads
→ User can also copy verification link to share on LinkedIn
```

---

## 11. Non-Functional Requirements

### Performance
- Page load under 2 seconds on a standard connection
- API responses under 300ms for simple queries
- Certificate generation under 5 seconds

### Security
- **Authentication fully managed by Clerk** — no manual JWT, bcrypt, or session logic
- Role-based route protection via Clerk `middleware.ts` using `publicMetadata.role`
- SQL injection prevented via Prisma's parameterized queries
- File uploads validated (type + size limit: 5MB)
- Admin API routes verify `role === "admin"` via `auth()` on every request
- Clerk webhook endpoint verified using Svix signature headers

### Scalability (Post-Hackathon Considerations)
- Pagination on all list endpoints (default: 12 per page)
- Index on `applications(user_id)`, `applications(program_id)`, `programs(type)`, `programs(deadline)`
- Certificate generation can be moved to a background job queue (Bull/Redis) if load increases
- Next.js Server Components used wherever possible to reduce client bundle size

### Error Handling
- All API errors return consistent JSON: `{ success: false, message: "...", code: "..." }`
- Frontend shows toast notifications for success/error states
- 404 pages with navigation back to home
- Form errors shown inline, not as alerts

---

*Enrollio — Built for Hackathon Topic 9 | Code Red & ThinkSync | v1.2 — Stack: Next.js + Clerk + Prisma + MySQL*