const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
    documentType: { type: String, required: true },
    purpose: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    dateIssued: { type: Date, default: Date.now },
    remarks: { type: String },
    createdBy: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema); 