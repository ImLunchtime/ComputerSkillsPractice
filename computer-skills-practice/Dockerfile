# 使用官方 Node.js 20 Alpine 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    sqlite-dev

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖（包括开发依赖，因为构建需要）
RUN npm ci

# 复制源代码
COPY . .

# 确保数据目录存在并复制数据文件
RUN mkdir -p /app/server/data
COPY server/data/courses.json /app/server/data/


# 构建前端应用
RUN npm run build

# 暴露端口
EXPOSE 5173

# 启动命令
CMD ["npm", "run", "start-public"]