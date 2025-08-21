## Real-Time Airport Baggage & Flight Operations Tracker

Monorepo containing a Node.js/Express backend and a React (Vite) frontend for real-time flight and baggage operations using MongoDB, Redis, Kafka, and WebSocket (Socket.IO).

### Stack
- Backend: Node.js, Express, Mongoose, JWT, Socket.IO, KafkaJS, Redis
- Frontend: React, Vite, Material UI, React Router, Socket.IO client
- Infra: MongoDB, Redis, Kafka (with Zookeeper)

### Quick Start (No Docker)
1. Prereqs: Node.js 18+, local MongoDB running on `mongodb://localhost:27017`
2. Copy env examples:
   - backend: `cp backend/.env.example backend/.env`
   - Ensure `USE_INMEMORY=1` to disable Kafka/Redis and use in-memory fallbacks
3. Install deps:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
4. Run backend:
   - `cd backend && npm run dev` (default port 4000)
5. Run frontend:
   - `cd frontend && npm run dev` (default port 5173)
6. Login with admin:
   - Email: from `.env` (`ADMIN_EMAIL`), default `admin@airport.local`
   - Password: from `.env` (`ADMIN_PASSWORD`), default `ChangeMe123!`

### Roles
- ADMIN: Single admin; can create users (Airline Staff, Baggage Staff)
- AIRLINE: Manage flights (create/update, gate/status)
- BAGGAGE: Manage baggage (assign/update status)

### Real-time
- Kafka topics used for flight and baggage events
- Backend consumes and broadcasts via Socket.IO and updates Redis cache

### Frontend Pages
- Login, Admin Users, Flights, Baggage, OCC Dashboard

