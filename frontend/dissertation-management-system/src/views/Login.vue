<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="teacherId">Teacher ID</label>
          <input 
            type="text" 
            id="teacherId" 
            v-model="teacherId" 
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const teacherId = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// Initialize admin account on app startup
authStore.initAdmin();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    console.log('Attempting login with:', { teacherId: teacherId.value, password: password.value });
    await authStore.login(teacherId.value, password.value);
    console.log('Login successful, user:', authStore.user);
    
    // Check user role and redirect
    const targetRoute = authStore.user.role === 'admin' ? '/admin' : '/teacher';
    console.log('Redirecting to:', targetRoute);
    router.push(targetRoute);
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'Login failed, please check your ID and password';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Keep original styles */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 300px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  margin-top: 1rem;
  text-align: center;
}
</style>