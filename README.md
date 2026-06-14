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

### Frontend Framework
🟢 React.js
🟢 Next.js

### Language
🟢 TypeScript

### Styling
🟢 Tailwind CSS

### UI Components
🟢 ShadCN UI

### State Management
🟢 Redux Toolkit

### Forms & Validation
🟢 React Hook Form
🟢 Zod

### API Integration
🟢 Axios

### Maps & Geolocation
🟢 MapLibre GL (open-source, OpenStreetMap)
🟢 Overpass API (nearby vets, shelters, hospitals)
🟢 Nominatim (geocoding & reverse geocoding)
🟢 OSRM (routing & directions)

### Image Upload
🟢 Cloudinary (via next-cloudinary)

### Real-Time Features
🟢 Socket.io Client *(backend integration — roadmap)*

### Notifications
🟢 React Toastify

### Icons
🟢 React Icons / Lucide React

### Deployment
🟢 Vercel

### Version Control
🟢 Git & GitHub

---

## ✅ Project Tasks

### 📅 Phase 1 — Animal Reporting & Location Tracking Foundation

**Project Setup**
🟢 Next.js Project
🟢 TypeScript
🟢 Tailwind CSS
🟢 Git Repository
🟢 Mobile-First Design System

**Homepage Development**
🟢 Quick Report Button
🟢 Emergency Help Section
🟢 Nearby Rescue Overview
🟢 How-to-Use Guide Section

**Animal Reporting Module**
🟢 Upload Animal Photos (Cloudinary)
🟢 Describe Animal Condition
🟢 Select Animal Type
🟢 Select Severity Level
🟢 Submit Rescue Requests

**Geolocation Integration**
🟢 GPS Location Detection
🟢 Location Permission Handling
🟢 Interactive Map Preview
🟢 Manual Location Search

**Report Details Page**
🟢 Uploaded Images
🟢 Animal Information
🟢 Location Information
🟢 Report Status
🟢 Contact Reporter & Share

**Responsive Mobile Experience**
🟢 Smartphones
🟢 Tablets
🟢 Desktop Browsers

---

### 📅 Phase 2 — Vet & Shelter Discovery System

**Nearby Services Module**
🟢 Veterinarians
🟢 Animal Hospitals
🟢 Rescue Centers
🟢 Shelters & Pet Shops

**Interactive Map Integration**
🟢 Service Markers with icons
🟢 Route Visualization (colour-coded traffic)
🟢 Distance Calculation
🟢 Get Directions button

**Advanced Search & Filters**
🟢 Filter by type (Vet, Shelter, Hospital, Pet Shop)
🟢 Filter by 24/7 Emergency availability
🟢 Location name search with suggestions

**Service Details Page**
🟢 Contact Information
🟢 Operating Hours
🟢 Rating Display
🟢 Website & Phone links

**Emergency Contact Module**
🟢 One-Tap Calling
🟢 Direct Messaging UI
🟢 Rescue Request Sharing

**Rescue Dashboard**
🟢 Submitted Reports
🟢 Rescue Status
🟢 Redux Toolkit State Management

---

### 📅 Phase 3 — Rescue Coordination & Analytics

**Volunteer Coordination Module**
🟢 Volunteer Registration Form
🟢 Rescue Participation
🟢 Availability Preferences

**Community Dashboard**
🟢 Animals Rescued Stats
🟢 Active Rescue Requests
🟢 Community Contributions
🟢 Leaderboard

**Analytics Dashboard**
🟢 Monthly Rescues Bar Chart
🟢 Adoption Rate Metrics
🟢 Response Time Line Chart
🟢 KPI Cards (Total Rescues, Active Volunteers, Avg Response)

**Deployment & Documentation**
🟢 Deployed on Vercel
🟢 README Documentation
🟢 Clean Folder Architecture

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
