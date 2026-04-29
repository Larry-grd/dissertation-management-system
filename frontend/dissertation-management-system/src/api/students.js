import api from './api';

export const studentApi = {
  // 获取所有学生
  getAllStudents: () => api.get('/students'),
  
  // 添加学生
  addStudent: (studentData) => api.post('/students/add', studentData),
  
  // 分配教师
  assignTeacher: (data) => api.post('/students/assign-teacher', data),
  
  // 获取教师的学生列表
  getTeacherStudents: (teacherId) => api.get(`/students/teacher/${teacherId}`),
  
  // 更新成绩
  updateGrade: (data) => api.post('/students/update-grade', data)
};