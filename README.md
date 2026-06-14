<div align="center">

# 🐾 Animal Rescue Connect

### Emergency Help Platform for Stray &amp; Sick Animals

*Bridging fast visual emergency reporting with real-time geolocation discovery of vets and shelters.*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-animal--rescue--seven.vercel.app-2563eb?style=for-the-badge)](https://animal-rescue-seven.vercel.app)
&nbsp;
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
&nbsp;
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
&nbsp;
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Table of Contents

- [✨ Overview](#-overview)
- [🚀 Live Links](#-live-links)
- [❌ The Problem &amp; ✅ The Solution](#-the-problem---the-solution)
- [💡 Business Value &amp; SEO](#-business-value--seo)
- [🚀 Key Features](#-key-features)
- [📋 Project Tasks &amp; Phases](#-project-tasks--phases)
- [📦 Tech Stack &amp; Architecture](#-tech-stack--architecture)
- [📁 Project Structure](#-project-structure)
- [🛠️ Installation &amp; Setup](#-installation--setup)
- [🚢 Production Deployment](#-production-deployment)
- [🤝 Social &amp; Contributing](#-social--contributing)

---

## ✨ Overview

**Animal Rescue Connect** is a mobile-first web application designed to assist sick, injured, or abandoned animals by quickly connecting concerned citizens with nearby veterinarians, animal shelters, rescue organizations, and volunteers. Meticulously designed with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **Redux Toolkit**, it delivers a native-app-like experience.

Users can report animals in distress by uploading images, sharing GPS-based location information, and providing details about the animal's condition. The platform focuses on reducing rescue response times through real-time reporting, location-based service discovery, and routing tools.

---

## ❌ The Problem & ✅ The Solution

> **Stray and injured animals deserve immediate coordination.**

When an animal is in distress, traditional emergency response mechanisms are slow and fragmented. Communicating a precise street location is difficult, finding nearest open veterinary facilities takes precious time, and coordinating volunteer responses is highly disjointed.

| ❌ The Problem | ✅ Animal Rescue Connect's Solution |
| :--- | :--- |
| Reporting animal emergencies is slow, with no central tracking | Instant reporting with animal type, severity, and photo uploads |
| GPS location details are hard to communicate in text/calls | Automatic GPS detection and manual marker adjustment on a live map |
| Nearby shelters and vets are hard to locate in a panic | Geolocation service finder showing vets, hospitals, and shelters on map |
| Finding routes or directions to clinics takes crucial time | Integrated route drawing with traffic conditions and distance calculation |
| Volunteer efforts are disjointed with no coordinate hub | Volunteer sign-up with dynamic availability and location coordination |

---

## 🚀 Live Links

* **Live Client-Side App:** [https://animal-rescue-seven.vercel.app](https://animal-rescue-seven.vercel.app)

<br/>

<table>
  <tr>
    <td width="33.3%">
      <img src="./public/assets/home.png" alt="Home Page" width="100%" style="border-radius:8px;aspect-ratio:9/16;object-fit:cover" />
    </td>
    <td width="33.3%">
      <img src="./public/assets/map.png" alt="Map View" width="100%" style="border-radius:8px;aspect-ratio:9/16;object-fit:cover" />
    </td>
    <td width="33.3%">
      <img src="./public/assets/settings.png" alt="Settings Page" width="100%" style="border-radius:8px;aspect-ratio:9/16;object-fit:cover" />
    </td>
  </tr>
  <tr>
    <td align="center"><sub>🐾 Emergency Home Reporting</sub></td>
    <td align="center"><sub>📍 Geolocation Map Discovery</sub></td>
    <td align="center"><sub>⚙️ Settings & Privacy</sub></td>
  </tr>
</table>

---

## 💡 Business Value & SEO

By balancing beautiful aesthetics with robust security, Animal Rescue Connect yields remarkable utility:

| Feature | Impact |
| :--- | :--- |
| **Life-Saving Speed** | Fast report submittal reduces emergency response time by minutes |
| **Eager Geolocation** | Direct live navigation saves critical transit time to the nearest vet clinic |
| **SEO & Access Optimization** | Search Engine indexing and semantic structures maximize organic reach for lost animals |
| **Resource Efficiency** | Active volunteer tracking prevents duplicate rescues and coordinates responses |

---

## 🚀 Key Features

* 🚨 **Emergency Reporting** — Submit a rescue request with animal type, severity, condition, location, and photos.
* 🗺️ **Interactive Geolocation Map** — Locate nearby vets, shelters, pet shops & hospitals using live OpenStreetMap data.
* 🔍 **Location Search** — Search any location and get directions with color-coded traffic routing.
* 🐾 **Rescue Tracker** — Browse and track active rescue cases in real time.
* 📊 **Analytics Dashboard** — Community-wide rescue stats, adoption rates, and response time charts.
* 🤝 **Volunteer Sign-Up** — Register as a volunteer with your skills and availability.
* ⚙️ **Settings & Security** — Manage profile, privacy, location sharing, with DevTools inspecting disabled.

---

## 📋 Project Tasks & Phases

### Phase 1 — Animal Reporting & Location Tracking Foundation

* **Project Setup**
  * [x] Next.js project bootstrap with TypeScript & Tailwind CSS
  * [x] Clean directory structure & mobile-first design configuration
* **Homepage Development**
  * [x] Quick action report button
  * [x] Emergency help & immediate assistance guidelines
  * [x] Dynamic nearby rescue overview card
* **Animal Reporting Module**
  * [x] Photo upload integration with Cloudinary widget
  * [x] Detailed fields for condition, type, and severity selection
* **Geolocation Integration**
  * [x] Automatic GPS-based location detection
  * [x] Location permission handling and manual marker adjustment
* **Report Details Page**
  * [x] Uploaded image preview carousel
  * [x] Detailed case status, reporter name, and share options
* **Mobile Experience**
  * [x] Responsive layouts tailored for smartphones, tablets, and desktop

---

### Phase 2 — Vet & Shelter Discovery System

* **Nearby Services Module**
  * [x] List veterinarians, animal hospitals, rescue centers, and shelters
* **Interactive Map Integration**
  * [x] Live markers for verified animal services
  * [x] OSRM route drawing with color-coded traffic overlay (Red/Green)
  * [x] Interactive popup cards with ratings, directions button, and address
* **Advanced Search & Filtering**
  * [x] Filter service list by type (Vet, Shelter, Hospital, Pet Shop)
  * [x] Filter by 24/7 availability
  * [x] Location search autocompletion
* **Service Details Page**
  * [x] Detailed view of contact info, hours, website, and phone
* **Emergency Contact Features**
  * [x] One-tap direct phone calls
  * [x] Direct messaging UI
* **Rescue Dashboard**
  * [x] Manage submitted cases, update status, and track Redux state

---

### Phase 3 — Rescue Coordination & Analytics

* **Volunteer Coordination**
  * [x] Sign-up form with skills, availability, and preferences
  * [x] Active participation tracking in nearby cases
* **Community & Leaderboards**
  * [x] Live community board showing recent activities
  * [x] Contribution counter and leaderboards
* **Analytics Dashboard**
  * [x] Interactive charts built with Recharts (Monthly Rescues, Adoption Rate)
  * [x] Key Performance Indicators (Total Rescues, Active Volunteers, Avg Response Time)
* **Production Optimization**
  * [x] TypeScript compiler error checking
  * [x] Security measures (Inspect elements & drag-and-drop disabled)
  * [x] Deployment pipeline configuration on Vercel

---

## 📦 Tech Stack & Architecture

| Technology | Category | Purpose / Notes |
| :--- | :--- | :--- |
| **Next.js 16** | Frontend Framework | App Router, Server Components & SEO |
| **React 19** | Library | Concurrent rendering, modern hooks |
| **TypeScript** | Language | Strict type safety across components and store |
| **Tailwind CSS 4** | Styling | Modern, fast utility-first styling system |
| **Shadcn UI** | UI Primitives | Accessible and fully customizable base components |
| **Redux Toolkit** | State Management | Centralized store for user profile and active reports |
| **React Hook Form** | Form Handling | Performant form state management |
| **Zod** | Validation | Strict schema validation for inputs |
| **Axios** | API Client | HTTP requests for external services |
| **MapLibre GL** | Maps | High-performance OpenStreetMap vector rendering |
| **Overpass API** | Geolocation | Live queries for nearby vets/shelters |
| **Nominatim** | Geolocation | Reverse geocoding (coordinates to address) |
| **OSRM** | Routing | Route path creation with traffic-aware colors |
| **Cloudinary** | Image Hosting | Next-Cloudinary widget for user photo uploads |
| **Socket.io Client** | Real-time | Configured socket hooks (backend ready) |
| **React Toastify** | Notifications | User-friendly alert and progress toast displays |
| **Lucide React** | Icons | Modern and consistent iconography |
| **Vercel** | Deployment | Automated deployments and hosting |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── analytics/                # Community analytics dashboard
│   ├── community/                # Community board
│   ├── map/                      # Interactive rescue map
│   ├── report/                   # Emergency report submission
│   ├── rescues/                  # Rescue listings & detail pages
│   ├── services/                 # Vet/shelter service pages
│   ├── settings/                 # Settings, notifications, privacy
│   ├── volunteer/                # Volunteer registration
│   ├── layout.tsx                # Root layout & providers
│   └── page.tsx                  # Home page
│
├── components/
│   ├── forms/                    # ReportForm, VolunteerForm
│   ├── layout/                   # Header, BottomNav
│   ├── map/                      # MapView (complex map component)
│   ├── providers/                # ThemeProvider, ReduxProvider, PermissionBootstrap
│   └── ui/                       # Atomic UI: Button, Card, Dialog, Badge, etc.
│
├── hooks/                        # Custom React hooks
├── lib/                          # API clients, schemas, utilities
├── store/                        # Redux store, slices, typed hooks
└── types/                        # Shared TypeScript definitions
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js `v18+`
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/CoderGUY47/animal-rescue.git
cd animal-rescue

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Cloudinary keys

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

```env
# Cloudinary — for rescue report image uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## 🚢 Production Deployment

* **Frontend Hosting (Next.js):** Deployed on **Vercel** (`animal-rescue-seven.vercel.app`).
* **Deployment Pipeline:** Automatic CI/CD pipeline integrated directly via GitHub.

---

## 🤝 Social & Contributing

<div align="center">

Produced with absolute dedication and precision by **[CoderGUY47](https://github.com/CoderGUY47)**.

*Join us in engineering the future of animal welfare!*

[![GitHub](https://img.shields.io/badge/GitHub-CoderGUY47-181717?style=for-the-badge&logo=github)](https://github.com/CoderGUY47)

</div>
