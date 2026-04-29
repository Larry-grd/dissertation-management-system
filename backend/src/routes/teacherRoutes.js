const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// 管理员路由
router.post('/add', teacherController.addTeacher);
router.get('/:teacherId', teacherController.getTeacher);

module.exports = router;