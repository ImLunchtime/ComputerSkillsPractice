import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 课程数据文件路径
const COURSES_FILE = path.join(__dirname, '../data/courses.json');
const PROGRESS_FILE = path.join(__dirname, '../data/progress.json');

// 确保数据文件存在
const ensureDataFiles = () => {
  // 确保courses.json存在
  if (!fs.existsSync(COURSES_FILE)) {
    const initialCourses = {
      courses: [
        {
          id: 'click-course',
          title: '点击',
          description: '学习基本的鼠标点击操作',
          icon: '👆',
          difficulty: '初级',
          challenges: [
            {
              id: 1,
              title: '单击挑战',
              description: '点击按钮完成挑战',
              type: 'click'
            },
            {
              id: 2,
              title: '双击挑战',
              description: '快速双击按钮完成挑战',
              type: 'double-click'
            }
          ]
        }
      ]
    };
    fs.writeFileSync(COURSES_FILE, JSON.stringify(initialCourses, null, 2));
  }
  
  // 确保progress.json存在
  if (!fs.existsSync(PROGRESS_FILE)) {
    const initialProgress = {
      userProgress: {}
    };
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(initialProgress, null, 2));
  }
};

// 读取课程数据
const readCoursesData = () => {
  try {
    const data = fs.readFileSync(COURSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取课程数据失败:', error);
    return { courses: [] };
  }
};

// 读取进度数据
const readProgressData = () => {
  try {
    const data = fs.readFileSync(PROGRESS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取进度数据失败:', error);
    return { userProgress: {} };
  }
};

// 写入进度数据
const writeProgressData = (data) => {
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('写入进度数据失败:', error);
  }
};

// 获取所有课程
router.get('/', requireAuth, (req, res) => {
  try {
    ensureDataFiles();
    const coursesData = readCoursesData();
    
    res.json({
      status: 'success',
      data: {
        courses: coursesData.courses
      }
    });
  } catch (error) {
    console.error('获取课程列表失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取课程列表失败'
    });
  }
});

// 获取特定课程
router.get('/:courseId', requireAuth, (req, res) => {
  try {
    ensureDataFiles();
    const coursesData = readCoursesData();
    const course = coursesData.courses.find(c => c.id === req.params.courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: '课程不存在'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    console.error('获取课程详情失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取课程详情失败'
    });
  }
});

// 获取用户所有进度
router.get('/progress/all', requireAuth, (req, res) => {
  try {
    ensureDataFiles();
    const progressData = readProgressData();
    const userId = req.user.id; // 使用req.user.id而不是req.session.user.id
    const userProgress = progressData.userProgress[userId] || {};
    
    res.json({
      status: 'success',
      data: {
        progress: userProgress
      }
    });
  } catch (error) {
    console.error('获取用户进度失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取用户进度失败'
    });
  }
});

// 获取特定课程的进度
router.get('/progress/:courseId', requireAuth, (req, res) => {
  try {
    ensureDataFiles();
    const progressData = readProgressData();
    const userId = req.user.id; // 使用req.user.id而不是req.session.user.id
    const courseProgress = progressData.userProgress[userId]?.[req.params.courseId] || {};
    
    res.json({
      status: 'success',
      data: {
        progress: courseProgress
      }
    });
  } catch (error) {
    console.error('获取课程进度失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取课程进度失败'
    });
  }
});

// 更新挑战完成状态
router.post('/progress/:courseId/:challengeId', requireAuth, (req, res) => {
  try {
    ensureDataFiles();
    const progressData = readProgressData();
    const userId = req.user.id; // 使用req.user.id而不是req.session.user.id
    const { courseId, challengeId } = req.params;
    const { completed } = req.body;
    
    // 确保用户进度结构存在
    if (!progressData.userProgress[userId]) {
      progressData.userProgress[userId] = {};
    }
    if (!progressData.userProgress[userId][courseId]) {
      progressData.userProgress[userId][courseId] = {};
    }
    
    // 更新挑战完成状态
    progressData.userProgress[userId][courseId][challengeId] = completed;
    
    // 保存数据
    writeProgressData(progressData);
    
    res.json({
      status: 'success',
      message: '进度更新成功',
      data: {
        courseId,
        challengeId,
        completed
      }
    });
  } catch (error) {
    console.error('更新进度失败:', error);
    res.status(500).json({
      status: 'error',
      message: '更新进度失败'
    });
  }
});

// 重置课程进度
router.delete('/progress/:courseId', requireAuth, (req, res) => {
  try {
    ensureDataFiles();
    const progressData = readProgressData();
    const userId = req.user.id; // 使用req.user.id而不是req.session.user.id
    const { courseId } = req.params;
    
    // 删除课程进度
    if (progressData.userProgress[userId] && progressData.userProgress[userId][courseId]) {
      delete progressData.userProgress[userId][courseId];
    }
    
    // 保存数据
    writeProgressData(progressData);
    
    res.json({
      status: 'success',
      message: '课程进度已重置'
    });
  } catch (error) {
    console.error('重置进度失败:', error);
    res.status(500).json({
      status: 'error',
      message: '重置进度失败'
    });
  }
});

export default router;