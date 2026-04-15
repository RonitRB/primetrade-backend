# Primetrade Backend API

A scalable REST API with JWT Authentication, Role-Based Access Control, and full CRUD operations — built with Node.js, Express, and MongoDB.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Role-Based Access](#role-based-access)
- [Frontend UI](#frontend-ui)
- [Scalability Notes](#scalability-notes)

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Runtime    | Node.js                           |
| Framework  | Express.js v5                     |
| Database   | MongoDB (via Mongoose)            |
| Auth       | JWT (jsonwebtoken) + bcryptjs     |
| Validation | express-validator                 |
| Config     | dotenv                            |

---

## Project Structure

```
primetrade-backend/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Profile
│   │   └── taskController.js   # CRUD Task operations
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect + adminOnly guards
│   ├── models/
│   │   ├── User.js             # User schema (name, email, password, role)
│   │   └── Task.js             # Task schema (title, description, status, createdBy)
│   ├── routes/
│   │   ├── authRoutes.js       # /api/v1/auth/*
│   │   └── taskRoutes.js       # /api/v1/tasks/*
│   ├── .env                    # Environment variables (not committed)
│   ├── app.js                  # Express app entry point
│   └── package.json
└── frontend/
    └── index.html              # Vanilla JS frontend UI
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) v6+ (running locally or Atlas URI)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/primetrade-backend.git
cd primetrade-backend

# 2. Install dependencies
cd backend
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your values

# 4. Start the server
node app.js
```

The API will be live at: `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=your_super_secret_jwt_key_here
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```http
GET /
Response: { "message": "Primetrade API v1 is running" }
```

---

### Auth Endpoints (`/api/v1/auth`)

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"   // "user" or "admin"
}
```
**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "<jwt_token>",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" }
}
```

---

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (200):**
```json
{
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" }
}
```

---

#### Get Profile (Protected)
```http
GET /api/v1/auth/profile
Authorization: Bearer <jwt_token>
```
**Response (200):**
```json
{
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" }
}
```

---

### Task Endpoints (`/api/v1/tasks`)
> All task routes require `Authorization: Bearer <jwt_token>` header.

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Build REST API",
  "description": "Complete the Primetrade assignment",
  "status": "in-progress"
}
```
**Status values:** `pending` | `in-progress` | `completed`

**Response (201):**
```json
{
  "message": "Task created",
  "task": { "_id": "...", "title": "Build REST API", "status": "in-progress", "createdBy": "..." }
}
```

---

#### Get All Tasks
```http
GET /api/v1/tasks
Authorization: Bearer <jwt_token>
```
> **Note:** Regular users see only their own tasks. Admins see all tasks.

**Response (200):**
```json
{
  "count": 2,
  "tasks": [ { "_id": "...", "title": "...", "status": "...", "createdBy": { "name": "...", "email": "..." } } ]
}
```

---

#### Update Task
```http
PUT /api/v1/tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "completed"
}
```
**Response (200):**
```json
{
  "message": "Task updated",
  "task": { "_id": "...", "title": "Updated Title", "status": "completed" }
}
```

---

#### Delete Task
```http
DELETE /api/v1/tasks/:id
Authorization: Bearer <jwt_token>
```
**Response (200):**
```json
{ "message": "Task deleted successfully" }
```

---

#### Get All Tasks (Admin Only)
```http
GET /api/v1/tasks/all
Authorization: Bearer <admin_jwt_token>
```

---

## Role-Based Access

| Action              | User | Admin |
|---------------------|------|-------|
| Register / Login    | ✅   | ✅    |
| View own tasks      | ✅   | ✅    |
| View ALL tasks      | ❌   | ✅    |
| Create task         | ✅   | ✅    |
| Update own task     | ✅   | ✅    |
| Update any task     | ❌   | ✅    |
| Delete own task     | ✅   | ✅    |
| Delete any task     | ❌   | ✅    |

---

## Frontend UI

A lightweight Vanilla JS frontend is included at `frontend/index.html`.

**Features:**
- Register & Login with JWT storage in localStorage
- Protected dashboard (redirects if not authenticated)
- Create, view, update, and delete tasks
- Role-aware task display (admins see all tasks)
- Error/success message feedback

**To run:**
Simply open `frontend/index.html` in your browser while the backend is running on port 5000.

---

## Scalability Notes

See [SCALABILITY.md](./SCALABILITY.md) for a detailed breakdown of the architecture decisions and scaling strategy.

---

## Postman Collection

Import `Primetrade_API.postman_collection.json` (included in root) into Postman to test all endpoints with pre-configured requests and environment variables.

---

## Security Practices

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT tokens signed with secret key, expire in **7 days**
- Authorization header validated on every protected route
- Role guard middleware (`adminOnly`) prevents privilege escalation
- Mongoose schema enforces data type validation at DB level

---

## Author

Built as part of the Primetrade.ai Backend Developer Internship Assignment.
