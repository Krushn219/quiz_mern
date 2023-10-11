const express = require("express")

const router = express.Router()

const upload = require("../utils/multer")

// const hotelController = require("../controllers/hotelController")
const { create } = require("../controllers/userController")

// Create User
router.post("/create", create)


module.exports = router