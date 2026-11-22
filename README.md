# FixMate — Verified Smart Device & Home Appliance Repair Platform

**FixMate** is a full-stack, role-based on-demand device and home appliance repair booking platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, **BetterAuth**, **Recharts**, and **Stripe**[cite: 1].

It solves two real-world problems: customers get transparent, step-by-step live repair tracking and only pay online after the job is completed, while verified technicians get a dedicated workspace to showcase their services and manage incoming repair jobs[cite: 1].

---

## 🌐 Live Links & Repositories

- **Live Client URL (Vercel):** `https://fixmate-client-sooty.vercel.app`
- **Live Server API URL (Render):** `https://fixmate-server-9suj.onrender.com`
- **Client GitHub Repository:** `https://github.com/mmgalam/fixmate-client`
- **Server GitHub Repository:** `https://github.com/mmgalam/fixmate-server`

---

## 🔐 Demo Credentials (For Testing)

| Role             | Email                  | Password      |
| :--------------- | :--------------------- | :------------ |
| **Admin**        | `admin@fixmate.com`    | `Admin123`    |
| **Technician 1** | `tech1@fixmate.com`    | `Tech123`     |
| **Technician 2** | `tech2@fixmate.com`    | `Tech123`     |
| **Customer**     | `customer@fixmate.com` | `Customer123` |

---

## 🎯 Purpose of the Application

- **For Customers:** Browse admin-approved repair services, search/filter/sort by category or service mode, submit repair requests with preferred dates, track live repair milestones, pay securely via Stripe after job completion, download printable PDF invoices, and rate technicians[cite: 1].
- **For Technicians:** Publish repair service listings with ImgBB image uploads, manage service availability and edits, and advance incoming customer repair requests step by step (`Requested → Accepted → In Progress → Completed`) while setting the final repair fee[cite: 1].
- **For Admins:** Moderate and approve/reject technician service listings, manage platform user roles (`Customer`, `Technician`, `Admin`), monitor all bookings, and track verified Stripe platform revenue[cite: 1].

---

## ✨ Key Features

- **Role-Based Authentication & Session Bridge:** Powered by **BetterAuth** with MongoDB adapter and custom role fields (`customer`, `technician`, `admin`), paired with a `/api/token` JWT bridge for secure Express API authorization[cite: 1].
- **Server-Side Search, Filter & Sort:** Real-time URL-synced search, category filters (`Smartphone`, `Laptop & PC`, `AC`, `Refrigerator`, `TV`, `Washing Machine`, `Electrical`), service mode filters (`Home Visit`, `Shop Drop-off`), and price/date sorting[cite: 1].
- **Role-Restricted Repair Request Flow:** Prevents logged-out users, technicians, and admins from requesting repairs, blocks duplicate active requests, and validates preferred dates and problem descriptions[cite: 1].
- **Dynamic Role-Based Dashboards:** Responsive collapsible sidebar dashboards for **Customer**, **Technician**, and **Admin** featuring interactive **Recharts** analytics, 3D stats cards, and a shared **Update Profile** page with ImgBB photo uploads[cite: 1].
- **Live Job Timeline Tracker:** Visual step-by-step repair progress tracker (`Requested → Accepted → In Progress → Completed → Paid`) with timestamps in **My Bookings**[cite: 1].
- **Pay-After-Service Stripe Integration & PDF Receipts:** Stripe Checkout opens only when a booking is `completed` and `unpaid`, followed by session verification (`/payment/success`), printable PDF receipts, and post-payment 1–5 star customer reviews[cite: 1].
- **Light & Dark Theme Support:** Smooth system-aware light/dark mode toggle across all public pages, dashboards, modals, and error boundaries[cite: 1].

---

## 🗺️ Application Routes

| Route                                 | Access     | Description                                                                                                                        |
| :------------------------------------ | :--------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                   | Public     | Hero banner, 6 latest approved services, How FixMate Works, Categories & Trust stats[cite: 1]                                      |
| `/services`                           | Public     | Server-side searchable, filterable, and sortable approved services marketplace[cite: 1]                                            |
| `/services/[id]`                      | Public     | Full service details, technician profile summary, customer reviews & Repair Request modal[cite: 1]                                 |
| `/about`                              | Public     | Platform workflow, safety guarantees, and stakeholder overview[cite: 1]                                                            |
| `/sign-in`, `/sign-up`                | Public     | Role-based registration (Customer/Technician) with password validation & login[cite: 1]                                            |
| `/dashboard/customer`                 | Customer   | Customer overview analytics, `My Bookings` (Timeline, Cancel, Pay Now, Rate), and `Payment History` (PDF Invoice)[cite: 1]         |
| `/dashboard/technician`               | Technician | Technician overview analytics, `Add a Service` (ImgBB), `My Services` (CRUD + availability toggle), and `Manage Requests`[cite: 1] |
| `/dashboard/admin`                    | Admin      | Admin overview analytics, `Manage Users` (role management), `Service Approval`, `All Bookings`, and `Transactions`[cite: 1]        |
| `/dashboard/profile`                  | All Roles  | Shared profile editor (Name, Phone, Area, Bio, ImgBB Avatar) with instant session sync[cite: 1]                                    |
| `/payment/success`, `/payment/cancel` | Customer   | Stripe Checkout verification & cancellation screens[cite: 1]                                                                       |

---

## 📦 NPM Packages Used

- **`next` & `react`** — Next.js App Router framework and React UI library[cite: 1]
- **`better-auth`** — Full-stack authentication with MongoDB adapter and additional role/profile fields[cite: 1]
- **`jose`** — Signs short-lived HS256 JWT tokens in `/api/token` for Express backend authorization
- **`mongodb`** — MongoDB client connection for BetterAuth session storage[cite: 1]
- **`lucide-react`** — Clean, consistent icon library across public pages and dashboards
- **`recharts`** — Responsive bar charts for Customer, Technician, and Admin overview analytics[cite: 1]
- **`sonner`** — Accessible toast notifications for auth, CRUD operations, status updates, and errors[cite: 1]
- **`next-themes`** — Seamless Light / Dark / System theme switching[cite: 1]
- **`tailwindcss` (v4)** — Utility-first styling with custom dark variants and responsive layouts

---

## 🚀 Local Setup & Running Locally

1. **Clone the repository and install dependencies:**
   ```bash
   git clone [https://github.com/mmgalam/fixmate-client.git](https://github.com/mmgalam/fixmate-client.git)
   cd fixmate-client
   npm install
   ```
