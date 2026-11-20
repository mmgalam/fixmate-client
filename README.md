# FixMate — Smart Device & Home Appliance Repair Service Platform

FixMate is a full-stack, role-based on-demand repair booking platform connecting device owners with verified local technicians. Customers browse admin-approved repair listings, submit repair requests, track job progress through a strict live pipeline, and pay securely via Stripe Checkout only after the repair is completed.

## Live Links & Repositories
- **Live Frontend URL:** https://your-fixmate-client.vercel.app
- **Live Backend API URL:** https://your-fixmate-server.onrender.com
- **Client Repository:** https://github.com/your-username/fixmate-client
- **Server Repository:** https://github.com/your-username/fixmate-server

## Demo Credentials (Ready for Testing)
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@fixmate.com` | `Admin123` |
| **Technician 1** | `tech1@fixmate.com` | `Tech123` |
| **Technician 2** | `tech2@fixmate.com` | `Tech123` |
| **Customer** | `customer@fixmate.com` | `Customer123` |

## Key Features
- **Role-Based Access Control (Customer, Technician, Admin):** Powered by BetterAuth + MongoDB Adapter and custom Express JWT middlewares (`verifyToken`, `verifyCustomer`, `verifyTechnician`, `verifyAdmin`) returning `401` and `403` for unauthorized access.
- **Server-Side Search, Filter & Sort:** Real-time MongoDB querying by title/category, category filter, service mode (`Home Visit` / `Shop Drop-off`), and price/newest sorting synced with URL query parameters.
- **Technician Service Management & ImgBB Uploads:** Technicians publish and manage repair listings with direct ImgBB file uploads, availability toggles, and automatic re-approval moderation on edits.
- **Strict Job Status Pipeline:** Enforces `Requested → Accepted / Rejected → In Progress → Completed` transitions with final invoice confirmation upon job completion.
- **Pay-After-Service Stripe Integration (Test Mode):** Customers pay completed jobs via Stripe Checkout (`4242 4242 4242 4242`) with idempotent session verification and Stripe Webhook handling.

## Packages & Technologies Used
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, BetterAuth, Jose, Lucide React, Sonner, Recharts
- **Backend:** Node.js, Express.js, MongoDB Native Driver, JSON Web Token (`jsonwebtoken`), Stripe SDK, CORS, Dotenv
- **External APIs:** ImgBB Image Hosting API, Stripe Checkout & Webhooks