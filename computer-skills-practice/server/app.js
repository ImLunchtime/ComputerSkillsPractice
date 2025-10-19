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
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
  origin: 'http://localhost:5173', // Vue开发服务器地址
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

// 静态文件服务（用于生产环境）
// 注意：静态文件服务应该在API路由之后，避免冲突
app.use(express.static(path.join(__dirname, '../dist')));

// 处理Vue路由（用于生产环境）
// 注释掉这个路由，因为在开发环境中不需要
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: '服务器内部错误' 
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 API接口可通过 http://localhost:${PORT}/api 访问`);
});

export default app;