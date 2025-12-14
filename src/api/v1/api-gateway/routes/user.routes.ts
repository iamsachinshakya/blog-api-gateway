import { Router } from "express";
import { proxy } from "../utils/proxy";
import { env } from "../../../../app/config/env";

const userRouter = Router();

userRouter.use(
    "/",
    proxy(env.USER_SERVICE_BASE_URL, "/api/v1/users")
);

export default userRouter;
