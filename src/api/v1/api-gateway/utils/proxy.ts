// utils/proxy.ts
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import type { Request, Response } from "express";
import { ApiError } from "../../common/utils/apiError";
import { ErrorCode } from "../../common/constants/errorCodes";

export const proxy = (target: string, basePath: string) =>
    createProxyMiddleware<Request, Response>({
        target,
        changeOrigin: true,

        // ⏱️ Timeouts
        timeout: 120_000,       // client -> gateway (120s)
        proxyTimeout: 120_000,  // gateway -> service (120s)

        // Rewrite path for downstream service
        pathRewrite: (path, req) => {
            const rewrittenPath = `${basePath}${path}`;

            console.info(
                `[API-GATEWAY] ${req.method} ${req.originalUrl} -> ${target}${rewrittenPath}`
            );

            return rewrittenPath;
        },

        on: {
            error(err, req: any, res: any) {
                console.error("[API-GATEWAY PROXY ERROR]", err.message);

                // Check if response headers were already sent
                if (res.headersSent) {
                    console.error("[API-GATEWAY] Headers already sent, cannot send error response");
                    return;
                }

                const apiError = new ApiError(
                    "Downstream service unavailable",
                    502,
                    ErrorCode.DOWNSTREAM_SERVICE_UNAVAILABLE,
                    {
                        target,
                        path: req.originalUrl,
                        reason: err.message,
                    }
                );

                // Use the correct status code from apiError
                res.status(apiError.statusCode).json({
                    message: apiError.message,
                });
            },

            proxyReq: fixRequestBody,  // Fix body streaming issue
        },
    });
