// backend/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, unique: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  progressReport: {
    submitted: { type: Boolean, default: false },
    grade: { type: Number, min: 0, max: 100 }
  },
  finalReport: {
    submitted: { type: Boolean, default: false },
    grade: { type: Number, min: 0, max: 100 }
  },
  status: { type: String, enum: ['pending', 'progress', 'final', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);