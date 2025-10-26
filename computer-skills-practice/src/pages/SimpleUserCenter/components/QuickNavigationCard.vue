<template>
  <div class="p-6 w-80 h-96">
    <h2 class="text-lg font-bold text-gray-800 mb-4">快速导航</h2>
    
    <!-- 功能按钮 -->
    <div class="space-y-3 mb-6">
      <!-- 全部练习按钮 -->
      <div 
        @click="goToPracticeCenter" 
        class="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <span class="font-medium text-gray-800">全部练习</span>
      </div>
      
      <!-- 个人资料按钮 -->
      <div 
        @click="goToProfile" 
        class="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <span class="font-medium text-gray-800">个人资料</span>
      </div>
    </div>
    
    <!-- 用户统计信息插槽 -->
    <slot name="user-stats"></slot>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 方法
const goToPracticeCenter = () => {
  router.push('/practice')
}

const goToProfile = () => {
  router.push('/profile')
}
</script>

<style scoped>
/* 组件特定样式 */
</style>