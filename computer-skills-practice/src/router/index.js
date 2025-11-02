import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/Home/HomeView.vue'
import AuthView from '../pages/Auth/AuthView.vue'
import UserProfile from '../pages/Profile/UserProfile.vue'
import AdminPanel from '../pages/Admin/AdminPanel.vue'
import PracticeCenter from '../pages/Practice/PracticeCenter.vue'
import SimpleUserCenter from '../pages/SimpleUserCenter/SimpleUserCenter.vue'
import CourseView from '../pages/Course/CourseView.vue'
import CourseResult from '../pages/Course/CourseResult.vue'
import SmartPracticeView from '../pages/SmartPracticeView.vue'
import SmartPracticeResult from '../pages/SmartPracticeResult.vue'
import DesignLanguage from '../pages/DesignLanguage/DesignLanguage.vue'

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
      path: '/all-practice',
      name: 'practice-center',
      component: PracticeCenter,
      meta: { requiresAuth: true }
    },
    {
    path: '/uc',
    name: 'simple-practice-center',
    component: SimpleUserCenter,
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
      path: '/smart-practice',
      name: 'smart-practice',
      component: SmartPracticeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/smart-practice/result',
      name: 'smart-practice-result',
      component: SmartPracticeResult,
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