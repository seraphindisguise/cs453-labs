import http from "node:http";
import { pathToFileURL } from "node:url";

const DEFAULT_PORT = 3000;

let requestCount = 0;

export function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(body));
}

export function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            if (body.trim() === "") {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
}

export function handleCalculate(body) {
    const { operation, a, b } = body;

    if (operation === undefined || a === undefined || b === undefined) {
        return {
            statusCode: 400,
            response: {
                error: "Missing required fields"
            }
        };
    }

    if (typeof a !== "number" || typeof b !== "number") {
        return {
            statusCode: 400,
            response: {
                error: "a and b must be numbers"
            }
        };
    }

    switch (operation) {
        case "add":
            return {
                statusCode: 200,
                response: {
                    result: a + b
                }
            };

        case "subtract":
            return {
                statusCode: 200,
                response: {
                    result: a - b
                }
            };

        case "multiply":
            return {
                statusCode: 200,
                response: {
                    result: a * b
                }
            };

        case "divide":
            if (b === 0) {
                return {
                    statusCode: 400,
                    response: {
                        error: "Division by zero"
                    }
                };
            }

            return {
                statusCode: 200,
                response: {
                    result: a / b
                }
            };

        default:
            return {
                statusCode: 400,
                response: {
                    error: "Unsupported operation"
                }
            };
    }
}

export async function requestHandler(req, res) {
    requestCount += 1;

    const method = req.method;
    const url = req.url;

    if (method === "GET" && url === "/health") {
        sendJson(res, 200, { status: "ok" });
        return;
    }

    if (method === "GET" && url === "/requests") {
        sendJson(res, 200, { count: requestCount });
        return;
    }

    if (method === "POST" && url === "/echo") {
        try {
            const body = await readJsonBody(req);
            sendJson(res, 200, body);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    if (method === "POST" && url === "/calculate") {
        try {
            const body = await readJsonBody(req);
            const result = handleCalculate(body);

            sendJson(res, result.statusCode, result.response);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    sendJson(res, 404, { error: "Not found" });
}

export function createServer() {
    return http.createServer(requestHandler);
}

export function resetState() {
    requestCount = 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    const port = process.env.PORT || DEFAULT_PORT;
    const server = createServer();

    server.listen(port, () => {
        console.log(`HTTP JSON server listening on port ${port}`);
    });
}