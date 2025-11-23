
# Jeepney Route Tracker – Open Source Project
A real-time jeepney tracking, auto-boarding detection, and commuter information system built using **Flutter**, **Node.js (Express)**, and **MongoDB**, with **Leaflet** for maps.

This README is ready for GitHub and includes:  
✔ Project overview  
✔ Architecture  
✔ Features  
✔ Database schema (MongoDB)  
✔ API overview  
✔ Sprint plan / project management  
✔ Contribution guide (optional)  

---

# Project Overview
The Jeepney Route Tracker is a mobile + backend system that enables:  
- **Real-time jeepney tracking** from driver → commuter  
- **Auto-boarding detection** based purely on GPS logic (no BLE)  
- **Route + stops visualization** using Leaflet  
- **Passenger volume estimates**  
- **ETA computation** per stop

This aims to modernize public transport visibility in your city, starting with the **FTI → Guadalupe** route.

---

# Tech Stack
## **Frontend (Mobile)**
- **Flutter**
- Dart
- Leaflet (via Flutter Leaflet plugins)
- Provider / Riverpod / Bloc (any state management)

## **Backend**
- **Node.js** (v18+)
- **Express.js**
- WebSockets (Socket.IO or ws)
- JWT Auth

## **Database**
- **MongoDB** (Cloud MongoDB Atlas recommended)
- Mongoose ODM

## **Maps**
- **Leaflet** (OpenStreetMap)

---

# 🗄️ MongoDB Database Schema
Below is a clean, production-ready NoSQL schema.

## **users**
```json
{
  _id: ObjectId, 
  name: String,
  email: String,
  passwordHash: String,
  role: "commuter" | "driver" | "admin",
  createdAt: Date,
  updatedAt: Date
}
````

## **jeepneys**

```json
{
  _id: ObjectId,
  driverId: ObjectId, // FK → users
  plateNumber: String,
  routeId: ObjectId, // FK → routes
  capacity: Number,
  status: "online" | "offline",
  createdAt: Date
}
```

## **routes**

```json
{
  _id: ObjectId,
  name: String,
  color: String,
  createdAt: Date
}
```

## **route_stops**

```json
{
  _id: ObjectId,
  routeId: ObjectId,
  name: String,
  lat: Number,
  lng: Number,
  sequence: Number
}
```

## **jeepney_locations** (real-time)

```json
{
  _id: ObjectId,
  jeepneyId: ObjectId,
  lat: Number,
  lng: Number,
  speed: Number,
  heading: Number,
  isStopped: Boolean,
  timestamp: Date
}
```

## **boardings**

```json
{
  _id: ObjectId,
  userId: ObjectId,
  jeepneyId: ObjectId,
  routeId: ObjectId,
  boardStopId: ObjectId,
  boardTime: Date,
  method: "auto" | "manual"
}
```

## **disembarkings**

```json
{
  _id: ObjectId,
  userId: ObjectId,
  jeepneyId: ObjectId,
  routeId: ObjectId,
  dropStopId: ObjectId,
  dropTime: Date,
  method: "auto" | "manual"
}
```

---

# API Overview (Express.js)

This is the top-level outline.

## **Auth**

```
POST /auth/signup
POST /auth/login
```

## **Routes + Stops**

```
GET /routes
GET /routes/:id/stops
```

## **Driver**

```
POST /driver/go-online
POST /driver/go-offline
POST /driver/location/update
```

## **Commuter**

```
GET /commuter/jeepneys
POST /commuter/location/update
```

## **Boarding Events**

```
POST /boarding/confirm-manual
POST /boarding/deny
```

---

# Auto-Boarding Detection Logic

**No BLE. No NFC. Pure GPS.**

### **Phases:**

1. **Proximity Detection** (≤ 8 meters)
2. **Stop Detection** (jeep speed < 5 km/h)
3. **Close Proximity Lock** (4m for 5-8 sec)
4. **Movement Synchronization**

   * same direction
   * similar speed
   * distance ≤ 3–5m for ≥ 10 sec
5. **Auto-Onboard State Enabled**
6. **Auto-Disembark** when distance increases past ≥12m once jeep stops

---

# Project Architecture

```
/mobile
  /lib
    /screens
    /services
    /providers
    /models
    /widgets
/server
  /src
    /controllers
    /routes
    /models
    /services
    /utils
/maps
  fti_guadalupe_route.json
README.md
```

---

# Agile Project Plan (Sprints)

Below is the **complete JIRA-style sprint board**.

---

# Sprint 1 — Foundation (Week 1–2)

### **Goals:**

* Flutter app skeleton
* Express backend setup
* MongoDB schema created
* Route + stops displayed in Leaflet
* Auth working

### **Tasks:**

#### Mobile

* [ ] Setup Flutter project
* [ ] Implement login/signup
* [ ] Map screen + Leaflet integration
* [ ] Display route + stops

#### Backend

* [ ] Setup Express project
* [ ] Create MongoDB connection + models
* [ ] Implement Auth API
* [ ] Implement Routes/Stops API

#### Admin

* [ ] Jeepney registration

---

# Sprint 2 — Live Tracking (Week 3–4)

### **Goals:**

* Driver GPS streaming
* WebSocket live jeep tracking
* Commuter sees jeep locations

### **Tasks:**

#### Driver App

* [ ] Background GPS updates
* [ ] Send to server every 2–3 seconds

#### Backend

* [ ] Implement WebSocket server
* [ ] Store latest location in jeepney_locations

#### Commuter App

* [ ] Listen to WebSocket
* [ ] Render jeep markers
* [ ] Smooth animations

---

# Sprint 3 — Auto-Boarding Detection (Week 5–6)

### **Goals:**

* Full GPS-based auto-boarding
* Commuter on-board screen
* Driver occupancy tracking

### **Tasks:**

#### Backend Logic

* [ ] Proximity detection layer
* [ ] Movement correlation algorithm
* [ ] Event generator → boardings collection

#### Mobile

* [ ] Auto-onboard UI
* [ ] Override (“I’m on board”) button
* [ ] “Not my jeep” error handler

---

# Sprint 4 — ETA + Passenger Volume (Week 7–8)

### **Goals:**

* Stop ETA
* Occupancy analytics
* Final UX polish

### **Tasks:**

#### Volume

* [ ] Active boarding counter
* [ ] Occupancy map updates

#### ETA

* [ ] Stop-to-stop calculations
* [ ] Display ETA list

#### Polish

* [ ] Map UI enhancements
* [ ] Dark mode

---

# Optional Sprint 5 — Deployment (Week 9–10)

### Tasks:

* [ ] Deploy backend to production
* [ ] Release mobile app
* [ ] Final documentation

---

# Contributing

This project is open for contributions!
Submit PRs, open issues, or help refine mapping + route logic.

---

# License

MIT
