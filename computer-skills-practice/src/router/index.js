import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import UserProfile from '../views/UserProfile.vue'
import AdminPanel from '../views/AdminPanel.vue'
import PracticeCenter from '../views/PracticeCenter.vue'
import CourseView from '../views/CourseView.vue'
import CourseResult from '../views/CourseResult.vue'
import DesignLanguage from '../views/DesignLanguage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPanel,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/practice',
      name: 'practice-center',
      component: PracticeCenter,
      meta: { requiresAuth: true }
    },
    {
      path: '/practice/:courseId',
      name: 'course',
      component: CourseView,
      meta: { requiresAuth: true }
    },
    {
      path: '/practice/:courseId/result',
      name: 'course-result',
      component: CourseResult,
      meta: { requiresAuth: true }
    },
    {
      path: '/design-language',
      name: 'design-language',
      component: DesignLanguage
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 检查是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        const user = data.data.user
        
        // 检查是否需要管理员权限
        if (to.matched.some(record => record.meta.requiresAdmin)) {
          if (user.role !== 'admin') {
            next('/')
            return
          }
        }
        
        next()
      } else {
        next('/auth')
      }
    } catch (error) {
      console.error('路由守卫检查失败:', error)
      next('/auth')
    }
  } else {
    next()
  }
})

export default router