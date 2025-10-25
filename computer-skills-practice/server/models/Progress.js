import { getDatabase, initDatabase } from '../database/init.js';

// 初始化数据库
const db = initDatabase();

class Progress {
  constructor(progressData) {
    this.id = progressData.id || null;
    this.userId = progressData.user_id || progressData.userId;
    this.courseId = progressData.course_id || progressData.courseId;
    this.challengeId = progressData.challenge_id || progressData.challengeId;
    this.completed = progressData.completed || false;
    this.score = progressData.score || 0;
    this.completedAt = progressData.completed_at || progressData.completedAt || null;
    this.createdAt = progressData.created_at || progressData.createdAt || new Date().toISOString();
    this.updatedAt = progressData.updated_at || progressData.updatedAt || new Date().toISOString();
  }

  // 获取用户的所有进度
  static getUserProgress(userId) {
    try {
      const progress = db.prepare(`
        SELECT * FROM user_progress 
        WHERE user_id = ?
        ORDER BY course_id, challenge_id
      `).all(userId);
      
      return progress.map(p => new Progress(p));
    } catch (error) {
      console.error('获取用户进度失败:', error);
      return [];
    }
  }

  // 获取用户特定课程的进度
  static getUserCourseProgress(userId, courseId) {
    try {
      const progress = db.prepare(`
        SELECT * FROM user_progress 
        WHERE user_id = ? AND course_id = ?
        ORDER BY challenge_id
      `).all(userId, courseId);
      
      return progress.map(p => new Progress(p));
    } catch (error) {
      console.error('获取用户课程进度失败:', error);
      return [];
    }
  }

  // 获取用户特定挑战的进度
  static getUserChallengeProgress(userId, courseId, challengeId) {
    try {
      const progress = db.prepare(`
        SELECT * FROM user_progress 
        WHERE user_id = ? AND course_id = ? AND challenge_id = ?
      `).get(userId, courseId, challengeId);
      
      return progress ? new Progress(progress) : null;
    } catch (error) {
      console.error('获取用户挑战进度失败:', error);
      return null;
    }
  }

  // 更新或创建用户进度
  static updateProgress(userId, courseId, challengeId, progressData = {}) {
    try {
      const { completed = false, score = 0 } = progressData;
      
      // 使用 UPSERT (INSERT OR REPLACE) 语法
      const upsertProgress = db.prepare(`
        INSERT INTO user_progress (user_id, course_id, challenge_id, completed, score, completed_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, course_id, challenge_id) 
        DO UPDATE SET 
          completed = excluded.completed,
          score = excluded.score,
          completed_at = excluded.completed_at,
          updated_at = CURRENT_TIMESTAMP
      `);
      
      const completedAt = completed ? new Date().toISOString() : null;
      
      const result = upsertProgress.run(
        userId,
        courseId,
        challengeId,
        completed ? 1 : 0,
        score,
        completedAt
      );
      
      // 返回更新后的进度
      return this.getUserChallengeProgress(userId, courseId, challengeId);
    } catch (error) {
      console.error('更新用户进度失败:', error);
      throw error;
    }
  }

  // 标记挑战完成
  static completeChallenge(userId, courseId, challengeId, score = 0) {
    return this.updateProgress(userId, courseId, challengeId, {
      completed: true,
      score: score
    });
  }

  // 获取用户在某个课程中的完成统计
  static getCourseStats(userId, courseId) {
    try {
      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total_challenges,
          COUNT(CASE WHEN completed = 1 THEN 1 END) as completed_challenges,
          AVG(CASE WHEN completed = 1 THEN score ELSE NULL END) as average_score,
          MAX(score) as best_score
        FROM user_progress 
        WHERE user_id = ? AND course_id = ?
      `).get(userId, courseId);
      
      return {
        totalChallenges: stats.total_challenges || 0,
        completedChallenges: stats.completed_challenges || 0,
        averageScore: stats.average_score || 0,
        bestScore: stats.best_score || 0,
        completionRate: stats.total_challenges > 0 ? 
          (stats.completed_challenges / stats.total_challenges * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error('获取课程统计失败:', error);
      return {
        totalChallenges: 0,
        completedChallenges: 0,
        averageScore: 0,
        bestScore: 0,
        completionRate: 0
      };
    }
  }

  // 获取用户的总体统计
  static getUserStats(userId) {
    try {
      const stats = db.prepare(`
        SELECT 
          COUNT(DISTINCT course_id) as total_courses,
          COUNT(*) as total_challenges,
          COUNT(CASE WHEN completed = 1 THEN 1 END) as completed_challenges,
          AVG(CASE WHEN completed = 1 THEN score ELSE NULL END) as average_score,
          MAX(score) as best_score
        FROM user_progress 
        WHERE user_id = ?
      `).get(userId);
      
      return {
        totalCourses: stats.total_courses || 0,
        totalChallenges: stats.total_challenges || 0,
        completedChallenges: stats.completed_challenges || 0,
        averageScore: stats.average_score || 0,
        bestScore: stats.best_score || 0,
        completionRate: stats.total_challenges > 0 ? 
          (stats.completed_challenges / stats.total_challenges * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error('获取用户统计失败:', error);
      return {
        totalCourses: 0,
        totalChallenges: 0,
        completedChallenges: 0,
        averageScore: 0,
        bestScore: 0,
        completionRate: 0
      };
    }
  }

  // 删除用户进度
  static deleteUserProgress(userId, courseId = null, challengeId = null) {
    try {
      let sql = 'DELETE FROM user_progress WHERE user_id = ?';
      let params = [userId];
      
      if (courseId) {
        sql += ' AND course_id = ?';
        params.push(courseId);
        
        if (challengeId) {
          sql += ' AND challenge_id = ?';
          params.push(challengeId);
        }
      }
      
      const deleteProgress = db.prepare(sql);
      const result = deleteProgress.run(...params);
      
      return result.changes > 0;
    } catch (error) {
      console.error('删除用户进度失败:', error);
      return false;
    }
  }

  // 获取排行榜数据
  static getLeaderboard(courseId = null, limit = 10) {
    try {
      let sql = `
        SELECT 
          u.id,
          u.username,
          u.experience,
          COUNT(CASE WHEN p.completed = 1 THEN 1 END) as completed_challenges,
          AVG(CASE WHEN p.completed = 1 THEN p.score ELSE NULL END) as average_score,
          MAX(p.score) as best_score
        FROM users u
        LEFT JOIN user_progress p ON u.id = p.user_id
      `;
      
      let params = [];
      
      if (courseId) {
        sql += ' WHERE p.course_id = ?';
        params.push(courseId);
      }
      
      sql += `
        GROUP BY u.id, u.username, u.experience
        ORDER BY u.experience DESC, completed_challenges DESC, average_score DESC
        LIMIT ?
      `;
      
      params.push(limit);
      
      const leaderboard = db.prepare(sql).all(...params);
      
      return leaderboard.map((entry, index) => ({
        rank: index + 1,
        userId: entry.id,
        username: entry.username,
        experience: entry.experience || 0,
        completedChallenges: entry.completed_challenges || 0,
        averageScore: entry.average_score || 0,
        bestScore: entry.best_score || 0
      }));
    } catch (error) {
      console.error('获取排行榜失败:', error);
      return [];
    }
  }
}

export default Progress;