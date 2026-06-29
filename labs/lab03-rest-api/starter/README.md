# Lab 3 REST API

## How to Run

```bash
npm install
npm run server
```

The server runs on:

```text
http://localhost:3000
```

## How to Test

```bash
npm test
```

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/items` | Return all items |
| GET | `/items/:id` | Return one item |
| POST | `/items` | Create one item |
| PUT | `/items/:id` | Update one item |
| DELETE | `/items/:id` | Delete one item |

## Reflection Answers

### 1. What makes this API more REST-like than the previous HTTP/JSON lab?

### My answer: This assignment's API follows REST principles, which means that it organizes resources into routes (for example, /items). It uses standard HTTP methods, such as POST and PUT, to make different operations on resources rather than creating specific endpoints for each individual action.


### 2. What is the purpose of a route parameter such as `/items/:id`?

### My answer: It lets the server identify a specific resource. Say a user types /items/1. This command requests the item whose ID is 1. If the user wanted to request an item with an ID of 2, they could type /items/2.


### 3. Why should `POST`, `PUT`, and `DELETE` use different HTTP methods?

### My answer: Every HTTP method has a different purpose, and using different methods makes the API predictable. It also adheres to REST standards this way. 


### 4. What is the difference between a `400` error and a `404` error?

### My answer: A '400' error means that sent invalid or bad data, whereas a '404' error means that the route or resource that was requested does not exist. The different lies in whether the thing requested actually exists.


### 5. How does the OpenAPI file relate to your Express server code?

### The OpenAPI file contains information about the REST API. It describes things such as request/response formats and status codes to inform developers on how the API works, which can save them time.

## Graduate Extension

### Not applicable for my assignment!
