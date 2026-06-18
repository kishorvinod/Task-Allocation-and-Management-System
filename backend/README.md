# Task Management System - Backend

## Overview

This backend application provides REST APIs for a Task Allocation Management System built using Fastify, TypeScript, MongoDB, and JWT Authentication.

The system supports:

* User Authentication
* Role Based Access Control (Admin/User)
* Task Management
* Task Assignment
* Task Status Tracking
* Workload Monitoring
* Dashboard Statistics
* Search, Filtering and Pagination

---

# Technology Stack

* Node.js
* TypeScript
* Fastify
* MongoDB
* Mongoose
* JWT Authentication
* Zod Validation
* Docker

---

# Project Structure

src/

├── modules/

│ ├── auth/

│ ├── users/

│ ├── tasks/

│ └── dashboard/

├── middleware/

├── utils/

├── types/

├── app.ts

└── server.ts

---

# MongoDB Schema Definitions

## User Schema

```ts
{
  name: String,
  email: String,
  password: String,
  role: "admin" | "user",

  skills: [String],

  availableHoursPerDay: Number,

  workingDays: [String],

  createdAt: Date,
  updatedAt: Date
}
```

### Example

```json
{
  "name": "John Doe",
  "email": "john@test.com",
  "role": "user",
  "skills": ["React", "Node"],
  "availableHoursPerDay": 8,
  "workingDays": [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
  ]
}
```

---

## Task Schema

```ts
{
  title: String,

  description: String,

  priority:
    "Low" |
    "Medium" |
    "High",

  status:
    "Pending" |
    "In Progress" |
    "Completed",

  estimatedHours: Number,

  requiredSkill: String,

  dueDate: Date,

  assignedUser: ObjectId,

  createdBy: ObjectId,

  createdAt: Date,
  updatedAt: Date
}
```

### Example

```json
{
  "title": "Build Login Page",
  "description": "Create login UI and API integration",
  "priority": "Medium",
  "status": "Pending",
  "estimatedHours": 6,
  "requiredSkill": "React",
  "dueDate": "2026-06-30"
}
```

---

# Indexing Strategy

Proper indexing is implemented to improve query performance.

## User Collection

### Unique Email Index

```ts
email: {
  type: String,
  unique: true
}
```

Purpose:

* Prevent duplicate accounts
* Fast login lookup

Query optimized:

```js
User.findOne({
  email
});
```

---

### Skills Index

```ts
skills: 1
```

Purpose:

* Fast skill-based filtering
* Task assignment matching

Query optimized:

```js
User.find({
  skills: "React"
});
```

---

## Task Collection

### Status Index

```ts
status: 1
```

Purpose:

* Dashboard statistics
* Task filtering

Query optimized:

```js
Task.find({
  status: "Pending"
});
```

---

### Priority Index

```ts
priority: 1
```

Purpose:

* Priority filtering

Query optimized:

```js
Task.find({
  priority: "High"
});
```

---

### Assigned User Index

```ts
assignedUser: 1
```

Purpose:

* User task retrieval
* Workload calculation

Query optimized:

```js
Task.find({
  assignedUser: userId
});
```

---

### Compound Search Index

```ts
{
  title: "text",
  description: "text"
}
```

Purpose:

* Search functionality

Query optimized:

```js
Task.find({
  $text: {
    $search: "login"
  }
});
```

---

# Authentication

JWT-based authentication is used.

## Login

Returns:

```json
{
  "token": "jwt-token",
  "user": {}
}
```

Authorization Header:

```http
Authorization: Bearer <token>
```

---

# Role Based Access Control

## Admin

Can:

* View all users
* Create tasks
* Update tasks
* Delete tasks
* Assign tasks
* View dashboard

## User

Can:

* View assigned tasks
* Update task status
* View own profile

---

# API Documentation

## Authentication

### Register

POST /api/auth/register

### Login

POST /api/auth/login

### Current User

GET /api/auth/me

---

## Users

### Get Users

GET /api/users

### Update Skills

PATCH /api/users/:id/skills

### Update Availability

PATCH /api/users/:id/availability

---

## Tasks

### Create Task

POST /api/tasks

### Get Tasks

GET /api/tasks

Query Parameters:

* page
* limit
* search
* status
* priority

### Get Task

GET /api/tasks/:id

### Update Task

PUT /api/tasks/:id

### Delete Task

DELETE /api/tasks/:id

### Assign Task

PATCH /api/tasks/:id/assign

Request:

```json
{
  "userId": "..."
}
```

### Update Status

PATCH /api/tasks/:id/status

Request:

```json
{
  "status": "Completed"
}
```

---

## Dashboard

### Statistics

GET /api/dashboard

Returns:

* Total Tasks
* Pending Tasks
* In Progress Tasks
* Completed Tasks
* Total Users

### Workload Report

GET /api/dashboard/workload

Returns:

* Available Hours
* Allocated Hours
* Remaining Hours
* Task Count

---

# Setup Instructions

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create .env

```env
PORT=5000

MONGODB_URI=mongodb://localhost:27017/tams

JWT_SECRET=your-secret
```

---

## Start MongoDB Docker

```bash
docker run -d \
-p 27017:27017 \
--name mongodb \
mongo
```

---

## Development

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

# Assumptions Made

1. Admin users are created manually.
2. Only Admin can assign tasks.
3. Task auto-allocation was not implemented.
4. User availability is manually maintained.
5. Estimated hours are used for workload calculation.
6. Users can update only their assigned task status.
7. Soft delete was not required by specification.

---

# Future Improvements

* Refresh Tokens
* Email Notifications
* Auto Task Allocation
* Audit Logs
* File Attachments
* Real-Time Updates
* Redis Caching
* Swagger/OpenAPI Documentation
