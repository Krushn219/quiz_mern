const mongoose = require("mongoose")

const subCategorySchema = mongoose.Schema({
    subCategory_name: {
        type: String,
        trim:true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true,
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

const Subcategory = mongoose.model("SubCategory", subCategorySchema)
module.exports = Subcategory