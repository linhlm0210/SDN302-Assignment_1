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
  searchQuestions
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

route.get("/questions/search", searchQuestions); // Add this line

export default route;