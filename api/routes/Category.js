const express = require("express")

const router = express.Router()

const upload = require("../utils/multer")

// const hotelController = require("../controllers/hotelController")
const { create, getSingleCategory, getAllCategory, updateCategory, deleteCategory,getallCategory } = require("../controllers/categoryController")

// Create Category
router.post("/create",upload.single("image"), create)

// Get Single Category
router.get("/single/:id", getSingleCategory)

// Get All Categorys
router.get("/", getAllCategory)
router.get("/all", getallCategory) // For Admin Panel

// Update Data
router.put("/:id",upload.single("image"), updateCategory)

// Delete Data
router.delete("/:id", deleteCategory)


module.exports = router