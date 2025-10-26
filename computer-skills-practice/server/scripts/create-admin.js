import User from '../models/UserSQLite.js';
import { initDatabase } from '../database/init.js';
import readline from 'readline';

// 创建readline接口用于用户输入
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 提示用户输入的函数
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// 隐藏密码输入的函数
function askPassword(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // 退格键
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

// 验证邮箱格式
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 验证用户名格式
function isValidUsername(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

// 验证密码强度
function isValidPassword(password) {
  return password.length >= 6;
}

async function createAdmin() {
  try {
    console.log('🔧 初始化数据库...');
    initDatabase();
    console.log('✅ 数据库初始化完成\n');

    console.log('=== 创建管理员账号 ===');
    
    // 检查是否通过环境变量提供了管理员信息
    const envUsername = process.env.ADMIN_USERNAME;
    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;
    
    let username, email, password;
    
    if (envUsername && envEmail && envPassword) {
      // 使用环境变量
      console.log('📋 检测到环境变量配置，使用环境变量创建管理员...');
      username = envUsername;
      email = envEmail;
      password = envPassword;
      
      console.log(`👤 用户名: ${username}`);
      console.log(`📧 邮箱: ${email}`);
      console.log(`🔑 密码: ${password.replace(/./g, '*')}`);
    } else {
      // 交互式输入
      console.log('📝 请输入管理员信息：');
      
      // 获取用户名
      do {
        username = await askQuestion('👤 请输入管理员用户名 (3-20个字符，只能包含字母、数字和下划线): ');
        if (!isValidUsername(username)) {
          console.log('❌ 用户名格式不正确，请重新输入');
        }
      } while (!isValidUsername(username));

      // 获取邮箱
      do {
        email = await askQuestion('📧 请输入管理员邮箱: ');
        if (!isValidEmail(email)) {
          console.log('❌ 邮箱格式不正确，请重新输入');
        }
      } while (!isValidEmail(email));

      // 获取密码
      do {
        password = await askPassword('🔑 请输入管理员密码 (至少6个字符): ');
        if (!isValidPassword(password)) {
          console.log('❌ 密码长度至少6个字符，请重新输入');
        }
      } while (!isValidPassword(password));

      // 确认密码
      let confirmPassword;
      do {
        confirmPassword = await askPassword('🔑 请再次输入密码确认: ');
        if (password !== confirmPassword) {
          console.log('❌ 两次输入的密码不一致，请重新输入');
        }
      } while (password !== confirmPassword);
    }

    // 检查管理员是否已存在
    const existingAdmin = User.findByUsername(username);
    if (existingAdmin) {
      console.log('⚠️  管理员账号已存在，跳过创建');
      console.log(`🆔 现有管理员ID: ${existingAdmin.id}`);
      rl.close();
      return;
    }

    // 检查邮箱是否已存在
    const existingEmail = User.findByEmail(email);
    if (existingEmail) {
      console.log('❌ 邮箱已被使用，请更换管理员邮箱');
      rl.close();
      process.exit(1);
    }

    // 创建管理员用户
    console.log('\n🔧 正在创建管理员账号...');
    
    const adminData = {
      username: username,
      email: email,
      password: password,
      role: 'admin'
    };

    const newAdmin = await User.create(adminData);
    
    console.log('✅ 管理员账号创建成功！');
    console.log(`👤 用户名: ${username}`);
    console.log(`📧 邮箱: ${email}`);
    console.log(`🔑 角色: 管理员`);
    console.log(`🆔 用户ID: ${newAdmin.id}`);
    console.log('\n🌐 现在您可以使用这个账号登录系统了。');

  } catch (error) {
    console.error('❌ 创建管理员账号失败:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 运行脚本
createAdmin();
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

// 验证邮箱格式
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 验证用户名格式
function isValidUsername(username) {
  // 用户名应该是3-20个字符，只包含字母、数字和下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

// 验证密码强度
function isValidPassword(password) {
  // 密码不需要很强
  return true;
}

async function createAdmin() {
  try {
    console.log('🔧 初始化数据库...');
    initDatabase();
    console.log('✅ 数据库初始化完成\n');

    console.log('=== 创建管理员账号 ===\n');

    // 获取用户名
    let username;
    while (true) {
      username = await askQuestion('请输入管理员用户名 (3-20个字符，只能包含字母、数字和下划线): ');
      
      if (!isValidUsername(username)) {
        console.log('❌ 用户名格式不正确，请重新输入');
        continue;
      }

      // 检查用户名是否已存在
      const existingUser = User.findByUsername(username);
      if (existingUser) {
        console.log('❌ 用户名已存在，请选择其他用户名');
        continue;
      }

      break;
    }

    // 获取邮箱
    let email;
    while (true) {
      email = await askQuestion('请输入管理员邮箱: ');
      
      if (!isValidEmail(email)) {
        console.log('❌ 邮箱格式不正确，请重新输入');
        continue;
      }

      // 检查邮箱是否已存在
      const existingUser = User.findByEmail(email);
      if (existingUser) {
        console.log('❌ 邮箱已存在，请使用其他邮箱');
        continue;
      }

      break;
    }

    // 获取密码
    let password;
    while (true) {
      password = await askPassword('请输入管理员密码 (至少8个字符，包含字母和数字): ');
      
      if (!isValidPassword(password)) {
        console.log('❌ 密码强度不够，请重新输入');
        continue;
      }

      const confirmPassword = await askPassword('请确认密码: ');
      
      if (password !== confirmPassword) {
        console.log('❌ 两次输入的密码不一致，请重新输入');
        continue;
      }

      break;
    }

    // 创建管理员用户
    console.log('\n🔧 正在创建管理员账号...');
    
    const adminData = {
      username: username,
      email: email,
      password: password,
      role: 'admin'
    };

    const newAdmin = await User.create(adminData);
    
    console.log('✅ 管理员账号创建成功！');
    console.log(`👤 用户名: ${username}`);
    console.log(`📧 邮箱: ${email}`);
    console.log(`🔑 角色: 管理员`);
    console.log(`🆔 用户ID: ${newAdmin.id}`);
    console.log('\n现在您可以使用这个账号登录系统了。');

  } catch (error) {
    console.error('❌ 创建管理员账号失败:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// 运行脚本
createAdmin();