import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库文件路径
const DB_PATH = path.join(__dirname, '../data/database.sqlite');

// 确保数据目录存在
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 创建数据库连接
const db = new Database(DB_PATH);

// 启用外键约束
db.pragma('foreign_keys = ON');

// 创建用户表
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1,
    experience INTEGER DEFAULT 0
  )
`;

// 创建用户进度表
const createProgressTable = `
  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id TEXT NOT NULL,
    challenge_id INTEGER NOT NULL,
    completed BOOLEAN DEFAULT 0,
    score INTEGER DEFAULT 0,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(user_id, course_id, challenge_id)
  )
`;

// 创建索引以提高查询性能
const createIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
  'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
  'CREATE INDEX IF NOT EXISTS idx_progress_user_id ON user_progress(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_progress_course_id ON user_progress(course_id)',
  'CREATE INDEX IF NOT EXISTS idx_progress_user_course ON user_progress(user_id, course_id)'
];

// 初始化数据库
export function initDatabase() {
  try {
    console.log('🔧 初始化SQLite数据库...');
    
    // 创建表
    db.exec(createUsersTable);
    db.exec(createProgressTable);
    
    // 创建索引
    createIndexes.forEach(indexSQL => {
      db.exec(indexSQL);
    });
    
    console.log('✅ 数据库初始化完成');
    return db;
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
}

// 获取数据库连接
export function getDatabase() {
  return db;
}

// 关闭数据库连接
export function closeDatabase() {
  if (db) {
    db.close();
    console.log('🔒 数据库连接已关闭');
  }
}

// 如果直接运行此文件，则初始化数据库
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase();
}

export default db;