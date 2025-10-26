<template>
  <div class="border-t pt-4">
    <h3 class="font-semibold text-gray-800 mb-3">学习统计</h3>
    
    <!-- 经验值 -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm text-gray-600">经验值</span>
        <span class="text-sm font-medium text-gray-800">{{ userStats.experience }} XP</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
          :style="{ width: `${experienceProgress}%` }"
        ></div>
      </div>
    </div>
    
    <!-- 练习进度 -->
    <div>
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm text-gray-600">练习进度</span>
        <span class="text-sm font-medium text-gray-800">{{ userStats.completedCourses }}/{{ userStats.totalCourses }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-green-500 h-2 rounded-full transition-all duration-300" 
          :style="{ width: `${practiceProgress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  userStats: {
    type: Object,
    default: () => ({
      experience: 0,
      completedCourses: 0,
      totalCourses: 0
    })
  }
})

// 计算经验值进度（每1000经验为一个等级）
const experienceProgress = computed(() => {
  return (props.userStats.experience % 1000) / 10
})

// 计算练习进度百分比
const practiceProgress = computed(() => {
  if (props.userStats.totalCourses === 0) return 0
  return (props.userStats.completedCourses / props.userStats.totalCourses) * 100
})
</script>

<style scoped>
/* 组件特定样式 */
</style>