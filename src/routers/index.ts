import { Router } from "express";

import authRouter from "./auth.router";
import movieRouter from "./movie.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/movie", movieRouter);

export default router;
