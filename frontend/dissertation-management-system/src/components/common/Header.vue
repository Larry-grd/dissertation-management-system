<template>
  <header class="header">
    <div class="header-content">
      <h1>Dissertation Management System</h1>
      <div class="user-info">
        <span>Hello! {{ user?.name || 'Guest' }}</span>
        <button @click="handleLogout" v-if="user">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../../store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const user = authStore.user;

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info button {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.user-info button:hover {
  background: rgba(255,255,255,0.1);
}
</style>