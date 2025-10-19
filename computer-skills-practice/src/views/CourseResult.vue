<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 结算内容 -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- 庆祝动画区域 -->
      <div class="text-center mb-12">
        <div class="text-8xl mb-6 animate-bounce">🎉</div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">课程完成！</h1>
        <p class="text-xl text-gray-600">恭喜你成功完成了所有挑战</p>
      </div>

      <!-- 课程信息卡片 -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span class="text-2xl">{{ course?.icon || '📚' }}</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ course?.title }}</h2>
            <p class="text-gray-600">{{ course?.description }}</p>
          </div>
        </div>
        
        <!-- 完成统计 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-3xl font-bold text-green-600">{{ completedChallenges }}</div>
            <div class="text-green-700">完成的挑战</div>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-3xl font-bold text-blue-600">{{ formatTime(completionTime) }}</div>
            <div class="text-blue-700">完成时间</div>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-3xl font-bold text-purple-600">100%</div>
            <div class="text-purple-700">完成度</div>
          </div>
        </div>
        
        <!-- 进度条 -->
        <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div class="bg-green-500 h-4 rounded-full w-full transition-all duration-1000 ease-out"></div>
        </div>
        <div class="text-center text-sm text-gray-600">课程进度: 100%</div>
      </div>

      <!-- 挑战详情 -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h3 class="text-xl font-bold text-gray-900 mb-6">挑战完成详情</h3>
        <div class="space-y-4">
          <div 
            v-for="(challenge, index) in course?.challenges || []" 
            :key="challenge.id"
            class="flex items-center p-4 bg-gray-50 rounded-lg"
          >
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900">挑战 {{ index + 1 }}: {{ challenge.title }}</h4>
              <p class="text-gray-600 text-sm">{{ challenge.description }}</p>
            </div>
            <div class="text-green-600 font-semibold">已完成</div>
          </div>
        </div>
      </div>

      <!-- 奖励区域（目前为空，为将来扩展预留） -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h3 class="text-xl font-bold text-gray-900 mb-6">获得奖励</h3>
        <div class="text-center py-8">
          <div class="text-6xl mb-4">🏆</div>
          <p class="text-gray-600 mb-4">目前还没有奖励系统</p>
          <p class="text-sm text-gray-500">未来版本将添加经验值、徽章等奖励机制</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          @click="goToPracticeCenter"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
        >
          返回练习中心
        </button>
        <button 
          @click="retryCourse"
          class="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors text-lg font-semibold"
        >
          重新练习
        </button>
        <button 
          @click="shareResult"
          class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
        >
          分享成果
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const route = useRoute()
const router = useRouter()

const course = ref(null)
const completedChallenges = ref(0)
const completionTime = ref(0)

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

// 加载课程数据
const loadCourse = async (courseId) => {
  try {
    const response = await fetch(`/api/courses/${courseId}`, {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      course.value = data.data.course
      completedChallenges.value = course.value.challenges?.length || 0
      
      // 从路由查询参数获取实际完成时间
      const queryTime = route.query.completionTime
      if (queryTime && !isNaN(queryTime)) {
        completionTime.value = parseInt(queryTime)
      } else {
        // 如果没有传递时间参数，使用默认值
        completionTime.value = 30 // 默认30秒
      }
    }
  } catch (error) {
    console.error('加载课程失败:', error)
  }
}

// 返回练习中心
const goToPracticeCenter = () => {
  router.push('/practice')
}

// 重新练习课程
const retryCourse = () => {
  // 清除当前课程的进度（可选）
  router.push(`/practice/${route.params.courseId}`)
}

// 分享结果
const shareResult = () => {
  const shareText = `我刚刚完成了"${course.value?.title}"课程，完成了${completedChallenges.value}个挑战！`
  
  if (navigator.share) {
    navigator.share({
      title: 'TM计算机技能练习网 - 课程完成',
      text: shareText,
      url: window.location.href
    })
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
      alert('成果已复制到剪贴板！')
    }).catch(() => {
      alert('分享功能暂不可用')
    })
  }
}

onMounted(() => {
  if (route.params.courseId) {
    loadCourse(route.params.courseId)
  }
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