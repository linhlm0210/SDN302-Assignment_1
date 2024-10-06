import Quiz from "../model/quizModel.js";
import Question from "../model/questionModel.js";


// For updating a specific question in a Quiz
export const updateAQuestionInQuiz = async (req, res) => {
  try {
    const idQuiz = req.params.id; // ID của quiz
    const idQuestion = req.params.questionId; // ID của câu hỏi

    // Tìm quiz theo ID
    const quizExist = await Quiz.findById(idQuiz).populate('questions');
    if (!quizExist) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    // Tìm câu hỏi theo ID
    const questionExist = await Question.findById(idQuestion);
    if (!questionExist) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Cập nhật các thuộc tính của câu hỏi
    questionExist.text = req.body.text || questionExist.text;
    questionExist.options = req.body.options || questionExist.options;
    questionExist.keywords = req.body.keywords || questionExist.keywords;
    questionExist.correctAnswerIndex = req.body.correctAnswerIndex !== undefined ? req.body.correctAnswerIndex : questionExist.correctAnswerIndex;

    // Lưu câu hỏi đã cập nhật
    await questionExist.save();

    res.status(200).json({ message: "Question updated successfully.", question: questionExist });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

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
    res.status(201)
    // .json(savedQuiz)
    .redirect('/quizzes');
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error. " });
  }
};

// get create form

export const createForm = async (req, res) => {
  try {
    console.log("get create form");
    res.render("quizzes/createQuiz");
  } catch (error) {
    console.log("Internal Server Error. ");
    res.status(500).json({ error: "Internal Server Error. " });
  }
}

// For getting all users from database
export const fetch = async (req, res) => {
  try {
    const quiz = await Quiz.find().lean();
    if (quiz.length === 0) {
      return res.status(404).json({ message: "Quiz not Found." });
    }
    // res.status(200).json(quiz);
    res.render("quizzes/listQuizzes", {
      quiz: quiz
  });
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error. " });
  }
};
// For getting a question from database

export const getQuizById = async (req, res) => {
  try {
    const id = req.params.id;
    const quizExist = await Quiz.findById(id).populate("questions").lean();;
    if (!quizExist) {
      return res.status(404).json({ message: "Quiz not Found." });
    }
    // return res.status(200).json(quizExist);
    res.render("quizzes/viewQuiz", {
      quiz: quizExist
  });
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
    const id = req.params.id;
    const quizExist = await Quiz.findById(id);
    if (!quizExist) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    // Update quiz fields
    quizExist.title = req.body.title || quizExist.title;
    quizExist.description = req.body.description || quizExist.description;

    // Update questions
    if (req.body.questions) {
      quizExist.questions = req.body.questions;
    }

    // Save the updated quiz
    const updatedQuiz = await quizExist.save();
    return res.status(201).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getUpdateForm = async (req, res) => {
  try {
    const id = req.params.id;
    const quiz = await Quiz.findById(id).populate('questions').lean();
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }
    res.render("quizzes/updateQuiz", { quiz, id }); // Pass the quiz data to the update form
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
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
    // res.status(201).json({ message: " Quiz deleted Successfully." });
    res.redirect('/quizzes');
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
    // res.status(201).json(savedQuestion);
    res.status(201)
    // .json(savedQuiz)
    .redirect('/quizzes/' + idQuiz + '/populate' );
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

  export const searchQuestions = async (req, res) => {
    try {
      const query = req.query.query;
      const questions = await Question.find({ text: new RegExp(query, 'i') }).lean();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  };