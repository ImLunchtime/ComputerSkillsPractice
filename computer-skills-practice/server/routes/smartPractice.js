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

// 课程数据文件路径
const COURSES_FILE = path.join(__dirname, '../data/courses.json');

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

// 获取用户学习进度（使用SQLite）
const getUserLearningProgress = (userId, courses) => {
  try {
    let completedCoursesCount = 0;
    const completedCourses = [];
    
    for (const course of courses) {
      const progressRecords = Progress.getUserCourseProgress(userId, course.id);
      
      const completedChallenges = progressRecords.filter(record => record.completed).length;
      const totalChallenges = course.challenges ? course.challenges.length : 0;
      
      if (totalChallenges > 0 && completedChallenges === totalChallenges) {
        completedCoursesCount++;
        completedCourses.push(course);
      }
    }
    
    return {
      completedCoursesCount,
      completedCourses,
      totalCourses: courses.length
    };
  } catch (error) {
    console.error('获取用户学习进度失败:', error);
    return {
      completedCoursesCount: 0,
      completedCourses: [],
      totalCourses: courses.length
    };
  }
};

// 随机打乱数组
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 生成复习部分挑战
const generateReviewChallenges = (completedCourses) => {
  if (completedCourses.length === 0) {
    return [];
  }
  
  // 随机选择最多2个已完成的课程
  const selectedCourses = shuffleArray(completedCourses).slice(0, 2);
  const reviewChallenges = [];
  
  selectedCourses.forEach(course => {
    if (course.challenges) {
      course.challenges.forEach(challenge => {
        reviewChallenges.push({
          ...challenge,
          courseId: course.id,
          courseTitle: course.title,
          component: getComponentPath(course.id, challenge.type || challenge.title)
        });
      });
    }
  });
  
  // 打散复习挑战的顺序
  return shuffleArray(reviewChallenges);
};

// 生成新课部分挑战
const generateNewCourseChallenges = (courses, userProgress) => {
  const nextCourseIndex = userProgress + 1;
  
  if (nextCourseIndex > courses.length) {
    return []; // 已经学完所有课程
  }
  
  const nextCourse = courses[nextCourseIndex - 1]; // 数组索引从0开始
  if (!nextCourse || !nextCourse.challenges) {
    return [];
  }
  
  const newChallenges = nextCourse.challenges.map(challenge => ({
    ...challenge,
    courseId: nextCourse.id,
    courseTitle: nextCourse.title,
    component: getComponentPath(nextCourse.id, challenge.type || challenge.title)
  }));
  
  // 随机排序新课挑战
  return shuffleArray(newChallenges);
};

// 根据课程ID和挑战类型获取组件路径
const getComponentPath = (courseId, challengeType) => {
  const componentMap = {
    'click-course': {
      '单击挑战': 'challenges/01-click-course/ClickChallenge.vue',
      'click': 'challenges/01-click-course/ClickChallenge.vue',
      '双击挑战': 'challenges/01-click-course/DoubleClickChallenge.vue',
      'double-click': 'challenges/01-click-course/DoubleClickChallenge.vue'
    },
    'drag-course': {
      '文件拖拽': 'challenges/02-drag-course/FileDragChallenge.vue',
      'file-drag': 'challenges/02-drag-course/FileDragChallenge.vue',
      '列表拖拽': 'challenges/02-drag-course/ListDragChallenge.vue',
      'list-drag': 'challenges/02-drag-course/ListDragChallenge.vue'
    },
    'context-menu-course': {
      '右键菜单新建文档': 'challenges/03-context-menu-course/ContextMenuNewFileChallenge.vue',
      'context-new-file': 'challenges/03-context-menu-course/ContextMenuNewFileChallenge.vue',
      '右键菜单复制粘贴': 'challenges/03-context-menu-course/ContextMenuCopyPasteChallenge.vue',
      'context-copy-paste': 'challenges/03-context-menu-course/ContextMenuCopyPasteChallenge.vue',
      '右键菜单打开': 'challenges/03-context-menu-course/ContextMenuOpenChallenge.vue',
      'context-open': 'challenges/03-context-menu-course/ContextMenuOpenChallenge.vue'
    },
    'shortcut-course': {
      '快捷键复制粘贴': 'challenges/04-shortcut-course/ShortcutCopyPasteChallenge.vue',
      'shortcut-copy-paste': 'challenges/04-shortcut-course/ShortcutCopyPasteChallenge.vue',
      '快捷键全选复制粘贴': 'challenges/04-shortcut-course/ShortcutSelectAllChallenge.vue',
      'shortcut-select-all': 'challenges/04-shortcut-course/ShortcutSelectAllChallenge.vue'
    },
    'url-basics-course': {
      '浏览器地址栏识别': 'challenges/05-url-basics-course/AddressBarChallenge.vue',
      'address-bar': 'challenges/05-url-basics-course/AddressBarChallenge.vue',
      'URL一级域名识别': 'challenges/05-url-basics-course/DomainIdentificationChallenge.vue',
      'domain-identification': 'challenges/05-url-basics-course/DomainIdentificationChallenge.vue',
      'URL后缀识别': 'challenges/05-url-basics-course/SuffixIdentificationChallenge.vue',
      'suffix-identification': 'challenges/05-url-basics-course/SuffixIdentificationChallenge.vue',
      '合法URL识别': 'challenges/05-url-basics-course/ValidUrlChallenge.vue',
      'valid-url': 'challenges/05-url-basics-course/ValidUrlChallenge.vue'
    }
  };
  
  const courseComponents = componentMap[courseId];
  if (courseComponents && courseComponents[challengeType]) {
    return courseComponents[challengeType];
  }
  
  // 默认返回第一个组件
  if (courseComponents) {
    return Object.values(courseComponents)[0];
  }
  
  return 'challenges/01-click-course/ClickChallenge.vue'; // 默认组件
};

// 生成智能练习API
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const coursesData = readCoursesData();
    const courses = coursesData.courses || [];
    
    if (courses.length === 0) {
      return res.json({
        status: 'success',
        message: '暂无可用课程',
        data: {
          reviewChallenges: [],
          newChallenges: []
        }
      });
    }
    
    // 获取用户学习进度
    const userProgress = getUserLearningProgress(userId, courses);
    
    // 生成复习部分挑战
    const reviewChallenges = generateReviewChallenges(userProgress.completedCourses);
    
    // 生成新课部分挑战
    const newChallenges = generateNewCourseChallenges(courses, userProgress.completedCoursesCount);
    
    res.json({
      status: 'success',
      message: '智能练习生成成功',
      data: {
        reviewChallenges,
        newChallenges,
        userProgress: {
          completed: userProgress.completedCoursesCount,
          total: userProgress.totalCourses
        }
      }
    });
    
  } catch (error) {
    console.error('生成智能练习失败:', error);
    res.status(500).json({
      status: 'error',
      message: '生成智能练习失败'
    });
  }
});

// 完成智能练习API
router.post('/complete', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { newCourseIds, completionTime, reviewCount, newCount } = req.body;
    
    // 标记新课程为已完成
    if (newCourseIds && newCourseIds.length > 0) {
      const coursesData = readCoursesData();
      const courses = coursesData.courses || [];
      
      for (const courseId of newCourseIds) {
        const course = courses.find(c => c.id === courseId);
        if (course && course.challenges) {
          // 为每个挑战创建或更新进度记录
          for (const challenge of course.challenges) {
            Progress.updateProgress(userId, courseId, challenge.id, {
              completed: true,
              score: 100
            });
          }
        }
      }
    }
    
    // 计算经验值奖励
    let experienceReward = 0;
    experienceReward += (reviewCount || 0) * 5; // 复习奖励：每个5XP
    experienceReward += (newCount || 0) * 10; // 新学奖励：每个10XP
    experienceReward += (newCourseIds?.length || 0) * 30; // 完成课程奖励：每个30XP
    experienceReward += 20; // 智能练习完成奖励：20XP
    
    // 更新用户经验值
    if (experienceReward > 0) {
      const user = User.findById(userId);
      if (user) {
        User.updateExperience(userId, experienceReward);
      }
    }
    
    res.json({
      status: 'success',
      message: '智能练习完成',
      data: {
        experienceReward,
        newCoursesCompleted: newCourseIds?.length || 0
      }
    });
    
  } catch (error) {
    console.error('完成智能练习失败:', error);
    res.status(500).json({
      status: 'error',
      message: '完成智能练习失败'
    });
  }
});

export default router;