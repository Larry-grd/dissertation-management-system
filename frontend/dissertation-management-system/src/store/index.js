import { defineStore } from 'pinia';
import { teacherApi } from '../api/teachers';
import { studentApi } from '../api/students';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null
  }),
  
  actions: {
    async initAdmin() {
      try {
        await teacherApi.initAdmin();
        console.log('管理员账户初始化成功');
      } catch (error) {
        console.error('管理员账户初始化失败:', error);
      }
    },
    
    async login(teacherId, password) {
      try {
        const response = await teacherApi.login(teacherId, password);

        this.token = response.data.token;
        this.user = response.data.teacher;

        localStorage.setItem('token', this.token);
        
        console.log('Token stored:', this.token);
        console.log('Token length:', this.token.length); // 检查token长度

        return true;
      } catch (error) {
        throw error;
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
    
    async checkAuth() {
      if (!this.token) {
        throw new Error('No token');
      }
      
      try {
        const response = await teacherApi.getMe();
        this.user = response.data.teacher;
        console.log('Auth check successful:', this.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        this.logout();
        throw error;
      }
    }
  }
});

// 学生管理状态
export const useStudentStore = defineStore('students', {
  state: () => ({
    students: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchStudents() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await studentApi.getAllStudents();
        let studentData = response.data;
        
        if (Array.isArray(studentData)) {
          this.students = studentData;
        } else if (studentData && studentData.students) {
          this.students = studentData.students;
        } else {
          this.error = 'Invalid data format';
        }
      } catch (err) {
        this.error = 'Failed to fetch students: ' + (err.response?.data?.message || err.message);
      } finally {
        this.loading = false;
      }
    },
    
    async addStudent(studentData) {
      try {
        const response = await studentApi.addStudent(studentData);
        // 添加成功后刷新学生列表
        await this.fetchStudents();
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    async assignTeacher(data) {
      try {
        const response = await studentApi.assignTeacher(data);
        // 分配成功后刷新学生列表
        await this.fetchStudents();
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }
});