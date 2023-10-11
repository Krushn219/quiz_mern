const mongoose = require("mongoose");
const Question = require("../models/Question")
const createError = require("../utils/error");
const ApiFeatures = require("../utils/apifeature");
const ObjectId = mongoose.Types.ObjectId;

// Create
// module.exports.create = async (req, res, next) => {
//     const { question, options, answer, category } = req.body

//     console.log("data+++", req.body)
//     return;


//     if (!question || !options || !answer || !category) {
//         return res.status(404).json({
//             success: false,
//             msg: "All Fields Required"
//         })
//     }
//     try {
//         const question = await Question.create(req.body)

//         if (!question) {
//             return res.status(400).json({
//                 success: false,
//                 msg: "Can not create Question..."
//             })
//         }

//         return res.status(201).json({
//             success: false,
//             msg: "Question Created Successfully...",
//             question
//         })

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             msg: error
//         })
//     }
// }

module.exports.create = async (req, res, next) => {
    const { question, options, answer, subcategory } = req.body;

    if (!question || !options || !answer || !subcategory) {
        return res.status(404).json({
            success: false,
            msg: "All Fields Required"
        });
    }

    // Map the answer identifier to its text value
    const selectedOptionIndex = parseInt(answer.replace("option", "")) - 1;
    const selectedOptionText = options[selectedOptionIndex];

    try {
        const newQuestion = await Question.create({
            question,
            options,
            answer: selectedOptionText, // Store the selected option text
            subcategory,
        });

        if (!newQuestion) {
            return res.status(400).json({
                success: false,
                msg: "Can not create Question..."
            });
        }

        return res.status(201).json({
            success: true,
            msg: "Question Created Successfully...",
            question: newQuestion
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};

// Update
module.exports.updateQuestion = async (req, res, next) => {
    const questionId = req.params.id;
    const updatedQuestionData = req.body;

    try {
        const updatedQuestion = await Question.findByIdAndUpdate(
            questionId,
            { $set: updatedQuestionData },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({
                success: false,
                msg: 'Question not found.',
            });
        }

        return res.status(200).json({
            success: true,
            msg: 'Question updated successfully.',
            question: updatedQuestion,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};

// Single Question Record
module.exports.getSingleQuestion = async (req, res, next) => {
    const id = req.params.id;

    try {
        const question = await Question.findById(id).populate({
            path: 'subcategory',
            select: 'SubCategory subCategory_name'
        })

        if (!question) {
            return res.status(404).json({
                success: false,
                msg: "Question Not Found!!"
            })
        }

        return res.status(200).json({
            success: true,
            question
        })
    } catch (error) {
        next(error)
        // return res.status(500).json({
        //     success: false,
        //     msg: error
        // })
    }

}

// Get All Questions
module.exports.getAllQuestions = async (req, res) => {
    try {
        const allQuestions = await Question.find().populate({
            path: 'subcategory',
            select: 'subCategory_name category'
        })
        const count = await Question.countDocuments();

        if (allQuestions.length === 0) {
            return res.send({
                subCategories: []
            })
        }

        // Shuffle the questions array randomly
        const shuffledQuestions = shuffleArray(allQuestions);

        // Return the first 10 questions
        const questions = shuffledQuestions.slice(0, 10);


        return res.status(200).json({
            success: true,
            count: count,
            questions
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}

// / Fisher-Yates shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Delete Single Record
module.exports.deleteQuestion = async (req, res) => {
    const id = req.params.id;

    try {
        const question = await Question.findById(id).populate({
            path: 'category',
            select: 'category'
        })

        if (!question) {
            return res.status(404).json({
                success: false,
                msg: "Question Not Found!!"
            })
        }

        const deleteQuestion = await Question.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            msg: "Question Deleted Successfully..."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}

// Questions by category
module.exports.questionsByCategory = async (req, res) => {

    const categoryId = req.params.categoryId;

    try {

        const allQuestions = await Question.find({ category: categoryId })
        const count = await Question.countDocuments();


        if (allQuestions.length == 0) {
            return res.status(404).json({
                success: false,
                msg: "Data Not Found!!"
            })
        }

        // Shuffle the questions array randomly
        const shuffledQuestions = shuffleArray(allQuestions);

        // Return the first 10 questions
        const questions = shuffledQuestions.slice(0, 10);


        return res.status(200).json({
            success: true,
            Totalcount: count,
            filteredQuestions: allQuestions.length,
            questions
        })


    } catch (error) {
        console.log("error++", error)
        return res.status(500).json({
            success: false,
            msg: error
        })
    }

}

// Questions by category
module.exports.questionsBySubCategory = async (req, res) => {

    const subcategoryId = req.params.subcategoryId;

    try {

        const allQuestions = await Question.find({ subcategory: subcategoryId })
        const count = await Question.countDocuments();


        if (allQuestions.length == 0) {
            return res.status(404).json({
                success: false,
                msg: "Data Not Found!!"
            })
        }

        // Shuffle the questions array randomly
        const shuffledQuestions = shuffleArray(allQuestions);

        // Return the first 10 questions
        const questions = shuffledQuestions.slice(0, 10);


        return res.status(200).json({
            success: true,
            Totalcount: count,
            filteredQuestions: allQuestions.length,
            questions
        })


    } catch (error) {
        console.log("error++", error)
        return res.status(500).json({
            success: false,
            msg: error
        })
    }

}

// All Questions without suffel
module.exports.getallQuestions = async (req, res) => {
    try {
        const count = await Question.countDocuments();

        // Pagination
        const resultPerPage = Number(req.query.limit);
        const sort = {createdAt:-1};


        if (req.query.sortBy && req.query.Question) {
            sort[req.query.sortBy] = req.query.Question === 'desc' ? -1 : 1
        }
        else {
            sort['createdAt'] = -1; 
        }

        const apiFeature = new ApiFeatures(Question.find().populate({
            path: 'subcategory',
            select: 'subCategory_name category'
        }).sort(sort), req.query)
            .filter()
            .search()
            .pagination(resultPerPage);
        let questions = await apiFeature.query;
        let filteredQuestionCount = questions.length;

        // Calculate total pages
        const totalPages = Math.ceil(count / resultPerPage);
        return res.status(200).json({
            success: true,
            count: count,
            filteredQuestion: filteredQuestionCount,
            page: req.query.page,
            limit: resultPerPage,
            totalPages,
            questions
        })
    } catch (error) {
        console.log("Err0r+++", error)
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}