<template>
  <div class="h-screen bg-gray-50 w-screen">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 正文部分 -->
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-center items-center gap-8 min-h-[calc(100vh-200px)] w-full">
        <!-- 左侧卡片：练习推荐 -->
        <PracticeRecommendationCard 
          :courses="courses"
          :user-progress="userProgress"
        />
        
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
import NavBar from '../../components/NavBar.vue'
import PracticeRecommendationCard from './components/PracticeRecommendationCard.vue'
import QuickNavigationCard from './components/QuickNavigationCard.vue'
import UserStatsSection from './components/UserStatsSection.vue'

// 响应式数据
const courses = ref([])
const userProgress = ref({})
const userStats = ref({
  experience: 0,
  completedCourses: 0,
  totalCourses: 0
})

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
</style>