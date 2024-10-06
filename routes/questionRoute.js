import express from "express"
import { create, deleteQuestion, fetch, update , getQuestionById, createQuestion, updateQuestion, updateQuestion1} from "../controller/questionController.js";

const route = express.Router();

route.get("/", fetch)
route.get("/geta/:id", getQuestionById)
route.get("/:id/update", updateQuestion)
route.post("/:id/update", updateQuestion1)
route.post("/:id/delete",deleteQuestion)
route.delete("/delete",deleteQuestion)
route.get("/create", createQuestion);
route.post("/create", create);
export default route;