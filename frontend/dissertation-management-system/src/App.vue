<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './store';

const authStore = useAuthStore();

onMounted(() => {
  // 检查用户是否已登录
  authStore.initAdmin();
});
</script>

<style>
/* 添加全局样式 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f5f5f5;
}
</style>