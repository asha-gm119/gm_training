const mongoose = require('mongoose');
const validator = require('validator');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email format']
  },
  department: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
