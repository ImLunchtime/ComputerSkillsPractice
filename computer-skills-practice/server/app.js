import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（用于生产环境）
app.use(express.static(path.join(__dirname, '../dist')));

// 导入路由
import apiRoutes from './routes/api.js';

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