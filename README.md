# ANTHURIUM — E-Commerce Architecture & Multi-App Monorepo

Welcome to the **ANTHURIUM** luxury Indian women's fashion boutique monorepo.
The system is cleanly separated into three independent applications plus a shared types package:

```
/anthurium
│
├── /storefront   → Customer-facing Next.js 15 Application (Port 3000)
├── /admin        → Independent Admin SaaS Control Center Next.js 15 (Port 3001)
├── /backend      → Express + TypeScript REST API Engine (Port 5000)
├── /shared       → Shared TypeScript Interfaces & Constants
├── package.json  → Unified Monorepo Orchestration
└── README.md     → Architecture, Security & Subdomain Deployment Guide
```

---

## 1. Monorepo Overview

| Application | Technology | Dev Port | Production Domain | Purpose |
|---|---|---|---|---|
| **Storefront** | Next.js 15, React 19, Tailwind CSS | `3000` | `https://anthurium.in` | Customer boutique browsing, collections, product discovery, cart, wishlist, Razorpay checkout, and WhatsApp CTAs. **Contains zero admin routes.** |
| **Admin** | Next.js 15, React 19, Tailwind CSS | `3001` | `https://admin.anthurium.in` | Professional dark slate SaaS management portal for products, orders, customers, inventory, hero slides, Instagram reels, lookbook hotspots, banners, reviews, coupons & store settings. |
| **Backend** | Node.js, Express, TypeScript, Mongoose | `5000` | `https://api.anthurium.in` | REST API gateway, JWT authentication, role authorization, Razorpay verification, MongoDB Atlas persistence. |
| **Shared** | TypeScript | — | Internal | Shared interfaces (`Product`, `Order`, `User`, `HeroSection`, `Story`, `Lookbook`, `Banner`, etc.). |

---

## 2. Quick Start & Running Locally

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- MongoDB Atlas or local MongoDB instance

### One-Command Launch (All 3 Services Concurrently)
From the root `/anthurium` directory:

```bash
# Starts Backend (5000), Storefront (3000), and Admin (3001) concurrently
npm run dev
```

### Running Individual Services

```bash
# 1. Run Express Backend API (Port 5000)
npm run dev:backend

# 2. Run Customer Storefront (Port 3000)
npm run dev:storefront

# 3. Run Admin Dashboard (Port 3001)
npm run dev:admin
```

### Building for Production

```bash
# Build all three applications
npm run build

# Or individually:
npm run build:backend
npm run build:storefront
npm run build:admin
```

---

## 3. Environment Variables Configuration

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.qqwny.mongodb.net/anthurium?retryWrites=true&w=majority
JWT_SECRET=anthurium_super_secret_jwt_key_2026_boutique

# CORS & Domain Whitelist
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
STOREFRONT_URL=http://localhost:3000

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret

# Optional Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=placeholder
CLOUDINARY_API_KEY=placeholder
CLOUDINARY_API_SECRET=placeholder
```

### Storefront (`storefront/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

### Admin (`admin/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 4. Admin Authentication & Security Architecture

### Role-Based Access Control (RBAC)
- The user model enforces two discrete roles: `'customer'` and `'admin'`.
- Authentication uses secure **HTTP-only cookies** and/or Bearer JWT tokens.
- **Strict Server-Side Authorization**: The Express API enforces `protect` and `adminOnly` middleware on all administrative endpoints (`/api/admin/*`).
  - If an unauthenticated user calls an admin endpoint: **`401 Unauthorized`**.
  - If a customer role attempts to access an admin endpoint: **`403 Forbidden`** (`Access denied: Admin role required`).
  - If a customer attempts to log in via `/api/auth/admin-login`: **`403 Forbidden`** (`Forbidden: Access denied. Administrator privileges required.`).
- **Storefront Isolation**: The customer storefront contains zero admin routes or admin pages. Visiting `http://localhost:3000/admin` returns **`404 Not Found`**.
- **Admin App Route Protection**: Unauthenticated visits to `http://localhost:3001` or `http://localhost:3001/dashboard` are automatically redirected to `http://localhost:3001/login`.

### Development Admin Credentials
- **Email:** `admin@anthurium.com`
- **Password:** `adminpassword123`
*(Seeded in database; not hardcoded in frontend code).*

---

## 5. Domain & Subdomain Configuration (Single Domain)

The production setup runs under **one single apex domain** (`anthurium.in`) using subdomains:

```
https://anthurium.in         → Customer Storefront (Vercel / Cloudflare Pages)
https://www.anthurium.in     → Customer Storefront CNAME redirect
https://admin.anthurium.in   → Admin Dashboard (Vercel / Cloudflare Pages)
https://api.anthurium.in     → Backend API (Render / Railway / VPS / AWS EC2)
```

### DNS Record Setup Table
In your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap):

| Type | Host / Name | Value / Target | Description |
|---|---|---|---|
| **A** or **CNAME** | `@` (apex) | `cname.vercel-dns.com` (or your host IP) | Customer Storefront |
| **CNAME** | `www` | `cname.vercel-dns.com` | Redirect to apex storefront |
| **CNAME** | `admin` | `cname.vercel-dns.com` | Independent Admin Dashboard |
| **A** or **CNAME** | `api` | `your-backend-cluster.onrender.com` | Express REST API Gateway |

### Production CORS
The Express backend allows ONLY these origins with `credentials: true`:
- `https://anthurium.in`
- `https://www.anthurium.in`
- `https://admin.anthurium.in`
- `http://localhost:3000` (development)
- `http://localhost:3001` (development)

Any request with an unknown origin is rejected at the CORS middleware layer.

---

## 6. Admin Dashboard Modules

1. **Dashboard Overview (`/dashboard`):** Real-time metrics (Revenue, Total Orders, Registered Shoppers, Products, Low Stock alerts), 7-day sales trends, and recent order feeds.
2. **Product Catalog (`/products`):** Full SKU management, status switches (Active / Draft), price, sale price, fabric specifications, variants, and image galleries.
3. **Categories (`/categories`):** Create, update, reorder, and feature product categories (Sarees, Kurtis, Sets, Festive, etc.).
4. **Collections (`/collections`):** Manage curated collections (New Arrivals, Festive Edit, Wedding Stories).
5. **Orders & Logistics (`/orders`):** Order status workflow (Pending → Confirmed → Processing → Shipped → Delivered / Cancelled / Refunded), courier partner assignment, tracking numbers.
6. **Customers Directory (`/customers`):** Shopper spending history, order counts, and contact records.
7. **Inventory Sheet (`/inventory`):** Real-time stock levels, out-of-stock highlights, low-stock alerts (≤ 5), and inline instant quantity editing.
8. **Hero Section CMS (`/website/hero`):** Manage multiple slides, desktop and mobile responsive image URLs, headline styling, CTAs, display order, and ambient boutique audio tracks.
9. **Stories / Instagram CMS (`/website/stories`):** Manage video reels, image stories, Instagram post links, and tagged product associations.
10. **Lookbook CMS (`/website/lookbook`):** Editorial spreads with interactive product hotspots ("Shop This Look").
11. **Banners CMS (`/website/banners`):** Promotional strips and homepage dividers.
12. **Reviews Moderation (`/reviews`):** Approve, reject, feature, or delete customer ratings and comments.
13. **Coupons Engine (`/coupons`):** Percentage and fixed discount promo codes, minimum cart values, and expiration dates.
14. **Brand Settings (`/settings`):** Configurable brand name, tagline, WhatsApp number, email, address, and free shipping thresholds without rewriting code.

---

## 7. Reusable Boutique Architecture

All boutique-specific content (brand name, WhatsApp number, address, announcement bar, hero slides, collections, products) is driven dynamically by the database and admin CMS rather than hardcoded into frontend components. This allows the template to be rebranded and deployed for multiple boutique clients (`client1.com`, `admin.client1.com`, etc.) simply by updating environment variables and database records.

---

## 8. Verification & Test Suite Results

### TypeScript Type-Checking
- `backend`: `npx tsc --noEmit` → **0 errors**
- `storefront`: `npx tsc --noEmit` → **0 errors**
- `admin`: `npx tsc --noEmit` → **0 errors**

### Security & Authorization Assertions
- `GET http://localhost:3000/admin` → **404 Not Found** (Admin UI isolated from storefront)
- Unauthenticated `GET /api/admin/analytics` → **401 Unauthorized**
- Customer token calling `/api/admin/*` → **403 Forbidden**
- Customer account attempting `/api/auth/admin-login` → **403 Forbidden**
- Admin account logging into `/api/auth/admin-login` → **200 OK**
- Admin token accessing `/api/admin/analytics` → **200 OK** (Returns revenue & order metrics)
- Admin token accessing `/api/admin/products` → **200 OK** (Returns product catalog)
- Unknown CORS Origin (`https://unauthorized-attacker.com`) → **Blocked by CORS policy**
