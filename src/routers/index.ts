import { Router } from "express";

import authRouter from "./auth.router";
import movieRouter from "./movie.router";
import tokenRouter from "./token.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/movie", movieRouter);
router.use("/refresh-token", tokenRouter);

export default router;
