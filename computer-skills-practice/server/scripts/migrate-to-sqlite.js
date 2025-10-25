import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from '../database/init.js';
import User from '../models/UserSQLite.js';
import Progress from '../models/Progress.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON文件路径
const USERS_JSON = path.join(__dirname, '../data/users.json');
const PROGRESS_JSON = path.join(__dirname, '../data/progress.json');

// 读取JSON文件
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`读取文件 ${filePath} 失败:`, error);
    return null;
  }
}

// 迁移用户数据
async function migrateUsers() {
  console.log('🔄 开始迁移用户数据...');
  
  const usersData = readJsonFile(USERS_JSON);
  if (!usersData || !usersData.users) {
    console.log('📝 没有找到用户数据文件或数据为空');
    return { migrated: 0, skipped: 0 };
  }

  let migrated = 0;
  let skipped = 0;

  for (const userData of usersData.users) {
    try {
      // 检查用户是否已存在
      const existingUser = User.findById(userData.id) || 
                          User.findByUsername(userData.username) || 
                          User.findByEmail(userData.email);
      
      if (existingUser) {
        console.log(`⏭️  用户 ${userData.username} 已存在，跳过`);
        skipped++;
        continue;
      }

      // 直接插入用户数据（保持原有密码哈希）
      const db = initDatabase();
      const insertUser = db.prepare(`
        INSERT INTO users (id, username, email, password, role, created_at, last_login, is_active, experience)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      insertUser.run(
        userData.id,
        userData.username,
        userData.email,
        userData.password, // 已经是加密的密码
        userData.role || 'user',
        userData.createdAt || new Date().toISOString(),
        userData.lastLogin || null,
        userData.isActive !== undefined ? (userData.isActive ? 1 : 0) : 1,
        userData.experience || 0
      );

      console.log(`✅ 用户 ${userData.username} 迁移成功`);
      migrated++;
    } catch (error) {
      console.error(`❌ 迁移用户 ${userData.username} 失败:`, error);
    }
  }

  console.log(`👥 用户数据迁移完成: ${migrated} 个成功, ${skipped} 个跳过`);
  return { migrated, skipped };
}

// 迁移进度数据
async function migrateProgress() {
  console.log('🔄 开始迁移进度数据...');
  
  const progressData = readJsonFile(PROGRESS_JSON);
  if (!progressData || !progressData.userProgress) {
    console.log('📝 没有找到进度数据文件或数据为空');
    return { migrated: 0, skipped: 0 };
  }

  let migrated = 0;
  let skipped = 0;

  for (const [userId, userCourses] of Object.entries(progressData.userProgress)) {
    for (const [courseId, courseChallenges] of Object.entries(userCourses)) {
      for (const [challengeId, challengeData] of Object.entries(courseChallenges)) {
        try {
          // 检查进度是否已存在
          const existingProgress = Progress.getUserChallengeProgress(
            parseInt(userId), 
            courseId, 
            parseInt(challengeId)
          );
          
          if (existingProgress) {
            console.log(`⏭️  用户 ${userId} 课程 ${courseId} 挑战 ${challengeId} 进度已存在，跳过`);
            skipped++;
            continue;
          }

          // 插入进度数据
          const db = initDatabase();
          const insertProgress = db.prepare(`
            INSERT INTO user_progress (user_id, course_id, challenge_id, completed, score, completed_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `);
          
          const now = new Date().toISOString();
          insertProgress.run(
            parseInt(userId),
            courseId,
            parseInt(challengeId),
            challengeData.completed ? 1 : 0,
            challengeData.score || 0,
            challengeData.completedAt || (challengeData.completed ? now : null),
            now,
            now
          );

          migrated++;
        } catch (error) {
          console.error(`❌ 迁移进度数据失败 (用户: ${userId}, 课程: ${courseId}, 挑战: ${challengeId}):`, error);
        }
      }
    }
  }

  console.log(`📊 进度数据迁移完成: ${migrated} 条记录成功, ${skipped} 条跳过`);
  return { migrated, skipped };
}

// 备份原始JSON文件
function backupJsonFiles() {
  console.log('💾 备份原始JSON文件...');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../data/backup', timestamp);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // 备份用户文件
  if (fs.existsSync(USERS_JSON)) {
    const backupUsersPath = path.join(backupDir, 'users.json');
    fs.copyFileSync(USERS_JSON, backupUsersPath);
    console.log(`📁 用户数据已备份到: ${backupUsersPath}`);
  }

  // 备份进度文件
  if (fs.existsSync(PROGRESS_JSON)) {
    const backupProgressPath = path.join(backupDir, 'progress.json');
    fs.copyFileSync(PROGRESS_JSON, backupProgressPath);
    console.log(`📁 进度数据已备份到: ${backupProgressPath}`);
  }

  return backupDir;
}

// 验证迁移结果
function validateMigration() {
  console.log('🔍 验证迁移结果...');
  
  try {
    const users = User.findAll();
    console.log(`👥 SQLite中的用户数量: ${users.length}`);
    
    if (users.length > 0) {
      const sampleUser = users[0];
      const userProgress = Progress.getUserProgress(sampleUser.id);
      console.log(`📊 示例用户 ${sampleUser.username} 的进度记录数: ${userProgress.length}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ 验证迁移结果失败:', error);
    return false;
  }
}

// 主迁移函数
async function migrate() {
  console.log('🚀 开始数据迁移到SQLite...');
  console.log('=====================================');
  
  try {
    // 初始化数据库
    console.log('🔧 初始化SQLite数据库...');
    initDatabase();
    
    // 备份原始文件
    const backupDir = backupJsonFiles();
    
    // 迁移用户数据
    const userResult = await migrateUsers();
    
    // 迁移进度数据
    const progressResult = await migrateProgress();
    
    // 验证迁移结果
    const isValid = validateMigration();
    
    console.log('=====================================');
    console.log('📋 迁移总结:');
    console.log(`👥 用户: ${userResult.migrated} 个迁移成功, ${userResult.skipped} 个跳过`);
    console.log(`📊 进度: ${progressResult.migrated} 条记录迁移成功, ${progressResult.skipped} 条跳过`);
    console.log(`💾 备份位置: ${backupDir}`);
    console.log(`✅ 验证结果: ${isValid ? '通过' : '失败'}`);
    
    if (isValid) {
      console.log('🎉 数据迁移完成！');
      console.log('💡 提示: 请更新应用配置以使用新的SQLite模型');
    } else {
      console.log('⚠️  迁移可能存在问题，请检查数据完整性');
    }
    
  } catch (error) {
    console.error('❌ 迁移过程中发生错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate();
}

export { migrate, migrateUsers, migrateProgress, backupJsonFiles, validateMigration };