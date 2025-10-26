import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// ES模块中获取__dirname的方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5173; // 改为5173端口以匹配前端

// 中间件配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173', // 生产环境不需要CORS
  credentials: true
}));

// Cookie解析器
app.use(cookieParser());

// Session配置
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // 在生产环境中应设置为true（需要HTTPS）
    httpOnly: true,
    maxAge: 30 * 60 * 1000, // 30分钟
    sameSite: 'lax'
  },
  rolling: true // 每次请求都重新设置过期时间
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 导入路由
import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import courseRoutes from './routes/coursesSQLite.js'; // 使用SQLite版本

// API路由
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: '后端服务器运行正常！',
    timestamp: new Date().toISOString()
  });
});

// 使用API路由
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// 静态文件服务（用于生产环境）
// 注意：静态文件服务应该在API路由之后，避免冲突
app.use(express.static(path.join(__dirname, '../dist')));

// 处理Vue路由（用于生产环境）
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: '服务器内部错误' 
  });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 API接口可通过 http://localhost:${PORT}/api 访问`);
  console.log(`🌐 前端页面可通过 http://localhost:${PORT} 访问`);
  console.log(`🔧 环境: ${process.env.NODE_ENV || 'development'}`);
});

export default app;