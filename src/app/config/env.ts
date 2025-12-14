import { z } from "zod";
import { Environment, LogLevel } from "./constants";


// ------------------------
// Environment schema
// ------------------------
const envSchema = z.object({
    // Server
    NODE_ENV: z.enum([Environment.DEVELOPMENT, Environment.PRODUCTION, Environment.TEST]).default(Environment.DEVELOPMENT),
    PORT: z.string().regex(/^\d+$/, "PORT must be a number").default("5000"),
    CORS_ORIGIN: z.string(),

    // Logging
    LOG_LEVEL: z.enum([LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]).default(LogLevel.DEBUG),

    // API Gateway identity
    SERVICE_NAME: z.string().default("api-gateway"),

    // Redis (optional, for caching / rate-limiting)
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.string().default("6380"),
    REDIS_PASSWORD: z.string().optional().nullable(),
    REDIS_URL: z.string().default("redis://localhost:6380"),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.string().regex(/^\d+$/, "RATE_LIMIT_WINDOW_MS must be a number").default("60000"),
    RATE_LIMIT_MAX_REQUESTS: z.string().regex(/^\d+$/, "RATE_LIMIT_MAX_REQUESTS must be a number").default("100"),

    // Downstream Services
    AUTH_SERVICE_BASE_URL: z.string(),
    USER_SERVICE_BASE_URL: z.string(),
    POST_SERVICE_BASE_URL: z.string(),
    COMMENT_SERVICE_BASE_URL: z.string(),
});

// ------------------------
// Parse & validate
// ------------------------
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Invalid environment configuration:");
    console.error(parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;

// ------------------------
// Environment helpers
// ------------------------
export const isProduction = env.NODE_ENV === Environment.PRODUCTION;
export const isDevelopment = env.NODE_ENV === Environment.DEVELOPMENT;
export const isTest = env.NODE_ENV === Environment.TEST;

// ------------------------
// Startup log
// ------------------------
console.info(
    `🌍 Environment initialized: ${env.NODE_ENV} | Port: ${env.PORT} | Log level: ${env.LOG_LEVEL}`
);
