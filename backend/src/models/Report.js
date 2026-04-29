const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  type: { 
    type: String, 
    enum: ['progress', 'final'], 
    required: true 
  },
  title: { type: String, required: true },
  submittedAt: { type: Date },
  fileUrl: { type: String },
  grade: { type: Number, min: 0, max: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);