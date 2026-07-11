import express from "express";
import {
    validateTask,
    validateTaskPatch
} from "../middleware/validateTask.js"
export const tasksRouter = express.Router();

let nextId = 3;
const tasks = [
    {
        id: 1,
        title: "Watch Week 3 lecture",
        course: "CS 453",
        completed: false
    },
    {
        id: 2,
        title: "Complete Lab 3",
        course: "CS 453",
        completed: false
    }
];

function findTaskById(id) {
    return tasks.find(task => task.id === id);
}

/* function isValidTask(task) {
    return (
        typeof task.title === "string" &&
        task.title.trim().length > 0 &&
        typeof task.course === "string" &&
        task.course.trim().length > 0 &&
        typeof task.completed === "boolean"
    );
}*/
tasksRouter.get("/", (req, res) => {
    res.json(tasks);
});

tasksRouter.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = findTaskById(id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }
    res.json(task);
});

tasksRouter.post("/", validateTask, (req, res) => {
    const newTask = {
        id: nextId,
        title: req.body.title.trim(),
        course: req.body.course.trim(),
        completed: req.body.completed
    };

    nextId += 1;
    tasks.push(newTask);

    res.status(201).json(newTask);
});

tasksRouter.put("/:id", validateTask, (req, res) => {
    const id = Number(req.params.id);
    const task = findTaskById(id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    task.title = req.body.title.trim();
    task.course = req.body.course.trim();
    task.completed = req.body.completed;

    res.json(task);
});

tasksRouter.patch("/:id", validateTaskPatch, (req, res) => {
    const id = Number(req.params.id);
    const task = findTaskById(id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const { title, course, completed } = req.body;

    if (title !== undefined) {
        task.title = title.trim();
    }

    if (course !== undefined) {
        task.course = course.trim();
    }

    if (completed !== undefined) {
        task.completed = completed;
    }

    res.json(task);
});

tasksRouter.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1){
        return res.status(404).json({
            error: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.status(204).send();
});
