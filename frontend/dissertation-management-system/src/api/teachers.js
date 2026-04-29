import api from './api';

export const teacherApi = {
  // Add Teacher
  addTeacher: (teacherData) => api.post('/teachers/add', teacherData),
  
  // Get Teacher Information
  getTeacher: (teacherId) => api.get(`/teachers/${teacherId}`),

  // Initialize Admin Account
  initAdmin: () => api.post('/auth/init-admin'),
  
  // Teacher Login
  login: (teacherId, password) => api.post('/auth/login', { teacherId, password }),
  
  // Get Current User Information
  getMe: () => api.get('/auth/me')
};