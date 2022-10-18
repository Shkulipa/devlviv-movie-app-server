import { Router } from "express";
import MovieController from './../controllers/movie.controller';
import validation from "../middlewares/validation.middleware";

const movieRouter = Router();

movieRouter.get("/", MovieController.getMovies);

export default movieRouter;
