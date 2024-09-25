import Quiz from "../model/quizModel.js";
import Question from "../model/questionModel.js";

// For posting data into database
export const create = async (req, res) => {
  try {
    const quizData = new Quiz(req.body);
    const { title } = quizData;
    const quizExist = await Quiz.findOne({ title });
    if (quizExist) {
      return res.status(400).json({ message: "Quiz already exist." });
    }
    const savedQuiz = await quizData.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error. " });
  }
};

// For getting all users from database
export const fetch = async (req, res) => {
  try {
    const quiz = await Quiz.find();
    if (quiz.length === 0) {
      return res.status(404).json({ message: "Quiz not Found." });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error. " });
  }
};
// For getting a question from database

export const getQuizById = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const quizExist = await Quiz.findById(id).populate("questions");
    if (!quizExist) {
      return res.status(404).json({ message: "Quiz not Found." });
    }
    return res.status(200).json(quizExist);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error. " });
  }
};

// export const getAQuestion = async (req, res)=>{
//     try {
//         const text = req.params.text || req.query.text;
//         // console.log(id);
//         const questionExist = await Question.findOne({text:text})
//         if(questionExist.length === 0){
//             return res.status(404).json({message : "Question not Found."})
//         }
//         return res.status(200).json(questionExist);
//     } catch (error) {
//         res.status(500).json({error : " Internal Server Error. "})
//     }
// }
// For updating data

export const update = async (req, res) => {
  try {
    // console.log('Updating  Question    ');
    const id = req.params.id;
    const quizExist = await Quiz.findOne({ _id: id });
    if (!quizExist) {
      return res.status(404).json({ message: "Quiz not found." });
    }
    // console.log(req.body);
    const updateQuiz = await Quiz.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(201).json(updateQuiz);
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error. " });
  }
};
// For deleting data from database
export const deleteQuiz = async (req, res) => {
  try {
    const id = req.params.id || req.query.id;
    console.log(id);
    const quizExist = await Quiz.findOne({ _id: id });
    if (!quizExist) {
      return res.status(404).json({ message: " Quiz Not Found. " });
    }
    await Quiz.findByIdAndDelete(id);
    res.status(201).json({ message: " Quiz deleted Successfully." });
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error. " });
  }
};

// For updating a Quiz

export const createQuizQuestion = async (req, res) => {
  try {
    const idQuiz = req.params.id;
    const quizExist = await Quiz.findOne({ _id: idQuiz });

    if (!quizExist) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    const questionData = new Question(req.body);
    const { text } = questionData;
    const questionExist = await Question.findOne({ text });

    if (questionExist) {
      return res.status(400).json({ message: "Question already exist." });
    }
    const savedQuestion = await questionData.save();
    quizExist.questions.push(savedQuestion._id);
    await quizExist.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error. " });
  }
};
export const createQuizQuestions = async (req, res) => {
    try {
      console.log("Creating multiple questions");
      const idQuiz = req.params.id;
      const quizExist = await Quiz.findOne({ _id: idQuiz });
      
      if (!quizExist) {
        return res.status(404).json({ message: "Quiz not found." });
      }
      
      const questionsData = req.body;
      const existingQuestions = await Question.find({
        text: { $in: questionsData.map((question) => question.text) },
      });
      
      // Lấy danh sách các câu hỏi đã tồn tại
      const existingQuestionTexts = existingQuestions.map(q => q.text);
      const duplicateQuestions = questionsData.filter(q => existingQuestionTexts.includes(q.text));
      
      if (duplicateQuestions.length > 0) {
        return res.status(400).json({
          message: "Questions already exist.",
          duplicates: duplicateQuestions
        });
      }
      
      const savedQuestions = await Question.create(questionsData);
      quizExist.questions.push(...savedQuestions.map((question) => question._id));
      await quizExist.save();
      
      res.status(201).json({ message: "Questions added successfully." });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  };