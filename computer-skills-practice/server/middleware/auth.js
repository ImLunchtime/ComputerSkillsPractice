import User from '../models/UserSQLite.js'; // 使用SQLite版本

// 验证用户是否已登录
export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      status: 'error',
      message: '请先登录'
    });
  }

  // 验证用户是否存在
  const user = User.findById(req.session.userId);
  if (!user) {
    req.session.destroy();
    return res.status(401).json({
      status: 'error',
      message: '用户不存在，请重新登录'
    });
  }

  // 将用户信息添加到请求对象中
  const { password, ...userWithoutPassword } = user;
  req.user = userWithoutPassword;
  next();
};

// 验证管理员权限
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: '需要管理员权限'
    });
  }
  next();
};

// 可选的认证中间件（不强制要求登录）
export const optionalAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    const user = User.findById(req.session.userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }
  }
  next();
};

// 会话续期中间件
export const renewSession = (req, res, next) => {
  if (req.session && req.session.userId) {
    // 重新设置会话过期时间
    req.session.touch();
  }
  next();
};