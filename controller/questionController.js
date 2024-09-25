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
        res.status(200).json(savedQuestion)
    } catch (error) {
        res.status(500).json({error : "Internal Server Error. "})
    }
}

// For getting all users from database 
export const fetch = async (req, res)=>{
    try {
        const question = await Question.find();
        if(question.length === 0 ){
            return res.status(404).json({message : "Question not Found."})
        }
        res.status(200).json(question);
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
export const update = async (req, res)=>{
    try {
        const id = req.params.id;
        const questionExist = await Question.findOne({_id:id})
        if (!questionExist){
            return res.status(404).json({message : "Question not found."})
        }
        const updateQuestion = await User.findByIdAndUpdate(id, req.body, {new : true});
        res.status(201).json(updateQuestion);
    } catch (error) {
        res.status(500).json({error : " Internal Server Error. "})
    }
}
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
        res.status(201).json({message : " Question deleted Successfully."})
    } catch (error) {
        res.status(500).json({error : " Internal Server Error. "})
    }
}

// export const test = async () => {
//     try{
//         const users = [
//             { name: 'John Doe', email: 'john.doe@example.com', address: '123 Main St' },
//             { name: 'Jane Smith', email: 'jane.smith@example.com', address: '456 Elm St' },
//             { name: 'Alice Johnson', email: 'alice.johnson@example.com', address: '789 Maple Ave' }
//           ];

//         await JUser.insertMany(users);
//     }catch (error){
//         console.log(error);
//     }
// }