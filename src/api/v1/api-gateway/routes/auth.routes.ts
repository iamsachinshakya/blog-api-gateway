import { Router } from "express";
import { proxy } from "../utils/proxy";
import { env } from "../../../../app/config/env";

const authRouter = Router();

authRouter.use(
    "/",
    proxy(env.AUTH_SERVICE_BASE_URL, "/api/v1/auth")
);

export default authRouter;

