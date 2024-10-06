import express from "express";
import {
  create,
  createForm,
  deleteQuiz,
  fetch,
  getUpdateForm,
  update,
  getQuizById,
  createQuizQuestion,
  createQuizQuestions,
} from "../controller/quizController.js";

const route = express.Router();

route.get("/", fetch);
route.get("/:id/populate", getQuizById);

route.get("/create", createForm);
route.post("/create", create);

route.post("/:id/question", createQuizQuestion);
route.post("/:id/questions", createQuizQuestions);

route.get("/:id/update", getUpdateForm);
route.post("/:id/update", update);

route.post("/:id/delete", deleteQuiz);
route.delete("/delete", deleteQuiz);

export default route;
