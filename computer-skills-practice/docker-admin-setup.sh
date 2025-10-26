#!/bin/bash

# Docker环境下管理员配置脚本
echo "=== Computer Skills Practice - Docker管理员配置 ==="
echo ""

# 检查是否在Docker容器中运行
if [ ! -f /.dockerenv ]; then
    echo "❌ 此脚本需要在Docker容器中运行"
    echo "请使用以下命令进入容器："
    echo "docker-compose exec computer-skills-practice bash"
    exit 1
fi

echo "🔧 正在配置管理员账号..."
echo ""

# 运行管理员创建脚本
node docker-create-admin.js

echo ""
echo "=== 配置完成 ==="
echo "📝 提示："
echo "1. 如需修改管理员信息，请编辑 docker-compose.yml 中的环境变量"
echo "2. 修改后需要重新启动容器：docker-compose restart"
echo "3. 登录地址：http://您的服务器IP:5173/auth"
echo ""