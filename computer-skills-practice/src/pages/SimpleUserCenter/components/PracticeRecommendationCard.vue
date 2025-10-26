<template>
  <div class="bg-white rounded-lg shadow-md p-8 w-[600px] h-96 flex flex-col">
    <h2 class="text-xl font-bold text-gray-800 mb-4">练习推荐</h2>
    
    <!-- 推荐练习列表 - 改为横向布局 -->
    <div class="flex gap-4 flex-1">
      <!-- 下一个练习推荐 -->
      <div class="flex-1 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow flex flex-col">
        <div class="flex items-center mb-2">
          <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span class="text-sm text-gray-600">即将学习</span>
        </div>
        <h3 class="font-semibold text-gray-800 mb-1">{{ nextPractice.title }}</h3>
        <p class="text-sm text-gray-600 mb-3 flex-grow">{{ nextPractice.description }}</p>
        <BaseButton 
          variant="primary" 
          @click="startPractice(nextPractice.id)"
          class="w-full text-sm mt-auto"
        >
          开始练习
        </BaseButton>
      </div>
      
      <!-- 智能推荐练习 -->
      <div class="flex-1 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow flex flex-col">
        <div class="flex items-center mb-2">
          <div class="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
          <span class="text-sm text-gray-600">智能推荐</span>
        </div>
        <h3 class="font-semibold text-gray-800 mb-1">{{ recommendedPractice.title }}</h3>
        <p class="text-sm text-gray-600 mb-3 flex-grow">{{ recommendedPractice.description }}</p>
        <BaseButton 
          variant="secondary" 
          @click="startPractice(recommendedPractice.id)"
          class="w-full text-sm mt-auto"
        >
          开始练习
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../../../components/BaseButton.vue'

const props = defineProps({
  courses: {
    type: Array,
    default: () => []
  },
  userProgress: {
    type: Object,
    default: () => ({})
  }
})

const router = useRouter()

// 计算推荐练习
const nextPractice = computed(() => {
  if (!props.courses.length) {
    return {
      id: null,
      title: '暂无可用练习',
      description: '请稍后再试'
    }
  }
  
  // 找到下一个未完成的练习
  const nextCourse = props.courses.find(course => {
    const progress = props.userProgress[course.id] || {}
    const completedChallenges = Object.values(progress).filter(completed => completed).length
    const totalChallenges = course.challenges ? course.challenges.length : 0
    return completedChallenges < totalChallenges
  })
  
  if (nextCourse) {
    return {
      id: nextCourse.id,
      title: nextCourse.title,
      description: nextCourse.description || '继续你的学习之旅'
    }
  } else {
    // 如果所有练习都完成了，找到最后完成的练习
    // 根据完成时间或者课程顺序找到最后完成的练习
    const completedCourses = props.courses.filter(course => {
      const progress = props.userProgress[course.id] || {}
      const completedChallenges = Object.values(progress).filter(completed => completed).length
      const totalChallenges = course.challenges ? course.challenges.length : 0
      return completedChallenges === totalChallenges && totalChallenges > 0
    })
    
    if (completedCourses.length > 0) {
      // 返回课程列表中的最后一个已完成课程（按课程顺序）
      const lastCompleted = completedCourses[completedCourses.length - 1]
      return {
        id: lastCompleted.id,
        title: lastCompleted.title,
        description: '复习已完成的练习'
      }
    } else {
      // 如果没有完成的课程，返回第一个课程
      const firstCourse = props.courses[0]
      return {
        id: firstCourse.id,
        title: firstCourse.title,
        description: '开始你的学习之旅'
      }
    }
  }
})

const recommendedPractice = computed(() => {
  // 随机推荐算法：从所有可用练习中随机选择一个
  if (!props.courses.length) {
    return {
      id: null,
      title: '暂无推荐',
      description: '请稍后再试'
    }
  }
  
  // 生成随机索引，确保每次都是随机的
  const randomIndex = Math.floor(Math.random() * props.courses.length)
  const randomCourse = props.courses[randomIndex]
  
  return {
    id: randomCourse.id,
    title: randomCourse.title,
    description: '基于你的学习情况推荐'
  }
})

// 方法
const startPractice = (courseId) => {
  if (courseId) {
    router.push(`/practice/${courseId}`)
  }
}
</script>

<style scoped>
/* 组件特定样式 */
</style>