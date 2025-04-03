import { app, PORT } from "./index";

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
    console.log("Closing server...");
    server.close(() => {
        console.log("Server closed.");
    });
});

process.on("SIGINT", () => {
    console.log("Received SIGINT. Shutting down...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});
