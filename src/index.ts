import app from "./app/app";
import { env } from "./app/config/env";
import logger from "./app/utils/logger";

process.on("uncaughtException", (err: Error) => {
    logger.error("💥 Uncaught Exception! Shutting down...");
    logger.error(err.stack || err.message);
    process.exit(1);
});

const startServer = async () => {
    try {

        // Start server
        const server = app.listen(env.PORT, () => {
            logger.info(`🚀 Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
        });

        // Handle unhandled promise rejections
        process.on("unhandledRejection", async (err: any) => {
            logger.error("💥 Unhandled Rejection! Shutting down...");
            logger.error(err?.stack || err);

            server.close(() => process.exit(1));
        });

        // Graceful shutdown on SIGTERM / SIGINT
        const shutdown = async () => {
            logger.info("👋 SIGTERM/SIGINT received. Shutting down gracefully...");
            server.close(() => logger.info("💤 Server and Kafka consumer stopped"));
        };

        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);

    } catch (err: any) {
        logger.error("❌ Failed to start server:", err?.stack || err.message);
        process.exit(1);
    }
};

startServer();
