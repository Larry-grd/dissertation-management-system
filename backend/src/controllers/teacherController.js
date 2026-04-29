const Teacher = require('../models/Teacher');

// // 添加教师
// exports.addTeacher = async (req, res) => {
//   try {
//     const { teacherId, name, email, password } = req.body;
//     const teacher = new Teacher({ teacherId, name, email, password });
//     await teacher.save();
//     res.status(201).json(teacher);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
// 添加教师
exports.addTeacher = async (req, res) => {
  try {
    const { teacherId, name, email, password } = req.body;
    
    // 检查教师是否已存在
    let teacher = await Teacher.findOne({ teacherId });
    if (teacher) {
      return res.status(400).json({ message: '教师已存在' });
    }
    
    teacher = new Teacher({ teacherId, name, email, password });
    await teacher.save();
    
    res.status(201).json({
      _id: teacher._id,
      teacherId: teacher.teacherId,
      name: teacher.name,
      email: teacher.email
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 获取教师信息
exports.getTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await Teacher.findOne({ teacherId });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};