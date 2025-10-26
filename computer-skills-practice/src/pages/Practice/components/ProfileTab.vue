<template>
  <div class="p-8">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div class="text-blue-500 text-6xl mb-4">👤</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">个人资料</h2>
      <p class="text-gray-600 text-lg mb-6">查看和管理您的个人信息</p>
      <button 
        @click="goToProfile"
        class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
      >
        前往个人主页
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToProfile = () => {
  router.push('/profile')
}
</script>