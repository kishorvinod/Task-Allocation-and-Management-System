# Task Allocation Management System Analytics Service

## Overview

The Analytics Service is a standalone Python microservice built using FastAPI that provides advanced reporting and workforce analytics for the Task Management System.

Unlike the primary backend, which focuses on authentication, task management, and CRUD operations, this service is dedicated to analytical insights derived from MongoDB data.

The service connects to the same MongoDB database used by the Fastify backend and exposes REST APIs for:

* User workload analysis
* Resource utilization tracking
* Delivery risk identification
* Skill demand analysis
* Task completion metrics
* Priority-based workload reporting
* Effort distribution analysis

---

# Architecture

```text
┌─────────────────┐
│ React Frontend  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fastify Backend │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ MongoDB         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ FastAPI         │
│ Analytics       │
│ Service         │
└─────────────────┘
```

The Analytics Service operates independently from the Fastify backend and performs read-only operations against MongoDB.

---

# Technology Stack

* Python 3.11+
* FastAPI
* PyMongo
* MongoDB
* Python Dotenv
* Uvicorn

---

# Project Structure

```text
python-analytics/

├── app
│
├── main.py
│
├── database.py
│
├── routers
│   └── analytics.router.py
│
├── services
│   └── analytics.service.py
│
├── .env
│
├── requirements.txt
│
└── README.md
```

---

# Database Collections Used

The service reads data from the same MongoDB collections used by the Task Management Backend.

## Users Collection

```json
{
  "_id": "ObjectId",
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

### Fields Used

| Field                | Purpose                |
| -------------------- | ---------------------- |
| name                 | User identification    |
| skills               | Skill demand analytics |
| availableHoursPerDay | Workload calculations  |
| workingDays          | Capacity calculations  |

---

## Tasks Collection

```json
{
  "_id": "ObjectId",
  "title": "Build Login Page",
  "description": "Create login UI",
  "priority": "High",
  "status": "Pending",
  "estimatedHours": 8,
  "requiredSkill": "React",
  "assignedUser": "ObjectId",
  "dueDate": "2026-06-30"
}
```

### Fields Used

| Field          | Purpose                     |
| -------------- | --------------------------- |
| status         | Completion analytics        |
| priority       | Priority workload analytics |
| estimatedHours | Capacity calculations       |
| requiredSkill  | Skill demand analytics      |
| assignedUser   | Workload allocation         |
| dueDate        | Risk analysis               |

---

# Setup Instructions

## Clone Repository

```bash
git clone <repository-url>
```

## Navigate To Project

```bash
cd python-analytics
```

## Create Virtual Environment

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python -m venv venv

source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017

DATABASE_NAME=tamsdb
```

---

## Run Application

```bash
uvicorn app.main:app --reload
```

Application URL:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

---

# Analytics APIs

---

# 1. Workload Summary

## Endpoint

```http
GET /analytics/workload-summary
```

## Purpose

Provides workload distribution across all users.

## Calculation Logic

### Available Hours

```text
availableHours =
availableHoursPerDay × numberOfWorkingDays
```

Example:

```text
8 hours/day × 5 days = 40 hours
```

### Allocated Hours

```text
allocatedHours =
sum(estimatedHours of assigned tasks)
```

Example:

```text
Task A = 8

Task B = 12

Task C = 10

Total = 30 hours
```

### Remaining Hours

```text
remainingHours =
availableHours - allocatedHours
```

### Task Count

```text
count(assigned tasks)
```

## Sample Response

```json
[
  {
    "name": "John",
    "availableHours": 40,
    "allocatedHours": 30,
    "remainingHours": 10,
    "taskCount": 4
  }
]
```

---

# 2. Overloaded Users

## Endpoint

```http
GET /analytics/overloaded-users
```

## Purpose

Identifies users whose assigned workload exceeds available capacity.

## Calculation Logic

```text
allocatedHours > availableHours
```

Example:

```text
Available = 40

Allocated = 55

55 > 40

User is overloaded
```

---

# 3. Underutilized Users

## Endpoint

```http
GET /analytics/underutilized-users
```

## Purpose

Identifies users who are significantly underutilized.

## Calculation Logic

### Utilization Percentage

```text
utilization =
allocatedHours
÷
availableHours
× 100
```

### Threshold

```text
utilization < 50%
```

Example:

```text
Allocated = 10

Available = 40

Utilization = 25%

User is underutilized
```

---

# 4. Tasks At Risk

## Endpoint

```http
GET /analytics/tasks-at-risk
```

## Purpose

Identifies tasks likely to miss deadlines.

## Calculation Logic

A task is considered at risk if:

```text
status != Completed

AND

dueDate <= next 3 days
```

Example:

```text
Today = 16 June

Due Date = 18 June

Days Remaining = 2

Task marked as risk
```

---

# 5. Skill Demand Summary

## Endpoint

```http
GET /analytics/skill-demand
```

## Purpose

Provides skill demand versus skill availability analysis.

Useful for:

* Workforce planning
* Resource allocation
* Skill gap identification

## Calculation Logic

For each skill:

### User Count

```text
count(users having skill)
```

### Task Count

```text
count(tasks requiring skill)
```

Example:

```text
Skill: React

Users = 3

Tasks = 12
```

---

# 6. Task Completion Summary

## Endpoint

```http
GET /analytics/task-completion-summary
```

## Purpose

Provides overall project progress statistics.

## Calculation Logic

### Total Tasks

```text
count(all tasks)
```

### Completed Tasks

```text
status = Completed
```

### Completion Rate

```text
completedTasks
÷
totalTasks
× 100
```

Example:

```text
Completed = 30

Total = 50

Completion Rate = 60%
```

---

# 7. Priority Wise Workload

## Endpoint

```http
GET /analytics/priority-workload
```

## Purpose

Analyzes effort distribution by priority level.

## Calculation Logic

Group tasks by:

```text
priority
```

Calculate:

```text
Task Count

Total Estimated Hours
```

Example:

```text
Priority: High

Tasks = 8

Estimated Hours = 65
```

---

# 8. Estimated Hours By Status

## Endpoint

```http
GET /analytics/hours-by-status
```

## Purpose

Shows effort distribution across task lifecycle stages.

## Calculation Logic

Group tasks by:

```text
Pending

In Progress

Completed
```

Calculate:

```text
SUM(estimatedHours)
```

Example:

```text
Pending

Tasks = 5

Hours = 40
```

---

# Assumptions Made

1. Analytics service is read-only.
2. MongoDB is the single source of truth.
3. Estimated Hours represent workload effort.
4. Working capacity is derived from availableHoursPerDay and workingDays.
5. Underutilization threshold is fixed at 50%.
6. Tasks due within 3 days are considered at risk.
7. Completed tasks are excluded from risk calculations.
8. Skills are stored as string arrays in the users collection.
9. Each task requires one primary skill.
10. Priority values are restricted to Low, Medium, and High.

---

# Performance & Indexing Strategy

To support efficient analytics queries, the following indexes are recommended.

## Users Collection

### Email Index

```javascript
db.users.createIndex({
  email: 1
})
```

Purpose:

* Authentication lookup
* Unique user identification

### Skills Index

```javascript
db.users.createIndex({
  skills: 1
})
```

Purpose:

* Skill demand analytics
* Resource matching

---

## Tasks Collection

### Assigned User Index

```javascript
db.tasks.createIndex({
  assignedUser: 1
})
```

Purpose:

* Workload calculations
* User allocation analytics

### Status Index

```javascript
db.tasks.createIndex({
  status: 1
})
```

Purpose:

* Completion analytics
* Status-based aggregations

### Priority Index

```javascript
db.tasks.createIndex({
  priority: 1
})
```

Purpose:

* Priority workload reporting

### Due Date Index

```javascript
db.tasks.createIndex({
  dueDate: 1
})
```

Purpose:

* Risk analysis
* Deadline monitoring

### Required Skill Index

```javascript
db.tasks.createIndex({
  requiredSkill: 1
})
```

Purpose:

* Skill demand analytics

---

# Future Enhancements

* Predictive workload forecasting
* AI-based delivery risk prediction
* Team productivity scoring
* Trend analysis dashboards
* Department-level analytics
* Scheduled reports
* PDF and Excel exports
* Redis caching
* Interactive charts
* Historical performance tracking

---

# Conclusion

The Analytics Service extends the Task Management System by providing workforce planning, workload balancing, delivery risk analysis, skill demand reporting, and project progress analytics through a dedicated FastAPI microservice. The service demonstrates a microservice-oriented architecture where operational APIs and analytical APIs are separated while sharing a common MongoDB data source.
