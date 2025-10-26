<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <NavBar />
    </div>
    
    <!-- 主要内容 -->
    <main class="h-screen flex pt-16 p-4">
      <!-- 内容区域 -->
      <div class="flex-1 overflow-y-auto">
        <!-- 专项练习 -->
        <PracticeTab 
          v-if="selectedTab === 'practice'"
          :courses="courses"
          :user-progress="userProgress"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/NavBar.vue'
import PracticeSidebar from './components/PracticeSidebar.vue'
import PracticeTab from './components/PracticeTab.vue'
import SkillsTab from './components/SkillsTab.vue'
import ProfileTab from './components/ProfileTab.vue'

const router = useRouter()
const courses = ref([])
const userProgress = ref({})
const selectedTab = ref('practice')

// 选择选项卡
const selectTab = (tab) => {
  if (tab === 'profile') {
    // 直接跳转到用户资料页面
    router.push('/profile')
  } else {
    selectedTab.value = tab
  }
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
    }
  } catch (error) {
    console.error('加载用户进度失败:', error)
  }
}

onMounted(() => {
  loadCourses()
  loadUserProgress()
})
</script>

<style scoped>
/* 主组件样式已移至子组件中 */
</style>