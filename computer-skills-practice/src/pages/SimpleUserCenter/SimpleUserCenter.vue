<template>
  <div class="h-screen bg-gray-50 w-screen">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 正文部分 -->
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-center items-center gap-12 min-h-[calc(100vh-200px)] w-full">
        <!-- 左侧：大的绿色圆形开始练习按钮 -->
        <div class="flex-shrink-0">
          <button 
            @click="startSmartPractice"
            class="start-practice-button group relative overflow-hidden"
          >
            <!-- 背景渐变 -->
            <div class="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 transition-all duration-300 group-hover:from-green-500 group-hover:to-green-700"></div>
            
            <!-- 悬停效果 -->
            <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            <!-- 内容 -->
            <div class="relative z-10 flex flex-col items-center justify-center text-white">
              <!-- 图标 -->
              <div class="text-6xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                🚀
              </div>
              
              <!-- 文字 -->
              <div class="text-2xl font-bold tracking-wide">
                开始练习
              </div>
              
              <!-- 副标题 -->
              <div class="text-sm opacity-90 mt-2">
                智能推荐练习内容
              </div>
            </div>
            
            <!-- 装饰性光圈 -->
            <div class="absolute inset-4 border-2 border-white border-opacity-30 rounded-full"></div>
          </button>
        </div>
        
        <!-- 右侧卡片：功能按钮和用户信息 -->
        <QuickNavigationCard>
          <template #user-stats>
            <UserStatsSection :user-stats="userStats" />
          </template>
        </QuickNavigationCard>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/NavBar.vue'
import QuickNavigationCard from './components/QuickNavigationCard.vue'
import UserStatsSection from './components/UserStatsSection.vue'

const router = useRouter()

// 响应式数据
const courses = ref([])
const userProgress = ref({})
const userStats = ref({
  experience: 0,
  completedCourses: 0,
  totalCourses: 0
})

// 开始智能练习
const startSmartPractice = () => {
  router.push('/smart-practice')
}

// API 调用方法
const fetchCourses = async () => {
  try {
    const response = await fetch('/api/courses', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      courses.value = data.data.courses
      userStats.value.totalCourses = courses.value.length
    }
  } catch (error) {
    console.error('获取课程失败:', error)
  }
}

const fetchUserProgress = async () => {
  try {
    const response = await fetch('/api/courses/progress/all', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      userProgress.value = data.data.progress
      
      // 计算完成的课程数量和经验值
      let totalExperience = 0
      let completedCourses = 0
      
      courses.value.forEach(course => {
        const progress = userProgress.value[course.id] || {}
        const completedChallenges = Object.values(progress).filter(completed => completed).length
        const totalChallenges = course.challenges ? course.challenges.length : 0
        
        // 如果课程完全完成，计入完成课程数
        if (completedChallenges === totalChallenges && totalChallenges > 0) {
          completedCourses++
        }
        
        // 每完成一个挑战获得10经验，完成整个课程额外获得50经验
        totalExperience += completedChallenges * 10
        if (completedChallenges === totalChallenges && totalChallenges > 0) {
          totalExperience += 50
        }
      })
      
      userStats.value.completedCourses = completedCourses
      userStats.value.experience = totalExperience
    }
  } catch (error) {
    console.error('获取用户进度失败:', error)
  }
}

// 生命周期
onMounted(async () => {
  await fetchCourses()
  await fetchUserProgress()
})
</script>

<style scoped>
/* 自定义样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 确保页面完全居中 */
main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
}

/* 开始练习按钮样式 */
.start-practice-button {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
  position: relative;
}

.start-practice-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 20px 40px rgba(34, 197, 94, 0.4);
}

.start-practice-button:active {
  transform: translateY(-2px) scale(1.02);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .start-practice-button {
    width: 220px;
    height: 220px;
  }
  
  .start-practice-button .text-6xl {
    font-size: 3rem;
  }
  
  .start-practice-button .text-2xl {
    font-size: 1.5rem;
  }
}
</style>