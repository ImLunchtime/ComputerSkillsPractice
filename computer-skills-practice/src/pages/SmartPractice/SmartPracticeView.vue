<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 智能练习内容 -->
    <main class="px-4 py-8 text-center">
      <!-- 练习头部 -->
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
          <span v-if="currentSection === 'review'" class="text-blue-600">复习阶段</span>
          <span v-else-if="currentSection === 'new'" class="text-green-600">新课阶段</span>
          - 个性化推荐的练习内容
        </p>
        
        <!-- 进度条 -->
        <div class="w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto">
          <div 
            class="bg-gradient-to-r from-blue-600 to-green-600 h-3 rounded-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        
        <!-- 阶段指示器 -->
        <div class="flex justify-center mt-4 space-x-4">
          <div class="flex items-center">
            <div :class="['w-3 h-3 rounded-full mr-2', reviewChallenges.length > 0 ? 'bg-blue-600' : 'bg-gray-300']"></div>
            <span class="text-sm text-gray-600">复习 ({{ reviewChallenges.length }})</span>
          </div>
          <div class="flex items-center">
            <div :class="['w-3 h-3 rounded-full mr-2', newChallenges.length > 0 ? 'bg-green-600' : 'bg-gray-300']"></div>
            <span class="text-sm text-gray-600">新课 ({{ newChallenges.length }})</span>
          </div>
        </div>
      </div>

      <!-- 挑战内容 -->
      <div class="py-8 border border-gray-200 rounded-lg">
        <div v-if="currentChallenge && !practiceCompleted">
          <!-- 当前挑战信息 -->
          <div class="mb-6">
            <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2"
                 :class="currentSection === 'review' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
              {{ currentSection === 'review' ? '复习' : '新课' }}
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-1">{{ currentChallenge.title }}</h3>
            <p class="text-gray-600 text-sm">来自课程：{{ currentChallenge.courseTitle }}</p>
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
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">智能练习完成！</h2>
          <p class="text-gray-600 mb-8">
            你已经完成了本次智能练习<br>
            <span v-if="reviewChallenges.length > 0">复习了 {{ reviewChallenges.length }} 个挑战</span>
            <span v-if="reviewChallenges.length > 0 && newChallenges.length > 0">，</span>
            <span v-if="newChallenges.length > 0">学习了 {{ newChallenges.length }} 个新挑战</span>
          </p>
          <button 
            @click="goToResult"
            class="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all text-lg"
          >
            查看结果
          </button>
        </div>
        
        <!-- 加载状态 -->
        <div v-else class="py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">正在生成智能练习...</p>
        </div>
      </div>

      <!-- 成功横幅 -->
      <div 
        v-if="showSuccessBanner" 
        class="fixed bottom-0 left-0 right-0 bg-green-500 text-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out"
      >
        <div class="flex items-center justify-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-medium">挑战完成！</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/NavBar.vue'
import { getComponent } from '../../utils/componentLoader.js'

const router = useRouter()

// 响应式数据
const reviewChallenges = ref([])
const newChallenges = ref([])
const allChallenges = ref([])
const currentChallengeIndex = ref(0)
const completedChallenges = ref(new Set())
const practiceCompleted = ref(false)
const showSuccessBanner = ref(false)
const practiceStartTime = ref(null)
const newCoursesLearned = ref(new Set())

// 计算属性
const totalChallenges = computed(() => allChallenges.value.length)

const currentChallenge = computed(() => {
  return allChallenges.value[currentChallengeIndex.value]
})

const currentSection = computed(() => {
  if (currentChallengeIndex.value < reviewChallenges.value.length) {
    return 'review'
  } else {
    return 'new'
  }
})

const progressPercentage = computed(() => {
  if (totalChallenges.value === 0) return 0
  return (completedChallenges.value.size / totalChallenges.value) * 100
})

const currentChallengeComponent = computed(() => {
  if (!currentChallenge.value || !currentChallenge.value.component) return null
  return getComponent(currentChallenge.value.component)
})

// 方法
const goBack = () => {
  router.push('/uc')
}

const goToResult = () => {
  const completionTime = practiceStartTime.value ? 
    Math.floor((Date.now() - practiceStartTime.value) / 1000) : 0
  
  router.push({
    name: 'smart-practice-result',
    query: {
      completionTime,
      reviewCount: reviewChallenges.value.length,
      newCount: newChallenges.value.length,
      newCourses: Array.from(newCoursesLearned.value).join(',')
    }
  })
}

// 加载智能练习数据
const loadSmartPractice = async () => {
  try {
    const response = await fetch('/api/smart-practice/generate', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      const practiceData = data.data
      
      reviewChallenges.value = practiceData.reviewChallenges || []
      newChallenges.value = practiceData.newChallenges || []
      
      // 合并所有挑战
      allChallenges.value = [...reviewChallenges.value, ...newChallenges.value]
      
      // 记录新课程
      newChallenges.value.forEach(challenge => {
        newCoursesLearned.value.add(challenge.courseId)
      })
      
      // 记录开始时间
      practiceStartTime.value = Date.now()
      
      // 如果没有挑战，直接完成
      if (allChallenges.value.length === 0) {
        practiceCompleted.value = true
      }
    } else {
      console.error('生成智能练习失败')
      router.push('/uc')
    }
  } catch (error) {
    console.error('加载智能练习失败:', error)
    router.push('/uc')
  }
}

// 挑战完成处理
const onChallengeCompleted = async () => {
  const challengeIndex = currentChallengeIndex.value
  
  // 标记挑战为已完成
  completedChallenges.value.add(challengeIndex)
  
  // 显示成功横幅
  showSuccessBanner.value = true
  setTimeout(() => {
    showSuccessBanner.value = false
  }, 2000)
  
  // 检查是否还有未完成的挑战
  if (completedChallenges.value.size >= allChallenges.value.length) {
    // 所有挑战完成，标记新课程为已完成
    await markNewCoursesCompleted()
    practiceCompleted.value = true
  } else {
    // 移动到下一个挑战
    setTimeout(() => {
      findNextChallenge()
    }, 2000)
  }
}

// 找到下一个未完成的挑战
const findNextChallenge = () => {
  for (let i = 0; i < allChallenges.value.length; i++) {
    if (!completedChallenges.value.has(i)) {
      currentChallengeIndex.value = i
      return
    }
  }
}

// 标记新课程为已完成
const markNewCoursesCompleted = async () => {
  try {
    const newCourseIds = Array.from(newCoursesLearned.value)
    
    for (const courseId of newCourseIds) {
      // 标记课程中的所有挑战为已完成
      const course = newChallenges.value.find(c => c.courseId === courseId)
      if (course) {
        await fetch(`/api/courses/complete/${courseId}`, {
          method: 'POST',
          credentials: 'include'
        })
      }
    }
  } catch (error) {
    console.error('标记新课程完成失败:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadSmartPractice()
})
</script>

<style scoped>
/* 组件特定样式 */
</style>