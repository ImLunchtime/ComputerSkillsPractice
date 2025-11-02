<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">正在生成智能练习...</p>
      </div>
    </div>
    
    <!-- 练习内容 -->
    <main v-else class="px-4 py-8 text-center">
      <!-- 课程头部 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <button 
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-gray-900">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            返回用户中心
          </button>
          
          <div class="text-sm text-gray-500">
            {{ currentChallengeIndex + 1 }} / {{ totalChallenges }}
          </div>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 mb-2">智能练习</h1>
        <p class="text-gray-600 mb-4">
          <span v-if="reviewChallenges.length > 0">复习 {{ reviewChallenges.length }} 个挑战</span>
          <span v-if="reviewChallenges.length > 0 && newChallenges.length > 0"> · </span>
          <span v-if="newChallenges.length > 0">学习 {{ newChallenges.length }} 个新挑战</span>
        </p>
        
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
          <!-- 挑战信息 -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ currentChallenge.title }}</h2>
            <div class="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>来自课程: {{ currentChallenge.courseTitle }}</span>
              <span v-if="isReviewChallenge" class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">复习</span>
              <span v-else class="px-2 py-1 bg-green-100 text-green-800 rounded-full">新学</span>
            </div>
          </div>
          
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
        
        <!-- 练习完成状态 -->
        <div v-else-if="practiceCompleted" class="py-12">
          <IconCelebration class="text-6xl text-yellow-500 mb-4" />
          <h2 class="text-3xl font-bold text-gray-900 mb-4">恭喜完成智能练习！</h2>
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
            {{ completedChallenges.size === totalChallenges ? '完成练习' : '下一关' }}
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import BaseButton from '../components/BaseButton.vue'
import { IconCelebration } from '@iconify-prerendered/vue-material-symbols'
import { getComponent } from '@/utils/componentLoader'

const router = useRouter()

// 响应式数据
const loading = ref(true)
const reviewChallenges = ref([])
const newChallenges = ref([])
const currentChallengeIndex = ref(0)
const practiceCompleted = ref(false)
const showSuccessBanner = ref(false)
const startTime = ref(null)
const completedChallenges = ref(new Set())

// 计算属性
const allChallenges = computed(() => [...reviewChallenges.value, ...newChallenges.value])
const totalChallenges = computed(() => allChallenges.value.length)
const currentChallenge = computed(() => {
  if (currentChallengeIndex.value >= allChallenges.value.length) return null
  return allChallenges.value[currentChallengeIndex.value]
})

const progressPercentage = computed(() => {
  if (totalChallenges.value === 0) return 0
  return Math.round((completedChallenges.value.size / totalChallenges.value) * 100)
})

const isReviewChallenge = computed(() => {
  return currentChallengeIndex.value < reviewChallenges.value.length
})

const currentChallengeComponent = computed(() => {
  if (!currentChallenge.value || !currentChallenge.value.component) return null
  
  return getComponent(currentChallenge.value.component)
})

// 方法
const fetchSmartPractice = async () => {
  try {
    const response = await fetch('/api/smart-practice/generate', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      reviewChallenges.value = data.data.reviewChallenges || []
      newChallenges.value = data.data.newChallenges || []
      
      if (totalChallenges.value === 0) {
        // 没有可练习的内容，直接显示完成状态
        practiceCompleted.value = true
      }
    } else {
      console.error('获取智能练习失败')
      router.push('/uc')
    }
  } catch (error) {
    console.error('获取智能练习失败:', error)
    router.push('/uc')
  } finally {
    loading.value = false
  }
}

const onChallengeCompleted = () => {
  const challengeId = currentChallenge.value.id
  
  // 标记挑战为已完成
  completedChallenges.value.add(challengeId)
  
  // 显示成功横幅
  showSuccessBanner.value = true
  
  // 检查是否所有挑战都完成了
  if (completedChallenges.value.size === totalChallenges.value) {
    practiceCompleted.value = true
  }
}

const goToNextChallenge = () => {
  showSuccessBanner.value = false
  
  if (completedChallenges.value.size === totalChallenges.value) {
    // 所有挑战完成，前往结果页面
    goToResult()
  } else {
    // 进入下一个挑战
    findNextChallenge()
  }
}

// 查找下一个未完成的挑战
const findNextChallenge = () => {
  for (let i = 0; i < allChallenges.value.length; i++) {
    if (!completedChallenges.value.has(allChallenges.value[i].id)) {
      currentChallengeIndex.value = i
      return
    }
  }
  
  // 所有挑战都完成了
  practiceCompleted.value = true
}

const goBack = () => {
  router.push('/uc')
}

const goToResult = async () => {
  try {
    // 计算完成时间
    const completionTime = startTime.value ? Math.round((Date.now() - startTime.value) / 1000) : 0
    
    // 获取新学课程的ID
    const newCourseIds = [...new Set(newChallenges.value.map(challenge => challenge.courseId))]
    
    // 调用完成API
    const response = await fetch('/api/smart-practice/complete', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newCourseIds,
        completionTime,
        reviewCount: reviewChallenges.value.length,
        newCount: newChallenges.value.length
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      // 跳转到结果页面，传递结果数据
      router.push({
        path: '/smart-practice/result',
        query: {
          completionTime,
          reviewCount: reviewChallenges.value.length,
          newCount: newChallenges.value.length,
          newCoursesCompleted: data.data.newCoursesCompleted || 0,
          experienceReward: data.data.experienceReward || 0
        }
      })
    } else {
      console.error('完成智能练习失败')
      router.push('/uc')
    }
  } catch (error) {
    console.error('完成智能练习失败:', error)
    router.push('/uc')
  }
}

// 生命周期
onMounted(() => {
  startTime.value = Date.now()
  fetchSmartPractice()
})
</script>

<style scoped>
/* 组件特定样式 */
</style>