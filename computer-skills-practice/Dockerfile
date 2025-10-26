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

# 设置npm配置
ENV npm_config_build_from_source=true
ENV PYTHON=/usr/bin/python3

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 构建前端应用
RUN npm run build

# 暴露端口
EXPOSE 5173

# 启动命令
CMD ["npm", "run", "start:docker"]