import express from "express";
import { tasksRouter } from "./routes/tasks.js";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.use("/api/tasks", tasksRouter);

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Course Task Tracker listening on port ${PORT}`);

});