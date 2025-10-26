# 使用Node.js 20 Alpine作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装构建工具和Python（用于编译native模块）
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    sqlite-dev

# 复制package文件
COPY package*.json ./

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=5173
ENV PYTHON=/usr/bin/python3

# 设置npm配置
ENV npm_config_build_from_source=true

# 安装依赖（包括开发依赖用于构建）
RUN npm ci

# 复制应用代码
COPY . .

# 确保数据目录存在并复制数据文件
RUN mkdir -p /app/server/data
COPY server/data/courses.json /app/server/data/

# 复制管理员配置脚本
COPY docker-create-admin.js ./
COPY docker-admin-setup.sh ./
RUN chmod +x docker-admin-setup.sh

# 构建前端应用
RUN npm run build

# 清理开发依赖以减小镜像大小
RUN npm prune --production

# 暴露端口
EXPOSE 5173

# 启动命令
CMD ["npm", "run", "start-public"]