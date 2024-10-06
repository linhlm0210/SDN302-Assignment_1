import Question from "../model/questionModel.js"
// For posting data into database 
export const create = async(req, res)=>{
    try {
        const questionData = new Question( req.body);
        const {text} = questionData;
        const questionExist = await Question.findOne({text})
        if (questionExist){
            return res.status(400).json({message : "Question already exist."})
        }
        const savedQuestion = await questionData.save();
        // res.status(200).json(savedQuestion)
        res.status(201)
    .redirect('/questions');
    } catch (error) {
        res.status(500).json({error : "Internal Server Error. "})
    }
}

export const createQuestion = async (req, res) => {
    try {
      console.log("get create form questions");
      res.render("questions/createQuestion");
    } catch (error) {
      console.log("Internal Server Error. ");
      res.status(500).json({ error: "Internal Server Error. " });
    }
  }

// For getting all users from database 
export const fetch = async (req, res)=>{
    try {
        const question = await Question.find().lean();
        if(question.length === 0 ){
            return res.status(404).json({message : "Question not Found."})
        }
        // res.status(200).json(question);
        // console.log(question[0].options[question[0].correctAnswerIndex]);
        question.forEach(item => {
            item.correctAnswer = item.options[item.correctAnswerIndex];
        });
        res.render("questions/listQuestions", {
            question: question
        });
    } catch (error) {
        res.status(500).json({error : " Internal Server Error. "})
        
    }
}
// For getting a question from database 

export const getQuestionById = async (req, res)=>{
    try {
        const id = req.params.id;
        // console.log(id);
        const questionExist = await Question.findById(id)
        if(!questionExist){
            return res.status(404).json({message : "Question not Found."})
        }
        return res.status(200).json(questionExist);
    } catch (error) {
        res.status(500).json({error : "Internal Server Error. "})
    }
}


// For updating data 
// export const update = async (req, res)=>{
//     try {
//         const id = req.params.id;
//         const questionExist = await Question.findOne({_id:id}).lean();
//         if (!questionExist){
//             return res.status(404).json({message : "Question not found."})
//         }
//         const updateQuestion = await Question.findByIdAndUpdate(id, req.body, {new : true});
//         res.status(201).json(updateQuestion);
//     } catch (error) {
//         res.status(500).json({error : " Internal Server Error. "})
//     }
// }

export const update = async (req, res) => {
    try {
      const id = req.params.id;
      const questionExist = await Question.findOne({ _id: id }).lean();
  
      // Kiểm tra xem câu hỏi có tồn tại không
      if (!questionExist) {
        return res.status(404).json({ message: "Question not found." });
      }
      const updateData = {
        text: req.body.text,
        options: req.body.options,
        correctAnswerIndex: req.body.correctAnswerIndex,
        keywords: req.body.keywords,
      };
  
      // Cập nhật câu hỏi trong cơ sở dữ liệu
      const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, { new: true });
  
      // Nếu thành công, trả về JSON hoặc chuyển hướng về trang khác
      res.status(201)
    //   .json(updatedQuestion)
      .redirect('/questions');
      
  
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  };
  

  export const renderUpdateQuestion = async (req, res) => {
    try {
      const id = req.params.id;
      const questionExist = await Question.findById(id).lean();
      if (!questionExist) {
        return res.status(404).json({ message: "Question not found." });
      }
      res.render('questions/updateQuestion', { question: questionExist });
    } catch (error) {
      console.error("Error fetching question:", error);
      res.status(500).json({ error: "Internal Server Error." });
    }
  };


  // Render trang update question với dữ liệu hiện tại của câu hỏi
  export const getUpdateQuestion = async (req, res) => {
      try {
          const id = req.params.id; // Lấy id của câu hỏi từ URL
          const questionExist = await Question.findById(id).lean(); // Tìm câu hỏi dựa vào id và chuyển thành plain object
          if (!questionExist) {
              return res.status(404).json({ message: "Question not found." });
          }
          // Render trang updateQuestion.hbs với dữ liệu câu hỏi
          res.render('updateQuestion', { question: questionExist });
      } catch (error) {
          console.error("Error fetching question:", error);
          res.status(500).json({ error: "Internal Server Error." });
      }
  };
  
  // Xử lý yêu cầu cập nhật question khi form được submit
  export const updateQuestion = async (req, res) => {
      try {
          const id = req.params.id; // Lấy id của câu hỏi từ URL
          const { text, options, correctAnswerIndex, keywords } = req.body; // Lấy dữ liệu từ form
  
          // Kiểm tra nếu câu hỏi tồn tại
          const questionExist = await Question.findById(id);
          if (!questionExist) {
              return res.status(404).json({ message: "Question not found." });
          }
  
          // Cập nhật thông tin câu hỏi
          questionExist.text = text;
          questionExist.options = options;
          questionExist.correctAnswerIndex = correctAnswerIndex;
          questionExist.keywords = keywords;
  
          // Lưu lại các thay đổi
          await questionExist.save();
  
          // Chuyển hướng người dùng sau khi cập nhật thành công
          res.redirect('/questions'); // Hoặc điều hướng tới trang khác tùy theo yêu cầu của bạn
      } catch (error) {
          console.error("Error updating question:", error);
          res.status(500).json({ error: "Internal Server Error." });
      }
  };
  

// For deleting data from database 
export const deleteQuestion = async (req, res)=>{
    try {
        const id = req.params.id || req.query.id;
        console.log(id);
        const questionExist = await Question.findOne({_id:id})
        if(!questionExist){
            return res.status(404).json({message : " Question Not Found. "})
        }
        await Question.findByIdAndDelete(id);
        // res.status(201).json({message : " Question deleted Successfully."})
        res.redirect('/questions');
    } catch (error) {
        res.status(500).json({error : " Internal Server Error. "})
    }
}
