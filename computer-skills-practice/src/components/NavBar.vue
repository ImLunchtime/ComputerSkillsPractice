<template>
  <nav class="bg-white shadow-sm border-b w-full mb-6">
    <div class="mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- 品牌标识 -->
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-semibold text-gray-800 hover:text-gray-900">
            TM计算机技能练习网
          </router-link>
        </div>

        <!-- 导航菜单和按钮 -->
        <div class="flex items-center space-x-6">
          <router-link to="/" class="text-gray-600 hover:text-gray-900">首页</router-link>
          <router-link v-if="user" to="/practice" class="text-gray-600 hover:text-gray-900">练习</router-link>
          <a href="#" class="text-gray-600 hover:text-gray-900">关于</a>
          
          <!-- 用户状态显示 -->
          <div v-if="user" class="flex items-center space-x-4 ml-6">
            <!-- 用户信息 -->
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">
                  {{ user.username.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-gray-700">{{ user.username }}</span>
              <span v-if="user.role === 'admin'" class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                管理员
              </span>
            </div>
            
            <!-- 用户菜单 -->
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
              
              <!-- 下拉菜单 -->
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <router-link 
                  to="/profile" 
                  @click="showUserMenu = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  个人主页
                </router-link>
                <router-link 
                  v-if="user.role === 'admin'"
                  to="/admin" 
                  @click="showUserMenu = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  管理员中心
                </router-link>
                <button 
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
          
          <!-- 登录注册按钮（未登录时显示） -->
          <div v-else class="flex space-x-3 ml-6">
            <router-link 
              to="/auth"
              class="text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded"
            >
              登录/注册
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const showUserMenu = ref(false)

onMounted(() => {
  checkUserStatus()
  // 监听用户登录事件
  window.addEventListener('user-login', handleUserLogin)
  // 点击外部关闭菜单
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('user-login', handleUserLogin)
  document.removeEventListener('click', handleClickOutside)
})

const checkUserStatus = async () => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      user.value = data.data.user
    } else {
      // 对于非200状态码，也尝试解析JSON以获取错误信息
      try {
        const errorData = await response.json()
        console.log('用户未登录:', errorData.message)
      } catch (parseError) {
        console.log('用户未登录')
      }
      user.value = null
    }
  } catch (error) {
    console.error('检查用户状态失败:', error)
    user.value = null
  }
}

const handleUserLogin = (event) => {
  user.value = event.detail.user
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

const logout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    
    if (response.ok) {
      user.value = null
      showUserMenu.value = false
      router.push('/')
    }
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}
</script>