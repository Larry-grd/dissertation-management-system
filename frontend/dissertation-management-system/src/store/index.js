import { defineStore } from 'pinia';
import { teacherApi } from '../api/teachers';

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