const express = require("express")

const router = express.Router()

const upload = require("../utils/multer")

// const hotelController = require("../controllers/hotelController")
const { logIn, logOut} = require("../controllers/authController")

// LogIn Route
router.post("/login", logIn)


// LogIn Route
// router.post("/logout", logOut)

module.exports = router