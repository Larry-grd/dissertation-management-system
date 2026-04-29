const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// 获取所有学生
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('assignedTeacher');
    res.json(students);
    console.log(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 添加学生
exports.addStudent = async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    const student = new Student({ studentId, name, email });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 分配教师给学生
exports.assignTeacher = async (req, res) => {
  try {
    const { studentId, teacherId } = req.body;
    const student = await Student.findOne({ studentId });
    const teacher = await Teacher.findOne({ teacherId });
    
    if (!student || !teacher) {
      return res.status(404).json({ message: 'Student or Teacher not found' });
    }
    
    student.assignedTeacher = teacher._id;
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 获取教师的学生列表
exports.getTeacherStudents = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    // 找到教师并获取其ObjectId
    const teacher = await Teacher.findOne({ teacherId });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    const students = await Student.find({ assignedTeacher: teacher._id }).populate('assignedTeacher');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新学生成绩
exports.updateStudentGrade = async (req, res) => {
  try {
    const { studentId, reportType, grade } = req.body;
    const student = await Student.findOne({ studentId });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    if (reportType === 'progress') {
      student.progressReport.grade = grade;
      student.progressReport.submitted = true;
    } else if (reportType === 'final') {
      student.finalReport.grade = grade;
      student.finalReport.submitted = true;
    }
    
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};