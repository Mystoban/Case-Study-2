const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  residentId: {
    type: Number,
    required: true,
    unique: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  middlename: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  suffix: {
    type: String,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  birthplace: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  civilstatus: {
    type: String,
    required: true,
    enum: ['Single', 'Married', 'Widowed', 'Separated']
  },
  address: {
    type: String,
    required: true
  },
  parentsname: {
    type: String,
    required: true
  },
  siblingsname: {
    type: String
  },
  citizenship: {
    type: String,
    required: true
  },
  occupation: {
    type: String
  },
  PWD: {
    type: Boolean,
    default: false
  },
  fourpsmember: {
    type: Boolean,
    default: false
  },
  registervoter: {
    type: Boolean,
    default: false
  },
  occupancystatus: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
residentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resident', residentSchema); 