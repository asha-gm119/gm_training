## Real-Time Airport Baggage & Flight Operations Tracker

Monorepo containing a Node.js/Express backend and a React (Vite) frontend for real-time flight and baggage operations using MongoDB, Redis, Kafka, and WebSocket (Socket.IO).

### Stack
- Backend: Node.js, Express, Mongoose, JWT, Socket.IO, KafkaJS, Redis
- Frontend: React, Vite, Material UI, React Router, Socket.IO client
- Infra: MongoDB, Redis, Kafka (with Zookeeper)

### Quick Start
1. Copy env examples:
   - backend: `cp backend/.env.example backend/.env`
2. Start via Docker Compose:
   - `docker compose up --build`
3. Seed admin user is automatic on backend start if none exists.

### Roles
- ADMIN: Single admin; can create users (Airline Staff, Baggage Staff)
- AIRLINE: Manage flights (create/update, gate/status)
- BAGGAGE: Manage baggage (assign/update status)

### Real-time
- Kafka topics used for flight and baggage events
- Backend consumes and broadcasts via Socket.IO and updates Redis cache

### Frontend Pages
- Login, Admin Users, Flights, Baggage, OCC Dashboard

