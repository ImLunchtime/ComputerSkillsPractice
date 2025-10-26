<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">用户主页</h1>
            
            <!-- 用户信息卡片 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xl font-bold">
                      {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <h2 class="text-xl font-semibold text-gray-900">{{ user?.username || '用户' }}</h2>
                  <p class="text-gray-600">{{ user?.email || 'user@example.com' }}</p>
                  <p class="text-sm text-gray-500">
                    角色: {{ user?.role === 'admin' ? '管理员' : '普通用户' }}
                  </p>
                  <p class="text-sm text-gray-500">
                    注册时间: {{ formatDate(user?.createdAt) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 功能区域 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- 学习进度 -->
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">学习进度</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">已完成课程</span>
                    <span class="text-sm font-medium text-blue-600">0 / 4</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: 0%"></div>
                  </div>
                  <p class="text-xs text-gray-500">继续学习以提升您的技能！</p>
                </div>
              </div>

              <!-- 最近活动 -->
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">最近活动</h3>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">暂无活动记录</p>
                  <p class="text-xs text-gray-500">开始学习课程来查看您的活动记录</p>
                </div>
              </div>

              <!-- 成就徽章 -->
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">成就徽章</h3>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">暂无徽章</p>
                  <p class="text-xs text-gray-500">完成课程和练习来获得徽章</p>
                </div>
              </div>
            </div>

            <!-- 快速操作 -->
            <div class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
              <div class="flex flex-wrap gap-4">
                <BaseButton 
                  variant="primary"
                  @click="goToSkills"
                >
                  开始学习
                </BaseButton>
                <BaseButton 
                  variant="secondary"
                  :disabled="true"
                >
                  查看证书（即将推出）
                </BaseButton>
                <BaseButton 
                  v-if="user?.role === 'admin'"
                  variant="green"
                  @click="goToAdmin"
                >
                  管理员中心
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/NavBar.vue'
import BaseButton from '../../components/BaseButton.vue'

const router = useRouter()
const user = ref(null)
const loading = ref(true)

onMounted(async () => {
  await fetchUserInfo()
})

const fetchUserInfo = async () => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      user.value = data.data.user
    } else {
      // 用户未登录，跳转到登录页面
      router.push('/auth')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    router.push('/auth')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const goToSkills = () => {
  router.push('/')
}

const goToAdmin = () => {
  router.push('/admin')
}
</script>