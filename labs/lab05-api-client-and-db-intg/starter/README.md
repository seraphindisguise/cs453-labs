# Lab 5 Starter

## How to Run

```bash
npm install
docker compose up -d
npm run api
npm run client
```

Open:

```text
http://localhost:5173
```

Postgres is exposed on:

```text
postgres://postgres:postgres@localhost:5433/lab05
```

## What Already Works

- Postgres runs in Docker.
- The Express server connects to Postgres.
- The server creates and seeds an `items` table on startup.
- `GET /health`, `GET /api/items`, and `POST /api/items` are implemented.
- The browser client can load items and add a new item.

## What You Need to Add

- `GET /api/items/:id`
- `PUT /api/items/:id`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`
- Better validation and error handling
- Client-side UI for at least some of the new routes

## Graduate Extension

Add one more resource or relationship, such as categories, projects, or tags,
and connect it to the database.

## Reflection Answers

### 1. What changed when the API moved from in-memory data to Postgres?

My answer: Initially, when the API uses in-memory data, the items are stored in a JS array and are lost when the server restarts. When the API uses Postres, the data is stored is a database and cannot be accessed even when the Express server/browser client is restarted. Additionally, route handlers changed (they use SQL queries) and the API has to wait for asynchronous database operations to handle database connection/query errors.


### 2. When should you use `PUT` instead of `PATCH`?

My answer: "Put" should be used when the client wants to replace the entire editable portion of a resource. "Patch" should be used only when the client wants to update the part of a resource. In this lab's API, a "put" request has to have both the item name and the quantity.


### 3. What kinds of validation belong in the API even if the browser client also validates input?

My answer: The API should always validate route parameters and request bodies because clients other than the browser, such as curl, can send requests directly. It should verify that the item ID is a positive integer, the name is not empty, and the quantity is a non-negative integer. The API should also distinguish between invalid input (400 Bad Request) and a valid request for a resource that does not exist (404 Not Found). Server-side validation ensures the database always receives valid data.


### 4. How does the browser client help you test the API differently than `curl` alone?

My answer: curl is useful for testing individual routes, request bodies, and HTTP status codes. The browser client tests the API as part of a complete application by using fetch, displaying data, and handling success or error messages. It also verifies that CORS is configured correctly since the client and API run on different ports. Using both provides confidence that both the API and the full application work correctly.


### 5. If you added an extension, what did you add and why?

My answer: I extended the browser client by adding View, Edit, and Delete buttons for each item. These buttons demonstrate the new GET /api/items/:id, PUT /api/items/:id, and DELETE /api/items/:id routes from the browser. This made the application more interactive while keeping it simple. It also provided an easy way to test the new API functionality without relying only on command-line tools.
