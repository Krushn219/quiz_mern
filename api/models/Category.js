const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    quizname: {
        type: String,
        trim:true
    },
    category: {
        type: String,
        required: true,
        trim:true,
        unique:true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Category = mongoose.model("Category", categorySchema)
module.exports = Category