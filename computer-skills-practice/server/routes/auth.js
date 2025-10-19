import express from 'express';
import User from '../models/User.js';
import { requireAuth, renewSession } from '../middleware/auth.js';

const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // 基本验证
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: '请填写所有必填字段'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: '两次输入的密码不一致'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: '密码长度至少为6位'
      });
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: '请输入有效的邮箱地址'
      });
    }

    // 创建用户
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'user' // 默认为普通用户
    });

    res.status(201).json({
      status: 'success',
      message: '注册成功',
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.error('注册失败:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || '注册失败'
    });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: '请输入用户名和密码'
      });
    }

    // 用户认证
    const user = await User.authenticate(username, password);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: '用户名或密码错误'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: '账户已被禁用'
      });
    }

    // 创建会话
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    res.json({
      status: 'success',
      message: '登录成功',
      data: {
        user: user
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      status: 'error',
      message: '登录失败，请稍后重试'
    });
  }
});

// 用户登出
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('登出失败:', err);
      return res.status(500).json({
        status: 'error',
        message: '登出失败'
      });
    }

    res.clearCookie('connect.sid'); // 清除session cookie
    res.json({
      status: 'success',
      message: '登出成功'
    });
  });
});

// 检查登录状态
router.get('/me', requireAuth, renewSession, (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

// 刷新会话（续期）
router.post('/refresh', requireAuth, renewSession, (req, res) => {
  res.json({
    status: 'success',
    message: '会话已刷新',
    data: {
      user: req.user
    }
  });
});

// 检查用户名是否可用
router.get('/check-username/:username', (req, res) => {
  const { username } = req.params;
  const existingUser = User.findByUsername(username);
  
  res.json({
    status: 'success',
    data: {
      available: !existingUser
    }
  });
});

// 检查邮箱是否可用
router.get('/check-email/:email', (req, res) => {
  const { email } = req.params;
  const existingUser = User.findByEmail(email);
  
  res.json({
    status: 'success',
    data: {
      available: !existingUser
    }
  });
});

export default router;