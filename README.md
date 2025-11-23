# JeepTrack-MakatiCity
This repository is a product-spec / starter-kit for developers who want to contribute to a real-world pilot. It contains everything needed to implement the commuter and driver mobile apps, backend services, and an admin console.



# JeepTrak (placeholder)

An open-source mobile + backend system to help commuters and jeepney drivers coordinate along a route (example: **FTI → Guadalupe**). This repo contains the specification, architecture, API, boarding-detection algorithm, and developer onboarding instructions to build an MVP. Uses **Leaflet** for maps (no paid map provider required) and **no BLE** hardware requirement.

> This repository is a product-spec / starter-kit for developers who want to contribute to a real-world pilot. It contains everything needed to implement the commuter and driver mobile apps, backend services, and an admin console.

---

## Key goals

* Show live jeepney locations and ETAs along a route.
* Auto-detect when a commuter boards/disembarks a jeep using **GPS + motion correlation + time thresholds** (no BLE).
* Provide driver-side tools (go online/offline, update capacity) and commuter UI (track jeep, in-ride info, SOS).
* Ready for a small pilot (10–50 vehicles) and easy to extend.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Core Features](#core-features)
4. [Boarding Detection Algorithm](#boarding-detection-algorithm)
5. [Data Model (summary)](#data-model-summary)
6. [API Endpoints (example)](#api-endpoints-example)
7. [Frontend Notes](#frontend-notes)
8. [Dev Setup (local)](#dev-setup-local)
9. [Deployment](#deployment)
10. [Testing and Pilot Plan](#testing-and-pilot-plan)
11. [Contribution Guide](#contribution-guide)
12. [Roadmap & Ideas](#roadmap--ideas)
13. [License](#license)

---

## Project Overview

JeepTrak aims to make daily commuting easier for jeepney riders and drivers. Riders can see nearby jeepneys on a route, get ETAs, and have the app auto-detect boarding and disembark events. Drivers share live GPS to appear on rider maps and can update capacity.

This repository is intended as an open-source starting point for community developers, universities, or transit volunteers to experiment and run pilots.

---

## Architecture

* **Mobile clients**: React Native (recommended) or Flutter — single codebase for Android/iOS.
* **Maps**: Leaflet (webviews or React Native Leaflet bindings) and OpenStreetMap tiles (or self-hosted tiles).
* **Realtime**: WebSockets (Socket.IO, or native WebSocket) for live GPS and events.
* **Backend services**:

  * Auth & User management (phone OTP)
  * Location ingestion service (high-frequency for drivers)
  * Boarding detection microservice (stateless, scalable)
  * API server (REST for standard CRUD)
  * Admin console (React)
* **Datastore**: PostgreSQL for relational data; Redis for ephemeral state (possible occupancy cache).
* **Optional analytics**: ClickHouse / BigQuery for timeseries/analytics.

---

## Core Features

### Commuter App

* OTP phone login
* Route list & map (Leaflet)
* Live list of online jeepneys with ETA to stops
* Auto-detect boarding (GPS-driven) and in-ride screen
* Manual "I’m on board" and "I just disembarked" overrides
* Favorite stops, arrival notifications
* Fare estimator, SOS/report feature

### Driver App

* Register & verify (plate number, minimal KYC)
* Go Online / Go Offline toggle
* High-frequency GPS streaming (1–3s)
* Update capacity and status
* View waiting volumes at upcoming stops (crowd-sourced)
* See detected onboard riders with an option to correct

### Admin Console

* Manage routes & stops
* Approve drivers
* Live map of all jeeps
* Analytics & incident management

---

## Boarding Detection Algorithm

**No BLE**. Core idea: combine proximity, vehicle speed, time-in-zone, and movement correlation.

### Configurable parameters (example)

```txt
PROXIMITY_FIRST = 8 meters
PROXIMITY_LOCK = 4 meters
STAY_SECONDS = 6 seconds
JEEP_STOP_SPEED = 5 km/h
COMMUTER_WALK_SPEED = 2 m/s
MOVEMENT_WINDOW = 12 seconds
DISAMBARK_DISTANCE = 12 meters
```

### Flow (high-level)

1. Driver streams location frequently (1–3s). Commuters stream location less frequently (3–10s when not active; higher when near a stop or expecting).
2. If `distance <= PROXIMITY_FIRST` and `jeep.speed <= JEEP_STOP_SPEED` and `user.speed <= COMMUTER_WALK_SPEED`, mark *Possible Boarding*.
3. If user persists within `PROXIMITY_LOCK` for `STAY_SECONDS` while jeep remains slow, mark *Close Proximity Lock*.
4. When jeep resumes movement, compare the next `MOVEMENT_WINDOW` samples: if commuter and jeep headings and speed-changes correlate and distance stays within `3-5m`, **confirm boarding**.
5. For disembark: detect when jeep stops and commuter's distance increases beyond `DISAMBARK_DISTANCE` for a small window (5s) → confirm disembark.

### Pseudocode (simplified)

```python
# called when new location samples arrive
if d <= PROXIMITY_FIRST and jeep.speed <= JEEP_STOP_SPEED and user.speed <= COMMUTER_WALK_SPEED:
    create_possible_boarding(user, jeep)

# background check
if possible_boarding.duration >= STAY_SECONDS and distance <= PROXIMITY_LOCK:
    set_state(user, jeep, 'CLOSE_PROXIMITY_LOCK')

# on jeep movement resume
collect_samples(window=MOVEMENT_WINDOW)
if movement_correlation(user_samples, jeep_samples) and distance <= 5m:
    confirm_boarding(user, jeep)
else:
    notify_user('Ambiguous detection, please confirm')
```

### Notes & improvements

* Use a Kalman filter to smooth GPS noise.
* Implement a scoring function for multiple nearby jeeps; pick the highest score.
* Respect user privacy: only collect location with consent; allow clearing history.

---

## Data Model (summary)

Tables (simplified):

* `users` (user_id, phone, name, created_at)
* `drivers` (driver_id, name, plate, verified, created_at)
* `jeeps` (jeep_id, driver_id, route_id, status)
* `routes` (route_id, name, direction)
* `stops` (stop_id, route_id, name, lat, lng, seq)
* `location_streams` (ephemeral, not persisted long-term)
* `boardings` (event logs, user_id, jeep_id, type, confidence, timestamp)
* `reports` (incidents/reports)

---

## API Endpoints (examples)

Standard REST + WebSocket channels for realtime location:

* `POST /auth/request-otp` { phone }
* `POST /auth/verify-otp` { phone, otp }
* `GET /routes` → list routes
* `GET /routes/:id/stops` → list stops
* `GET /jeeps?route={id}` → online jeeps
* `POST /driver/:id/location` → driver GPS (high freq)
* `POST /user/:id/location` → user GPS (adaptive freq)
* `POST /boardings/:user_id/confirm` → manual confirm
* `POST /reports` → incident report

Realtime channels (WebSocket):

* `jeeps:route:{route_id}` — broadcast jeep locations
* `user:{user_id}:events` — personal events (boarding prompts, confirmations)

---

## Frontend Notes (Leaflet)

* Use Leaflet + OpenStreetMap tiles. For React Native, use a WebView wrapping a small Leaflet app or use community Leaflet bindings.
* Marker clustering for routes with many jeeps.
* Use polylines to draw route and stops; show ETA bubbles near stops.
* Keep the boarding-detection prompts subtle (toast or small banner) and provide a single-tap undo.

Tile usage: consider a tile usage policy (cache tiles, limit refresh). For pilot, use public OSM tiles carefully; consider third-party tile providers or self-hosted tiles if scale requires.

---

## Dev Setup (local) — Example

This section shows a suggested local setup to run the backend and a mock frontend.

### Prerequisites

* Node.js >= 18
* PostgreSQL >= 13
* Redis
* Docker (optional)

### Environment variables (example `.env`)

```
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/jeeptrak
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
WS_SECRET=your_ws_secret
LEAFLET_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Run locally (backend)

```bash
# clone repo
npm install
# run migrations
npm run db:migrate
# start server
npm run dev
```

### Run frontend (example react web app with Leaflet)

```bash
cd frontend
npm install
npm run start
```

---

## Deployment

* Use containerized deployments (Docker). One container for API, one for detection microservice, one for WebSocket/ingestion service.
* Use managed Postgres (RDS/Cloud SQL) and Redis (Elasticache/MemoryStore).
* Use a load balancer for WebSocket traffic (e.g., AWS ALB with sticky sessions or use Socket.IO cluster + Redis adapter).
* Use a logging & monitoring stack (Sentry, Prometheus/Grafana).

---

## Testing & Pilot Plan

1. Unit test detection logic using synthetic GPS tracks (simulate boarding / non-boarding scenarios).
2. Integration test entire flow with mocked websocket streams.
3. Field pilot: 10–20 jeepneys on the FTI → Guadalupe route for 4 weeks.

   * Metrics to measure: detection accuracy (TP/FP/FN), battery usage, network usage, driver adoption.
4. Iterate thresholds based on pilot data.

---

## Contribution Guide

* Please open an issue for feature requests or bugs.
* Fork the repository and create topic branches per feature.
* Write tests for new logic (especially detection algorithm changes).
* Follow the code style (eslint/prettier) and include changelog entries for breaking changes.
* Maintain privacy-first defaults for any new feature involving location data.

---

## Roadmap & Ideas

* Fare payment integration (GCash / PayMaya / Cards)
* Expand to other routes/cities
* Driver analytics dashboard (profit, utilization)
* Offline mode & low-power adaptive location sampling
* Enhanced crowd estimation using anonymized boarding logs

---

## License

This project is released under the **MIT License** — see `LICENSE` for details.

---

## Contact

If you want to pilot, test, or contribute — open an issue or reach out through the repo issues. Good luck and thank you for helping improve urban mobility!
