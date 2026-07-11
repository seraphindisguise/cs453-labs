# CS 453 Midterm: Course Task Tracker API
## Course Task Tracker REST API

### Overview

This project implements a REST-style API using Node.js and Express. The API manages a small in-memory collection of course tasks and supports creating, retrieving, updating, and deleting tasks. The project was created for my CS 453 midterm and demonstrates the use of:

1) Express routing
2) Middleware
3) JSON request and response handling
4) REST API design
5) HTTP status codes
6) OpenAPI documentation
7) A simple client using `fetch`

Because the data is stored in memory, all tasks are reset whenever the server restarts.

---

# Project Structure

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
    ├── package-lock.json
    ├── routes/
    │   └── tasks.js
    ├── middleware/
    │   ├── logger.js
    │   ├── validateTask.js
    │   └── errorHandler.js
    └── node_modules/
```

---

# Requirements

This project requires:

- A working computer
- Node.js (version 18 or newer)
- npm

---

# Installation

Navigate to the project's `src` directory and type the following command:

```bash
cd src
```

Install the required packages:

```bash
npm install
```

This installs Express and any other required dependencies.

---

# Running the Server

Start the API server with:

```bash
npm run server
```

If everything starts correctly, you should see:

```text
Course Task Tracker listening on port 3000
```

The server will be available at:

```text
http://localhost:3000
```

---

# Running the Client

Open a second terminal window while the server is still running. Then, navigate to the `src` directory and run:

```bash
node client.js
```

The client demonstrates the following API operations:

1) Health check
2) Create a task
3) List all tasks
4) Retrieve one task by ID
5) Update a task
6) Delete a task

Console output is used to display the results of each request.

---

# API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Returns a simple health check message |
| GET | `/api/tasks` | Returns all tasks |
| GET | `/api/tasks/:id` | Returns one task by ID |
| POST | `/api/tasks` | Creates a new task |
| PUT | `/api/tasks/:id` | Replaces an existing task |
| PATCH | `/api/tasks/:id` | Partially updates an existing task |
| DELETE | `/api/tasks/:id` | Deletes a task |

---

# Middleware

The project includes three middleware components.

### Request Logger

Logs information for every request, including:

- HTTP method
- Request path
- Response status code
- Time taken to complete the request

### Validation Middleware

Checks incoming task data for POST, PUT, and PATCH requests before the route handler executes. Invalid data results in a `400 Bad Request` response.

### Error Handler

Handles invalid JSON and unexpected server errors by returning appropriate HTTP status codes and JSON error messages.

---

# OpenAPI Documentation

The API is documented in:

```
openapi.yaml
```

The specification includes:

- API information
- Server URL
- Route definitions
- Request body schemas
- Response schemas
- Common error responses
- Reusable data schemas

---

# Notes

1) This project uses an in-memory array rather than a database.
2) Restarting the server resets all task data.
3) The project follows REST principles by using standard HTTP methods and status codes.
4) The included client demonstrates all of the required API operations from the assignment.

---

# Files Included

The project submission contains:

- `answers.md`
- The express server source code
- The client source code
- `openapi.yaml`
- `README.md`
