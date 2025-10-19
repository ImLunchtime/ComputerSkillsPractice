<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 课程内容 -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- 课程头部 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <button 
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            返回练习中心
          </button>
          
          <div class="text-sm text-gray-500">
            挑战 {{ currentChallengeIndex + 1 }} / {{ course?.challenges?.length || 0 }}
          </div>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ course?.title }}</h1>
        <p class="text-gray-600 mb-4">{{ course?.description }}</p>
        
        <!-- 进度条 -->
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div 
            class="bg-blue-600 h-3 rounded-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- 挑战内容 -->
      <div class="bg-white rounded-lg shadow-md p-8 text-center">
        <div v-if="currentChallenge">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">
            {{ currentChallenge.title }}
          </h2>
          <p class="text-gray-600 mb-8">{{ currentChallenge.description }}</p>
          
          <!-- 动态加载挑战组件 -->
          <component 
            :is="currentChallengeComponent" 
            @challenge-completed="onChallengeCompleted"
            :challenge="currentChallenge"
          />
        </div>
        
        <!-- 课程完成状态 -->
        <div v-else-if="courseCompleted" class="py-12">
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">恭喜完成课程！</h2>
          <p class="text-gray-600 mb-8">你已经成功完成了所有挑战</p>
          <button 
            @click="goToResult"
            class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            查看结果
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'

// 导入挑战组件
import ClickChallenge from '../components/challenges/ClickChallenge.vue'
import DoubleClickChallenge from '../components/challenges/DoubleClickChallenge.vue'

const route = useRoute()
const router = useRouter()

const course = ref(null)
const currentChallengeIndex = ref(0)
const completedChallenges = ref(new Set())
const courseCompleted = ref(false)

// 计算属性
const currentChallenge = computed(() => {
  if (!course.value || !course.value.challenges) return null
  return course.value.challenges[currentChallengeIndex.value]
})

const progressPercentage = computed(() => {
  if (!course.value || !course.value.challenges) return 0
  return (completedChallenges.value.size / course.value.challenges.length) * 100
})

const currentChallengeComponent = computed(() => {
  if (!currentChallenge.value) return null
  
  // 根据挑战类型返回对应的组件
  const componentMap = {
    'click': ClickChallenge,
    'double-click': DoubleClickChallenge
  }
  
  return componentMap[currentChallenge.value.type] || null
})

// 加载课程数据
const loadCourse = async (courseId) => {
  try {
    const response = await fetch(`/api/courses/${courseId}`, {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      course.value = data.data.course
      
      // 加载用户进度
      await loadUserProgress(courseId)
    } else {
      console.error('课程不存在')
      router.push('/practice')
    }
  } catch (error) {
    console.error('加载课程失败:', error)
    router.push('/practice')
  }
}

// 加载用户进度
const loadUserProgress = async (courseId) => {
  try {
    const response = await fetch(`/api/progress/${courseId}`, {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      const progress = data.data.progress || {}
      
      // 设置已完成的挑战
      Object.keys(progress).forEach(challengeId => {
        if (progress[challengeId]) {
          completedChallenges.value.add(parseInt(challengeId))
        }
      })
      
      // 找到下一个未完成的挑战
      findNextChallenge()
    }
  } catch (error) {
    console.error('加载用户进度失败:', error)
  }
}

// 找到下一个未完成的挑战
const findNextChallenge = () => {
  if (!course.value || !course.value.challenges) return
  
  for (let i = 0; i < course.value.challenges.length; i++) {
    if (!completedChallenges.value.has(course.value.challenges[i].id)) {
      currentChallengeIndex.value = i
      return
    }
  }
  
  // 所有挑战都完成了
  courseCompleted.value = true
}

// 挑战完成处理
const onChallengeCompleted = async () => {
  const challengeId = currentChallenge.value.id
  
  // 标记挑战为已完成
  completedChallenges.value.add(challengeId)
  
  // 保存进度到后端
  try {
    await fetch(`/api/progress/${route.params.courseId}/${challengeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ completed: true })
    })
  } catch (error) {
    console.error('保存进度失败:', error)
  }
  
  // 检查是否所有挑战都完成了
  if (completedChallenges.value.size === course.value.challenges.length) {
    courseCompleted.value = true
  } else {
    // 移动到下一个挑战
    setTimeout(() => {
      findNextChallenge()
    }, 1500) // 给用户一些时间看到完成效果
  }
}

// 返回练习中心
const goBack = () => {
  router.push('/practice')
}

// 前往结果页面
const goToResult = () => {
  router.push(`/practice/${route.params.courseId}/result`)
}

// 监听路由参数变化
watch(() => route.params.courseId, (newCourseId) => {
  if (newCourseId) {
    loadCourse(newCourseId)
  }
}, { immediate: true })
</script>

<style scoped>
/* 组件特定样式 */
</style>