export function validateTask(req, res, next) {
    const { title, course, completed } = req.body;

    if (typeof title !== "string" || title.trim().length === 0 ) {
        return res.status(400).json({
            error: "Title must be a non-empty string"
        });
    }

    if (typeof course !== "string" || course.trim().length === 0) {
        return res.status(400).json({
            error: "Course must be a non-empty string"
        });
    }

    if (typeof completed !== "boolean") {
        return res.status(400).json({
            error: "Completed must be a Boolean"
        });
    }

    next();
}

export function validateTaskPatch(req, res, next) {
    const { title, course, completed } = req.body;

    if (
        title !== undefined &&
        (typeof title !== "string" || title.trim().length === 0)
    ) {
        return res.status(400).json({
            error: "Title must be a non-empty string"
        });
    }

    if (
        course !== undefined &&
        (typeof course !== "string" || course.trim().length === 0)
    ) {
        return res.status(400).json({
            error: "Course must be a non-empty string"
        });
    }

    if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({
            error: "Completed must be a Boolean"
        });
    }

    if (
        title === undefined &&
        course === undefined &&
        completed === undefined
    ) {
        return res.status(400).json({
            error: "At least one valid task field is required"
        });
    }

    next();
}