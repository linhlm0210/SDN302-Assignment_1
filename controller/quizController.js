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
    res.status(201)
    // .json(savedQuiz)
    .redirect('get');
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
    // console.log(id);
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

// export const update = async (req, res) => {
//   try {
//     // console.log('Updating  Question    ');
//     const id = req.params.id;
//     const quizExist = await Quiz.findOne({ _id: id });
//     if (!quizExist) {
//       return res.status(404).json({ message: "Quiz not found." });
//     }
//     // console.log(req.body);
//     const updateQuiz = await Quiz.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     return res.status(201).json(updateQuiz);
//   } catch (error) {
//     res.status(500).json({ error: " Internal Server Error. " });
//   }
// };

export const getUpdateForm = async (req, res) => {
  try {
    const id = req.params.id;
    const quiz = await Quiz.findById(id).lean();
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }
    res.render("quizzes/updateQuiz", { quiz, id }); // Pass the quiz data to the update form
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const quizExist = await Quiz.findById(id).populate("questions").lean();
    if (!quizExist) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    // Update quiz details
    quizExist.title = req.body.title;
    quizExist.description = req.body.description;

    // Check for questions update
    if (req.body.questions) {
      quizExist.questions = await Promise.all(req.body.questions.map((question) => {
        return {
          text: question.text,
          options: question.options || [], // Đảm bảo options là mảng
          keywords: question.keywords,
          correctAnswerIndex: question.correctAnswerIndex
        };
      }));
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, {
      title: quizExist.title,
      description: quizExist.description,
      questions: quizExist.questions
    }, { new: true });

    res.redirect('/quizzes/get'); // Redirect after successful update
  } catch (error) {
    console.error(error); // Log error for debugging
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
    res.redirect('/quizzes/get');
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