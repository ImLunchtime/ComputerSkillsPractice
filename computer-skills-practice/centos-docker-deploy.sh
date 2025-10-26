#!/bin/bash

# CentOS 8 Stream Docker部署脚本
# 用于部署计算机技能练习网站

set -e

echo "🚀 开始在CentOS 8 Stream上部署计算机技能练习网站..."

# 1. 安装Docker
echo "📦 安装Docker..."
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动Docker服务
echo "🔧 启动Docker服务..."
sudo systemctl start docker
sudo systemctl enable docker

# 将当前用户添加到docker组（可选，避免每次使用sudo）
echo "👤 配置Docker用户权限..."
sudo usermod -aG docker $USER

# 2. 安装Docker Compose（如果没有）
echo "📦 安装Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. 创建项目目录
echo "📁 创建项目目录..."
PROJECT_DIR="/opt/computer-skills-practice"
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# 4. 提示用户上传代码
echo "📤 请将项目代码上传到: $PROJECT_DIR"
echo "   你可以使用以下方式之一："
echo "   - scp -r ./computer-skills-practice user@server:$PROJECT_DIR/"
echo "   - git clone 你的仓库地址 $PROJECT_DIR"
echo ""
echo "⏳ 代码上传完成后，请运行以下命令继续部署："
echo ""
echo "cd $PROJECT_DIR"
echo "sudo docker-compose up -d"
echo ""
echo "🔧 配置开机自启动："
echo "sudo systemctl enable docker"
echo ""
echo "✅ 部署完成后，访问: http://你的服务器IP:5173"

# 5. 创建systemd服务文件（开机自启动）
echo "🔧 创建systemd服务..."
sudo tee /etc/systemd/system/computer-skills-practice.service > /dev/null <<EOF
[Unit]
Description=Computer Skills Practice Web Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Docker安装完成！"
echo ""
echo "📋 接下来的步骤："
echo "1. 上传项目代码到 $PROJECT_DIR"
echo "2. cd $PROJECT_DIR"
echo "3. sudo docker-compose up -d"
echo "4. sudo systemctl enable computer-skills-practice"
echo "5. sudo systemctl start computer-skills-practice"
echo ""
echo "🌐 访问地址: http://你的服务器IP:5173"