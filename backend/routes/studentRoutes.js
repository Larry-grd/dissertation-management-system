// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// 获取所有学生（管理员）
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find().populate('teacher', 'name email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加学生（管理员）
router.post('/', auth, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 分配教师给学生（管理员）
router.put('/assign-teacher/:id', auth, async (req, res) => {
  try {
    const { teacherId } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { teacher: teacherId },
      { new: true }
    ).populate('teacher', 'name email');
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取教师的学生列表（教师）
router.get('/teacher/:teacherId', auth, async (req, res) => {
  try {
    const students = await Student.find({ teacher: req.params.teacherId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新学生成绩（教师）
router.put('/grades/:id', auth, async (req, res) => {
  try {
    const { progressGrade, finalGrade } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        'progressReport.grade': progressGrade,
        'finalReport.grade': finalGrade,
        'progressReport.submitted': true,
        'finalReport.submitted': true
      },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;