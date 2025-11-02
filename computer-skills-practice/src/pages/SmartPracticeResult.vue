<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 结果内容 -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <!-- 标题区域 -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">练习完成！</h1>
          <p class="text-gray-600">恭喜你</p>
        </div>
        
        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- 完成时间 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600">完成时间</p>
                <p class="text-2xl font-bold text-gray-800">{{ formatTime(completionTime) }}</p>
              </div>
            </div>
          </div>
          
          <!-- 练习数量 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600">练习总数</p>
                <p class="text-2xl font-bold text-gray-800">{{ totalChallenges }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 详细统计 -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">练习详情</h2>
          <div class="space-y-4">
            <!-- 复习挑战 -->
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-800">复习挑战</p>
                  <p class="text-sm text-gray-600">巩固已学知识</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-blue-600">{{ reviewCount }}</p>
                <p class="text-sm text-gray-500">+{{ reviewCount * 5 }}XP</p>
              </div>
            </div>
            
            <!-- 新学挑战 -->
            <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-800">新学挑战</p>
                  <p class="text-sm text-gray-600">学习新技能</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-green-600">{{ newCount }}</p>
                <p class="text-sm text-gray-500">+{{ newCount * 10 }}XP</p>
              </div>
            </div>
            
            <!-- 课程完成 -->
            <div v-if="newCoursesCompleted > 0" class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-800">完成课程</p>
                  <p class="text-sm text-gray-600">新完成的课程数量</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-yellow-600">{{ newCoursesCompleted }}</p>
                <p class="text-sm text-gray-500">+{{ newCoursesCompleted * 30 }}XP</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 经验奖励 -->
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white mb-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">经验奖励</h3>
            <p class="text-3xl font-bold mb-2">+{{ experienceReward }} XP</p>
            <p class="text-sm opacity-90">继续努力，提升你的技能等级！</p>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button 
            @click="goToUserCenter"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            返回用户中心
          </button>
          <button 
            @click="startNewPractice"
            class="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            再来一次
          </button>
        </div>
        
        <!-- 学习建议 -->
        <div class="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">学习建议</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <p v-if="reviewCount > 0">✨ 你通过复习巩固了 {{ reviewCount }} 个技能点，保持这个好习惯！</p>
            <p v-if="newCount > 0">🚀 你学习了 {{ newCount }} 个新技能，继续探索更多内容吧！</p>
            <p v-if="newCoursesCompleted > 0">🎉 恭喜完成 {{ newCoursesCompleted }} 个新课程，你的技能在不断提升！</p>
            <p>💡 建议每天进行智能练习，让AI为你推荐最适合的学习内容。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const router = useRouter()
const route = useRoute()

// 从路由参数获取数据
const completionTime = ref(parseInt(route.query.completionTime) || 0)
const reviewCount = ref(parseInt(route.query.reviewCount) || 0)
const newCount = ref(parseInt(route.query.newCount) || 0)
const newCoursesCompleted = ref(parseInt(route.query.newCoursesCompleted) || 0)
const experienceReward = ref(parseInt(route.query.experienceReward) || 0)

// 计算属性
const totalChallenges = computed(() => reviewCount.value + newCount.value)

// 方法
const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds}秒`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}分${remainingSeconds}秒`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}小时${minutes}分钟`
  }
}

const goToUserCenter = () => {
  router.push('/uc')
}

const startNewPractice = () => {
  router.push('/smart-practice')
}

// 生命周期
onMounted(() => {
  // 如果没有结果数据，重定向到用户中心
  if (totalChallenges.value === 0) {
    router.push('/uc')
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>