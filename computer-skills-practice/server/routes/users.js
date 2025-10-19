import express from 'express';
import User from '../models/User.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 获取所有用户（仅管理员）
router.get('/', requireAuth, requireAdmin, (req, res) => {
  try {
    const users = User.findAll();
    res.json({
      status: 'success',
      data: {
        users: users,
        total: users.length
      }
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取用户列表失败'
    });
  }
});

// 获取单个用户信息（仅管理员）
router.get('/:id', requireAuth, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const user = User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: '用户不存在'
      });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({
      status: 'success',
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取用户信息失败'
    });
  }
});

// 创建新用户（仅管理员）
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 基本验证
    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: '请填写所有必填字段'
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

    // 验证角色
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: '无效的用户角色'
      });
    }

    // 创建用户
    const newUser = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    res.status(201).json({
      status: 'success',
      message: '用户创建成功',
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || '创建用户失败'
    });
  }
});

// 更新用户信息（仅管理员）
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, isActive } = req.body;

    // 检查用户是否存在
    const existingUser = User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: '用户不存在'
      });
    }

    // 准备更新数据
    const updateData = {};
    
    if (username) updateData.username = username;
    if (email) {
      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: 'error',
          message: '请输入有效的邮箱地址'
        });
      }
      updateData.email = email;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          status: 'error',
          message: '密码长度至少为6位'
        });
      }
      updateData.password = password;
    }
    if (role && ['user', 'admin'].includes(role)) {
      updateData.role = role;
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // 更新用户
    const updatedUser = await User.updateUser(id, updateData);

    res.json({
      status: 'success',
      message: '用户信息更新成功',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || '更新用户失败'
    });
  }
});

// 删除用户（仅管理员）
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;

    // 不能删除自己
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        status: 'error',
        message: '不能删除自己的账户'
      });
    }

    // 检查用户是否存在
    const existingUser = User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: '用户不存在'
      });
    }

    // 删除用户
    const success = User.deleteUser(id);
    
    if (success) {
      res.json({
        status: 'success',
        message: '用户删除成功'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: '删除用户失败'
      });
    }

  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || '删除用户失败'
    });
  }
});

// 批量删除用户（仅管理员）
router.delete('/', requireAuth, requireAdmin, (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: '请提供要删除的用户ID列表'
      });
    }

    // 检查是否包含当前用户
    if (userIds.includes(req.user.id)) {
      return res.status(400).json({
        status: 'error',
        message: '不能删除自己的账户'
      });
    }

    let deletedCount = 0;
    const errors = [];

    for (const userId of userIds) {
      try {
        const success = User.deleteUser(userId);
        if (success) {
          deletedCount++;
        } else {
          errors.push(`用户ID ${userId} 删除失败`);
        }
      } catch (error) {
        errors.push(`用户ID ${userId} 删除失败: ${error.message}`);
      }
    }

    res.json({
      status: 'success',
      message: `成功删除 ${deletedCount} 个用户`,
      data: {
        deletedCount,
        errors: errors.length > 0 ? errors : null
      }
    });

  } catch (error) {
    console.error('批量删除用户失败:', error);
    res.status(500).json({
      status: 'error',
      message: '批量删除用户失败'
    });
  }
});

export default router;