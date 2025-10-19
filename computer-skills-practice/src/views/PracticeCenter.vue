<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 主要内容 -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">练习中心</h1>
        <p class="text-xl text-gray-600">选择一个课程开始你的计算机技能学习之旅</p>
      </div>

      <!-- 用户进度概览 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">学习进度</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ completedCourses }}</div>
            <div class="text-gray-600">已完成课程</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{{ totalChallenges }}</div>
            <div class="text-gray-600">完成的挑战</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600">{{ Math.round(overallProgress) }}%</div>
            <div class="text-gray-600">总体进度</div>
          </div>
        </div>
      </div>

      <!-- 课程列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="course in courses" 
          :key="course.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          @click="startCourse(course)"
        >
          <div class="p-6">
            <!-- 课程图标 -->
            <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-2xl">{{ course.icon }}</span>
            </div>
            
            <!-- 课程信息 -->
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ course.title }}</h3>
            <p class="text-gray-600 mb-4">{{ course.description }}</p>
            
            <!-- 课程统计 -->
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm text-gray-500">{{ course.challenges.length }} 个挑战</span>
              <span class="text-sm text-gray-500">{{ course.difficulty }}</span>
            </div>
            
            <!-- 进度条 -->
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: getCourseProgress(course.id) + '%' }"
              ></div>
            </div>
            
            <!-- 状态标签 -->
            <div class="flex justify-between items-center">
              <span 
                v-if="getCourseProgress(course.id) === 100"
                class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                已完成
              </span>
              <span 
                v-else-if="getCourseProgress(course.id) > 0"
                class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
              >
                进行中
              </span>
              <span 
                v-else
                class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
              >
                未开始
              </span>
              
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                {{ getCourseProgress(course.id) === 100 ? '重新练习' : '开始练习' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="courses.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">📚</div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">暂无课程</h3>
        <p class="text-gray-500">课程正在准备中，请稍后再来查看</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const router = useRouter()
const courses = ref([])
const userProgress = ref({})

// 计算属性
const completedCourses = computed(() => {
  return courses.value.filter(course => getCourseProgress(course.id) === 100).length
})

const totalChallenges = computed(() => {
  let total = 0
  courses.value.forEach(course => {
    const progress = userProgress.value[course.id] || {}
    total += Object.values(progress).filter(completed => completed).length
  })
  return total
})

const overallProgress = computed(() => {
  if (courses.value.length === 0) return 0
  let totalProgress = 0
  courses.value.forEach(course => {
    totalProgress += getCourseProgress(course.id)
  })
  return totalProgress / courses.value.length
})

// 获取课程进度
const getCourseProgress = (courseId) => {
  const course = courses.value.find(c => c.id === courseId)
  if (!course) return 0
  
  const progress = userProgress.value[courseId] || {}
  const completedChallenges = Object.values(progress).filter(completed => completed).length
  return Math.round((completedChallenges / course.challenges.length) * 100)
}

// 开始课程
const startCourse = (course) => {
  router.push(`/practice/${course.id}`)
}

// 加载课程数据
const loadCourses = async () => {
  try {
    const response = await fetch('/api/courses', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      courses.value = data.data.courses
    }
  } catch (error) {
    console.error('加载课程失败:', error)
  }
}

// 加载用户进度
const loadUserProgress = async () => {
  try {
    const response = await fetch('/api/progress', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      userProgress.value = data.data.progress
    }
  } catch (error) {
    console.error('加载用户进度失败:', error)
  }
}

onMounted(() => {
  loadCourses()
  loadUserProgress()
})
</script>

<style scoped>
/* 组件特定样式 */
</style>