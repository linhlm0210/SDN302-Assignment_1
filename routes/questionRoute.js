import express from "express"
import { create, deleteQuestion, fetch, update , getQuestionById} from "../controller/questionController.js";

const route = express.Router();

route.get("/get", fetch)
route.get("/geta/:id", getQuestionById)
route.post ("/",create)
route.put("/update/:id", update)
route.delete("/delete/:id",deleteQuestion)
route.delete("/delete",deleteQuestion)

export default route;