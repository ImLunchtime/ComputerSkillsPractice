import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 用户数据文件路径
const USERS_FILE = path.join(__dirname, '../data/users.json');

// 确保数据目录存在
const dataDir = path.dirname(USERS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化用户数据文件
if (!fs.existsSync(USERS_FILE)) {
  const initialData = {
    users: [],
    nextId: 1
  };
  fs.writeFileSync(USERS_FILE, JSON.stringify(initialData, null, 2));
}

class User {
  constructor(userData) {
    this.id = userData.id || null;
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password; // 已加密的密码
    this.role = userData.role || 'user'; // 'user' 或 'admin'
    this.createdAt = userData.createdAt || new Date().toISOString();
    this.lastLogin = userData.lastLogin || null;
    this.isActive = userData.isActive !== undefined ? userData.isActive : true;
  }

  // 读取用户数据
  static readUsersData() {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取用户数据失败:', error);
      return { users: [], nextId: 1 };
    }
  }

  // 写入用户数据
  static writeUsersData(data) {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('写入用户数据失败:', error);
      return false;
    }
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
      const data = this.readUsersData();
      
      // 检查用户名和邮箱是否已存在
      const existingUser = data.users.find(u => 
        u.username === userData.username || u.email === userData.email
      );
      
      if (existingUser) {
        throw new Error('用户名或邮箱已存在');
      }

      // 加密密码
      const hashedPassword = await this.hashPassword(userData.password);
      
      // 创建新用户
      const newUser = new User({
        id: data.nextId,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'user'
      });

      data.users.push(newUser);
      data.nextId++;

      if (this.writeUsersData(data)) {
        // 返回用户信息（不包含密码）
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
      } else {
        throw new Error('保存用户数据失败');
      }
    } catch (error) {
      throw error;
    }
  }

  // 根据用户名查找用户
  static findByUsername(username) {
    const data = this.readUsersData();
    return data.users.find(u => u.username === username);
  }

  // 根据邮箱查找用户
  static findByEmail(email) {
    const data = this.readUsersData();
    return data.users.find(u => u.email === email);
  }

  // 根据ID查找用户
  static findById(id) {
    const data = this.readUsersData();
    return data.users.find(u => u.id === parseInt(id));
  }

  // 获取所有用户（不包含密码）
  static findAll() {
    const data = this.readUsersData();
    return data.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // 更新用户最后登录时间
  static updateLastLogin(userId) {
    try {
      const data = this.readUsersData();
      const userIndex = data.users.findIndex(u => u.id === parseInt(userId));
      
      if (userIndex !== -1) {
        data.users[userIndex].lastLogin = new Date().toISOString();
        return this.writeUsersData(data);
      }
      return false;
    } catch (error) {
      console.error('更新最后登录时间失败:', error);
      return false;
    }
  }

  // 更新用户信息
  static async updateUser(userId, updateData) {
    try {
      const data = this.readUsersData();
      const userIndex = data.users.findIndex(u => u.id === parseInt(userId));
      
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }

      // 如果更新密码，需要加密
      if (updateData.password) {
        updateData.password = await this.hashPassword(updateData.password);
      }

      // 更新用户信息
      data.users[userIndex] = { ...data.users[userIndex], ...updateData };
      
      if (this.writeUsersData(data)) {
        const { password, ...userWithoutPassword } = data.users[userIndex];
        return userWithoutPassword;
      } else {
        throw new Error('保存用户数据失败');
      }
    } catch (error) {
      throw error;
    }
  }

  // 删除用户
  static deleteUser(userId) {
    try {
      const data = this.readUsersData();
      const userIndex = data.users.findIndex(u => u.id === parseInt(userId));
      
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }

      data.users.splice(userIndex, 1);
      return this.writeUsersData(data);
    } catch (error) {
      throw error;
    }
  }

  // 用户认证
  static async authenticate(username, password) {
    try {
      const user = this.findByUsername(username) || this.findByEmail(username);
      
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