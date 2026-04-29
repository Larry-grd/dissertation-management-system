const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// CORS 配置
app.use(cors({
  origin: 'http://localhost:5173', // 前端地址
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
}));

// 中间件
app.use(express.json());

// 连接数据库 - 修复连接选项
mongoose.connect(process.env.MONGODB_URI, {
  // 移除已弃用的选项
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// 路由
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/auth', authRoutes);

// 简单的路由
app.get('/', (req, res) => {
  res.send('Dissertation Management System API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});