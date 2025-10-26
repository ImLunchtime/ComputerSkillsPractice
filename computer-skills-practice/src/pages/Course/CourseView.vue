<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 课程内容 -->
    <main class="px-4 py-8 text-center">
      <!-- 课程头部 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <button 
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-gray-900">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            返回练习中心
          </button>
          
          <div class="text-sm text-gray-500">
            {{ currentChallengeIndex + 1 }} / {{ course?.challenges?.length || 0 }}
          </div>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ course?.title }}</h1>
        <p class="text-gray-600 mb-4">{{ course?.description }}</p>
        
        <!-- 进度条 -->
        <div class="w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto">
          <div 
            class="bg-blue-600 h-3 rounded-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- 挑战内容 -->
      <div class="py-8 border border-gray-200 rounded-lg">
        <div v-if="currentChallenge">
          <!-- 动态加载挑战组件 -->
          <Suspense>
            <component 
              :is="currentChallengeComponent" 
              @challenge-completed="onChallengeCompleted"
              :challenge="currentChallenge"
            />
            <template #fallback>
              <div class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-2 text-gray-600">加载中...</span>
              </div>
            </template>
          </Suspense>
        </div>
        
        <!-- 课程完成状态 -->
        <div v-else-if="courseCompleted" class="py-12">
          <IconCelebration class="text-6xl text-yellow-500 mb-4" />
          <h2 class="text-3xl font-bold text-gray-900 mb-4">恭喜完成练习！</h2>
          <p class="text-gray-600 mb-8">你已经成功完成了所有挑战</p>
          <button 
            @click="goToResult"
            class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            查看结果
          </button>
        </div>
      </div>

      <!-- 成功横幅 -->
      <div 
        v-if="showSuccessBanner" 
        class="fixed bottom-0 left-0 right-0 bg-green-500 text-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out"
        :class="showSuccessBanner ? 'translate-y-0' : 'translate-y-full'"
      >
        <div class="flex items-center justify-center">
          <div class="flex items-center mr-6">
            <IconCelebration class="text-2xl text-yellow-500 mr-3" />
            <div>
              <h3 class="text-xl font-bold">干得漂亮！</h3>
              <p class="text-green-100">挑战完成，继续保持！</p>
            </div>
          </div>
          <BaseButton 
            variant="green" 
            @click="goToNextChallenge"
          >
            {{ completedChallenges.size === course?.challenges?.length ? '完成练习' : '下一关' }}
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../../components/NavBar.vue'
import { IconCelebration } from '@iconify-prerendered/vue-material-symbols'

const route = useRoute()
const router = useRouter()

const course = ref(null)
const currentChallengeIndex = ref(0)
const completedChallenges = ref(new Set())
const courseCompleted = ref(false)
const showSuccessBanner = ref(false)
const courseStartTime = ref(null)

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
  if (!currentChallenge.value || !currentChallenge.value.component) return null
  
  // 异步组件加载
  return defineAsyncComponent(() => import(/* @vite-ignore */ `./components/${currentChallenge.value.component}`))
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
      
      // 记录课程开始时间
      if (!courseStartTime.value) {
        courseStartTime.value = Date.now()
      }
      
      // 加载用户进度
      await loadUserProgress(courseId)
    } else {
      console.error('课程不存在')
      router.push('/all-practice')
    }
  } catch (error) {
    console.error('加载课程失败:', error)
    router.push('/all-practice')
  }
}

// 加载用户进度
const loadUserProgress = async (courseId) => {
  try {
    const response = await fetch(`/api/courses/progress/${courseId}`, {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      const progress = data.data.progress || {}

      const totalChallenges = course.value?.challenges?.length || 0
      const completedCount = Object.values(progress).filter(Boolean).length

      if (totalChallenges > 0 && completedCount >= totalChallenges) {
        // 已完成课程，重新练习时从头开始，不使用历史进度
        completedChallenges.value = new Set()
        courseCompleted.value = false
        currentChallengeIndex.value = 0
      } else {
        // 设置已完成的挑战（用于未完成课程继续练习）
        Object.keys(progress).forEach(challengeId => {
          if (progress[challengeId]) {
            completedChallenges.value.add(parseInt(challengeId))
          }
        })
      }
      
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
  
  // 显示成功横幅
  showSuccessBanner.value = true
  
  // 保存进度到后端
  try {
    await fetch(`/api/courses/progress/${route.params.courseId}/${challengeId}`, {
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
  }
}

// 返回练习中心
const goBack = () => {
  router.push('/uc')
}

// 前往结果页面
const goToResult = () => {
  // 计算实际完成时间（秒）
  const completionTimeSeconds = courseStartTime.value ? 
    Math.floor((Date.now() - courseStartTime.value) / 1000) : 0
  
  // 通过路由参数传递完成时间
  router.push({
    path: `/practice/${route.params.courseId}/result`,
    query: { completionTime: completionTimeSeconds }
  })
}

// 进入下一关
const goToNextChallenge = () => {
  showSuccessBanner.value = false
  if (completedChallenges.value.size === course.value.challenges.length) {
    // 所有挑战完成，前往结果页面
    goToResult()
  } else {
    // 进入下一个挑战
    findNextChallenge()
  }
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