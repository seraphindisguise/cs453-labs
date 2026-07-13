import express from "express";
import cors from "cors";
import pg from "pg";
import { pathToFileURL } from "node:url";

const { Pool } = pg;

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 5433),
  database: process.env.PGDATABASE ?? "lab05",
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "postgres"
});

function parseItemId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function validateCompleteItem(body) {
  const name = body?.name?.trim();
  const quantity = Number(body?.quantity);

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    return null;
  }

  return { name, quantity };
}

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ]
  }));

  app.get("/health", async (req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "error",
        message: "Database connection failed."
      });
    }
  });

  // Return all items.
  app.get("/api/items", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, name, quantity
        FROM items
        ORDER BY id ASC
      `);

      res.json({ items: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  });

  // Create one item.
  app.post("/api/items", async (req, res) => {
    const item = validateCompleteItem(req.body);

    if (!item) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name and non-negative integer quantity are required."
      });
    }

    try {
      const result = await pool.query(
        `
          INSERT INTO items (name, quantity)
          VALUES ($1, $2)
          RETURNING id, name, quantity
        `,
        [item.name, item.quantity]
      );

      res.status(201).json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to add item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to add item."
      });
    }
  });

  // Return one item by ID.
  app.get("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Item ID must be a positive integer."
      });
    }

    try {
      const result = await pool.query(
        `
          SELECT id, name, quantity
          FROM items
          WHERE id = $1
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "Item not found."
        });
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to load item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load item."
      });
    }
  });

  // Fully replace one item.
  app.put("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);
    const item = validateCompleteItem(req.body);

    if (id === null) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Item ID must be a positive integer."
      });
    }

    if (!item) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name and non-negative integer quantity are required."
      });
    }

    try {
      const result = await pool.query(
        `
          UPDATE items
          SET name = $1, quantity = $2
          WHERE id = $3
          RETURNING id, name, quantity
        `,
        [item.name, item.quantity, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "Item not found."
        });
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to replace item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to replace item."
      });
    }
  });

  // Partially update one item.
  app.patch("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Item ID must be a positive integer."
      });
    }

    const hasName = Object.hasOwn(req.body ?? {}, "name");
    const hasQuantity = Object.hasOwn(req.body ?? {}, "quantity");

    if (!hasName && !hasQuantity) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Provide a name, quantity, or both."
      });
    }

    let name;
    let quantity;

    if (hasName) {
      name = req.body.name?.trim();

      if (!name) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Name must be a non-empty string."
        });
      }
    }

    if (hasQuantity) {
      quantity = Number(req.body.quantity);

      if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Quantity must be a non-negative integer."
        });
      }
    }

    try {
      const existing = await pool.query(
        `
          SELECT id, name, quantity
          FROM items
          WHERE id = $1
        `,
        [id]
      );

      if (existing.rows.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "Item not found."
        });
      }

      const currentItem = existing.rows[0];
      const updatedName = hasName ? name : currentItem.name;
      const updatedQuantity = hasQuantity ? quantity : currentItem.quantity;

      const result = await pool.query(
        `
          UPDATE items
          SET name = $1, quantity = $2
          WHERE id = $3
          RETURNING id, name, quantity
        `,
        [updatedName, updatedQuantity, id]
      );

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to update item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to update item."
      });
    }
  });

  // Delete one item.
  app.delete("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Item ID must be a positive integer."
      });
    }

    try {
      const result = await pool.query(
        `
          DELETE FROM items
          WHERE id = $1
          RETURNING id
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "Item not found."
        });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to delete item."
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({
      error: "Not Found",
      message: "Route not found."
    });
  });

  return app;
}

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity >= 0)
    )
  `);

  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS count FROM items"
  );

  if (rows[0].count === 0) {
    await pool.query(
      `
        INSERT INTO items (name, quantity)
        VALUES ($1, $2), ($3, $4), ($5, $6)
      `,
      ["Keyboard", 10, "Mouse", 5, "Monitor", 3]
    );
  }
}

const isMainModule =
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  const app = createApp();

  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Lab 5 API listening on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error);
      process.exit(1);
    });
}
