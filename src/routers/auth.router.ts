import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import validation from "../middlewares/validation.middleware";
import signup from "../schemas/signup.schema";
import signin from "../schemas/signin.schema";

const authRouter = Router();

authRouter.post("/signup", validation(signup), AuthController.signup);
authRouter.post("/signin", validation(signin), AuthController.signin);
authRouter.post("/logout", AuthController.logout);

export default authRouter;