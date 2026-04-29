<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li v-if="user?.role === 'admin'">
          <router-link to="/admin">Admin Dashboard</router-link>
        </li>
        <li v-if="user?.role === 'teacher'">
          <router-link to="/teacher">Teacher Dashboard</router-link>
        </li>
        <li v-if="user?.role === 'admin'">
          <router-link to="/students">Student Management</router-link>
        </li>
        <li v-if="user?.role === 'admin'">
          <router-link to="/teachers">Teacher Management</router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../../store';

const authStore = useAuthStore();
const user = authStore.user;
</script>

<style scoped>
.sidebar {
  background: #34495e;
  color: white;
  width: 200px;
  padding: 1rem;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav ul li {
  margin-bottom: 1rem;
}

nav ul li a {
  color: white;
  text-decoration: none;
  display: block;
  padding: 0.5rem;
  border-radius: 4px;
}

nav ul li a:hover {
  background: rgba(255,255,255,0.1);
}
</style>