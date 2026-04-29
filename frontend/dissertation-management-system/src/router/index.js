import { createRouter, createWebHistory } from 'vue-router';
import AdminDashboard from '../views/Admin/Dashboard.vue';
import TeacherDashboard from '../views/Teacher/Dashboard.vue';
import { useAuthStore } from '../store';

const routes = [
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/teacher',
    name: 'TeacherDashboard',
    component: TeacherDashboard,
    meta: { requiresAuth: true, role: 'teacher' }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    try {
      // 检查token是否有效
      await authStore.checkAuth();
      
      // 检查角色权限
      if (to.meta.role && authStore.user.role !== to.meta.role) {
        next('/login');
      } else {
        next();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      next('/login');
    }
  } else {
    next();
  }
});

export default router;