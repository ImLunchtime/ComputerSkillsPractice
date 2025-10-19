<template>
  <div class="h-screen bg-gray-50 overflow-hidden">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 结算内容 -->
    <main class="px-4 py-8 text-center h-full flex flex-col justify-center">
      <!-- 庆祝动画区域 -->
      <div class="mb-12">
        <IconCelebration class="text-8xl text-yellow-500 mb-6 animate-bounce" />
        <h1 class="text-4xl font-bold text-gray-900 mb-4">练习完成！</h1>
        <p class="text-xl text-gray-600">恭喜你成功完成了此练习</p>
      </div>

      <!-- 奖励区域 -->
      <div class="mb-8">
        <h3 class="text-xl font-bold text-gray-900 mb-6">获得奖励</h3>
        <div class="py-8">
          <div class="text-6xl mb-4">🏆</div>
          <p class="text-gray-600 mb-4">目前还没有奖励系统</p>
          <p class="text-sm text-gray-500">未来版本将添加经验值、徽章等奖励机制</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <BaseButton variant="primary" @click="goToPracticeCenter">返回练习中心</BaseButton>
        <BaseButton variant="secondary" @click="retryCourse">重新练习</BaseButton>
        <BaseButton variant="green" @click="shareResult">分享成果</BaseButton>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { IconCelebration, IconLibraryBooks } from '@iconify-prerendered/vue-material-symbols'

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