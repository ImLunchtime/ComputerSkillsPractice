import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/UserSQLite.js';
import Progress from '../models/Progress.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 课程数据文件路径（继续使用JSON）
const COURSES_FILE = path.join(__dirname, '../data/courses.json');

// 确保课程数据文件存在
const ensureCoursesFile = () => {
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

// 获取所有课程
router.get('/', requireAuth, (req, res) => {
  try {
    ensureCoursesFile();
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
    ensureCoursesFile();
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
    const userId = req.user.id;
    const userProgress = Progress.getUserProgress(userId);
    
    // 将进度数据转换为原有格式以保持兼容性
    const progressByUser = {};
    progressByUser[userId] = {};
    
    userProgress.forEach(progress => {
      if (!progressByUser[userId][progress.courseId]) {
        progressByUser[userId][progress.courseId] = {};
      }
      progressByUser[userId][progress.courseId][progress.challengeId] = {
        completed: progress.completed,
        score: progress.score,
        completedAt: progress.completedAt
      };
    });
    
    res.json({
      status: 'success',
      data: {
        progress: progressByUser[userId] || {}
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

// 获取用户特定课程进度
router.get('/progress/:courseId', requireAuth, (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    const courseProgress = Progress.getUserCourseProgress(userId, courseId);
    
    // 转换为原有格式
    const progressData = {};
    courseProgress.forEach(progress => {
      progressData[progress.challengeId] = {
        completed: progress.completed,
        score: progress.score,
        completedAt: progress.completedAt
      };
    });
    
    res.json({
      status: 'success',
      data: {
        progress: progressData
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

// 更新挑战进度
router.post('/progress/:courseId/:challengeId', requireAuth, (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    const challengeId = parseInt(req.params.challengeId);
    const { completed = false, score = 0 } = req.body;
    
    // 更新进度
    const updatedProgress = Progress.updateProgress(userId, courseId, challengeId, {
      completed,
      score
    });
    
    if (updatedProgress) {
      res.json({
        status: 'success',
        message: '进度更新成功',
        data: {
          progress: {
            completed: updatedProgress.completed,
            score: updatedProgress.score,
            completedAt: updatedProgress.completedAt
          }
        }
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: '进度更新失败'
      });
    }
  } catch (error) {
    console.error('更新挑战进度失败:', error);
    res.status(500).json({
      status: 'error',
      message: '更新挑战进度失败'
    });
  }
});

// 完成课程并获得经验奖励
router.post('/complete/:courseId', requireAuth, (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    
    // 获取课程信息
    ensureCoursesFile();
    const coursesData = readCoursesData();
    const course = coursesData.courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: '课程不存在'
      });
    }
    
    // 检查用户是否完成了所有挑战
    const courseProgress = Progress.getUserCourseProgress(userId, courseId);
    const completedChallenges = courseProgress.filter(p => p.completed).length;
    const totalChallenges = course.challenges.length;
    
    if (completedChallenges < totalChallenges) {
      return res.status(400).json({
        status: 'error',
        message: '请先完成所有挑战'
      });
    }
    
    // 计算经验奖励
    let experienceReward = 0;
    switch (course.difficulty) {
      case '初级':
        experienceReward = 50;
        break;
      case '中级':
        experienceReward = 100;
        break;
      case '高级':
        experienceReward = 200;
        break;
      default:
        experienceReward = 50;
    }
    
    // 根据完成质量调整奖励
    const averageScore = courseProgress.reduce((sum, p) => sum + (p.score || 0), 0) / completedChallenges;
    if (averageScore >= 90) {
      experienceReward = Math.floor(experienceReward * 1.5); // 优秀完成奖励50%
    } else if (averageScore >= 70) {
      experienceReward = Math.floor(experienceReward * 1.2); // 良好完成奖励20%
    }
    
    // 更新用户经验值
    const updatedUser = User.updateExperience(userId, experienceReward);
    
    if (updatedUser) {
      res.json({
        status: 'success',
        message: '课程完成！',
        data: {
          experienceReward,
          totalExperience: updatedUser.experience,
          courseStats: Progress.getCourseStats(userId, courseId)
        }
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: '经验值更新失败'
      });
    }
  } catch (error) {
    console.error('完成课程失败:', error);
    res.status(500).json({
      status: 'error',
      message: '完成课程失败'
    });
  }
});

// 删除用户课程进度
router.delete('/progress/:courseId', requireAuth, (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    
    const success = Progress.deleteUserProgress(userId, courseId);
    
    if (success) {
      res.json({
        status: 'success',
        message: '课程进度已重置'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: '重置课程进度失败'
      });
    }
  } catch (error) {
    console.error('删除课程进度失败:', error);
    res.status(500).json({
      status: 'error',
      message: '删除课程进度失败'
    });
  }
});

// 获取课程统计信息
router.get('/stats/:courseId', requireAuth, (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    
    const stats = Progress.getCourseStats(userId, courseId);
    
    res.json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('获取课程统计失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取课程统计失败'
    });
  }
});

// 获取用户总体统计
router.get('/stats/user/overview', requireAuth, (req, res) => {
  try {
    const userId = req.user.id;
    const stats = Progress.getUserStats(userId);
    
    res.json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('获取用户统计失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取用户统计失败'
    });
  }
});

// 获取排行榜
router.get('/leaderboard/:courseId', requireAuth, (req, res) => {
  try {
    const courseId = req.params.courseId;
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = Progress.getLeaderboard(courseId, limit);
    
    res.json({
      status: 'success',
      data: leaderboard
    });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取排行榜失败'
    });
  }
});

// 获取全局排行榜
router.get('/leaderboard', requireAuth, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = Progress.getLeaderboard(null, limit);
    
    res.json({
      status: 'success',
      data: leaderboard
    });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取排行榜失败'
    });
  }
});

export default router;