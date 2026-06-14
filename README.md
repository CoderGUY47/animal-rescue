<div align="center">
  <img src="./public/logo.svg" alt="Animal Rescue Connect Logo" width="72" height="72" />
  <h1>Animal Rescue Connect</h1>
  <p><strong>Emergency help platform for stray &amp; sick animals — report, locate, rescue.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2.9-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel" alt="Vercel" />
  </p>

  <p>
    <a href="https://animal-rescue-seven.vercel.app" target="_blank"><strong>🚀 Live Demo</strong></a>
    &nbsp;·&nbsp;
    <a href="https://github.com/CoderGUY47/animal-rescue" target="_blank"><strong>📂 Repository</strong></a>
  </p>
</div>

---

## 📸 Screenshots

<div align="center">
  <img src="./public/assets/home.png" alt="Home Page" width="30%" />
   
  <img src="./public/assets/map.png" alt="Map View" width="30%" />
   
  <img src="./public/assets/settings.png" alt="Settings Page" width="30%" />
</div>

---

## 📖 About

**Animal Rescue Connect** is a mobile-first web application that bridges the gap between people who spot injured or abandoned animals and the local volunteers, vets, and shelters who can help them. It was built to feel like a native app — instant, responsive, and always within reach.

---

## 💻 Tech Stack

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

## 📋 Project Tasks

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

## 🗂️ Core Modules

| Module | Features |
|---|---|
| 🚨 **Animal Reporting** | Report emergencies, upload images, submit rescue requests |
| 📍 **Geolocation** | GPS tracking, location sharing, map integration |
| 🏥 **Vet Discovery** | Vet search, nearby animal hospitals, service filtering |
| 🏠 **Shelter & Rescue** | Shelter discovery, rescue organization directory |
| 💬 **Communication** | Contact vets & shelters, status updates, messaging |
| 🤝 **Volunteer** | Registration, rescue participation, coordination dashboard |
| 📊 **Analytics** | Rescue reports, response metrics, community statistics |

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

## 🚀 Getting Started

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

## 📜 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
```

---

## 🗺️ Roadmap

- [ ] **Backend** — Express.js + Socket.io for real-time rescue updates
- [ ] **Authentication** — User accounts with rescue history
- [ ] **Push Notifications** — Browser push API for rescue alerts
- [ ] **Data Persistence** — Database integration
- [ ] **Admin Panel** — Manage and assign rescue cases

---

## 👤 Author

**Hridoy** — [@CoderGUY47](https://github.com/CoderGUY47)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
