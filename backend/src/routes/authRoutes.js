const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');
//require('dotenv').config();

// Set JWT secret directly in code (development environment)
const JWT_SECRET = 'your_development_secret_key_123456';

// Create initial admin account (if not exists)
router.post('/init-admin', async (req, res) => {
  try {
    const adminExists = await Teacher.findOne({ teacherId: 'admin' });
    if (!adminExists) {
      const admin = new Teacher({
        teacherId: 'admin',
        name: 'Administrator',
        email: 'admin@example.com',
        password: 'admin',
        role: 'admin'
      });
      await admin.save();
      res.json({ message: 'Admin account created successfully' });
    } else {
      res.json({ message: 'Admin account already exists' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Teacher login
router.post('/login', async (req, res) => {
  try {
    const { teacherId, password } = req.body;
    const teacher = await Teacher.findOne({ teacherId });
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    // Simple password verification
    if (password === teacher.password) {

      // Generate token
      const token = jwt.sign(
        { 
          user: { 
            id: teacher._id, 
            role: teacher.role,
            teacherId: teacher.teacherId 
          } 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Generated token:', token);

      res.json({ 
        success: true,
        token, 
        teacher: {
          _id: teacher._id,
          teacherId: teacher.teacherId,
          name: teacher.name,
          role: teacher.role,
          email: teacher.email
        }
      });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user information
router.get('/me', async (req, res) => {
  try {
    // console.log('Request headers:', req.headers); // Add detailed logging
    
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      // console.log('No Authorization header found');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Extract Bearer token
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    // console.log('Extracted token:', token);
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log('Decoded token:', decoded);
    
    // Check if token has expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: 'Token expired' });
    }

    const teacher = await Teacher.findById(decoded.user.id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    res.json({ 
      success: true,
      teacher: {
        _id: teacher._id,
        teacherId: teacher.teacherId,
        name: teacher.name,
        role: teacher.role,
        email: teacher.email
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router; // Ensure router is exported correctly