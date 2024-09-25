import mongoose from "mongoose";
import Question from "./questionModel.js";

const quizSchema = new mongoose.Schema({
    title : {
        type : String, 
        required : true,
    }, 
    description : { 
        type : String, 
        required : true,
    },
    questions : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
})

const Quiz = mongoose.model("Quiz",quizSchema, "Quiz");

export default Quiz;