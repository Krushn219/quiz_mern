const express = require("express")
require("dotenv").config();
const port = process.env.PORT || 8080
const app = express()
const db = require("./config/db")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const morgan = require("morgan");
const cors = require("cors")

// Routes
const categoryRoute = require("./routes/Category")
const questionRoute = require("./routes/Question");
const sunCategoryRoute = require("./routes/SubCategory");
const userRoute = require("./routes/User");
const authRoute = require("./routes/Auth");

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan("tiny"))
// app.use(cors({origin:[]}))
app.use(cors())

// Serve images from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// app.post('/upload', upload.single('profile'), (req, res) => {
//     res.json({
//         success: 1,
//         profile_url :`http://localhost:4000/profile/${req.file.filename}`
//     })
//     console.log(req.file);
// })

// app.use('/profile', express.static('upload/images'))

// Routes
app.use("/api/v1/category",categoryRoute)
app.use("/api/v1/question",questionRoute)
app.use("/api/v1/subcategory",sunCategoryRoute)
app.use("/api/v1/user",userRoute)
app.use("/api/v1/auth",authRoute)

// Commen middleware
app.use((err,req,res,next)=>{
    const errorStatus = err.errorStatus || 500
    const errorMessage = err.errorMessage || "Something Went Wrong!!"
    return res.status(errorStatus).json({
        success:false,
        status: errorStatus,
        message : errorMessage,
        stack:err.stack
    })
})

app.listen(port,(err)=>{
    if(err){
        console.log("Something went wrong!!")
    }
    console.log("Server is running on PORT::",port)

})