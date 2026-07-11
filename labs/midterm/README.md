# CS 453 Midterm: Course Task Tracker API

## Overview

This project implements a REST-style API for managing a small collection of course tasks using Express.
Each task contains the following fields:

```json
{
  "id": 1,
  "title": "Watch Week 3 lecture",
  "course": "CS453",
  "completed": false
}
```

The data is stored in memory and resets whenever the server restarts.

----

## Project Structure

```
midterm/
│
├── answers.md
├── openapi.yaml
├── README.md
└── src/
    ├── client.js
    ├── server.js
    ├── package.json
    ├── routes/
    │   └── tasks.js
    └── middleware/
        ├── logger.js
        ├── validateTask.js
        └── errorHandler.js
```

----

## Requirements

- Node.js 18 or newer (Node 24 recommended)
- npm

---

## Installation

Navigate to the "src" directory:

```bash
cd src
```

Install dependencies:

```bash
npm install
```

----

## Running the Server

Start the Express server:

```bash
npm run server
```

The server listens on:

```
http://localhost:3000
```

----

## Running the Client

With the server running in one terminal, open a second terminal and run:

```bash
cd src
node client.js
```

The client demonstrates:

1. Health check
2. Create a task
3. List all tasks
4. Retrieve one task
5. Update a task
6. Delete a task

---

## API Routes

| Method | Route | Description |
|-------|----------------|------------------------------|
| GET | `/health` | Health check |
| GET | `/api/tasks` | Return all tasks |
| GET | `/api/tasks/:id` | Return one task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Replace an existing task |
| PATCH | `/api/tasks/:id` | Partially update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## Middleware

The project includes the following middleware:

- Request logger
  - Logs HTTP method
  - Request path
  - Response status
  - Request duration

- Task validation
  - Validates request bodies for POST, PUT, and PATCH requests

- Error handler
  - Handles invalid JSON
  - Returns consistent JSON error responses

---

## OpenAPI Documentation

The API specification is documented in:

```
openapi.yaml
```

This document describes:

- API metadata
- Server URL
- Routes
- Request bodies
- Response schemas
- Error responses
- Reusable schemas

---

## Notes

- Tasks are stored in memory only.
- Restarting the server resets all task data.
- No database is used.