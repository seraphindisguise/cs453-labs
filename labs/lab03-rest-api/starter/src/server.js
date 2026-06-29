import express from "express";
import { pathToFileURL } from "node:url";

export function createApp() {
  const app = express();

  app.use(express.json());

  let nextId = 3;
  const items = [
    { id: 1, name: "keyboard", quantity: 10 },
    { id: 2, name: "mouse", quantity: 5 }
  ];

  function findItemById(id) {
    return items.find(item => item.id === id);
  }

  function isValidItemBody(body) {
    return (
      typeof body.name === "string" &&
      body.name.trim().length > 0 &&
      typeof body.quantity === "number" &&
      body.quantity >= 0
    );
  }

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/items", (req, res) => {
    res.json(items);
  });

  app.get("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = findItemById(id);

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.json(item);
  });

  app.post("/items", (req, res) => {
    if (!isValidItemBody(req.body)) {
      res.status(400).json({ error: "Invalid item data" });
      return;
    }

    const newItem = {
      id: nextId,
      name: req.body.name,
      quantity: req.body.quantity
    };

    nextId += 1;
    items.push(newItem);

    res.status(201).json(newItem);
  });

  app.put("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = findItemById(id);

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    if (!isValidItemBody(req.body)) {
      res.status(400).json({ error: "Invalid item data" });
      return;
    }

    item.name = req.body.name;
    item.quantity = req.body.quantity;

    res.json(item);
  });

  app.delete("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    items.splice(index, 1);

    res.status(204).send();
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Lab 3 REST API listening on port ${PORT}`);
  });
}