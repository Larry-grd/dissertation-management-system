import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Adding token to request:', token.substring(0, 20) + '...'); // 只显示前20个字符
    console.log('Request headers:', config.headers); // 添加详细日志
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;