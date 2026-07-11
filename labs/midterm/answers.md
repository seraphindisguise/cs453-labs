# CS 453 Midterm Answers

These are my answers for the conceptual questions on the midterm.

---

# Part 1 — Conceptual Foundations

## 1. Sockets vs. HTTP

A raw TCP socket makes a reliable channel for communication between two individual programs. It can send and receive streams of bytes yet cannot interpret them. The application has to create its own protocol for commands, responses, and messages.

HTTP is a protocol built on top of TCP which creates a standard format for requests and responses (for example: headers and methods). The fact that HTTP is standardized makes it so that servers, web browsers, and many development libraries understand how to use it without further context provided by the programmer.

Most web APIs do not expose raw socket protocols since HTTP provides a standard that is easy to use for development, testing, and documentation. It can be used across different programming languages, clients, and web infrastructure.

---

## 2. Request/Response

The request/response pattern is a model where a client sends a request to a server, the server processes the request, and sends a response back.

- In a TCP command server, the client sends a command (for example, `ECHO hello world`), the server processes the command, and the output is returned.
- In an HTTP API, the client sends an HTTP request containing a method, headers, and URL. Sometimes there is also a JSON body. The server then processes the request and returns an HTTP response along with a status code (and sometimes a JSON response body).
- In an Express route handler, a request is represented by the `req` object and the response is represented by the `res` object. The route handler reads information from `req`, performs the specified operation, and then sends a response using methods such as `res.json()`.

---

## 3. Statelessness

In order to be stateless, an API must treat every request as independent from previous requests. In other words, the server does not use information stored from previous requests, so every request must contain all of the information necessary to be valid.

An advantage of statelessness is that it makes applications easier to scale.

A disadvantage of statelessness is that clients may need to send the same information with each request, which can increase network traffic and reduce efficiency.

---

## 4. HTTP Status Codes

| Situation | Status Code | Reason |
|-----------|-------------|--------|
| A new resource was successfully created | **201 Created** | The request succeeded and a new resource was created. |
| The client requested an item that does not exist | **404 Not Found** | The requested resource could not be found. |
| The client sent JSON missing a required field | **400 Bad Request** | The request contains invalid or incomplete data. |
| The server had an unexpected error | **500 Internal Server Error** | An unexpected problem occurred on the server. |
| A successful request returns JSON data | **200 OK** | The request completed successfully and returned the requested data. |

---

# Part 2 — API Design

## 1. Resource URIs

The API uses `/api/tasks` as the collection URI and `/api/tasks/:id` for one specific task.

| Operation | HTTP Method | URI |
|-----------|-------------|-----|
| Get all tasks | `GET` | `/api/tasks` |
| Get one task by ID | `GET` | `/api/tasks/:id` |
| Create a task | `POST` | `/api/tasks` |
| Replace a task | `PUT` | `/api/tasks/:id` |
| Partially update a task | `PATCH` | `/api/tasks/:id` |
| Delete a task | `DELETE` | `/api/tasks/:id` |

For example, the URI `/api/tasks/3` identifies the task whose ID is **3**.

---

## 2. Method Semantics

### `GET /api/tasks`

This route is **safe** because it only retrieves information and should not modify any server data. Safe methods are also **idempotent** because repeating the request should not change the state of the server.

### `GET /api/tasks/:id`

This route is **safe** because it retrieves one task without changing it. Repeating the same request should return the same task as long as the task has not been changed by another request.

### `POST /api/tasks`

This route is **neither safe nor idempotent**. It is not safe because it changes server state by creating a task. It is not idempotent because sending the same request more than once may create multiple tasks with different IDs.

### `PUT /api/tasks/:id`

This route is **idempotent but not safe**. It changes server data, so it is not safe. However, repeating the same replacement request should leave the task in the same final state.

### `PATCH /api/tasks/:id`

This route is **not safe** because it modifies part of a task. `PATCH` is not guaranteed to be idempotent, although a specific update such as setting `completed` to `true` may produce the same final state when repeated.

### `DELETE /api/tasks/:id`

This route is **idempotent but not safe**. It changes server state by deleting a task. Repeating the request leaves the task deleted, even if later requests return `404 Not Found`.

---

## 3. JSON Representation

A valid JSON request body for creating a new task is:

```json
{
  "title": "Study for the midterm",
  "course": "CS453",
  "completed": false
}
```

The server assigns the new task an ID.

---

# Part 4 — Middleware

The request logger and task validation are middleware concerns because they apply to multiple routes rather than belonging to only one route.

The logger should run for every incoming request. Implementing it as middleware avoids repeating timing and logging code in every route handler. It also ensures that every request is logged using the same format, including the HTTP method, request path, response status, and time taken.

Validation is needed for routes that create or update tasks, including `POST`, `PUT`, and `PATCH`. Validation middleware checks the request body before the route handler performs its main work. This allows the route handler to focus on creating or updating the task while the middleware handles invalid input and returns a `400 Bad Request` response when necessary.

Using middleware reduces duplicated code, improves consistency, separates concerns, and makes the application easier to maintain.

---

# Part 7 — Reflection

## 1. Code vs. Contract

An Express route implementation is the actual executable server code that receives requests, changes data, and sends responses.

An OpenAPI specification is a contract that describes how the API is supposed to behave. It documents the available routes, HTTP methods, path parameters, request bodies, response bodies, schemas, and status codes.

The Express code implements the API, whereas the OpenAPI file documents the interface that clients are expected to use.

---

## 2. Drift

One example of drift is when the Express server changes a route from `/api/tasks/:id` to `/tasks/:id`, but the OpenAPI file still documents the old route.

Another example is when the server changes the required request body fields or response format, but the OpenAPI schema is not updated. For example, the server might require a `dueDate` field while the documentation still lists only `title`, `course`, and `completed`.

Code and documentation can also drift if the server returns a different status code than the one listed in the OpenAPI specification.

---

## 3. Client Impact

Inaccurate API documentation can cause client developers to send requests to the wrong routes, use the wrong HTTP methods, omit required fields, or expect incorrect response formats.

This can cause failed requests, incorrect error handling, parsing errors, and wasted time spent debugging. Accurate documentation allows client developers to build software against the API without needing to inspect the server implementation.
