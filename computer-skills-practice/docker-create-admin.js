import User from './server/models/UserSQLite.js';
import { initDatabase } from './server/database/init.js';

// Docker环境下创建管理员的脚本
async function createDockerAdmin() {
  try {
    console.log('🔧 初始化数据库...');
    initDatabase();
    console.log('✅ 数据库初始化完成\n');

    // 从环境变量获取管理员信息
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    console.log('=== 创建管理员账号 ===');
    console.log(`👤 用户名: ${adminUsername}`);
    console.log(`📧 邮箱: ${adminEmail}`);
    console.log(`🔑 密码: ${adminPassword.replace(/./g, '*')}`);

    // 检查管理员是否已存在
    const existingAdmin = User.findByUsername(adminUsername);
    if (existingAdmin) {
      console.log('⚠️  管理员账号已存在，跳过创建');
      console.log(`🆔 现有管理员ID: ${existingAdmin.id}`);
      return;
    }

    // 检查邮箱是否已存在
    const existingEmail = User.findByEmail(adminEmail);
    if (existingEmail) {
      console.log('❌ 邮箱已被使用，请更换管理员邮箱');
      process.exit(1);
    }

    // 创建管理员用户
    console.log('\n🔧 正在创建管理员账号...');
    
    const adminData = {
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    };

    const newAdmin = await User.create(adminData);
    
    console.log('✅ 管理员账号创建成功！');
    console.log(`👤 用户名: ${adminUsername}`);
    console.log(`📧 邮箱: ${adminEmail}`);
    console.log(`🔑 角色: 管理员`);
    console.log(`🆔 用户ID: ${newAdmin.id}`);
    console.log('\n🌐 现在您可以使用这个账号登录系统了。');
    console.log(`📱 登录地址: http://您的服务器IP:5173/auth`);

  } catch (error) {
    console.error('❌ 创建管理员账号失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
createDockerAdmin();