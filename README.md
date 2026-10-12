# ⚡ CHEAP CHIP — Sustainable E-Waste Marketplace, Chip Diagnostics & Multi-Role Logistics Platform

> **Live Production URL:** [https://cheap-chip.vercel.app/home](https://cheap-chip.vercel.app/home)  
> **Frontend & Full-Stack Core:** Next.js 16 (App Router) · React 19 · MongoDB · NextAuth v5 · Stripe · Groq AI (LLaMA 3.3 70B) · MapLibre GL · Tailwind CSS v4

---

## 📌 Executive Summary (What Recruiters See at First Glance)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CHEAP CHIP ECOSYSTEM                                   │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ 🛒 HARDWARE MARKETPLACE  │ 🔧 REAL-TIME REPAIR ENGINE  │ 🤖 GROQ LLAMA 3.3 AI CHATBOT  │
│ Buy & sell verified CPU, │ Algorithmic repair quotes   │ Sub-second AI diagnostic &    │
│ GPU, RAM, SSD, and board │ based on pin damage, thermal│ tracking assistance in English│
│ chips with price bounds. │ faults & usage multipliers. │ & Bengali via Groq Cloud API. │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ 🗺️ MAPLIBRE COURIER MAPS │ 💳 STRIPE PAYOUTS & PAYROLL │ 👥 4-TIER RBAC DASHBOARDS     │
│ Geospatial delivery route│ End-to-end card checkout &  │ Custom portals for Customers, │
│ rendering with GPS coords│ automated technician salary │ Technicians, Delivery Fleet,  │
│ via MapTiler engine.     │ distribution via Elements.  │ and Platform Administrators.  │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

**Cheap Chip** is a production-grade circular economy platform that tackles the global electronic waste (e-waste) crisis by combining an on-demand hardware diagnostic engine, a verified refurbished silicon marketplace, and a multi-tenant logistics network. 

Instead of treating electronics as disposable, Cheap Chip enables users to sell used processors, get dynamic repair estimates for damaged chips (e.g. bent pins, core failures, thermal throttling), track physical couriers on an interactive map, and chat with an ultra-fast LLaMA 3.3 AI assistant.

---

## 🌟 The 5 Core Pillars of Cheap Chip

### 1. 🔧 Automated Hardware Diagnostic & Repair Estimation Engine
* **The Problem:** When a processor or motherboard fails, customers have zero transparency into whether it can be fixed, how much it will cost, or how long it will take.
* **The Solution:** A multi-step interactive repair wizard where users specify their silicon model (Intel Core, AMD Ryzen, Server Xeon, ARM), physical condition, age, and observed failure modes:
  * Bent/broken pins (📌)
  * Thermal throttling & contact damage (🔥)
  * Voltage instability & microcode corruption (⚡)
  * Dead core / cache memory faults (💾)
* **The Algorithm:** A dynamic pricing model calculates labor time and material cost by applying condition damage multipliers (e.g., +70% for severe damage) and historical age factors (+15% to +50% for legacy chips). It produces an instant quote, completion deadline, and a unique 6-digit tracking code (`ORD-XXXXXX`).

### 2. 🤖 AI Hardware Copilot via Groq LLaMA 3.3 70B (`OrderChatbot`)
* **Real-Time Inference:** Integrated with the **Groq SDK** running `llama-3.3-70b-versatile` with streaming sub-second inference speeds.
* **Bilingual Support:** Understands customer hardware questions, order tracking inquiries, repair FAQs, and return policies in both English and Bengali.
* **Resilient Fallback:** Includes heuristic pattern-matching fallbacks so users never face an unresponsive chatbot if the remote API encounters network latency.

### 3. 🗺️ Live Logistics & Geospatial Delivery Tracking (`MapLibre GL`)
* **Vector Map Rendering:** Built with `maplibre-gl` and MapTiler Streets v2, rendering interactive GPU-accelerated vector maps directly in the browser.
* **Deliveryman Portal:** Couriers receive assigned pick-up and delivery tasks with exact customer geographic coordinates (`lat`, `lng`), pin markers, and live navigation zoom.
* **Real-Time Order Polling:** Customers can toggle "Live Tracking" on `/dashboard/user/track-product`, triggering automatic 5-second polling to watch orders transition from *Picked Up* to *In Transit* to *Delivered*.

### 4. 💳 Secure Stripe Financial Architecture & Automated Payroll
* **Customer Checkout:** Integrated with `@stripe/stripe-js` and `@stripe/react-stripe-js` using custom `CardElement` components for tamper-proof card transactions.
* **Admin Payout Portal (`dashboard/admin/pay-salary`):** Administrators can view payable balances for couriers and service technicians, verify completed repair work orders, and trigger automated salary disbursements via Stripe client secrets.

### 5. 👥 4-Role Role-Based Access Control (RBAC) System
Powered by **NextAuth v5 Beta** with session verification and custom database role matchers:

| User Role | Dedicated Portal | Core Capabilities |
|---|---|---|
| **Customer** | `/dashboard/user` | Create hardware sell posts, request CPU repairs, track orders in real time, review order history, recover lost tracking IDs. |
| **Technician** | `/dashboard/technician` | Browse incoming hardware tickets, accept assigned repairs, inspect physical components, log repair milestones, submit diagnostic reports. |
| **Delivery Courier** | `/dashboard/delivery` | View available pickups across the city, accept delivery jobs, inspect recipient drop-off locations on MapLibre maps, toggle package status. |
| **Platform Admin** | `/dashboard/admin` | Full operational control: review technician/courier job applications, manage employee roster, disburse salaries via Stripe, audit platform sales via Recharts. |

---

## 🛠️ Complete Technical Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       NEXT.JS 16 FULL-STACK ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  FRONTEND PRESENTATION TIER                                                 │
│  • React 19 (Server Components + Client Interactivity)                      │
│  • Tailwind CSS v4 + shadcn/ui + Radix UI + Lucide Icons                    │
│  • TanStack React Query v5 (Optimistic Updates & Server Caching)            │
│  • Recharts (Admin Business Analytics & Volume Visualizations)              │
├─────────────────────────────────────────────────────────────────────────────┤
│  EDGE SERVICES & THIRD-PARTY INTEGRATIONS                                  │
│  • Groq Cloud API (LLaMA 3.3 70B AI Customer Support Engine)                │
│  • Stripe Payment Gateway (Card Payments & Technician Payroll)              │
│  • MapLibre GL + MapTiler Engine (Interactive Vector Route Maps)            │
│  • NextAuth v5 Beta (Multi-Provider Authentication & Session Tokens)        │
├─────────────────────────────────────────────────────────────────────────────┤
│  DATA & PERSISTENCE TIER                                                    │
│  • MongoDB v7 Native Driver with SRV DNS Failover & Connection Pooling      │
│  • Collections: products, orders, repair-requests, technician-info,         │
│                 deliveryman-info, applications, users                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Comprehensive Tech Stack Breakdown

* **Core Framework:** Next.js 16 (App Router with route groups, server actions, and route handlers)
* **UI Library:** React 19.2
* **Styling & Design System:** Tailwind CSS v4, shadcn/ui, Radix UI primitives, `class-variance-authority`, `tailwind-merge`
* **Data Fetching & Cache:** TanStack React Query v5 with React Query DevTools
* **Forms & Validation:** React Hook Form with controlled inputs and schema error handling
* **AI & Machine Learning:** Groq SDK (`groq-sdk`, `llama-3.3-70b-versatile`)
* **Payments & Billing:** Stripe (`@stripe/stripe-js`, `@stripe/react-stripe-js`)
* **Geospatial & Mapping:** MapLibre GL (`maplibre-gl`), MapTiler API
* **Database:** MongoDB v7 Native Driver with enterprise TLS and DNS resolver fallbacks
* **Authentication:** NextAuth.js v5 Beta
* **Data Visualization:** Recharts, React CountUp
* **Notifications & Feedback:** Sonner (Toast notifications), Lottie React

---

## 💬 Ready-to-Use Portfolio / Resume Bullet Points

If you want to feature **Cheap Chip** on your resume or portfolio website, here are recruiter-tailored descriptions:

* **Headline:** Full-Stack E-Waste Marketplace & Microelectronics Diagnostic Platform
* **Resume Bullet 1:** *Architected and deployed an end-to-end circular economy hardware platform using Next.js 16, React 19, and MongoDB, enabling users to buy, sell, and repair refurbished silicon components.*
* **Resume Bullet 2:** *Engineered a multi-step algorithmic repair estimation engine that calculates component recovery timelines and repair pricing based on physical defect severity, usage duration, and silicon architecture.*
* **Resume Bullet 3:** *Integrated Groq SDK (LLaMA 3.3 70B) to deliver a sub-second bilingual AI support chatbot for order tracking, hardware troubleshooting, and repair status inquiries.*
* **Resume Bullet 4:** *Built interactive geospatial delivery maps with MapLibre GL and implemented automated courier payroll and customer checkout pipelines utilizing Stripe Elements.*
* **Resume Bullet 5:** *Implemented a 4-tier Role-Based Access Control (RBAC) system supporting distinct administrative, technician, courier, and customer operational dashboards with NextAuth v5.*
