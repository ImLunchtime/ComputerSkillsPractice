import bcrypt from 'bcrypt';
import { getDatabase, initDatabase } from '../database/init.js';

// 初始化数据库
const db = initDatabase();

class User {
  constructor(userData) {
    this.id = userData.id || null;
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password; // 已加密的密码
    this.role = userData.role || 'user'; // 'user' 或 'admin'
    this.createdAt = userData.created_at || userData.createdAt || new Date().toISOString();
    this.lastLogin = userData.last_login || userData.lastLogin || null;
    this.isActive = userData.is_active !== undefined ? userData.is_active : (userData.isActive !== undefined ? userData.isActive : true);
    this.experience = userData.experience || 0; // 用户经验值，默认为0
  }

  // 密码加密
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // 密码验证
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // 创建新用户
  static async create(userData) {
    try {
      // 检查用户名和邮箱是否已存在
      const existingUser = db.prepare(`
        SELECT id FROM users 
        WHERE username = ? OR email = ?
      `).get(userData.username, userData.email);
      
      if (existingUser) {
        throw new Error('用户名或邮箱已存在');
      }

      // 加密密码
      const hashedPassword = await this.hashPassword(userData.password);
      
      // 插入新用户
      const insertUser = db.prepare(`
        INSERT INTO users (username, email, password, role, experience)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const result = insertUser.run(
        userData.username,
        userData.email,
        hashedPassword,
        userData.role || 'user',
        0
      );

      // 获取创建的用户信息
      const newUser = db.prepare(`
        SELECT id, username, email, role, created_at, last_login, is_active, experience
        FROM users WHERE id = ?
      `).get(result.lastInsertRowid);

      return new User(newUser);
    } catch (error) {
      throw error;
    }
  }

  // 根据用户名查找用户
  static findByUsername(username) {
    const user = db.prepare(`
      SELECT * FROM users WHERE username = ?
    `).get(username);
    
    return user ? new User(user) : null;
  }

  // 根据邮箱查找用户
  static findByEmail(email) {
    const user = db.prepare(`
      SELECT * FROM users WHERE email = ?
    `).get(email);
    
    return user ? new User(user) : null;
  }

  // 根据ID查找用户
  static findById(id) {
    const user = db.prepare(`
      SELECT * FROM users WHERE id = ?
    `).get(id);
    
    return user ? new User(user) : null;
  }

  // 获取所有用户
  static findAll() {
    const users = db.prepare(`
      SELECT id, username, email, role, created_at, last_login, is_active, experience
      FROM users ORDER BY created_at DESC
    `).all();
    
    return users.map(user => new User(user));
  }

  // 更新最后登录时间
  static updateLastLogin(userId) {
    try {
      const updateLastLogin = db.prepare(`
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
      
      const result = updateLastLogin.run(userId);
      return result.changes > 0;
    } catch (error) {
      console.error('更新最后登录时间失败:', error);
      return false;
    }
  }

  // 更新用户信息
  static async updateUser(userId, updateData) {
    try {
      // 检查用户是否存在
      const existingUser = this.findById(userId);
      if (!existingUser) {
        throw new Error('用户不存在');
      }

      // 如果更新密码，需要加密
      if (updateData.password) {
        updateData.password = await this.hashPassword(updateData.password);
      }

      // 构建更新SQL
      const fields = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          // 转换字段名为数据库格式
          const dbField = key === 'lastLogin' ? 'last_login' : 
                         key === 'isActive' ? 'is_active' : 
                         key === 'createdAt' ? 'created_at' : key;
          fields.push(`${dbField} = ?`);
          values.push(updateData[key]);
        }
      });

      if (fields.length === 0) {
        throw new Error('没有要更新的字段');
      }

      values.push(userId);
      
      const updateUser = db.prepare(`
        UPDATE users 
        SET ${fields.join(', ')} 
        WHERE id = ?
      `);
      
      const result = updateUser.run(...values);
      
      if (result.changes > 0) {
        return this.findById(userId);
      } else {
        throw new Error('更新用户信息失败');
      }
    } catch (error) {
      throw error;
    }
  }

  // 更新用户经验值
  static updateExperience(userId, experienceToAdd) {
    try {
      const updateExp = db.prepare(`
        UPDATE users 
        SET experience = experience + ? 
        WHERE id = ?
      `);
      
      const result = updateExp.run(experienceToAdd, userId);
      
      if (result.changes > 0) {
        // 返回更新后的用户信息
        return this.findById(userId);
      } else {
        throw new Error('用户不存在');
      }
    } catch (error) {
      console.error('更新用户经验值失败:', error);
      throw error;
    }
  }

  // 删除用户
  static deleteUser(userId) {
    try {
      const deleteUser = db.prepare(`
        DELETE FROM users WHERE id = ?
      `);
      
      const result = deleteUser.run(userId);
      return result.changes > 0;
    } catch (error) {
      console.error('删除用户失败:', error);
      return false;
    }
  }

  // 用户认证
  static async authenticate(username, password) {
    try {
      const user = this.findByUsername(username);
      if (!user) {
        return null;
      }

      const isValidPassword = await this.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      // 更新最后登录时间
      this.updateLastLogin(user.id);

      // 返回用户信息（不包含密码）
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('用户认证失败:', error);
      return null;
    }
  }
}

export default User;