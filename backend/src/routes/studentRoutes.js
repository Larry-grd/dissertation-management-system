const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// 管理员路由
router.post('/add', studentController.addStudent);
router.post('/assign-teacher', studentController.assignTeacher);
router.get('/', studentController.getAllStudents);

// 教师路由
router.get('/teacher/:teacherId', studentController.getTeacherStudents);
router.post('/update-grade', studentController.updateStudentGrade);

module.exports = router;