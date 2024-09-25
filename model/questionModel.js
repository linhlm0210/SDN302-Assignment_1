import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  keywords: {
    type: String,
    required: false,
  },
  correctAnswerIndex: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema, "Question");
export default Question;
