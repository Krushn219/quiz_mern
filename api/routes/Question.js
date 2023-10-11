const express = require("express")

const router = express.Router()

// const hotelController = require("../controllers/hotelController")
const { create, getSingleQuestion, getAllQuestions, updateQuestion, deleteQuestion, questionsByCategory, questionsBySubCategory, getallQuestions } = require("../controllers/questionController")

// Create Question
router.post("/create", create)

// Get Single Question
router.get("/single/:id", getSingleQuestion)

// Get All Questions
router.get("/all", getAllQuestions)
router.get("/", getallQuestions)

// Update Data
router.put("/:id", updateQuestion)

// Delete Data
router.delete("/:id", deleteQuestion)

//Questions by Category
router.get("/category/:categoryId", questionsByCategory)

//Questions by SubCategory
router.get("/subcategory/:subcategoryId", questionsBySubCategory)


module.exports = router