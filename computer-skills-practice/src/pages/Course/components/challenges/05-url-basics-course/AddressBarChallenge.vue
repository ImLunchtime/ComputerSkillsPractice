<template>
  <div class="challenge-container">
    <!-- 挑战状态 -->
    <div v-if="!completed" class="mb-8">
      <div class="text-lg text-gray-700 mb-6">
        请在下面的浏览器窗口中找出地址栏的位置，然后点击它
      </div>
      
      <!-- 模拟浏览器窗口 -->
      <div class="browser-window bg-white border-2 border-gray-300 rounded-lg shadow-lg max-w-2xl mx-auto">
        <!-- 浏览器标题栏 -->
        <div class="browser-header bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300">
          <div class="flex items-center">
            <!-- 窗口控制按钮 -->
            <div class="flex space-x-2 mr-4">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <!-- 标签页 -->
            <div class="bg-white px-4 py-1 rounded-t border border-gray-300 border-b-0">
              <span class="text-sm text-gray-700">新标签页</span>
            </div>
          </div>
        </div>
        
        <!-- 导航栏 -->
        <div class="browser-nav bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <!-- 导航按钮 -->
            <button class="p-1 text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button class="p-1 text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            <button class="p-1 text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
            
            <!-- 地址栏 - 这是用户需要点击的目标 -->
            <div 
              class="address-bar flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 cursor-pointer hover:border-blue-400 transition-colors"
              @click="handleAddressBarClick"
              :class="{ 'ring-2 ring-blue-400 border-blue-400': isClicked }"
            >
              <div class="flex items-center">
                <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span class="text-gray-600 text-sm">https://www.example.com</span>
              </div>
            </div>
            
            <!-- 其他按钮 -->
            <button class="p-2 text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </button>
            <button class="p-2 text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 页面内容区域 -->
        <div class="browser-content bg-white p-8 rounded-b-lg min-h-64">
          <div class="text-center text-gray-500">
            <h2 class="text-2xl font-bold mb-4">欢迎使用浏览器</h2>
            <p>这是一个示例网页</p>
          </div>
        </div>
      </div>
      
      <!-- 提示文字 -->
      <div class="mt-6 text-sm text-gray-500">
        <IconLightbulb class="text-yellow-500 inline-block mr-1" />
        提示：地址栏通常位于浏览器窗口的顶部，显示当前网页的URL地址
      </div>
    </div>
    
    <!-- 完成状态 -->
    <div v-else class="completion-animation">
      <IconTaskAlt class="text-6xl text-green-600 mb-4 animate-bounce" />
      <h3 class="text-2xl font-bold text-green-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600 mb-4">很好！你已经找到了浏览器的地址栏</p>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
        <p class="text-sm text-blue-800">
          <strong>知识点：</strong>地址栏是浏览器中显示和输入网页地址（URL）的地方，通常位于浏览器窗口的顶部导航区域。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconLightbulb, IconTaskAlt } from '@iconify-prerendered/vue-material-symbols'
import { ref } from 'vue'

const emit = defineEmits(['challenge-completed'])

const completed = ref(false)
const isClicked = ref(false)

const handleAddressBarClick = () => {
  if (completed.value) return
  
  isClicked.value = true
  
  setTimeout(() => {
    completed.value = true
    emit('challenge-completed')
  }, 500)
}
</script>

<style scoped>
.challenge-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.browser-window {
  transition: all 0.3s ease;
}

.address-bar {
  transition: all 0.2s ease;
}

.completion-animation {
  text-align: center;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>