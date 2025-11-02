<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 结果内容 -->
    <main class="px-4 py-8">
      <div class="max-w-2xl mx-auto text-center">
        <!-- 庆祝图标 -->
        <div class="mb-8">
          <div class="text-8xl mb-4 animate-bounce">🎉</div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">智能练习完成！</h1>
          <p class="text-xl text-gray-600">恭喜你完成了个性化练习</p>
        </div>
        
        <!-- 练习统计 -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">练习统计</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <!-- 总完成时间 -->
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 mb-2">{{ formatTime(completionTime) }}</div>
              <div class="text-gray-600">完成时间</div>
            </div>
            
            <!-- 复习挑战数 -->
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600 mb-2">{{ reviewCount }}</div>
              <div class="text-gray-600">复习挑战</div>
            </div>
            
            <!-- 新学挑战数 -->
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600 mb-2">{{ newCount }}</div>
              <div class="text-gray-600">新学挑战</div>
            </div>
          </div>
          
          <!-- 新完成的课程 -->
          <div v-if="newCoursesCompleted.length > 0" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">🎓 新完成的课程</h3>
            <div class="flex flex-wrap justify-center gap-2">
              <span 
                v-for="course in newCoursesCompleted" 
                :key="course"
                class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {{ course }}
              </span>
            </div>
          </div>
          
          <!-- 经验值奖励 -->
          <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
            <div class="flex items-center justify-center mb-2">
              <svg class="w-8 h-8 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span class="text-2xl font-bold text-yellow-600">+{{ experienceReward }} XP</span>
            </div>
            <p class="text-gray-600 text-sm">智能练习完成奖励</p>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="goToUserCenter"
            class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            返回用户中心
          </button>
          
          <button 
            @click="startNewPractice"
            class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-lg font-medium"
          >
            再来一次智能练习
          </button>
        </div>
        
        <!-- 学习建议 -->
        <div class="mt-8 bg-blue-50 rounded-lg p-6 text-left">
          <h3 class="text-lg font-semibold text-blue-900 mb-3">💡 学习建议</h3>
          <div class="space-y-2 text-blue-800">
            <p v-if="reviewCount > 0">
              • 你复习了 {{ reviewCount }} 个挑战，保持定期复习有助于巩固技能
            </p>
            <p v-if="newCount > 0">
              • 你学习了 {{ newCount }} 个新挑战，继续保持学习的节奏
            </p>
            <p v-if="newCoursesCompleted.length > 0">
              • 恭喜完成了 {{ newCoursesCompleted.length }} 个新课程，你的技能在不断提升
            </p>
            <p>
              • 建议每天进行智能练习，系统会根据你的学习进度智能推荐内容
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../../components/NavBar.vue'

const route = useRoute()
const router = useRouter()

const completionTime = ref(0)
const reviewCount = ref(0)
const newCount = ref(0)
const newCoursesCompleted = ref([])
const experienceReward = ref(0)

// 格式化时间显示
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

// 加载结果数据
const loadResultData = () => {
  // 从路由查询参数获取数据
  completionTime.value = parseInt(route.query.completionTime) || 0
  reviewCount.value = parseInt(route.query.reviewCount) || 0
  newCount.value = parseInt(route.query.newCount) || 0
  
  // 解析新完成的课程
  if (route.query.newCourses) {
    const courseIds = route.query.newCourses.split(',').filter(id => id)
    // 这里可以根据课程ID获取课程名称，暂时使用ID
    newCoursesCompleted.value = courseIds
  }
  
  // 计算经验值奖励
  calculateExperienceReward()
}

// 计算经验值奖励
const calculateExperienceReward = () => {
  let baseReward = 0
  
  // 复习奖励：每个复习挑战 5 XP
  baseReward += reviewCount.value * 5
  
  // 新学奖励：每个新挑战 10 XP
  baseReward += newCount.value * 10
  
  // 完成课程奖励：每个新完成的课程 30 XP
  baseReward += newCoursesCompleted.value.length * 30
  
  // 智能练习完成奖励：基础 20 XP
  baseReward += 20
  
  experienceReward.value = baseReward
}

// 组件挂载时加载数据
onMounted(() => {
  loadResultData()
})
</script>

<style scoped>
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>