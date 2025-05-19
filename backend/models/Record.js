const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  clientname: {
    type: String,
    required: true
  },
  lettername: {
    type: String,
    required: true
  },
  letterprice: {
    type: Number,
    required: true
  },
  staffname: {
    type: String,
    required: true
  },
  kagawadname: {
    type: String,
    required: true
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true,
    default: '000000000000000000000000'
  },
  type: {
    type: String,
    required: true,
    enum: ['certificate', 'clearance', 'permit', 'other'],
    default: 'certificate'
  },
  purpose: {
    type: String,
    required: true,
    default: 'Document Request'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
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
recordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.Record) {
  delete mongoose.models.Record;
}

module.exports = mongoose.model('Record', recordSchema); 