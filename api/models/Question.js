const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim:true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
        return value.length === 4;
      },
      message: 'There should be exactly 4 options.',
    },
  },
  answer: {
    type: String,
    required: true,
  },
  // category: {
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'Category', 
  //   required: true,
  // },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SubCategory', 
    required: true,
  },
},{timestamps:true});

const Question = mongoose.model('question', questionSchema);

module.exports = Question;
