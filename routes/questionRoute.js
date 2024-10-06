import express from "express";
import { create, deleteQuestion, fetch, update, getQuestionById, createQuestion, updateQuestion, renderUpdateQuestion } from "../controller/questionController.js";

const route = express.Router();

route.get("/", fetch);
route.get("/geta/:id", getQuestionById);
route.get("/:id/update", renderUpdateQuestion);
route.post("/:id/update", updateQuestion);
route.post("/:id/delete", deleteQuestion);
route.delete("/delete", deleteQuestion);
route.get("/create", createQuestion);
route.post("/create", create);

export default route;