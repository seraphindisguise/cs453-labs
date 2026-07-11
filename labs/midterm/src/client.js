const BASE_URL = "http://localhost:3000";

async function request(path, options = {})
{
    const response = await fetch(`${BASE_URL}${path}`, options);
    let body = null;
    if (response.status !== 204)
    {
        body = await response.json();
    }

    if (!response.ok)
    {
        const message = body?.error ?? `HTTP error ${response.status}`;
        throw new Error(message);
    }

    return {
        status: response.status,
        body
    };
}

async function runClient()
{
    try{
        console.log("\n1. Health check");
        const healthResponse = await request("/health");
        console.log(healthResponse.body);
        console.log("\n2. Create a task");
        const createResponse = await request("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Study for the midterm",
                course: "CS453",
                completed: false
            })
        });

        const createdTask = createResponse.body;
        console.log(createdTask);

        console.log("\n3. List all tasks");
        const listResponse = await request("/api/tasks");
        console.log(listResponse.body);

        console.log(`\n4. Get task ${createdTask.id}`);
        const getResponse = await request(
            `/api/tasks/${createdTask.id}`
        );

        console.log(getResponse.body);

        console.log(`\n5. Update task ${createdTask.id}`);
        const updateResponse = await request(
            `/api/tasks/${createdTask.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: "Finish studying for the midterm",
                    course: "CS453",
                    completed: true
                })
            }
        );

        console.log(updateResponse.body);

        console.log(`\n6. Delete task ${createdTask.id}`);
        const deleteResponse = await request(
            `/api/tasks/${createdTask.id}`,
            {
                method: "DELETE"
            }
        );

        console.log(`Task deleted. Status: ${deleteResponse.status}`);
    } catch (error) {
        console.error("\nClient error:", error.message);
        process.exitCode = 1;
    }

}

runClient();