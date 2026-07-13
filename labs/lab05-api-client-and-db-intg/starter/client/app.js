const API_BASE_URL = "http://localhost:3000";

const loadButton = document.querySelector("#load-items");
const itemList = document.querySelector("#items");
const form = document.querySelector("#add-item-form");
const itemNameInput = document.querySelector("#item-name");
const itemQuantityInput = document.querySelector("#item-quantity");
const statusBox = document.querySelector("#status");

function setStatus(message) {
  statusBox.textContent = message;
}

function createButton(label, clickHandler) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", clickHandler);
  return button;
}

function renderItems(items) {
  itemList.replaceChildren();

  for (const item of items) {
    const li = document.createElement("li");
    const text = document.createElement("span");

    text.textContent = `${item.id}: ${item.name} (${item.quantity}) `;

    const viewButton = createButton("View", () => {
      loadOneItem(item.id);
    });

    const editButton = createButton("Edit", () => {
      editItem(item);
    });

    const deleteButton = createButton("Delete", () => {
      deleteItem(item.id);
    });

    li.append(text, viewButton, editButton, deleteButton);
    itemList.appendChild(li);
  }
}

async function loadItems() {
  setStatus("Loading items...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ?? `GET /api/items failed with status ${response.status}`
      );
    }

    renderItems(data.items);
    setStatus("Items loaded.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function loadOneItem(id) {
  setStatus(`Loading item ${id}...`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ?? `GET /api/items/${id} failed`
      );
    }

    setStatus(
      `Item ${data.item.id}: ${data.item.name} (${data.item.quantity})`
    );
  } catch (error) {
    setStatus(error.message);
  }
}

async function addItem(name, quantity) {
  setStatus("Adding item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ?? `POST /api/items failed with status ${response.status}`
      );
    }

    setStatus(`Added item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function editItem(item) {
  const name = window.prompt("Enter the new item name:", item.name);

  if (name === null) {
    return;
  }

  const quantityText = window.prompt(
    "Enter the new quantity:",
    String(item.quantity)
  );

  if (quantityText === null) {
    return;
  }

  const quantity = Number(quantityText);

  if (!name.trim() || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a name and a non-negative integer quantity.");
    return;
  }

  setStatus(`Updating item ${item.id}...`);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/items/${item.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim(),
          quantity
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ?? `PUT /api/items/${item.id} failed`
      );
    }

    setStatus(`Updated item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function deleteItem(id) {
  const confirmed = window.confirm(`Delete item ${id}?`);

  if (!confirmed) {
    return;
  }

  setStatus(`Deleting item ${id}...`);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/items/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      const data = await response.json();

      throw new Error(
        data.message ?? `DELETE /api/items/${id} failed`
      );
    }

    setStatus(`Deleted item ${id}.`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

loadButton.addEventListener("click", loadItems);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = Number(itemQuantityInput.value);

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a name and a non-negative integer quantity.");
    return;
  }

  itemNameInput.value = "";
  itemQuantityInput.value = "0";

  await addItem(name, quantity);
});

loadItems();