
# Task Allocation & Management System (Monorepo)

##  Overview

This is a **Task Management System** built using a **monorepo architecture**, containing both the **frontend** and **backend** applications in a single repository.

The system supports:

* User Authentication (JWT-based)
* Role-Based Access Control (Admin/User)
* Task Management & Assignment
* Task Status Tracking
* Dashboard & Workload Monitoring
* Search, Filtering, and Pagination

>  Note: Detailed documentation for frontend and backend is available in their respective repositories.

---

##  Monorepo Structure

```
root/
├── frontend/   # React + TypeScript app
├── backend/    # Fastify + Node.js API
└── README.md
```

---

##  Tech Stack

### Frontend

* React
* TypeScript
* React Router DOM
* Axios
* React Hook Form
* Zod
* Context API

### Backend

* Node.js
* TypeScript
* Fastify
* MongoDB + Mongoose
* JWT Authentication
* Zod Validation
* Docker

---

##  Features

###  Authentication & Authorization

* JWT-based login system
* Persistent sessions
* Role-based access:

  * **Admin**: Full control
  * **User**: Limited access

---

###  Dashboard

* Total Tasks
* Pending / In Progress / Completed Tasks
* Total Users
* Team Workload

---

###  User Management (Admin Only)

* View users
* Update skills
* Update availability

---

###  Task Management

#### Admin

* Create tasks
* Assign tasks
* Update & delete tasks
* Search, filter, paginate

#### User

* View assigned tasks
* Update task status

---

###  Search & Filtering

* Text-based search
* Filter by:

  * Status
  * Priority
* Pagination support

---

##  API Overview (Backend)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me`

### Users

* `GET /api/users`
* `PATCH /api/users/:id/skills`
* `PATCH /api/users/:id/availability`

### Tasks

* `POST /api/tasks`
* `GET /api/tasks`
* `GET /api/tasks/:id`
* `PUT /api/tasks/:id`
* `DELETE /api/tasks/:id`
* `PATCH /api/tasks/:id/assign`
* `PATCH /api/tasks/:id/status`

### Dashboard

* `GET /api/dashboard`
* `GET /api/dashboard/workload`

---

##  Setup Instructions

### Clone Repository

```
git clone <your-repo-url>
cd <repo-folder>
```

---

### 2️ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-secret
```

Run MongoDB (Docker):

```
docker run -d -p 27017:27017 --name mongodb mongo
```

Start backend:

```
npm run dev
```

---

###  Frontend Setup

```
cd frontend
npm install
npm start
```

Backend base URL is configured as:

```
http://localhost:5000/api
```

---

##  Authentication Flow

* User logs in → receives JWT token
* Token stored in localStorage
* Axios automatically attaches token via interceptors
* Protected routes enforced on frontend + backend

---

##  Key Concepts

### State Management

* Context API for authentication & user state

### Validation

* Zod used in both frontend and backend

### Database Design

* Indexed fields for performance:

  * Email (unique)
  * Skills
  * Task status & priority
  * Full-text search on tasks

---

##  Assumptions

* Admin users are created manually
* Only admins manage tasks
* No auto task allocation
* JWT stored in browser localStorage
* Backend enforces all authorization rules

---

##  Future Improvements

### Frontend

* Material UI / Better UI
* Responsive design
* Dark mode
* Charts & analytics
* Redux / React Query
* Testing (Unit + E2E)

### Backend

* Refresh tokens
* Email notifications
* Auto task allocation
* Audit logs
* File attachments
* Real-time updates
* Redis caching
* Swagger documentation

---

##  Additional Documentation

For detailed implementation:

* 📄 Frontend README → *(separate folder)-frontend*
* 📄 Backend README → *(separate folder)-backend*

---

## 👨‍💻 Author

Developed as a full-stack task allocation management solution using modern technologies with a scalable monorepo architecture.
