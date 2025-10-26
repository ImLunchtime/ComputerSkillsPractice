<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <NavBar />
    </div>
    
    <!-- 主要内容 -->
    <main class="h-screen flex flex-col pt-16">
      <!-- 数据统计区域 (1/4 高度) -->
      <div class="h-1/4 bg-white shadow-sm border-b border-gray-200">
        <div class="mx-auto px-6 py-8 h-full flex items-center">
          <div class="w-full">
            <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">练习中心</h1>
            <div class="grid grid-cols-3 gap-6 mx-auto">
              <!-- 完成课程数 -->
              <div class="text-center">
                <div class="text-4xl font-bold text-orange-500 mb-2">
                  {{ completedCourses }} / {{ courses.length }}
                </div>
                <div class="text-gray-600 text-lg">完成课程</div>
              </div>
              <!-- 学习进度 -->
              <div class="text-center">
                <div class="text-4xl font-bold text-blue-600 mb-2">
                  {{ Math.round(overallProgress) }}%
                </div>
                <div class="text-gray-600 text-lg">学习进度</div>
              </div>
              <!-- 经验值 -->
              <div class="text-center">
                <div class="text-4xl font-bold text-green-600 mb-2">
                  {{ currentUser?.experience || 0 }}XP
                </div>
                <div class="text-gray-600 text-lg">经验值</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程时间线区域 (3/4 高度) -->
      <div class="flex-1 relative overflow-hidden">
        <div 
          ref="timelineContainer"
          class="h-full overflow-x-auto overflow-y-hidden"
          @scroll="handleScroll"
        >
          <div 
            class="relative h-full flex items-center"
            :style="{ width: timelineWidth + 'px', minWidth: '100%' }"
          >
            <!-- 时间线虚线 -->
            <div 
              class="absolute top-1/2 transform -translate-y-1/2 h-0.5 bg-gray-300"
              :style="{ 
                left: '100px', 
                right: '100px',
                backgroundImage: 'repeating-linear-gradient(to right, #d1d5db 0, #d1d5db 10px, transparent 10px, transparent 20px)'
              }"
            ></div>

            <!-- 课程按钮 -->
            <div 
              v-for="(course, index) in courses" 
              :key="course.id"
              class="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
              :style="{ left: getCoursePosition(index) + 'px' }"
            >
              <!-- 正在学习的课程外圈 -->
              <div 
                v-if="getCurrentCourseIndex() === index"
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-400 animate-pulse"
                :class="[
                  isHovered === course.id ? 'w-20 h-20' : 'w-16 h-16'
                ]"
              ></div>
              
              <!-- 课程按钮 -->
              <div
                class="course-button relative cursor-pointer transition-all duration-300 ease-out flex items-center justify-center rounded-full shadow-lg border-2 border-white"
                :class="[
                  getCourseButtonClass(index),
                  isHovered === course.id ? 'w-16 h-16 transform scale-125' : 'w-12 h-12'
                ]"
                @mouseenter="handleMouseEnter(course.id)"
                @mouseleave="handleMouseLeave"
                @click="startCourse(course)"
              >
                <span class="text-white text-lg font-semibold">{{ course.icon }}</span>
              </div>

              <!-- 悬停时显示的课程信息 -->
              <div 
                v-if="isHovered === course.id"
                class="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 min-w-48 z-10 border border-gray-200"
              >
                <div class="text-center">
                  <div class="text-2xl mb-2">{{ course.icon }}</div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ course.title }}</h3>
                  <div class="text-sm text-gray-600 mb-2">{{ course.description }}</div>
                  <div class="text-xs">
                    <span 
                      v-if="getCourseProgress(course.id) === 100"
                      class="bg-green-100 text-green-800 px-2 py-1 rounded-full"
                    >
                      已完成
                    </span>
                    <span 
                      v-else
                      class="bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                    >
                      未完成
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/NavBar.vue'

const router = useRouter()
const courses = ref([])
const userProgress = ref({})
const currentUser = ref(null)
const isHovered = ref(null)
const timelineContainer = ref(null)

// 时间线相关
const timelineWidth = computed(() => {
  if (courses.value.length === 0) return 0
  return Math.max(courses.value.length * 200 + 200, window.innerWidth)
})

// 计算属性
const completedCourses = computed(() => {
  return courses.value.filter(course => getCourseProgress(course.id) === 100).length
})

const totalChallenges = computed(() => {
  let total = 0
  courses.value.forEach(course => {
    const progress = userProgress.value[course.id] || {}
    total += Object.values(progress).filter(completed => completed).length
  })
  return total
})

const overallProgress = computed(() => {
  if (courses.value.length === 0) return 0
  let totalProgress = 0
  courses.value.forEach(course => {
    totalProgress += getCourseProgress(course.id)
  })
  return totalProgress / courses.value.length
})

// 获取课程进度
const getCourseProgress = (courseId) => {
  const course = courses.value.find(c => c.id === courseId)
  if (!course) return 0
  
  const progress = userProgress.value[courseId] || {}
  const completedChallenges = Object.values(progress).filter(completed => completed).length
  return Math.round((completedChallenges / course.challenges.length) * 100)
}

// 获取当前正在学习的课程索引
const getCurrentCourseIndex = () => {
  if (courses.value.length === 0) return -1
  if (courses.value.length === 1) return 0
  
  // 找到最后一个已完成的课程
  let lastCompletedIndex = -1
  for (let i = 0; i < courses.value.length; i++) {
    if (getCourseProgress(courses.value[i].id) === 100) {
      lastCompletedIndex = i
    }
  }
  
  // 返回下一个课程的索引，如果所有课程都完成了，返回最后一个
  return Math.min(lastCompletedIndex + 1, courses.value.length - 1)
}

// 获取课程按钮的CSS类
const getCourseButtonClass = (index) => {
  const currentIndex = getCurrentCourseIndex()
  const courseProgress = getCourseProgress(courses.value[index].id)
  
  if (index === currentIndex) {
    // 正在学习的课程 - 亮橙色
    return 'bg-orange-400 hover:bg-orange-500'
  } else if (courseProgress === 100) {
    // 已完成的课程 - 橙色
    return 'bg-orange-500 hover:bg-orange-600'
  } else {
    // 未开始的课程 - 灰色
    return 'bg-gray-400 hover:bg-gray-500'
  }
}

// 获取课程在时间线上的位置
const getCoursePosition = (index) => {
  const containerWidth = timelineWidth.value
  const totalCourses = courses.value.length
  
  if (totalCourses === 1) {
    return containerWidth / 2
  }
  
  const spacing = (containerWidth - 200) / (totalCourses - 1)
  return 100 + index * spacing
}

// 鼠标悬停处理
const handleMouseEnter = (courseId) => {
  isHovered.value = courseId
}

const handleMouseLeave = () => {
  isHovered.value = null
}

// 滚动处理
const handleScroll = () => {
  // 可以在这里添加滚动相关的逻辑
}

// 滚动到当前课程
const scrollToCurrentCourse = async () => {
  await nextTick()
  if (!timelineContainer.value || courses.value.length === 0) return
  
  const currentIndex = getCurrentCourseIndex()
  const coursePosition = getCoursePosition(currentIndex)
  const containerWidth = timelineContainer.value.clientWidth
  
  // 计算滚动位置，使当前课程居中
  const scrollLeft = coursePosition - containerWidth / 2
  
  timelineContainer.value.scrollTo({
    left: Math.max(0, scrollLeft),
    behavior: 'smooth'
  })
}

// 开始课程
const startCourse = (course) => {
  router.push(`/practice/${course.id}`)
}

// 加载课程数据
const loadCourses = async () => {
  try {
    const response = await fetch('/api/courses', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      courses.value = data.data.courses
      // 加载完课程后滚动到当前课程
      await nextTick()
      scrollToCurrentCourse()
    }
  } catch (error) {
    console.error('加载课程失败:', error)
  }
}

// 加载用户进度
const loadUserProgress = async () => {
  try {
    const response = await fetch('/api/courses/progress/all', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      userProgress.value = data.data.progress
      // 加载完进度后重新滚动到当前课程
      await nextTick()
      scrollToCurrentCourse()
    }
  } catch (error) {
    console.error('加载用户进度失败:', error)
  }
}

// 加载当前用户信息
const loadCurrentUser = async () => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      currentUser.value = data.data.user
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

onMounted(() => {
  loadCourses()
  loadUserProgress()
  loadCurrentUser()
})
</script>

<style scoped>
/* 组件特定样式 */
</style>