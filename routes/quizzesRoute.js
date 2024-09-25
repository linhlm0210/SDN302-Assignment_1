import express from "express"
import { create, deleteQuiz, fetch, update , getQuizById, createQuizQuestion, createQuizQuestions} from "../controller/quizController.js";

const route = express.Router();

route.get("/get", fetch)
route.get("/:id/populate", getQuizById)
route.post ("/",create)
route.post("/:id/question", createQuizQuestion)
route.post("/:id/questions", createQuizQuestions)

route.put("/update/:id", update)
route.delete("/:id",deleteQuiz)
route.delete("/delete",deleteQuiz)

export default route;