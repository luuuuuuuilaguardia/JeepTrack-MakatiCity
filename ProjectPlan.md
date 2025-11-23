# PROJECT PLAN — Jeepney Route Tracker (8–10 Weeks)

**Methodology**: Agile / Scrum

## Overview of Major Modules

- **Commuter App**
- **Driver App**
- **Route System (Leaflet Map Integration)**
- **Live Tracking + Auto-Boarding Detection**
- **Stops, ETA, and Passenger Volume**
- **Backend Services (Node.js / Supabase or Firebase)**
- **Admin Dashboard (for jeep registration)**

## Timeline: 4 Sprints (Each 2 Weeks)
A 2-month build (realistic for an MVP).

---

## SPRINT 1 — Core Foundation (Week 1–2)

**Goal**: Basic structure, authentication, route system, map display

### User Stories
- As a commuter, I can open the app and see the FTI–Guadalupe route.
- As a driver, I can log in and see my route.
- As both users, I can view stops on the map.
- As an admin, I can register new jeepney drivers.

### Tasks

#### Mobile App (Flutter/React Native)
- Project setup
- State management setup
- User types (commuter, driver)
- Auth screens
- Leaflet map integration
- Load and visualize route
- Display jeepney stops

#### Backend
- **DB schema creation**:
  - users
  - jeepney
  - route
  - stops
- **API endpoints**:
  - `/signup`
  - `/login`
  - `/route/get`
  - `/stops/get`
- Admin jeepney registration script

#### UI/UX
- Wireframes for commuter & driver app

### Deliverables
- Login/Signup
- Leaflet map showing full route
- Landmark/Stops rendered
- Public README update
- Initial repo structure committed

### Risks
- GPS accuracy issues
- Route JSON accuracy

---

## SPRINT 2 — Live Tracking Engine (Week 3–4)

**Goal**: Real-time jeep tracking from driver → commuter

### User Stories
- As a driver, my app sends my GPS location every 2–3 seconds.
- As a commuter, I can see available jeeps on the route in real-time.

### Tasks

#### Driver App
- Background GPS tracking
- Send location to backend (WebSocket)
- Jeep “status” indicator (active/inactive)

#### Commuter App
- Live jeep markers on the map
- Marker updates every 2–3 seconds
- Tap jeep → view info (plate, route, last stop)

#### Backend
- WebSocket implementation
- Jeep location store
- Rate limiting
- Route-matching logic

### Deliverables
- Real-time moving jeep icons
- Driver app stable GPS streaming
- Backend live tracking layer

### Dependencies
- Sprint 1 mapping and route data

---

## SPRINT 3 — Auto-Boarding Detection (Week 5–6)

**Goal**: System identifies when commuter boards a jeep automatically.

### User Stories
- As a commuter, the system detects when I board a jeep.
- As a driver, the passenger count updates automatically.

### Tasks

#### Boarding Detection Logic
- Proximity detection (≤8m)
- Stop detection (jeep speed <5 km/h)
- Sync movement pattern correlation
- Distance clustering
- Drift/false positives prevention

#### Commuter UI
- Auto “On Board” screen
- Override buttons:
  - “I’m on board”
  - “Not my jeep”

#### Driver UI
- Passenger count indicator
- Auto +1 when someone boards

#### Backend
- Boarding event handler
- Real-time state sync
- Occupancy analytics

### Deliverables
- Fully working automatic boarding
- Onboard screen with live updates
- Driver passenger count sync

---

## SPRINT 4 — Passenger Volume, ETA, Final Polish (Week 7–8)

**Goal**: Crowding, ETA, optimization, and final UX polish

### User Stories
- As a commuter, I can see jeepney capacity and crowd level.
- As a commuter, I can view ETA to all stops.
- As a driver, I can set when I go online/offline.

### Tasks

#### Passenger Volume System
- Count of active riders
- Commuter volume per stop estimation

#### ETA System
- Speed-based time prediction
- Stop-to-stop ETA
- Display on commuter side

#### QA + Fixes
- Remove GPS spikes
- Optimize battery usage
- Finalize map UI
- Security checks

### Deliverables
- ETA displayed
- Passenger volume
- Final production-ready build (MVP)

---

## Final Tuning: Deployment Week (Week 9–10)

### Tasks
- Cloud deployment (Supabase, Firebase, or own VPS)
- App Store/Play Store prep
- Public readme docs
- Release v1.0.0

---

## OUR EXPECETED OUTCOMEE

will have:

✔ Commuter app  
✔ Driver app  
✔ Automatic boarding detection  
✔ Live tracking  
✔ Stops & ETA  
✔ Passenger volume  
✔ Open-source documentation  
✔ Working backend  
✔ Basic admin dashboard


- feel free to add or correct, this is only ai generated divid
