import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/server.js";

describe("Lab 3 REST API", () => {
  test("GET /health returns status ok", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/health")
      .expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });

  test("GET /items returns a list of items", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/items")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("quantity");
  });

  test("GET /items/:id returns one item", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/items/1")
      .expect(200);

    expect(response.body).toEqual({
      id: 1,
      name: "keyboard",
      quantity: 10
    });
  });

  test("GET /items/:id returns 404 for missing item", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/items/999")
      .expect(404);

    expect(response.body).toHaveProperty("error");
  });

  test("POST /items creates a new item", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/items")
      .send({
        name: "monitor",
        quantity: 4
      })
      .expect(201);

    expect(response.body).toEqual({
      id: 3,
      name: "monitor",
      quantity: 4
    });
  });

  test("POST /items rejects invalid item data", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/items")
      .send({
        name: "",
        quantity: -1
      })
      .expect(400);

    expect(response.body).toHaveProperty("error");
  });

  test("PUT /items/:id updates an existing item", async () => {
    const app = createApp();

    const response = await request(app)
      .put("/items/1")
      .send({
        name: "mechanical keyboard",
        quantity: 12
      })
      .expect(200);

    expect(response.body).toEqual({
      id: 1,
      name: "mechanical keyboard",
      quantity: 12
    });
  });

  test("PUT /items/:id returns 404 for missing item", async () => {
    const app = createApp();

    const response = await request(app)
      .put("/items/999")
      .send({
        name: "missing item",
        quantity: 1
      })
      .expect(404);

    expect(response.body).toHaveProperty("error");
  });

  test("PUT /items/:id rejects invalid item data", async () => {
    const app = createApp();

    const response = await request(app)
      .put("/items/1")
      .send({
        name: "",
        quantity: -1
      })
      .expect(400);

    expect(response.body).toHaveProperty("error");
  });

  test("DELETE /items/:id deletes an existing item", async () => {
    const app = createApp();

    await request(app)
      .delete("/items/1")
      .expect(204);

    await request(app)
      .get("/items/1")
      .expect(404);
  });

  test("DELETE /items/:id returns 404 for missing item", async () => {
    const app = createApp();

    const response = await request(app)
      .delete("/items/999")
      .expect(404);

    expect(response.body).toHaveProperty("error");
  });

  test("unknown routes return 404", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/unknown")
      .expect(404);

    expect(response.body).toHaveProperty("error");
  });
});