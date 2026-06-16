# Task Management System - Frontend

## Overview

Frontend application built using React and TypeScript.

Provides:

* Authentication
* Dashboard
* User Management
* Task Management
* Task Assignment
* Status Updates

---

# Technology Stack

* React
* TypeScript
* React Router DOM
* Axios
* React Hook Form
* Zod
* Context API

---

# Project Structure

src/

├── api/

├── context/

├── layouts/

├── pages/

│ ├── Login/

│ ├── Dashboard/

│ ├── Users/

│ └── Tasks/

├── routes/

├── services/

└── components/

---

# Features

## Authentication

* Login
* JWT Storage
* Persistent Sessions
* Protected Routes
* Role-Based Navigation

---

## Dashboard

Displays:

* Total Tasks
* Pending Tasks
* In Progress Tasks
* Completed Tasks
* Total Users
* Team Workload

---

## Users Management

Admin only.

Features:

* View Users
* Update Skills
* Update Availability

---

## Task Management

Admin:

* Create Task
* Assign Task
* Delete Task
* Search Tasks
* Filter Tasks
* Pagination

User:

* View Assigned Tasks
* Update Status

---

# State Management

Context API is used.

AuthContext manages:

* Current User
* Authentication State
* Logout

---

# API Integration

Axios instance:

```ts
Authorization: Bearer <token>
```

automatically attached using interceptors.

---

# Form Validation

Implemented using:

* React Hook Form
* Zod

Forms:

* Login
* Create Task
* Status Update

---

# Routing

Public:

```text
/
```

Protected:

```text
/dashboard
/tasks
```

Admin Only:

```text
/users
```

---

# Setup Instructions

## Install

```bash
npm install
```

---

## Start

```bash
npm start
```

---

## Backend URL

Configured in:

```ts
src/api/axios.ts
```

```ts
baseURL:
"http://localhost:5000/api"
```

---

# Assumptions Made

1. User registration is managed through backend/admin process.
2. Only Admin users manage tasks.
3. User interface focuses on functionality over styling.
4. Browser localStorage stores JWT tokens.
5. Backend enforces authorization rules.

---

# Future Improvements

* Material UI
* Responsive Design
* Toast Notifications
* Dark Mode
* React Query
* Redux Toolkit
* Charts and Analytics
* Unit Tests
* E2E Tests
