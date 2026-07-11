export function logger(req, res, next)
{
    const startTime = Date.now();

    res.on("finish", () => {
        const elapsedTime = Date.now() - startTime;

        console.log(
            `${req.method} ${req.path} ${res.statusCode} ${elapsedTime}ms`
        );
    });

    next();
}