import express from 'express';
const router = express.Router();

// 获取所有技能列表
router.get('/skills', (req, res) => {
  try {
    const skills = [
      { 
        id: 1, 
        name: '键盘快捷键练习', 
        category: '基础操作', 
        difficulty: '初级',
        description: '学习常用的键盘快捷键，提高操作效率',
        exercises: [
          { id: 1, name: 'Ctrl+C 复制', completed: false },
          { id: 2, name: 'Ctrl+V 粘贴', completed: false },
          { id: 3, name: 'Ctrl+Z 撤销', completed: false }
        ]
      },
      { 
        id: 2, 
        name: '文件管理操作', 
        category: '系统操作', 
        difficulty: '初级',
        description: '掌握文件和文件夹的基本操作',
        exercises: [
          { id: 4, name: '创建新文件夹', completed: false },
          { id: 5, name: '重命名文件', completed: false },
          { id: 6, name: '移动文件', completed: false }
        ]
      },
      { 
        id: 3, 
        name: '网络设置配置', 
        category: '系统设置', 
        difficulty: '中级',
        description: '学习网络连接和配置相关操作',
        exercises: [
          { id: 7, name: '查看IP地址', completed: false },
          { id: 8, name: '连接WiFi', completed: false },
          { id: 9, name: '网络故障排除', completed: false }
        ]
      },
      { 
        id: 4, 
        name: '命令行基础', 
        category: '高级操作', 
        difficulty: '高级',
        description: '掌握命令行界面的基本使用',
        exercises: [
          { id: 10, name: '目录导航', completed: false },
          { id: 11, name: '文件操作命令', completed: false },
          { id: 12, name: '系统信息查看', completed: false }
        ]
      }
    ];

    res.json({
      status: 'success',
      data: skills,
      total: skills.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '获取技能列表失败',
      error: error.message
    });
  }
});

// 获取单个技能详情
router.get('/skills/:id', (req, res) => {
  try {
    const skillId = parseInt(req.params.id);
    // 这里应该从数据库或文件中获取数据，现在先用模拟数据
    const skill = {
      id: skillId,
      name: '键盘快捷键练习',
      category: '基础操作',
      difficulty: '初级',
      description: '学习常用的键盘快捷键，提高操作效率',
      content: '详细的练习内容和步骤...',
      exercises: [
        { id: 1, name: 'Ctrl+C 复制', completed: false },
        { id: 2, name: 'Ctrl+V 粘贴', completed: false },
        { id: 3, name: 'Ctrl+Z 撤销', completed: false }
      ]
    };

    res.json({
      status: 'success',
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '获取技能详情失败',
      error: error.message
    });
  }
});

// 更新练习完成状态
router.put('/exercises/:id', (req, res) => {
  try {
    const exerciseId = parseInt(req.params.id);
    const { completed } = req.body;

    // 这里应该更新数据库，现在先返回成功响应
    res.json({
      status: 'success',
      message: '练习状态更新成功',
      data: {
        id: exerciseId,
        completed: completed
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '更新练习状态失败',
      error: error.message
    });
  }
});

export default router;